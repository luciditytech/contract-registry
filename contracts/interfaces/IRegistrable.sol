pragma solidity 0.5.0;

interface IRegistrable {
  function contractName() external view returns (bytes32);
  function register() external returns (bool);
  function isRegistered() external view returns (bool);
  function unregister(IRegistrable _newInstance) external;
}
