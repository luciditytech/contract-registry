pragma solidity 0.5.0;

import "../helpers/Killable.sol";
import "./interfaces/IStorageBase.sol";

contract StorageBase is Killable {

  address public deployer;

  address public storageOwner;

  event LogInitStorageOwner(address indexed executor, address indexed storageOwner);
  event LogSwitchOwnerTo(address indexed executor, address indexed storageOwner);

  modifier onlyFromStorageOwner() {
    require(msg.sender == address(storageOwner), "you are not an owner of this storage");
    _;
  }

  constructor () public {
    deployer = msg.sender;
  }

  function initStorageOwner(address _instance)
  external
  returns (bool) {
    require(msg.sender == deployer, "[initStorageOwner] only deployer can initialize storage owner");
    require(address(storageOwner) == address(0x0), "[initStorageOwner] _storageOwner is already set");

    storageOwner = _instance;
    emit LogInitStorageOwner(msg.sender, _instance);

    return true;
  }

  function switchOwnerTo(address _newOwner)
  external
  onlyFromStorageOwner
  returns (bool) {
    require(address(storageOwner) != address(0x0), "[switchOwnerTo] failed");

    storageOwner = _newOwner;
    emit LogSwitchOwnerTo(msg.sender, _newOwner);

    return true;
  }

  function accessCheck()
  external
  view
  onlyFromStorageOwner
  returns (bool) {
    return true;
  }
}
