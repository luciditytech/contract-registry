pragma solidity 0.5.0;

import "./interfaces/IStorageStrategy.sol";
import "../helpers/Suicidal.sol";
import "../storage/interfaces/IStorageBase.sol";

contract SingleStorageStrategy is IStorageStrategy, Suicidal {
  address private _deployer;

  IStorageBase public singleStorage;

  event LogDetachFromStorage(
    address indexed executor,
    address indexed newStorageOwner
  );

  event LogNewStorage(IStorageBase indexed storageAddress);
  event LogUpdateSingleStorage(IStorageBase indexed storageAddress);

  constructor (IStorageBase _storage) public {
    require(address(_storage) != address(0x0), "storage can't be empty");
    singleStorage = _storage;
    _deployer = msg.sender;
  }

  function updateSingleStorage(IStorageBase _storage)
  external {
    require(_deployer == msg.sender, "only deployer can update storage address");
    require(address(_storage) != address(0x0), "storage can't be empty");
    require(singleStorage != _storage, "addresses are the same");

    singleStorage = _storage;
    emit LogUpdateSingleStorage(_storage);
  }

  function getAllStorages()
  external
  view
  returns (IStorageBase[] memory) {
    return _getAllStorages();
  }

  function _getAllStorages()
  private
  view
  returns (IStorageBase[] memory) {
    IStorageBase[] memory list = new IStorageBase[](1);
    list[0] = singleStorage;
    return list;
  }

  function detachFromStorage(address _newStorageOwner)
  internal {
    require(singleStorage.switchOwnerTo(_newStorageOwner), "[detachFromStorage] failed");

    emit LogDetachFromStorage(msg.sender, _newStorageOwner);

    _suicide();
  }
}
