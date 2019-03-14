const { fromAscii } = require('web3-utils');
const ministroExecute = require('ministro-tool');
const { bytes32ToString, areAddressesEqual, isContractKilled } = require('../helpers/functions');

const Registrable = artifacts.require('RegistrableInstance');

console.log(fromAscii("VerifierRegistry"));

function MinistroContract() {
  const app = {};

  /* eslint-disable-next-line */
  app.__proto__ = ministroExecute();

  app.add = async (contract, txAttr, expectThrow) => {
    const txAttrLocal = app.getTxAttr(txAttr);

    const action = () => app.instance.add(contract, txAttrLocal);

    const results = await app.executeAction(action, txAttrLocal, 1, 'LogAdd', expectThrow);

    if (!expectThrow) {
      assert.exists(results.LogAdd, 'missing LogAdd event');
      const [{ executor, instanceName, instance }] = results.LogAdd;

      assert.strictEqual(executor, txAttrLocal.from, 'invalid executor');
      assert(areAddressesEqual(instance, contract), 'invalid address');

      const contractAddress = await app.contractByName(bytes32ToString(instanceName));
      assert(areAddressesEqual(contractAddress, contract), 'saved address is invalid');

      const registrableInstance = await Registrable.at(contract);
      assert(await registrableInstance.isRegistered.call(), 'should be registered');
      assert.strictEqual(await registrableInstance.contractName.call(), instanceName, 'invalid instanceName');
    }

    return results;
  };

  app.update = async (newAddr, txAttr, expectThrow) => {
    const txAttrLocal = app.getTxAttr(txAttr);

    const action = () => app.instance.update(
      newAddr,
      txAttrLocal,
    );

    let registrableInstanceOld;
    if (!expectThrow) {
      const registrableInstance = await Registrable.at(newAddr);
      const address = await app.contractByName(
        bytes32ToString(await registrableInstance.contractName.call()),
      );
      if (parseInt(address, 16) !== 0) {
        registrableInstanceOld = await Registrable.at(address);
      }
    }

    const results = await app.executeAction(action, txAttrLocal, 1, 'LogUpdate', expectThrow);

    if (!expectThrow) {
      assert.exists(results.LogUpdate, 'missing LogUpdate event');
      const [{
        executor, instanceName, oldInstance, newInstance,
      }] = results.LogUpdate;

      assert.strictEqual(executor, txAttrLocal.from, 'invalid executor');
      assert(areAddressesEqual(newInstance, newAddr), 'invalid new address');
      assert(!areAddressesEqual(newInstance, oldInstance), 'addresses should be different');
      assert.strictEqual(instanceName, instanceName, 'invalid name');

      const contractAddress = await app.contractByName(bytes32ToString(instanceName));
      assert(areAddressesEqual(contractAddress, newInstance), 'saved address is invalid');

      const registrableInstanceNew = await Registrable.at(newAddr);
      assert(await registrableInstanceNew.isRegistered.call(), 'should be register');

      assert.isDefined(registrableInstanceOld, 'registrableInstanceOld should exist since its update()');
      assert(isContractKilled(() => registrableInstanceOld.isRegistered.call()), 'old instance should be destroyed');
    }

    return results;
  };

  app.contractByName = async name => app.instance.contractByName.call(fromAscii(name));

  return app;
}

module.exports = MinistroContract;
