import MobxSocket from './mobxAtomStore';
import { action, autorun, observable } from 'mobx';
import * as firebase from 'firebase';
import { FirestoreSovereign } from './firestoreSovereign';

export class SovereignFactory {
  private _name: string = 'StoreFactory';
  private stores: Map<
    string,
    FirestoreSovereign<
      firebase.firestore.Query | firebase.firestore.DocumentReference,
      any
    >
  >;

  get name(): string {
    return this._name;
  }

  constructor(name: string) {
    this._name = name;
    this.stores = new Map();
  }

  public getOrCreateStore<
    F extends firebase.firestore.Query | firebase.firestore.DocumentReference,
    T
  >(key: string, query?: F): FirestoreSovereign<F, T> {
    if (!this.stores.has(key) && query) {
      const sovereign = new FirestoreSovereign<F, T>(query);
      this.stores.set(key, sovereign);
    }

    const store = this.stores.get(key) as FirestoreSovereign<F, T>;
    return store;
  }
}
