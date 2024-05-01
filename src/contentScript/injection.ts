import { initialize } from "@/wallet-standard";
import { BerryImpl } from "./impl";

const berry = new BerryImpl();

initialize(berry);

try {
  Object.defineProperty(window, "berry", { value: berry });
} catch (error) {
  console.error("--> berry define window object error", error);
}
