pragma solidity 0.5.0;

import "../../storage/interfaces/IStorageBase.sol";

interface IStorageStrategy {
  function getAllStorages() external view returns (IStorageBase[] memory);
}
