const ContractRegistry = artifacts.require('ContractRegistry');
const StorageBase = artifacts.require('StorageBase');
const SingleStorageStrategy = artifacts.require('SingleStorageStrategy');
const RegistrableInstance = artifacts.require('RegistrableInstance');
const RegistrableWithSingleStorage = artifacts.require('RegistrableWithSingleStorageInstance');

const ContractRegistryUtil = require('../ministro-contracts/ministroContractRegistry');
const RegistrableUtil = require('../ministro-contracts/ministroRegistrable');
const RegistrableWithSingleStorageUtil = require('../ministro-contracts/ministroRegistrableWithSingleStorage');
const StorageBaseUtil = require('../ministro-contracts/ministroStorageBase');
const SingleStorageStrategyUtil = require('../ministro-contracts/ministroSingleStorageStrategy');

const deployContractRegistry = async () => {
  const ministro = ContractRegistryUtil();
  const instance = await ContractRegistry.new();

  ministro.setInstanceVar(instance);
  ministro.setFromVar(await instance.owner.call());

  return {
    ministro,
    address: instance.address,
    instance,
  };
};

const deployRegistrable = async (deployer, contractRegistryAddress) => {
  const ministro = RegistrableUtil();
  const instance = await RegistrableInstance.new(contractRegistryAddress, { from: deployer });

  ministro.setInstanceVar(instance);
  ministro.setFromVar(deployer);

  return {
    ministro,
    instance,
  };
};

const deployStorageBase = async () => {
  const instance = await StorageBase.new();
  const ministro = StorageBaseUtil();

  ministro.setInstanceVar(instance);
  ministro.setFromVar(await instance.deployer.call());

  return {
    ministro,
    instance,
  };
};

const deploySingleStorageStrategy = async (deployer, storageBaseAddress) => {
  const storageBase = await StorageBase.at(storageBaseAddress);
  const instance = await SingleStorageStrategy.new(storageBase.address);

  const ministro = SingleStorageStrategyUtil();

  ministro.setInstanceVar(instance);
  ministro.setFromVar(deployer);

  return {
    ministro,
    instance,
  };
};

const deployRegistrableWithSingleStorageInstance = async (
  deployer,
  contractRegistryAddress,
  storageBaseAddress,
) => {
  const ministro = RegistrableWithSingleStorageUtil();
  const instance = await RegistrableWithSingleStorage.new(
    contractRegistryAddress,
    storageBaseAddress,
    { from: deployer },
  );

  ministro.setInstanceVar(instance);
  ministro.setFromVar(deployer);

  return {
    ministro,
    instance,
  };
};

module.exports = {
  deployContractRegistry,
  deployStorageBase,
  deploySingleStorageStrategy,
  deployRegistrable,
  deployRegistrableWithSingleStorageInstance,
};
