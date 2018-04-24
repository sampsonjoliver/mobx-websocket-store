import { SovereignFactory } from '../src/sovereignFactory';
import { autorun, reaction } from 'mobx';
import { firestore } from 'firebase';
import { FirestoreSovereign } from '../src/firestoreSovereign';

let factory: SovereignFactory<number>;
describe('sovereign-factory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    factory = new SovereignFactory<number>('');
  });

  it('Creates new sovereign when not exists', () => {
    const mockFirestoreQuery: any = { onSnapshot: jest.fn() };
    factory.getOrCreateStore('key', mockFirestoreQuery);

    expect(factory.getOrCreateStore('key')).toBeInstanceOf(FirestoreSovereign);
    expect(factory.getOrCreateStore('otherkey')).toBeUndefined();
  });

  it('Does become observed from observer access', () => {
    const mockFirestoreQuery: any = { onSnapshot: jest.fn() };
    const fsSovereign = factory.getOrCreateStore('key', mockFirestoreQuery);
    autorun(() => {
      const x = fsSovereign.data;
    });
    expect(mockFirestoreQuery.onSnapshot.mock.calls.length).toBe(1);
  });

  it('Becomes unobserved after observer closes', () => {
    const fsClose = jest.fn();
    const mockFirestoreQuery: any = { onSnapshot: jest.fn() };
    mockFirestoreQuery.onSnapshot.mockImplementation(() => fsClose);
    const fsSovereign = factory.getOrCreateStore(
      'key',
      mockFirestoreQuery as firestore.Query
    );

    console.log('fsSovereign', fsSovereign);

    const close = autorun(() => {
      const x = fsSovereign.data;
    });
    close();

    expect(mockFirestoreQuery.onSnapshot.mock.calls.length).toBe(1);
    expect(close.$mobx.isDisposed).toBeTruthy();

    expect(fsClose.mock.calls.length).toBe(1);
  });
});
