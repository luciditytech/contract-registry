pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "../../contracts/storage/interfaces/IStorageBase.sol";
import "../../contracts/storage/StorageBase.sol";
import "../../contracts/strategies/interfaces/IStorageStrategy.sol";
import "../../contracts/strategies/SingleStorageStrategy.sol";

contract TestSingleStorageStrategy {

  StorageBase storageBase;
  SingleStorageStrategy sss1;
  SingleStorageStrategy sss2;

  constructor () public {
    storageBase = new StorageBase();
  }

  function test_FirstStorageDeploy() public {
    sss1 = new SingleStorageStrategy(IStorageBase(address(storageBase)));
    IStorageBase[] memory list = sss1.getAllStorages();

    Assert.notEqual(address(list[0]), address(0x0), "There should be storage attached");
  }

  function test_InitStorageOwner() public {
    Assert.isTrue(storageBase.initStorageOwner(address(this)), "should be able to set initial owner");
  }

  function test_StorageCall() public {
    Assert.equal(address(this), address(storageBase.storageOwner()), "should set the owner");
    Assert.isTrue(storageBase.accessCheck(), "should be possible to call storage");
  }

  function test_SecondStorageTakeOver() public {
    sss2 = new SingleStorageStrategy(IStorageBase(address(storageBase)));

    Assert.isTrue(storageBase.switchOwnerTo(address(sss2)), "should be possible to switch");

    IStorageBase[] memory list = sss2.getAllStorages();
    Assert.equal(address(list[0]), address(storageBase), "There should be storage attached");
  }
}
