pragma solidity ^0.5.0;

import "truffle/Assert.sol";

import "../../contracts/tests/ThrowProxy.sol";
import "../../contracts/tests/Chain.sol";
import "../../contracts/tests/ChainStorage.sol";
import "../../contracts/tests/VerifierRegistry.sol";

import "../../contracts/interfaces/IContractRegistry.sol";
import "../../contracts/interfaces/IRegistrable.sol";
import "../../contracts/storageStrategy/interfaces/IStorageStrategy.sol";
import "../../contracts/ContractRegistry.sol";

contract TestSingleStorageTransfer {
  Chain chain1;
  Chain chain2;
  ChainStorage chainStorage;

  ThrowProxy throwProxy;

  IContractRegistry contractRegistry;

  constructor () public {
    throwProxy = new ThrowProxy(address(0x0));
    contractRegistry = IContractRegistry(address(this));
  }

  function test_createChainStorage() public {
    chainStorage = new ChainStorage();
    chain1 = new Chain(
      address(contractRegistry),
      IChainStorage(address(chainStorage))
    );
    chainStorage.initStorageOwner(address(chain1));
    chain1.register();

    Assert.equal(address(chainStorage.storageOwner()), address(chain1), "invalid storageOwner");
  }

  function test_unregistered() public {
    chain2 = new Chain(
      address(contractRegistry),
      IChainStorage(address(chainStorage))
    );

    Assert.equal(address(chainStorage.storageOwner()), address(chain1), "invalid storageOwner before update");
    Assert.equal(address(chain2.singleStorage()), address(chainStorage), "chain2 should have storage set before update");

    chain1.unregister(IRegistrable(address(chain2)));

    Assert.equal(address(chainStorage.storageOwner()), address(chain2), "invalid storageOwner after update");
    Assert.equal(address(chain2.singleStorage()), address(chainStorage), "chain2 should take over storage");
  }

  function test_registered() public {
    chain2.register();
    Assert.isTrue(chain2.isRegistered(), "should be register");
  }
}
