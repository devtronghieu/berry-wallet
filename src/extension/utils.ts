import { Event } from "@messaging/types";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "@utils/constants";

export const injectScript = (scriptUri: string) => {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("async", "false");
    scriptTag.src = chrome.runtime.getURL(scriptUri);
    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
  } catch (error) {
    console.error("script injection failed.", error);
  }
};

export const openPopup = async (event: Event) => {
  const lastFocusedWindow = await chrome.windows.getLastFocused();
  const { top, left = 0, width = 0 } = lastFocusedWindow;
  const leftPos = left + width - WINDOW_WIDTH;

  return await chrome.windows.create({
    top,
    left: leftPos,
    type: "popup",
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    url: `index.html#/requests/${event}`,
    focused: true,
  });
};
