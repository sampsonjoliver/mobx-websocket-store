export default class MockSocket {
  messageHandler: (string) => void;
  constructor(add: string) {
    this.open();
  }

  open() {
    console.log("Websocket open");
  }

  close() {
    console.log("Websocket closed");
  }

  on(name: string, handler: (string) => void) {
    this.messageHandler = handler;
  }

  message(message: string) {
    this.messageHandler(message);
  }
}
