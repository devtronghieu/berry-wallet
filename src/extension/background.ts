chrome.runtime.onConnect.addListener((port) => {
  const channel = port.name;
  console.log(`[BerryBackground] connected to ${channel}`);

  port.onMessage.addListener((message) => {
    console.log(`[BerryBackground] received message on ${channel}`, message);
    port.postMessage({ message: "Hello, World!" });
  });
});
