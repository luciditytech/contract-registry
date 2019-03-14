pragma solidity 0.5.0;

import "../../contracts/storage/StorageBase.sol";
import "./VerifierRegistry.sol";

contract ChainStorage is StorageBase {

  mapping (bytes32 => bool) public proposals;

  function setProposal(bytes32 _propose)
  public
  onlyFromStorageOwner
  returns (bool) {
    proposals[_propose] = true;
    return true;
  }
}
