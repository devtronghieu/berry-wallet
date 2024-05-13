import { PouchID } from "@engine/constants";
import { generateKeypairFromPrivateKey, generateKeypairFromSeedPhrase } from "@engine/keypair";
import {
  getActiveIndex,
  getEncryptedAccounts,
  upsertActiveIndex,
  upsertEncryptedAccounts,
  upsertPassword,
} from "@engine/storage";
import { decryptWithPassword, encryptWithPassword } from "@utils/crypto";
import { encode } from "bs58";

import { StoredAccount, StoredAccountType, StoredPrivateKey, StoredSeedPhrase } from "./types";

export const fetchAccountInfo = async () => {
  const encryptedAccounts = await getEncryptedAccounts(PouchID.encryptedAccounts);
  const activeProfileIndex = await getActiveIndex(PouchID.activeProfileIndex);
  const activeKeypairIndex = await getActiveIndex(PouchID.activeKeypairIndex);
  const nextAccountIndex = await getActiveIndex(PouchID.nextAccountIndex);
  if (encryptedAccounts === null) throw new Error("No accounts found");
  if (activeProfileIndex === null) throw new Error("No active wallet found");
  if (activeKeypairIndex === null) throw new Error("No active keypair found");
  if (nextAccountIndex === null) throw new Error("No next account index found");
  return {
    encryptedAccounts,
    activeProfileIndex,
    activeKeypairIndex,
    nextAccountIndex,
  };
};

export const addNewKeypair = async (hashedPassword: string) => {
  const { encryptedAccounts, activeProfileIndex, nextAccountIndex } = await fetchAccountInfo().catch((error) => {
    console.error(error);
    throw new Error("Failed to fetch account info");
  });
  const accounts = JSON.parse(decryptWithPassword(encryptedAccounts, hashedPassword)) as StoredAccount[];
  let activeProfileIndexTemp = activeProfileIndex;
  let activeWallet = accounts[activeProfileIndex];

  // Active account is private key, change it to the first seed phrase
  if (activeWallet.type === StoredAccountType.PrivateKey) {
    activeProfileIndexTemp = accounts.findIndex((acc) => acc.type === StoredAccountType.SeedPhrase);
    activeWallet = accounts[activeProfileIndexTemp];
    await upsertActiveIndex(PouchID.activeProfileIndex, activeProfileIndexTemp);
  }

  activeWallet = activeWallet as StoredSeedPhrase;
  const privateKeys = activeWallet.privateKeys;
  const lastPrivateKey = privateKeys[privateKeys.length - 1];
  const keypair = generateKeypairFromSeedPhrase(activeWallet.seedPhrase, lastPrivateKey.pathIndex + 1);

  // Get active keypair name
  const activeKeypairName = `Account ${nextAccountIndex + 1}`;

  // Add new keypair to the active wallet
  activeWallet.privateKeys.push({
    type: StoredAccountType.PrivateKey,
    name: activeKeypairName,
    privateKey: encode(keypair.secretKey),
    pathIndex: lastPrivateKey.pathIndex + 1,
    lastBalance: 0,
  });

  // Update active keypair index to the last one
  await upsertEncryptedAccounts(
    PouchID.encryptedAccounts,
    encryptWithPassword(JSON.stringify(accounts), hashedPassword),
  );

  await upsertActiveIndex(PouchID.activeKeypairIndex, activeWallet.privateKeys.length - 1);
  await upsertActiveIndex(PouchID.nextAccountIndex, nextAccountIndex + 1);

  return {
    activeKeypairName,
    keypair,
    encryptedAccounts,
    activeProfileIndex,
    activeKeypairIndex: activeWallet.privateKeys.length - 1,
  };
};

export const addNewWallet = async (walletType: StoredAccountType, generateKey: string, hashedPassword: string) => {
  const { encryptedAccounts, nextAccountIndex } = await fetchAccountInfo().catch((error) => {
    console.error(error);
    throw new Error("Failed to fetch account info");
  });

  const accounts: StoredAccount[] = JSON.parse(decryptWithPassword(encryptedAccounts, hashedPassword));
  let keypair;
  const activeKeypairName = `Account ${nextAccountIndex + 1}`;

  switch (walletType) {
    case StoredAccountType.SeedPhrase:
      if (hasDuplicateSeedPhrase(accounts, generateKey)) {
        throw new Error("Seed phrase already exists.");
      }
      keypair = generateKeypairFromSeedPhrase(generateKey, 0);
      accounts.push({
        type: StoredAccountType.SeedPhrase,
        name: `Wallet ${accounts.length + 1}`,
        seedPhrase: generateKey,
        privateKeys: [
          {
            type: StoredAccountType.PrivateKey,
            name: activeKeypairName,
            privateKey: encode(keypair.secretKey),
            pathIndex: 0,
            lastBalance: 0,
          },
        ],
      });
      break;
    case StoredAccountType.PrivateKey:
      if (hasDuplicatePrivateKey(accounts, generateKey)) {
        throw new Error("Private key already exists.");
      }
      keypair = generateKeypairFromPrivateKey(generateKey);
      accounts.push({
        type: StoredAccountType.PrivateKey,
        name: activeKeypairName,
        privateKey: generateKey,
        pathIndex: 0,
        lastBalance: 0,
      });
      break;
    default:
      throw new Error("Invalid active account type");
  }

  const newEncryptedAccounts = encryptWithPassword(JSON.stringify(accounts), hashedPassword);

  await upsertEncryptedAccounts(PouchID.encryptedAccounts, newEncryptedAccounts);
  await upsertActiveIndex(PouchID.activeProfileIndex, accounts.length - 1);
  await upsertActiveIndex(PouchID.activeKeypairIndex, 0);
  await upsertActiveIndex(PouchID.nextAccountIndex, nextAccountIndex + 1);

  return {
    activeKeypairName,
    keypair,
    encryptedAccounts: newEncryptedAccounts,
    activeProfileIndex: accounts.length - 1,
    activeKeypairIndex: 0,
  };
};

export const removeWallet = async (hashedPassword: string, account: StoredPrivateKey, activeKeypairName: string) => {
  const { encryptedAccounts, activeProfileIndex, activeKeypairIndex } = await fetchAccountInfo().catch((error) => {
    console.error(error);
    throw new Error("Failed to fetch account info");
  });
  const accounts = JSON.parse(decryptWithPassword(encryptedAccounts, hashedPassword)) as StoredAccount[];
  let isFound = false;
  let newActiveWalletIndex = activeProfileIndex;
  let newActiveKeypairIndex = activeKeypairIndex;
  let newActiveKeypairName = activeKeypairName;
  accounts.forEach((acc, walletIndex) => {
    if (isFound) return;
    switch (acc.type) {
      case StoredAccountType.SeedPhrase:
        acc.privateKeys.forEach((key, keypairIndex) => {
          if (key.privateKey === account.privateKey) {
            acc.privateKeys.splice(keypairIndex, 1);
            // In case the active keypair belongs to the removed seephrase accounts
            if (walletIndex === activeProfileIndex && acc.privateKeys.length <= activeKeypairIndex)
              newActiveKeypairIndex = acc.privateKeys.length - 1;
            if (acc.privateKeys.length === 0) {
              // Remove the seed phrase if there are no more keypairs
              accounts.splice(walletIndex, 1);
              // Update the active wallet index and active keypair in case all of the seedphrase keypairs is removed
              newActiveWalletIndex = accounts.length - 1;
              newActiveKeypairIndex = 0;
            }
            if (accounts[newActiveWalletIndex].type === StoredAccountType.SeedPhrase) {
              newActiveKeypairName = (accounts[newActiveWalletIndex] as StoredSeedPhrase).privateKeys[
                newActiveKeypairIndex
              ].name;
            } else newActiveKeypairName = accounts[newActiveWalletIndex].name;
            isFound = true;
          }
        });
        break;
      case StoredAccountType.PrivateKey:
        if (acc.privateKey === account.privateKey) {
          accounts.splice(walletIndex, 1);
          // Update the active wallet index and active keypair in case active private key is removed
          if (activeProfileIndex >= walletIndex) {
            newActiveWalletIndex = accounts.length - 1;
            newActiveKeypairIndex = 0;
          }
          if (accounts[newActiveWalletIndex].type === StoredAccountType.SeedPhrase) {
            newActiveKeypairName = (accounts[newActiveWalletIndex] as StoredSeedPhrase).privateKeys[
              newActiveKeypairIndex
            ].name;
          } else newActiveKeypairName = accounts[newActiveWalletIndex].name;
          isFound = true;
        }
        break;
      default:
        throw new Error("Invalid active account type");
    }
  });
  const newEncryptedAccounts = encryptWithPassword(JSON.stringify(accounts), hashedPassword);

  await upsertEncryptedAccounts(PouchID.encryptedAccounts, newEncryptedAccounts);
  await upsertActiveIndex(PouchID.activeProfileIndex, newActiveWalletIndex);
  await upsertActiveIndex(PouchID.activeKeypairIndex, newActiveKeypairIndex);

  return {
    activeKeypairName: newActiveKeypairName,
    encryptedAccounts: newEncryptedAccounts,
    activeProfileIndex: newActiveWalletIndex,
    activeKeypairIndex: newActiveKeypairIndex,
  };
};

export const updateLastBalanceCheck = async (hashedPassword: string, lastBalance: number) => {
  const { encryptedAccounts, activeProfileIndex, activeKeypairIndex } = await fetchAccountInfo().catch((error) => {
    console.error(error);
    throw new Error("Failed to fetch account info");
  });
  const accounts = JSON.parse(decryptWithPassword(encryptedAccounts, hashedPassword));
  let activeAccount: StoredPrivateKey;
  switch (accounts[activeProfileIndex].type) {
    case StoredAccountType.SeedPhrase:
      activeAccount = accounts[activeProfileIndex].privateKeys[activeKeypairIndex];
      break;
    case StoredAccountType.PrivateKey:
      activeAccount = accounts[activeProfileIndex];
      break;
    default:
      throw new Error("Invalid active account type");
  }

  if (activeAccount.lastBalance === lastBalance) return encryptedAccounts;
  else activeAccount.lastBalance = lastBalance;

  const newEncryptedAccounts = encryptWithPassword(JSON.stringify(accounts), hashedPassword);

  await upsertEncryptedAccounts(PouchID.encryptedAccounts, newEncryptedAccounts);

  return newEncryptedAccounts;
};

export const updateAccountName = async (hashedPassword: string, account: StoredPrivateKey, newName: string) => {
  const { encryptedAccounts } = await fetchAccountInfo().catch((error) => {
    console.error(error);
    throw new Error("Failed to fetch account info");
  });
  const accounts: StoredAccount[] = JSON.parse(decryptWithPassword(encryptedAccounts, hashedPassword));
  let updateAccount: StoredPrivateKey | undefined = undefined;
  let isFound = false;
  accounts.forEach((acc) => {
    if (isFound) return;
    switch (acc.type) {
      case StoredAccountType.SeedPhrase:
        acc.privateKeys.forEach((key) => {
          if (key.privateKey === account.privateKey) {
            updateAccount = key;
            isFound = true;
          }
        });
        break;
      case StoredAccountType.PrivateKey:
        if (acc.privateKey === account.privateKey) {
          updateAccount = acc;
          isFound = true;
        }
        break;
      default:
        throw new Error("Invalid active account type");
    }
  });

  if (updateAccount === undefined) return encryptedAccounts;
  updateAccount = updateAccount as StoredPrivateKey;
  if (updateAccount.name === newName) return encryptedAccounts;
  else updateAccount.name = newName;

  const newEncryptedAccounts = encryptWithPassword(JSON.stringify(accounts), hashedPassword);

  await upsertEncryptedAccounts(PouchID.encryptedAccounts, newEncryptedAccounts);

  return newEncryptedAccounts;
};

export const switchActiveAccount = async (walletIndex: number, keypairIndex: number) => {
  await upsertActiveIndex(PouchID.activeProfileIndex, walletIndex);
  await upsertActiveIndex(PouchID.activeKeypairIndex, keypairIndex);
};

export const hasDuplicateSeedPhrase = (accounts: StoredAccount[], seedPhrase: string) => {
  let isDuplicate = false;
  accounts.forEach((acc) => {
    if (acc.type === StoredAccountType.SeedPhrase && acc.seedPhrase === seedPhrase) {
      console.log("Seed phrase already exists.");
      isDuplicate = true;
      return;
    }
  });
  return isDuplicate;
};

export const hasDuplicatePrivateKey = (accounts: StoredAccount[], privateKey: string) => {
  let isDuplicate = false;
  accounts.forEach((acc) => {
    if (acc.type === StoredAccountType.PrivateKey && acc.privateKey === privateKey) {
      console.log("Private key already exists.");
      isDuplicate = true;
      return;
    }
  });
  return isDuplicate;
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const { encryptedAccounts } = await fetchAccountInfo().catch((error) => {
    console.error(error);
    throw new Error("Failed to fetch account info");
  });

  const accounts = JSON.parse(decryptWithPassword(encryptedAccounts, oldPassword));

  if (oldPassword === newPassword) return encryptedAccounts;

  const newEncryptedAccounts = encryptWithPassword(JSON.stringify(accounts), newPassword);

  await upsertEncryptedAccounts(PouchID.encryptedAccounts, newEncryptedAccounts);
  await upsertPassword(newPassword);

  return newEncryptedAccounts;
};
