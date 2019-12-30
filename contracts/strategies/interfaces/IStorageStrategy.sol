pragma solidity 0.5.0;

import "../../storage/interfaces/IStorageBase.sol";

interface IStorageStrategy {
  function updateSingleStorage(IStorageBase _storage) external;
  function getAllStorages() external view returns (IStorageBase[] memory);
}
