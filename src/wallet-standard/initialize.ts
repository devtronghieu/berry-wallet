import { registerWallet } from "./register.js";
import { BerryWallet } from "./wallet.js";
import type { Berry } from "./window.js";

export function initialize(berry: Berry): void {
  registerWallet(new BerryWallet(berry));
}
