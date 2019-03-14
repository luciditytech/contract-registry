pragma solidity 0.5.0;

import "../interfaces/Registrable.sol";

contract RegistrableInstance is Registrable {

  bytes32 NAME = "RegistrableInstance";

  constructor (address _contractRegistry) public Registrable(_contractRegistry) {}

  function contractName() external view returns (bytes32) {
    return NAME;
  }

  function setName(bytes32 _name) public {
    NAME = _name;
  }
}
