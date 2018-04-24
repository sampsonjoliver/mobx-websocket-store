import { FirestoreSovereign } from '../src/firestoreSovereign';
import { autorun, reaction } from 'mobx';
import { firestore } from 'firebase';

const mockFirestoreQuery: any = {
  onSnapshot: jest.fn()
};

let fsSovereign: FirestoreSovereign<firestore.Query, number>;

describe('fsSovereign', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    fsSovereign = new FirestoreSovereign<firestore.Query, number>(
      mockFirestoreQuery as firestore.Query
    );
  });

  it('Does not become observed from non-observer access', () => {
    const x = fsSovereign.data;
    expect(mockFirestoreQuery.onSnapshot.mock.calls.length).toBe(0);
  });

  it('Does become observed from observer access', () => {
    autorun(() => {
      const x = fsSovereign.data;
    });
    expect(mockFirestoreQuery.onSnapshot.mock.calls.length).toBe(1);
  });

  it('Becomes unobserved after observer closes', () => {
    const fsClose = jest.fn();
    mockFirestoreQuery.onSnapshot.mockImplementation(() => fsClose);
    const close = autorun(() => {
      const x = fsSovereign.data;
    });
    close();

    expect(mockFirestoreQuery.onSnapshot.mock.calls.length).toBe(1);
    expect(close.$mobx.isDisposed).toBeTruthy();
    expect(fsClose.mock.calls.length).toBe(1);
  });
});
