import { IAtom, createAtom } from 'mobx';

export default class MobxWebsocketStore<T> {
  atom: IAtom;
  opts: StoreOpts = {
    id: 'MobxWebsocketStore',
    resetDataOnOpen: true
  };

  protected __data: T | null;
  private openWebsocket: (store: MobxWebsocketStore<T>) => void;
  private closeWebsocket: (store: MobxWebsocketStore<T>) => void;

  get data(): T | null {
    this.atom.reportObserved();
    return this.__data;
  }

  set data(value: T | null) {
    this.__data = value;
    this.atom.reportChanged();
  }

  get id(): string {
    return this.opts.id;
  }

  constructor(
    openWebsocket: (store: MobxWebsocketStore<T>) => void,
    closeWebsocket: (store: MobxWebsocketStore<T>) => void,
    opts?: StoreOpts
  ) {
    this.openWebsocket = openWebsocket;
    this.closeWebsocket = closeWebsocket;
    this.atom = createAtom(
      'MobXWebsocketAtom',
      this.startListening.bind(this),
      this.stopListening.bind(this)
    );
    if (opts) {
      this.opts = Object.assign({}, this.opts, opts);
    }
  }

  startListening() {
    if (this.opts.resetDataOnOpen) {
      this.__data = null;
    }
    this.openWebsocket(this);
  }

  stopListening() {
    this.closeWebsocket(this);
  }
}

export type StoreOpts = {
  id?: string;
  resetDataOnOpen?: boolean;
};
