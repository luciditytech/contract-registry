require('babel-register');
require('babel-polyfill');

const {
  areAddressesEqual, stringToBytes32, isContractKilled,
} = require('../helpers/functions');

const Chain = artifacts.require('Chain.sol');
const ChainStorage = artifacts.require('ChainStorage.sol');
const VerifierRegistry = artifacts.require('VerifierRegistry.sol');


const {
  deployContractRegistry,
} = require('../helpers/deployers');

contract('ContractRegistry - testing communication interface', (accounts) => {
  let ministroContractRegistry;
  let chainStorageInstance;
  let chainInstance;
  let contractRegistryAddress;
  let verifierRegistryInstance;

  const chainName = 'Chain';

  before(async () => {
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

    verifierRegistryInstance = await VerifierRegistry.new(contractRegistryAddress);
  });

  it('should be possible to register all contracts', async () => {
    await ministroContractRegistry.add(verifierRegistryInstance.address);
    await ministroContractRegistry.add(chainInstance.address);
  });

  describe('with unregister verifier', async () => {
    const verifier = accounts[1];
    const verifierProposal = stringToBytes32('proposal');

    it('should NOT be possible to propose()', async () => {
      try {
        await chainInstance.propose(verifierProposal, { from: verifier });
        assert(false, 'should throw');
      } catch (e) {
        assert.isFalse(await chainInstance.proposals.call(verifierProposal));
      }
    });

    describe('when verifier is register', async () => {
      before(async () => {
        await verifierRegistryInstance.create({ from: verifier });
      });

      it('should be possible to propose()', async () => {
        await chainInstance.propose(verifierProposal, { from: verifier });
        assert.isTrue(await chainInstance.proposals.call(verifierProposal));
      });
    });

    describe('after chain is updated with new instance', async () => {
      const verifierProposal2 = stringToBytes32('proposal2');

      before(async () => {
        const chainInstanceNew = await Chain.new(
          contractRegistryAddress,
          chainStorageInstance.address,
        );
        await ministroContractRegistry.update(chainInstanceNew.address);
      });

      it('should NOT be possible to propose() using old instance', async () => {
        try {
          await chainInstance.propose(verifierProposal2, { from: verifier });
          assert(false, 'should throw');
        } catch (e) {
          // OK
        }
      });

      it('old instance should be killed', async () => {
        assert(
          await isContractKilled(() => chainInstance.proposals.call(verifierProposal2)),
        );
      });

      describe('when using new chain instance address', async () => {
        before(async () => {
          const chainNewAddress = await ministroContractRegistry.contractByName(chainName);
          chainInstance = await Chain.at(chainNewAddress);
          assert(areAddressesEqual(chainInstance.address, chainNewAddress));
        });

        it('should be possible to propose()', async () => {
          await chainInstance.propose(verifierProposal2, { from: verifier });
          assert.isTrue(await chainInstance.proposals.call(verifierProposal2));
        });

        it('first proposal should be available', async () => {
          assert.isTrue(await chainInstance.proposals.call(verifierProposal));
        });
      });
    });
  });
});
