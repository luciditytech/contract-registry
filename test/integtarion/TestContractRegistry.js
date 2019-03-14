const { ZERO_ADDRESS, areAddressesEqual } = require('../helpers/functions');

const VerifierRegistry = artifacts.require('VerifierRegistry.sol');

const {
  deployContractRegistry,
} = require('../helpers/deployers');

contract('ContractRegistry', () => {
  let ministroContractRegistry;
  let contractRegistryAddress;
  let verifierRegistryInstance;
  let verifierRegistryInstanceNew;

  const verifierRegistryName = 'VerifierRegistry';

  before(async () => {
    ({
      ministro: ministroContractRegistry,
      address: contractRegistryAddress,
    } = await deployContractRegistry());
  });

  describe('with Registrable contract without external storage', async () => {
    before(async () => {
      verifierRegistryInstance = await VerifierRegistry.new(contractRegistryAddress);
    });

    it('should NOT be possible to update() when contract not exists in registry', async () => {
      assert(areAddressesEqual(
        await ministroContractRegistry.contractByName(verifierRegistryName),
        ZERO_ADDRESS,
      ));

      await ministroContractRegistry.update(
        verifierRegistryInstance.address,
        {},
        true,
      );
    });

    it('should be possible to add() to registry', async () => {
      await ministroContractRegistry.add(verifierRegistryInstance.address);
    });

    it('should NOT be possible to add() to registry more than ONCE', async () => {
      await ministroContractRegistry.add(
        verifierRegistryInstance.address,
        {},
        true,
      );
    });

    describe('when new instance is ready', async () => {
      before(async () => {
        verifierRegistryInstanceNew = await VerifierRegistry.new(contractRegistryAddress);
      });

      it('should NOT be possible to update() with same instance', async () => {
        await ministroContractRegistry.update(
          verifierRegistryInstance.address,
          {},
          true,
        );
      });

      it('should be possible to update() with new instance', async () => {
        await ministroContractRegistry.update(
          verifierRegistryInstanceNew.address,
        );
      });
    });
  });
});
