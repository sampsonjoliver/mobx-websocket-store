# 0.2.0

* Update to use MobX 4.x `IAtom` and `createAtom` constructors instead of the removed `Atom` class.

# 0.1.2

* Added `id` opt to MobxWebsocketStore constructor options, allowing the store to be identified by `store.id` after creation.

# 0.1.1

* Update `openWebsocket` / `closeWebsocket` to take a `this` object to avoid scope resolution issues

# 0.0.3

* First stable release
* Implement `MobxWebsocketStore` class definition for MobX 3.x
