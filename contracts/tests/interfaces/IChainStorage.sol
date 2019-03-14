pragma solidity 0.5.0;

contract IChainStorage {
  function proposals(bytes32) public returns (bool);
  function setProposal(bytes32) public returns (bool);
}
