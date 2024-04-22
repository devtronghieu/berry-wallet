import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { decryptWithPassword, encryptWithPassword } from "@utils/crypto";
import { setEncryptedSeedPhrase, getEncryptedSeedPhrase, setPassword, setActiveKeypairIndex } from "./store";

export const getDerivedPath = (pathIndex: number) => `m/44'/501'/${pathIndex}'/0'`;

export const createSeedPhrase = () => {
  return generateMnemonic();
};

export const createWallet = async (seedPhrase: string, hashedPassword: string) => {
  const encryptedSeedPhrase = encryptWithPassword(seedPhrase, hashedPassword);
  const seed = mnemonicToSeedSync(seedPhrase);
  const keypair = Keypair.fromSeed(derivePath(getDerivedPath(0), seed.toString("hex")).key);

  await setEncryptedSeedPhrase(encryptedSeedPhrase);
  await setActiveKeypairIndex(0);
  await setPassword(hashedPassword);

  return {
    encryptedSeedPhrase,
    keypair,
  };
};

export const deriveKeypair = async (password: string, pathIndex: number) => {
  const encryptedSeedPhrase = await getEncryptedSeedPhrase();
  if (!encryptedSeedPhrase) {
    throw new Error("Seed phrase not found");
  }
  const seedPhrase = decryptWithPassword(encryptedSeedPhrase, password);
  const seed = mnemonicToSeedSync(seedPhrase);
  const keypair = Keypair.fromSeed(derivePath(getDerivedPath(pathIndex), seed.toString("hex")).key);
  return keypair;
};
