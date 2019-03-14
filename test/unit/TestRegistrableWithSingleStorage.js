const Web3Utils = require('web3-utils');
const { areAddressesEqual, stringToBytes32 } = require('../helpers/functions');

const {
  deployStorageBase,
  deployRegistrableWithSingleStorageInstance,
} = require('../helpers/deployers');

contract('RegistrableWithSingleStorage', (accounts) => {
  let ministroRegistrableWithSingleStorage;
  const deployer = accounts[0];
  let deployedStorage;
  const contractRegistry = Web3Utils.randomHex(20);

  before(async () => {
    ({ instance: deployedStorage } = await deployStorageBase());
    ({
      ministro: ministroRegistrableWithSingleStorage,
    } = await deployRegistrableWithSingleStorageInstance(
      deployer,
      contractRegistry,
      deployedStorage.address,
    ));
  });

  it('should have valid initial name', async () => {
    assert(areAddressesEqual(await ministroRegistrableWithSingleStorage.contractName(), stringToBytes32('RegistrableWithSingleStorageInst')), 'invalid name');
  });

  it('should have valid initial contractRegistry', async () => {
    assert(areAddressesEqual(await ministroRegistrableWithSingleStorage.contractRegistry(), contractRegistry), 'invalid contractRegistry');
  });

  it('should be initially unregistered', async () => {
    assert(!await ministroRegistrableWithSingleStorage.isRegistered(), 'invalid isRegistered');
  });

  it('should NOT be possible to register() by not contractRegistry', async () => {
    await ministroRegistrableWithSingleStorage.register({ from: deployer }, true);
  });

  it('should NOT be possible to unregister() by not contractRegistry', async () => {
    await ministroRegistrableWithSingleStorage.unregister(
      Web3Utils.randomHex(20),
      { from: deployer },
      true,
    );
  });
});
