import MobxWebsocketStore from '../src/mobxAtomStore';
import { autorun, reaction } from 'mobx';

const mockSocket = {
  open: jest.fn(),
  close: jest.fn()
};

let mobxAtomStore: MobxWebsocketStore<number>;

describe('mobxAtomStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mobxAtomStore = new MobxWebsocketStore<number>(
      store => {
        mockSocket.open();
      },
      store => {
        mockSocket.close();
      }
    );
  });

  it('Does not become observed from non-observer access', () => {
    const x = mobxAtomStore.data;
    expect(mockSocket.open.mock.calls.length).toBe(0);
  });

  it('Does become observed from observer access', () => {
    autorun(() => {
      const x = mobxAtomStore.data;
    });
    expect(mockSocket.open.mock.calls.length).toBe(1);
  });

  it('Becomes unobserved after observer closes', () => {
    const close = autorun(() => {
      const x = mobxAtomStore.data;
    });
    close();
    expect(mockSocket.open.mock.calls.length).toBe(1);
    expect(close.$mobx.isDisposed).toBeTruthy();
  });

  it('Triggers observer on data changed', () => {
    var count = 0;
    autorun(() => {
      const x = mobxAtomStore.data;
      count++;
    });
    mobxAtomStore.data = 5;
    mobxAtomStore.data = 2;
    expect(mockSocket.open.mock.calls.length).toBe(1);
    expect(count).toBe(3);
  });
});
