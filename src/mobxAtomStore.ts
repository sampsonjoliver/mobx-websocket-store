import { Atom } from "mobx";

export default class MobxWebsocketStore<T> {
  atom: Atom;
  opts: StoreOpts = {
    resetDataOnOpen: true
  };
  private __data: T | null;
  private openWebsocket: () => void;
  private closeWebsocket: () => void;

  get data(): T | null {
    this.atom.reportObserved();
    return this.__data;
  }

  set data(value: T | null) {
    this.__data = value;
    this.atom.reportChanged();
  }

  constructor(openWebsocket: () => void, closeWebsocket: () => void, opts?: StoreOpts) {
    this.openWebsocket = openWebsocket;
    this.closeWebsocket = closeWebsocket;
    this.atom = new Atom("MobXWebsocketAtom", this.startListening.bind(this), this.stopListening.bind(this));
    if (opts) {
      this.opts = Object.assign({}, this.opts, opts);
    }
  }

  startListening() {
    if (this.opts.resetDataOnOpen) {
      this.__data = null;
    }
    this.openWebsocket();
  }

  stopListening() {
    this.closeWebsocket();
  }
}

export type StoreOpts = {
  resetDataOnOpen: boolean;
};
