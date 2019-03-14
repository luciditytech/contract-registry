pragma solidity 0.5.0;

import "./IRegistrable.sol";

interface IContractRegistry {
  function add(IRegistrable) external returns(bool);
  function update(IRegistrable) external returns(bool);

  function contractByName(bytes32) external view returns (address);
}
