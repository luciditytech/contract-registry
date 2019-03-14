pragma solidity 0.5.0;

import "../../contracts/interfaces/Registrable.sol";

contract VerifierRegistry is Registrable {

  bytes32 constant NAME = "VerifierRegistry";

  constructor(address _contractRegistry)
  public
  Registrable(_contractRegistry) {}

  mapping (address => bool) public verifiers;

  function create() public {
    verifiers[msg.sender] = true;
  }

  function contractName() external view returns (bytes32) {
    return NAME;
  }
}
