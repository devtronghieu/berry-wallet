import { PouchID } from "@engine/constants";
import { generateKeypairFromSeedPhrase } from "@engine/keypair";
import { getActiveIndex, getEncryptedAccounts, upsertActiveIndex, upsertEncryptedAccounts } from "@engine/storage";
import { decryptWithPassword, encryptWithPassword } from "@utils/crypto";
import { encode } from "bs58";

import { StoredAccountType, StoredSeedPhrase } from "./types";

export const fetchAccountInfo = async () => {
  const encryptedAccounts = await getEncryptedAccounts(PouchID.encryptedAccounts);
  const activeWalletIndex = await getActiveIndex(PouchID.activeWalletIndex);
  const activeKeypairIndex = await getActiveIndex(PouchID.activeKeypairIndex);
  console.log(encryptedAccounts, activeWalletIndex, activeKeypairIndex);
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
  const keypair = await generateKeypairFromSeedPhrase(activeWallet.seedPhrase, lastPrivateKey.pathIndex + 1);

  // Add new keypair to the active wallet
  activeWallet.privateKeys.push({
    type: StoredAccountType.PrivateKey,
    name: `Account ${lastPrivateKey.pathIndex + 2}`,
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
    keypair,
    encryptedAccounts,
    activeKeypairIndex: activeWallet.privateKeys.length - 1,
  };
};
