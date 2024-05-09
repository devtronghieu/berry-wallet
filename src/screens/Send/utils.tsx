import { PublicKey } from "@solana/web3.js";

interface ValidateResult {
  isValid: boolean;
  errorMessage: string;
}

export const validatePublicKey = (value: string): ValidateResult => {
  if (value.length === 0) {
    return { isValid: false, errorMessage: "" };
  }

  let publicKey: PublicKey;
  try {
    publicKey = new PublicKey(value);
  } catch (error) {
    return { isValid: false, errorMessage: "Invalid receiver public key." };
  }

  if (!PublicKey.isOnCurve(publicKey.toBytes())) {
    return { isValid: false, errorMessage: "Invalid receiver public key." };
  }

  return { isValid: true, errorMessage: "" };
};

export const validateAmount = (value: string, balanceAmount: number) => {
  if (value.length === 0) {
    return { isValid: false, errorMessage: "" };
  }

  if (isNaN(parseFloat(value))) {
    return { isValid: false, errorMessage: "Amount must be a number." };
  }
  if (parseFloat(value) <= 0) {
    return { isValid: false, errorMessage: "Amount must be greater than 0." };
  }

  if (parseFloat(value) > balanceAmount) {
    return { isValid: false, errorMessage: "Amount exceeds your balance." };
  }

  return { isValid: true, errorMessage: "" };
};

export const validateTotalAmount = (value: string, balanceAmount: number) => {
  if (value.length === 0) {
    return { isValid: false, errorMessage: "" };
  }

  if (isNaN(parseFloat(value))) {
    return { isValid: false, errorMessage: "Total amount must be a number." };
  }
  if (parseFloat(value) <= 0) {
    return { isValid: false, errorMessage: "No collectibles available." };
  }

  if (parseFloat(value) > balanceAmount) {
    return { isValid: false, errorMessage: "Your balance is not enough." };
  }

  return { isValid: true, errorMessage: "" };
};
