import { StoredAccount, StoredAccountType, StoredSeedPhrase } from "@engine/accounts/types";
import { generateKeypairFromPrivateKey } from "@engine/keypair";
import { Keypair } from "@solana/web3.js";
import { decryptWithPassword, EncryptedData } from "@utils/crypto";

export interface AddrListItem {
  srcImg: string;
  name: string;
  keypair: Keypair;
  walletIndex: number;
  keypairIndex: number;
}

export const generateAddrList = (
  activeKeypairIndex: number,
  activeProfileIndex: number,
  encryptedAccounts: EncryptedData,
  hashedPassword: string,
  srcImage: string,
  setActiveAddr: (index: number) => void,
) => {
  if (!encryptedAccounts || !hashedPassword) return [];
  const keypairs: AddrListItem[] = [];
  const accounts = JSON.parse(decryptWithPassword(encryptedAccounts, hashedPassword)) as StoredAccount[];
  accounts.forEach((account, walletIndex) => {
    switch (account.type) {
      case StoredAccountType.SeedPhrase:
        (account as StoredSeedPhrase).privateKeys.forEach((privateKey, keypairIndex) => {
          keypairs.push({
            srcImg: srcImage,
            name: privateKey.name,
            keypair: generateKeypairFromPrivateKey(privateKey.privateKey),
            walletIndex,
            keypairIndex,
          });
          if (activeProfileIndex === walletIndex && activeKeypairIndex === keypairIndex)
            setActiveAddr(keypairs.length - 1);
        });
        break;
      case StoredAccountType.PrivateKey:
        keypairs.push({
          srcImg: srcImage,
          name: account.name,
          keypair: generateKeypairFromPrivateKey(account.privateKey),
          walletIndex,
          keypairIndex: 0,
        });
        if (activeProfileIndex === walletIndex) setActiveAddr(keypairs.length - 1);
        break;
      default:
        console.error("Invalid account type");
    }
  });

  return keypairs;
};
