import MobxWebsocketStore from '../src/mobxAtomStore';
import { autorun, reaction } from 'mobx';
import MockSocket from './MockSocket';

const openMockSocket = () => {
  const socket = new MockSocket('ws://localhost:8080');
  socket.on('message', message => {
    store.data = message;
  });
  return socket;
};

const createObserver = (id: string, timeout: number = 5000) => {
  const disposer = autorun(() => {
    console.log(`observer ${id} observed store data ${store.data}`);
  });
  setTimeout(() => {
    disposer();
  }, timeout);
};

var socket: MockSocket;
const store = new MobxWebsocketStore<number>(
  store => {
    console.log('Opening websocket');
    socket = openMockSocket();
  },
  store => {
    console.log('Closing websocket');
    socket.close();
  },
  { resetDataOnOpen: false }
);

setTimeout(() => {
  createObserver('1', 2000);

  // Here we fake a server piping data to the socket every second
  const storeUpdateTick = setInterval(event => {
    socket.message(Math.random().toString());
  }, 1000);
}, 2000);

setTimeout(() => {
  createObserver('2');
  createObserver('3');
  createObserver('4');
}, 5000);

setTimeout(() => {
  process.exit();
}, 12000);
