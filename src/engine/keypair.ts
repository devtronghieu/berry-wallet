import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { encryptWithPassword } from "@/utils/crypto";

export const getDerivedPath = (pathIndex: number) => `m/44'/501'/${pathIndex}'/0'`;

export const createSeedPhrase = () => {
  return generateMnemonic();
};

export const createWallet = (seedPhrase: string, password: string) => {
  const encryptedSeedPhrase = encryptWithPassword(seedPhrase, password);
  console.log("--> encrypted seed phrase", encryptedSeedPhrase);

  const seed = mnemonicToSeedSync(seedPhrase);
  const keypair = Keypair.fromSeed(derivePath(getDerivedPath(0), seed.toString("hex")).key);
  console.log("--> pubkey", keypair.publicKey.toBase58());
};
