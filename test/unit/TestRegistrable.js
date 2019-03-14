const Web3Utils = require('web3-utils');

const { areAddressesEqual, stringToBytes32 } = require('../helpers/functions');

const {
  deployRegistrable,
} = require('../helpers/deployers');

contract('Registrable', (accounts) => {
  let ministroRegistrable;
  const deployer = accounts[0];
  const contractRegistry = Web3Utils.randomHex(20);

  before(async () => {
    ({ ministro: ministroRegistrable } = await deployRegistrable(deployer, contractRegistry));
  });

  it('should have valid initial name', async () => {
    assert(areAddressesEqual(await ministroRegistrable.contractName(), stringToBytes32('RegistrableInstance')), 'invalid name');
  });

  it('should have valid initial contractRegistry', async () => {
    assert(areAddressesEqual(await ministroRegistrable.contractRegistry(), contractRegistry), 'invalid contractRegistry');
  });

  it('should be initially unregister', async () => {
    assert(!await ministroRegistrable.isRegistered(), 'invalid isRegistered');
  });

  it('should NOT be possible to register() by not contractRegistry', async () => {
    await ministroRegistrable.register({ from: deployer }, true);
  });

  it('should NOT be possible to unregister() by not contractRegistry', async () => {
    await ministroRegistrable.unregister(Web3Utils.randomHex(20), { from: deployer }, true);
  });
});
