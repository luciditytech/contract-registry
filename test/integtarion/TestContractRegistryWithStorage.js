const { ZERO_ADDRESS } = require('../helpers/functions');

const Chain = artifacts.require('Chain.sol');
const ChainStorage = artifacts.require('ChainStorage.sol');

const {
  deployContractRegistry,
} = require('../helpers/deployers');

contract('ContractRegistry', () => {
  let ministroContractRegistry;
  let chainStorageInstance;
  let chainInstance;
  let chainInstanceNew;
  let contractRegistryAddress;

  describe('when invalid constructor data provided', async () => {
    before(async () => {
      ({
        ministro: ministroContractRegistry,
        address: contractRegistryAddress,
      } = await deployContractRegistry());
    });

    it('should NOT be possible to deploy() when storage is not provided', async () => {
      try {
        await Chain.new(contractRegistryAddress, ZERO_ADDRESS);
        assert(false, 'should throw');
      } catch (e) {
        // OK
      }
    });
  });

  describe('with Registrable contract with single storage', async () => {
    describe('when deploying contract', async () => {
      beforeEach(async () => {
        ({
          ministro: ministroContractRegistry,
          address: contractRegistryAddress,
        } = await deployContractRegistry());

        chainStorageInstance = await ChainStorage.new();

        chainInstance = await Chain.new(
          contractRegistryAddress,
          chainStorageInstance.address,
        );
        await chainStorageInstance.initStorageOwner(chainInstance.address);

        chainInstanceNew = await Chain.new(
          contractRegistryAddress,
          chainStorageInstance.address,
        );
      });

      it('should be possible to add() this contract', async () => {
        await ministroContractRegistry.add(chainInstanceNew.address);
      });

      it('should be possible to update() with this contract', async () => {
        await ministroContractRegistry.add(chainInstance.address);
        await ministroContractRegistry.update(chainInstanceNew.address);
      });
    });
  });
});
