require('babel-register');
require('babel-polyfill');

const BigNumber = require('bignumber.js');
const Web3Utils = require('web3-utils');

const {
  deployStorageBase,
} = require('../helpers/deployers');

contract('StorageBase', (accounts) => {
  let ministroStorageBase;
  const deployer = accounts[0];
  const storageOwner = Web3Utils.randomHex(20);
  const notStorageOwner = Web3Utils.randomHex(20);
  const newStorageOwner = Web3Utils.randomHex(20);

  before(async () => {
    ({ ministro: ministroStorageBase } = await deployStorageBase());

    assert(!BigNumber(storageOwner).eq(notStorageOwner), 'storage owners should be different');
    assert(!BigNumber(newStorageOwner).eq(notStorageOwner), 'storage owners should be different');
  });

  it('should have valid initial deployer', async () => {
    assert.strictEqual(
      await ministroStorageBase.deployer(),
      deployer,
      'invalid deployer',
    );
  });

  it('should have empty initial storage owner', async () => {
    assert.strictEqual(
      BigNumber(await ministroStorageBase.storageOwner()).toNumber(10),
      0,
      'invalid storageOwner',
    );
  });

  it('should NOT be possible to initiate storage owner value from NOT deployer', async () => {
    await ministroStorageBase.initStorageOwner(storageOwner, { from: storageOwner }, true);
  });

  it('should be possible to initiate storage owner value from deployer', async () => {
    await ministroStorageBase.initStorageOwner(storageOwner);
  });

  it('should NOT be possible to change storage owner value once it is set', async () => {
    await ministroStorageBase.initStorageOwner(storageOwner, {}, true);
  });

  it('should NOT be possible to switch to another storage owner by NOT storage owner', async () => {
    await ministroStorageBase.switchOwnerTo(newStorageOwner, { from: deployer }, true);
  });

  it('should NOT be possible to switch to another storage owner by NOT storage owner', async () => {
    await ministroStorageBase.switchOwnerTo(newStorageOwner, { from: deployer }, true);
  });

  it('should be possible to switch to another storage owner by storage owner', async () => {
    await ministroStorageBase.switchOwnerTo(newStorageOwner, { from: storageOwner }, true);
  });

  it('should NOT be possible to kill by NOT deployer', async () => {
    await ministroStorageBase.kill({ from: storageOwner }, true);
  });

  it('should be possible to kill by deployer', async () => {
    await ministroStorageBase.kill();
  });
});
