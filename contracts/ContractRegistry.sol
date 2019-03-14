pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./interfaces/IRegistrable.sol";
import "./interfaces/IContractRegistry.sol";

contract ContractRegistry is IContractRegistry, Ownable {

  mapping(bytes32 => IRegistrable) private _contractsByName;

  event LogAdd(address indexed executor, bytes32 instanceName, IRegistrable instance);
  event LogUpdate(address indexed executor, bytes32 instanceName, IRegistrable oldInstance, IRegistrable newInstance);

  constructor() public {}

  function contractByName(bytes32 _name) external view returns (address) {
    return address(_contractsByName[_name]);
  }

  function add(IRegistrable _instance)
  public
  onlyOwner
  returns(bool) {
    require(address(_instance) != address(0x0), "[add] Contract address is empty");
    bytes32 name = _instance.contractName();
    require(name != 0, "[add] Contract name is empty");
    require(address(_contractsByName[name]) == address(0x0), "[add] This name is already in use");

    require(_instance.register(), "[add] register failed");

    _contractsByName[name] = _instance;

    emit LogAdd(msg.sender, name, _instance);

    return true;
  }

  function update(IRegistrable _newInstance)
  public
  onlyOwner
  returns(bool) {
    bytes32 name = _newInstance.contractName();
    IRegistrable oldInstance = _contractsByName[name];

    require(address(oldInstance) != address(0x0), "[update] Instance with provided name do not exists");
    require(address(_newInstance) != address(0x0), "[update] New instance address is empty");
    require(oldInstance != _newInstance, "[update] New and old address are the same");

    oldInstance.unregister(_newInstance);
    require(_newInstance.register(), "[update] registration failed");

    _contractsByName[name] = _newInstance;

    emit LogUpdate(msg.sender, name, oldInstance, _newInstance);

    return true;
  }
}
