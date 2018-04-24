import * as React from 'react';
import { Provider, inject, observer, IReactComponent } from 'mobx-react';
import { SovereignFactory } from './sovereignFactory';
import { firestore } from 'firebase';

const FsProvider = () => {
  return <Provider sovereignStore={new SovereignFactory('sovereignStore')} />;
};

const injectFirestore = (
  WrappedComponent: IReactComponent,
  fsMap: (
    db: firestore.Firestore
  ) => { [key: string]: firestore.Query | firestore.DocumentReference }
) => {
  class SovereignComponent extends React.Component<
    { sovereignStore: SovereignFactory },
    {}
  > {
    componentDidMount() {
      const factory: SovereignFactory = this.props.sovereignStore;
      const fsRefs = fsMap(firestore());
      const sovereigns = Object.keys(fsRefs).map(key => ({
        key: factory.getOrCreateStore(key, fsRefs[key])
      }));
      this.setState({ ...sovereigns });
    }

    render() {
      return <WrappedComponent {...this.state} />;
    }
  }

  return inject('sovereignStore')(observer(SovereignComponent));
};
