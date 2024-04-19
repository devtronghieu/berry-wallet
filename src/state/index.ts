import { proxy } from "valtio";

export interface AppState {
  isLoggedIn: boolean;
}

export const appState = proxy<AppState>({
  isLoggedIn: false,
});
