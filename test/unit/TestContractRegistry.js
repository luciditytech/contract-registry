require('babel-register');
require('babel-polyfill');

const Registrable = artifacts.require('RegistrableInstance');

const Web3Utils = require('web3-utils');

const {
  deployContractRegistry,
} = require('../helpers/deployers');


contract('ContractRegistry', () => {
  let registrable1;
  let registrable2;
  let registrable3;
  let invalidRegistrable;
  let contractRegistryAddress;
  let ministroContractRegistry;

  before(async () => {
    ({
      ministro: ministroContractRegistry,
      address: contractRegistryAddress,
    } = await deployContractRegistry());

    registrable1 = await Registrable.new(contractRegistryAddress);
    registrable2 = await Registrable.new(contractRegistryAddress);
    registrable3 = await Registrable.new(contractRegistryAddress);
    await registrable3.setName(Web3Utils.fromAscii('registrable3'));

    invalidRegistrable = await Registrable.new(Web3Utils.randomHex(20));
  });

  it('should add() to registry', async () => {
    await ministroContractRegistry.add(registrable1.address);
  });

  it('invalid registrable contract should not be added', async () => {
    await ministroContractRegistry.add(invalidRegistrable.address, {}, true);
  });

  it('should update() registry', async () => {
    await ministroContractRegistry.update(registrable2.address);
  });

  it('should not be possible to update() with invalid registrable', async () => {
    await ministroContractRegistry.update(invalidRegistrable.address, {}, true);
  });

  it('should not be possible to update() when new instance is already registered', async () => {
    await ministroContractRegistry.add(registrable3.address);
    await ministroContractRegistry.update(registrable3.address, {}, true);
  });
});
