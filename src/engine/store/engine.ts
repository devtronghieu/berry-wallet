import { EncryptedData } from "@utils/crypto";

import { getDB } from "./connection";

const seedPhraseId = "seedPhrase";

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

const passwordId = "password";

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

const passwordExpiredAtId = "passwordExpiredAt";

export const setPasswordExpiredAt = async (expiredAt: number) => {
  const doc = {
    _id: passwordExpiredAtId,
    expiredAt,
  };

  await getDB().put(doc);
};

export const getPasswordExpiredAt = async () => {
  try {
    const doc = await getDB().get<{ expiredAt: number }>(passwordExpiredAtId);
    return doc.expiredAt;
  } catch (error) {
    if ((error as PouchDB.Core.Error).status === 404) {
      return null;
    }

    throw error;
  }
};

const activeKeypairIndexId = "activeKeypairIndex";

export const setActiveKeypairIndex = async (index: number) => {
  const doc = {
    _id: activeKeypairIndexId,
    index,
  };

  await getDB().put(doc);
};

export const getActiveKeypairIndex = async () => {
  try {
    const doc = await getDB().get<{ index: number }>(activeKeypairIndexId);
    return doc.index;
  } catch (error) {
    if ((error as PouchDB.Core.Error).status === 404) {
      return null;
    }

    throw error;
  }
};
