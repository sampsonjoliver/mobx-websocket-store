import MobxSocket from './mobxAtomStore';
import { firestore } from 'firebase';

export class FirestoreSovereign<
  F extends firestore.Query | firestore.DocumentReference,
  T
> extends MobxSocket<F extends firestore.Query ? T[] : T> {
  private unsubscriber: () => void;
  private fsRef: F;
  private __isLoading: boolean = false;

  public get isLoading() {
    this.atom.reportObserved();
    return this.__isLoading;
  }

  private getDataFromSnapshot<
    U extends firestore.QuerySnapshot | firestore.DocumentSnapshot
  >(snapshot: U): U extends firestore.QuerySnapshot ? T[] : T {
    if ((snapshot as firestore.QuerySnapshot).docs) {
      return (snapshot as firestore.QuerySnapshot).docs.map(doc =>
        doc.data()
      ) as U extends firestore.QuerySnapshot ? T[] : T;
    } else {
      return (snapshot as firestore.DocumentSnapshot).data() as U extends firestore.QuerySnapshot
        ? T[]
        : T;
    }
  }

  constructor(fsRef: F) {
    super(
      store => {
        console.log('Opening FS Sovereign');
        this.__isLoading = true;
        this.unsubscriber = (this.fsRef as firestore.Query).onSnapshot(
          snapshot => {
            this.__data = this.getDataFromSnapshot(
              snapshot
            ) as F extends firestore.Query ? T[] : T;
            this.__isLoading = false;
            this.atom.reportChanged();
          }
        );
      },
      store => {
        console.log('Closing FS Sovereign');
        this.unsubscriber();
        this.unsubscriber = undefined;
      }
    );

    this.fsRef = fsRef;
  }
}
