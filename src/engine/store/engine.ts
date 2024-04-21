import { EncryptedData } from "@utils/crypto";
import { getDB } from "./connection";

const seedPhraseId = "seedPhrase";
const passwordId = "password";

export const setEncryptedSeedPhrase = async (encryptedSeedPhrase: EncryptedData) => {
  const doc = {
    _id: seedPhraseId,
    ...encryptedSeedPhrase,
  };

  await getDB().put<EncryptedData>(doc);
};

export const getEncryptedSeedPhrase = async () => {
  try {
    const doc = await getDB().get<EncryptedData>(seedPhraseId);
    return doc;
  } catch (error) {
    if ((error as PouchDB.Core.Error).status === 404) {
      return null;
    }

    throw error;
  }
};

export const setPassword = async (password: string) => {
  const doc = {
    _id: passwordId,
    password,
  };

  await getDB().put(doc);
};

export const getPassword = async () => {
  try {
    const doc = await getDB().get<{ password: string }>(passwordId);
    return doc.password;
  } catch (error) {
    if ((error as PouchDB.Core.Error).status === 404) {
      return null;
    }

    throw error;
  }
};
