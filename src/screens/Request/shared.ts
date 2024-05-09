import { ChromeKernel } from "@messaging/core";
import { useOutletContext } from "react-router-dom";

export interface RequestOutletContext<T> {
  chromeKernel: ChromeKernel;
  messageId: string;
  payload: T;
}

export const useRequestContext = <T>() => useOutletContext<RequestOutletContext<T>>();
