pragma solidity ^0.5.0;

import "truffle/Assert.sol";

import "../../contracts/tests/ThrowProxy.sol";
import "../../contracts/tests/Chain.sol";
import "../../contracts/tests/ChainStorage.sol";
import "../../contracts/tests/VerifierRegistry.sol";

import "../../contracts/interfaces/IContractRegistry.sol";
import "../../contracts/interfaces/IRegistrable.sol";
import "../../contracts/storageStrategy/interfaces/IStorageStrategy.sol";
import "../../contracts/storage/interfaces/IStorageBase.sol";
import "../../contracts/ContractRegistry.sol";

contract TestContractRegistryFlow {
  Chain chain1;
  Chain chain2;
  ChainStorage chainStorage;
  VerifierRegistry verifierRegistry;

  ThrowProxy throwProxy;

  ContractRegistry contractRegistry;

  constructor () public {
    throwProxy = new ThrowProxy(address(0x0));
    contractRegistry = new ContractRegistry();
  }

  function test_createChainStorage() public {
    chainStorage = new ChainStorage();
    chain1 = new Chain(
      address(contractRegistry),
      IChainStorage(address(chainStorage))
    );
    chainStorage.initStorageOwner(address(chain1));

    Assert.equal(address(chainStorage.storageOwner()), address(chain1), "invalid storageOwner");
  }

  function test_addChainToRegistry() public {
    Assert.isFalse(chain1.isRegistered(), "should NOT be register");
    contractRegistry.add(IRegistrable(address(chain1)));
    Assert.isTrue(chain1.isRegistered(), "should be register");
  }

  function test_UpdateChain() public {
    chain2 = new Chain(
      address(contractRegistry),
      IChainStorage(address(chainStorage))
    );

    Assert.isFalse(chain2.isRegistered(), "should NOT be register");
    contractRegistry.update(IRegistrable(address(chain2)));
    Assert.isTrue(chain2.isRegistered(), "should be register");

    Assert.equal(address(chainStorage.storageOwner()), address(chain2), "invalid storageOwner after update");
    Assert.equal(address(chain2.singleStorage()), address(chainStorage), "chain2 should take over storage");
  }
}
