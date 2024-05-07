import { Transaction } from "@engine/history/types";
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

export const upsertPasswordExpiredAt = async (expiredAt: number) => {
  try {
    const doc = await getDB().get<{ expiredAt: number }>(passwordExpiredAtId);
    await getDB().put({ ...doc, expiredAt });
  } catch (error) {
    if ((error as PouchDB.Core.Error).status === 404) {
      await getDB().put({ _id: passwordExpiredAtId, expiredAt });
    } else {
      throw error;
    }
  }
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

const historyId = "transactionHistory";  

export const setHistory = async (history: Transaction[]) => {
  try {
    const doc = await getDB().get<{ transactions: Transaction[] }>(historyId);
    await getDB().put({ ...doc, transactions: history });
  } catch (error) {
    if ((error as PouchDB.Core.Error).status === 404) {
      await getDB().put({ _id: historyId, transactions: history });
    } else {
      throw error;
    }
  }
};

export const getHistory = async () => {
  try {
    const doc = await getDB().get<{ transactions: Transaction[] }>(historyId);
    return doc.transactions;
  } catch (error) {
    if ((error as PouchDB.Core.Error).status === 404) {
      return [];
    }

    throw error;
  }
};