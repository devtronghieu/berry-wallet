import { Keypair } from "@solana/web3.js";
import { decryptWithPassword, encryptWithPassword } from "@utils/crypto";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { encode } from "bs58";
import { derivePath } from "ed25519-hd-key";

import { fetchAccountInfo } from "./accounts";
import { StoredAccountType, StoredSeedPhrase } from "./accounts/types";
import { PouchID } from "./constants";
import { setPassword, upsertActiveIndex, upsertEncryptedAccounts } from "./storage";

export const getDerivedPath = (pathIndex: number) => `m/44'/501'/${pathIndex}'/0'`;

export const createSeedPhrase = () => {
  return generateMnemonic();
};

export const createWallet = async (seedPhrase: string, hashedPassword: string) => {
  const keypair = await generateKeypairFromSeedPhrase(seedPhrase, 0);
  await setPassword(hashedPassword);

  // Store the initial seed phrase
  const storedSeedPhrase = {
    type: StoredAccountType.SeedPhrase,
    name: "Wallet 1",
    seedPhrase: seedPhrase,
    privateKeys: [
      {
        type: StoredAccountType.PrivateKey,
        name: "Account 1",
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
    keypair,
    encryptedAccounts,
  };
};

export const deriveKeypair = async (password: string) => {
  const { encryptedAccounts, activeWalletIndex, activeKeypairIndex } = await fetchAccountInfo().catch((error) => {
    console.error(error);
    throw new Error("Failed to fetch account info");
  });
  const accounts = JSON.parse(decryptWithPassword(encryptedAccounts, password));
  const activeWallet = accounts[activeWalletIndex] as StoredSeedPhrase;
  if (!activeWallet) throw new Error("No active wallet found");
  return generateKeypairFromSeedPhrase(activeWallet.seedPhrase, activeWallet.privateKeys[activeKeypairIndex].pathIndex);
};

export const generateKeypairFromSeedPhrase = async (seedPhrase: string, pathIndex: number) => {
  const seed = mnemonicToSeedSync(seedPhrase);
  return Keypair.fromSeed(derivePath(getDerivedPath(pathIndex), seed.toString("hex")).key);
};

export const generateKeypairFromPrivateKey = (privateKey: string) => {
  return Keypair.fromSecretKey(Uint8Array.from(Buffer.from(privateKey, "base64")));
};
