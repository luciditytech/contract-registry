pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "../../contracts/tests/ThrowProxy.sol";
import "../../contracts/interfaces/IContractRegistry.sol";
import "../../contracts/tests/RegistrableInstance.sol";

contract TestRegistrable {
  RegistrableInstance registrable;
  RegistrableInstance registrable2;

  ThrowProxy throwProxy;

  constructor () public {
    registrable = new RegistrableInstance(address(this));
    registrable2 = new RegistrableInstance(address(this));

    throwProxy = new ThrowProxy(address(registrable));
  }

  function test_initialValues() public {
    Assert.equal(address(registrable.contractRegistry()), address(this), "invalid contractRegistry");
  }

  function testThrow_CanNotUnregisteredWhenNotRegistered() public {
    Assert.equal(address(registrable), throwProxy.target(), "should be address of testing contract");

    //prime the proxy.
    IRegistrable(address(throwProxy)).unregister(IRegistrable(address(registrable2)));
    bool success;
    (success, ) = throwProxy.execute.gas(4600000)();

    Assert.isFalse(success, "should not allow to unregister if not registered first");
  }

  function test_ShouldBePossibleToRegistered() public {
    Assert.isTrue(registrable.register(), "should be possible to register");
    Assert.isTrue(registrable.isRegistered(), "should be register");
  }

  function testThrow_CanBeUnregisterWhenWasRegistered() public {
    registrable.unregister(IRegistrable(address(registrable2)));
  }
}
