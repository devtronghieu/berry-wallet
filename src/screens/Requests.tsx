import { ChromeKernel } from "@messaging/core";
import { Channel } from "@messaging/types";
import { appState } from "@state/index";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";

const RequestsScreen = () => {
  const chromeKernel = useMemo(() => new ChromeKernel(Channel.Popup), []);
  const { keypair } = useSnapshot(appState);
  const { event } = useParams();

  const handleConnect = () => {
    chromeKernel.handleRequest = async () => {
      return keypair?.publicKey.toBase58();
    };
    window.close();
  };

  const handleReject = async () => {
    chromeKernel.handleRequest = async () => {
      return new Error("User rejected the request");
    };
    window.close();
  };

  return (
    <div>
      <h1>Requests</h1>
      <p>Event: {event}</p>
      <button className="gradient-button" onClick={handleReject}>
        No
      </button>
      <button className="gradient-button" onClick={handleConnect}>
        Yes
      </button>
    </div>
  );
};

export default RequestsScreen;
