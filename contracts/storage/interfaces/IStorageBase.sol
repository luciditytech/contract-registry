pragma solidity 0.5.0;

interface IStorageBase {
  function initStorageOwner(address) external returns (bool);
  function switchOwnerTo(address) external returns (bool);
  function kill() external returns (bool);

  function storageOwner() external returns (address);
}
