require('babel-register');
require('babel-polyfill');

const Web3Utils = require('web3-utils');

const Chain = artifacts.require('Chain.sol');
const NotUpdatable = artifacts.require('NotUpdatable.sol');


const {
  deployContractRegistry,
} = require('../helpers/deployers');

contract('ContractRegistry - NOT UPDATABLE', () => {
  let ministroContractRegistry;
  let contractRegistryAddress;
  let notUpdatableInstance;
  let chainInstance;

  before(async () => {
    ({
      ministro: ministroContractRegistry,
      address: contractRegistryAddress,
    } = await deployContractRegistry());

    chainInstance = await Chain.new(contractRegistryAddress, Web3Utils.randomHex(20));
    await ministroContractRegistry.add(chainInstance.address);
  });

  describe('with NotUpdatable contract', async () => {
    before(async () => {
      notUpdatableInstance = await NotUpdatable.new();
    });

    it('should NOT be possible to add() to registry', async () => {
      await ministroContractRegistry.add(notUpdatableInstance.address, {}, true);
    });

    it('should NOT be possible to update() registry', async () => {
      await ministroContractRegistry.update(notUpdatableInstance.address, {}, true);
    });
  });
});
