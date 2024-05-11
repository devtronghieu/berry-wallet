import { Keypair } from "@solana/web3.js";
import { decryptWithPassword, encryptWithPassword } from "@utils/crypto";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import base58, { encode } from "bs58";
import { derivePath } from "ed25519-hd-key";

import { fetchAccountInfo } from "./accounts";
import { StoredAccount, StoredAccountType } from "./accounts/types";
import { PouchID } from "./constants";
import { upsertActiveIndex, upsertEncryptedAccounts, upsertPassword } from "./storage";

export const getDerivedPath = (pathIndex: number) => `m/44'/501'/${pathIndex}'/0'`;

export const createSeedPhrase = () => {
  return generateMnemonic();
};

export const createWallet = async (seedPhrase: string, hashedPassword: string) => {
  const keypair = generateKeypairFromSeedPhrase(seedPhrase, 0);
  await upsertPassword(hashedPassword);

  // Store the initial seed phrase
  const storedSeedPhrase = {
    type: StoredAccountType.SeedPhrase,
    name: "Wallet 1",
    seedPhrase: seedPhrase,
    privateKeys: [
      {
        type: StoredAccountType.PrivateKey,
        name: "Account 1.1",
        privateKey: encode(keypair.secretKey),
        pathIndex: 0,
        lastBalance: 0,
      },
    ],
  };

  const encryptedAccounts = encryptWithPassword(JSON.stringify([storedSeedPhrase]), hashedPassword);

  await upsertEncryptedAccounts(PouchID.encryptedAccounts, encryptedAccounts);
  await upsertActiveIndex(PouchID.activeWalletIndex, 0);
  await upsertActiveIndex(PouchID.activeKeypairIndex, 0);

  return {
    activeKeypairName: "Account 1.1",
    keypair,
    encryptedAccounts,
    activeWalletIndex: 0,
    activeKeypairIndex: 0,
  };
};

export const deriveKeypairAndName = async (password: string) => {
  const { encryptedAccounts, activeWalletIndex, activeKeypairIndex } = await fetchAccountInfo().catch((error) => {
    console.error(error);
    throw new Error("Failed to fetch account info");
  });
  const accounts = JSON.parse(decryptWithPassword(encryptedAccounts, password));
  const activeWallet: StoredAccount = accounts[activeWalletIndex];
  let keypair, keypairName;
  switch (activeWallet.type) {
    case StoredAccountType.SeedPhrase:
      keypair = generateKeypairFromSeedPhrase(
        activeWallet.seedPhrase,
        activeWallet.privateKeys[activeKeypairIndex].pathIndex,
      );
      keypairName = activeWallet.privateKeys[activeKeypairIndex].name;
      break;
    case StoredAccountType.PrivateKey:
      keypair = generateKeypairFromPrivateKey(activeWallet.privateKey);
      keypairName = activeWallet.name;
      break;
    default:
      throw new Error("Invalid active account type");
  }
  return {
    keypair,
    keypairName,
  };
};

export const generateKeypairFromSeedPhrase = (seedPhrase: string, pathIndex: number) => {
  const seed = mnemonicToSeedSync(seedPhrase);
  return Keypair.fromSeed(derivePath(getDerivedPath(pathIndex), seed.toString("hex")).key);
};

export const generateKeypairFromPrivateKey = (privateKey: string) => {
  return Keypair.fromSecretKey(base58.decode(privateKey));
};
