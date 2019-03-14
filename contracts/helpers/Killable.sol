pragma solidity 0.5.0;

contract Killable {

  address payable private _payableOwner;

  event LogKill(
    uint256 balance,
    address indexed balanceReceiver
  );

  constructor () public {
    _payableOwner = msg.sender;
  }

  function kill()
  external {
    require(msg.sender == _payableOwner, "[kill] access denied");

    emit LogKill(address(this).balance, _payableOwner);
    selfdestruct(_payableOwner);
  }
}
