import { PouchID } from "@engine/constants";
import { generateKeypairFromPrivateKey, generateKeypairFromSeedPhrase } from "@engine/keypair";
import { getActiveIndex, getEncryptedAccounts, upsertActiveIndex, upsertEncryptedAccounts } from "@engine/storage";
import { decryptWithPassword, encryptWithPassword } from "@utils/crypto";
import { encode } from "bs58";

import { StoredAccount, StoredAccountType, StoredPrivateKey, StoredSeedPhrase } from "./types";

export const fetchAccountInfo = async () => {
  const encryptedAccounts = await getEncryptedAccounts(PouchID.encryptedAccounts);
  const activeWalletIndex = await getActiveIndex(PouchID.activeWalletIndex);
  const activeKeypairIndex = await getActiveIndex(PouchID.activeKeypairIndex);
  if (encryptedAccounts === null) throw new Error("No accounts found");
  if (activeWalletIndex === null) throw new Error("No active wallet found");
  if (activeKeypairIndex === null) throw new Error("No active keypair found");
  return {
    encryptedAccounts,
    activeWalletIndex,
    activeKeypairIndex,
  };
};

export const addNewKeypair = async (hashedPassword: string) => {
  const { encryptedAccounts, activeWalletIndex } = await fetchAccountInfo().catch((error) => {
    console.error(error);
    throw new Error("Failed to fetch account info");
  });
  const accounts = JSON.parse(decryptWithPassword(encryptedAccounts, hashedPassword));
  const activeWallet: StoredSeedPhrase = accounts[activeWalletIndex];
  const privateKeys = activeWallet.privateKeys;
  const lastPrivateKey = privateKeys[privateKeys.length - 1];
  const keypair = generateKeypairFromSeedPhrase(activeWallet.seedPhrase, lastPrivateKey.pathIndex + 1);

  // Get active keypair name
  const activeKeypairName = `Account ${activeWalletIndex + 1}.${lastPrivateKey.pathIndex + 2}`;

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

  return {
    activeKeypairName,
    keypair,
    encryptedAccounts,
    activeWalletIndex,
    activeKeypairIndex: activeWallet.privateKeys.length - 1,
  };
};

export const addNewWallet = async (walletType: StoredAccountType, generateKey: string, hashedPassword: string) => {
  const { encryptedAccounts } = await fetchAccountInfo().catch((error) => {
    console.error(error);
    throw new Error("Failed to fetch account info");
  });

  const accounts: StoredAccount[] = JSON.parse(decryptWithPassword(encryptedAccounts, hashedPassword));
  let keypair;
  let activeKeypairName;

  switch (walletType) {
    case StoredAccountType.SeedPhrase:
      if (hasDuplicateSeedPhrase(accounts, generateKey)) {
        throw new Error("Seed phrase already exists.");
      }
      keypair = generateKeypairFromSeedPhrase(generateKey, 0);
      activeKeypairName = `Account ${accounts.length + 1}.1`;
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
      activeKeypairName = `Account ${accounts.length + 1}`;
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
  await upsertActiveIndex(PouchID.activeWalletIndex, accounts.length - 1);
  await upsertActiveIndex(PouchID.activeKeypairIndex, 0);

  return {
    activeKeypairName,
    keypair,
    newEncryptedAccounts,
    activeWalletIndex: accounts.length - 1,
    activeKeypairIndex: 0,
  };
};

export const updateLastBalanceCheck = async (hashedPassword: string, lastBalance: number) => {
  const { encryptedAccounts, activeWalletIndex, activeKeypairIndex } = await fetchAccountInfo().catch((error) => {
    console.error(error);
    throw new Error("Failed to fetch account info");
  });
  const accounts = JSON.parse(decryptWithPassword(encryptedAccounts, hashedPassword));
  let activeAccount: StoredPrivateKey;
  switch (accounts[activeWalletIndex].type) {
    case StoredAccountType.SeedPhrase:
      activeAccount = accounts[activeWalletIndex].privateKeys[activeKeypairIndex];
      break;
    case StoredAccountType.PrivateKey:
      activeAccount = accounts[activeWalletIndex];
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
  let isFound = false;
  accounts.forEach((acc) => {
    if (isFound) return;
    switch (acc.type) {
      case StoredAccountType.SeedPhrase:
        acc.privateKeys.forEach((key) => {
          if (key.privateKey === account.privateKey) {
            key.name = newName;
            isFound = true;
          }
        });
        break;
      case StoredAccountType.PrivateKey:
        if (acc.privateKey === account.privateKey) {
          acc.name = newName;
          isFound = true;
        }
        break;
      default:
        throw new Error("Invalid active account type");
    }
  });

  if (!isFound) return encryptedAccounts;

  const newEncryptedAccounts = encryptWithPassword(JSON.stringify(accounts), hashedPassword);

  await upsertEncryptedAccounts(PouchID.encryptedAccounts, newEncryptedAccounts);

  return newEncryptedAccounts;
};

export const switchActiveAccount = async (walletIndex: number, keypairIndex: number) => {
  await upsertActiveIndex(PouchID.activeWalletIndex, walletIndex);
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
