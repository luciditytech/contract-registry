pragma solidity 0.5.0;

import "../interfaces/RegistrableWithSingleStorage.sol";

contract RegistrableWithSingleStorageInstance is RegistrableWithSingleStorage {

  bytes32 constant NAME = "RegistrableWithSingleStorageInst";

  constructor (address _contractRegistry, IStorageBase _storage)
  public
  RegistrableWithSingleStorage(_contractRegistry, _storage) {}

  function contractName() external view returns (bytes32) {
    return NAME;
  }
}
