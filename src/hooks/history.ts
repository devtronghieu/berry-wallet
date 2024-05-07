import { historyState } from "@state/history";
import { useSnapshot } from "valtio";

export const useHistory = () => {
    const history = useSnapshot(historyState).transactions;
    return history;
};