# mobx-websocket-store

A simple class to create a mobx store that uses `atoms` to open and close websocket connections based on the observed state of the store.

## Installation

Install with your package manager of choice
```
yarn add mobx-websocket-store 
// or
npm install mobx-websocket-store 
```
## Motivation

The concept of this was driven by using the firebase realtime database in a frontend react project. A firebase database `reference` is analogous to having a 'socket', and attaching or detaching value listeners to that `reference` is analagous to opening and closing the socket connection.

A data store should therefore start listening to a `reference` only when one or more views were subscribed to that store. When all views are later removed, the store should stop listening for changes at that `reference`.


## Usage

Create a store instance for your websocket using the constructor, and passing in an onOpenWebsocket and onCloseWebsocket callback:
```
import  MobxWebsocketStore from 'mobx-websocket-store';
import { autorun } from 'mobx';

const socket = ...
const store = new MobxWebsocketStore(
  (store) => {
    console.log("Opening websocket");
    socket = openSocket();
  },
  (store) => {
    console.log("Closing websocket");
    socket.close();
  }
);

autorun(() => {
  console.log(store.data);
});
```

## Example Usage With React and Firebase
Here's how you could set up a simple chat room in about 5 minutes, using the very excellent `mobx-react` bindings and the `firebase` package.

First, we'll set up a store that will fetch messages in the chat room when it is observed:

```
import MobxWebsocketStore from 'mobx-websocket-store';
import firebase from "firebase";

firebase.initializeApp( ... );

const ref = firebase.database().ref("/messages");
const refListener = (snapshot: firebase.database.DataSnapshot) => {
  this.data = snapshot.val();
  this.atom.reportChanged();
};

const store = new MobxWebsocketStore(
  (store) => {
    console.log("Opening websocket");
    ref.on("value", refListener.bind(store));
  },
  (store) => {
    console.log("Closing websocket");
    ref.off("value", refListener.bind(store));
  }
);
```

Then, by passing that store to a component as a prop, a react component can subscribe to that store like below:

```
@observer
class ChatRoom extends Component {
  render() {
    const messages = this.props.store.data;
    return (
      /* Render each message into a component */
    );
  }
}
```

And voila! Thanks to MobX `atom`s and a little MobX secret sauce, when a `ChatRoom` component is rendered, it will subscribe to the messages store, which will cause that store to start listening to that database `reference`. When the `ChatRoom` component stops being rendered, due to the user navigating elsewhere, the database `reference` will stop listening for changes.
