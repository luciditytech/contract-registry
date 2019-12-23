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
  let invalidStorage;
  let validStorage;

  describe('when storage is deployed', async () => {
    before(async () => {
      ({ instance: invalidStorage } = await deployStorageBase());
    });

    it('should not be possible to deploy without providing storage', async () => {
      try {
        await SingleStorageStrategy.new(ZERO_ADDRESS);
        assert(false, 'should throw');
      } catch (e) {
        // OK
      }
    });

    describe('when storage strategy is deployed with invalid storage address', async () => {
      before(async () => {
        ({
          ministro: ministroSingleStorageStrategy,
        } = await deploySingleStorageStrategy(deployer, invalidStorage.address));

        ({ instance: validStorage } = await deployStorageBase());
      });

      it('should have valid initial storage address', async () => {
        assert(areAddressesEqual(await ministroSingleStorageStrategy.singleStorage(), invalidStorage.address), 'invalid initial storage address');
      });

      it('should NOT be possible to update single storage address by not a deployer', async () => {
        await ministroSingleStorageStrategy.updateSingleStorage(
          validStorage.address,
          { from: accounts[1] },
          true,
        );
      });

      it('should be possible to update single storage by deployer', async () => {
        await ministroSingleStorageStrategy.updateSingleStorage(validStorage.address);
      });

      it('should be possible to get list of storages', async () => {
        await ministroSingleStorageStrategy.getAllStorages();
      });
    });
  });
});
