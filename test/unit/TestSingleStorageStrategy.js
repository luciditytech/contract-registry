require('babel-register');
require('babel-polyfill');

const { ZERO_ADDRESS, areAddressesEqual } = require('../helpers/functions');

const SingleStorageStrategy = artifacts.require('SingleStorageStrategy');

const {
  deploySingleStorageStrategy,
  deployStorageBase,
} = require('../helpers/deployers');

contract('SingleStorageStrategy', async (accounts) => {
  let ministroSingleStorageStrategy;
  const deployer = accounts[0];
  let deployedStorage;

  describe('when storage is deployed', async () => {
    before(async () => {
      ({ instance: deployedStorage } = await deployStorageBase());
    });

    it('should not be possible to deploy without providing storage', async () => {
      try {
        await SingleStorageStrategy.new(ZERO_ADDRESS);
        assert(false, 'should throw');
      } catch (e) {
        // OK
      }
    });

    describe('when storage strategy is deployed', async () => {
      before(async () => {
        ({
          ministro: ministroSingleStorageStrategy,
        } = await deploySingleStorageStrategy(deployer, deployedStorage.address));
      });

      it('should have valid initial storage', async () => {
        assert(areAddressesEqual(await ministroSingleStorageStrategy.singleStorage(), deployedStorage.address), 'invalid singleStorage');
      });

      it('should be possible to get list of storages', async () => {
        await ministroSingleStorageStrategy.getAllStorages();
      });
    });
  });
});
