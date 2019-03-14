pragma solidity 0.5.0;

import "../helpers/Suicidal.sol";
import "./IRegistrable.sol";
import "./IContractRegistry.sol";

contract Registrable is IRegistrable, Suicidal {

  IContractRegistry public contractRegistry;

  bool private _isRegistered;

  modifier needContractRegistrySetup {
    require(address(contractRegistry) != address(0x0), "[needContractRegistrySetup] contractRegistry address is empty");
    require(_isRegistered, "[needContractRegistrySetup] contract is not registered");
    _;
  }

  modifier onlyFromContractRegistry() {
    require(msg.sender == address(contractRegistry), "[onlyFromContractRegistry] access denied");
    _;
  }

  modifier onlyFromContract(bytes32 _name) {
    require(_name != bytes32(0), "contract name is not set");
    require(msg.sender == contractRegistry.contractByName(_name), "[onlyFromContract...] access denied");
    _;
  }

  event LogRegister(address indexed executor, address indexed registered, bool isRegistered);

  constructor (address _contractRegistry) public {
    require(address(_contractRegistry) != address(0x0), "_contractRegistry address is empty");

    contractRegistry = IContractRegistry(_contractRegistry);
  }

  function isRegistered() external view returns (bool) {
    return _isRegistered;
  }

  function register()
  external
  onlyFromContractRegistry
  returns (bool) {
    return _register();
  }

  function _register()
  internal
  returns (bool) {
    require(!_isRegistered, "i'm already register");

    _isRegistered = true;
    emit LogRegister(msg.sender, address(this), true);

    return true;
  }

  function unregister(IRegistrable _newInstance)
  external
  onlyFromContractRegistry {
    _unregister(_newInstance);

    /// @dev it is important that contract be killed once it is replaced by new one,
    ///      so there be no case when we allow to use old methods (including getters)
    _suicide();
  }

  function _unregister(IRegistrable _newInstance)
  internal
  returns (bool) {
    require(_isRegistered, "i'm not even register");
    require(address(_newInstance) != address(0x0), "[unregister] _newInstance address is empty");
    require(address(_newInstance) != address(this), "[unregister] _newInstance is me");

    _isRegistered = false;
    emit LogRegister(msg.sender, address(this), false);

    return true;
  }
}
