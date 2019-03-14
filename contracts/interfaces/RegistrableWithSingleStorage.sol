pragma solidity 0.5.0;

import "./Registrable.sol";
import "../storage/interfaces/IStorageBase.sol";
import "../storageStrategy/interfaces/IStorageStrategy.sol";
import "../storageStrategy/SingleStorageStrategy.sol";

contract RegistrableWithSingleStorage is Registrable, SingleStorageStrategy {

  constructor (address _contractRegistry, IStorageBase _storage)
  public
  Registrable(_contractRegistry)
  SingleStorageStrategy (_storage) {}

  function register()
  external
  onlyFromContractRegistry
  returns (bool) {
    require(address(singleStorage) != address(0x0), "[register] contract do not have storage attached");

    return _register();
  }

  function unregister(IRegistrable _newInstance)
  external
  onlyFromContractRegistry {
    _unregister(_newInstance);

    IStorageStrategy newInstance = IStorageStrategy(address(_newInstance));
    detachFromStorage(address(newInstance));
  }
}
