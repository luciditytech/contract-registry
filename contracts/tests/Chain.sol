pragma solidity 0.5.0;

import "../../contracts/interfaces/RegistrableWithSingleStorage.sol";
import "./interfaces/IChainStorage.sol";
import "./VerifierRegistry.sol";

contract Chain is RegistrableWithSingleStorage {

  bytes32 constant NAME = "Chain";

  constructor(address _contractRegistry, IChainStorage _storage)
  public
  RegistrableWithSingleStorage(_contractRegistry, IStorageBase(address(_storage))) {}

  function contractName() external view returns (bytes32) {
    return NAME;
  }

  function propose(bytes32 _propose)
  public
  needContractRegistrySetup
  returns (bool) {
    VerifierRegistry vr = VerifierRegistry(contractRegistry.contractByName("VerifierRegistry"));
    require(vr.verifiers(msg.sender), "verifier do not exists");

    IChainStorage(address(singleStorage)).setProposal(_propose);

    return true;
  }

  function proposals(bytes32 _proposal)
  external
  returns (bool) {
    return IChainStorage(address(singleStorage)).proposals(_proposal);
  }
}
