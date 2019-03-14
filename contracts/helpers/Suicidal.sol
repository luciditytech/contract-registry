pragma solidity 0.5.0;

contract Suicidal {

  address payable private _payableOwner;

  event LogSuicide(
    uint256 balance,
    address indexed balanceReceiver
  );

  constructor () public {
    _payableOwner = msg.sender;
  }

  function _suicide()
  internal {
    emit LogSuicide(address(this).balance, _payableOwner);
    selfdestruct(_payableOwner);
  }
}
