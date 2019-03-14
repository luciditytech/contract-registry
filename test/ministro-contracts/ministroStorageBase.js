const ministroExecute = require('ministro-tool');
const { areAddressesEqual, ZERO_ADDRESS, isContractKilled } = require('../helpers/functions');

function MinistroContract() {
  const app = {};

  /* eslint-disable-next-line */
  app.__proto__ = ministroExecute();

  app.initStorageOwner = async (initialStorageOwner, txAttr, expectThrow) => {
    const txAttrLocal = app.getTxAttr(txAttr);

    const action = () => app.instance.initStorageOwner(initialStorageOwner, txAttrLocal);

    const results = await app.executeAction(action, txAttrLocal, 1, 'LogInitStorageOwner', expectThrow);

    if (!expectThrow) {
      assert.exists(results.LogInitStorageOwner, 'missing LogInitStorageOwner event');
      const [{ executor, storageOwner }] = results.LogInitStorageOwner;

      assert.strictEqual(executor, txAttrLocal.from, 'invalid executor');
      assert(areAddressesEqual(storageOwner, initialStorageOwner), 'invalid storageOwner');

      assert(areAddressesEqual(storageOwner, await app.storageOwner()), 'invalid storageOwner()');
    }

    return results;
  };

  app.switchOwnerTo = async (newOwner, txAttr, expectThrow) => {
    const txAttrLocal = app.getTxAttr(txAttr);

    const action = () => app.instance.switchOwnerTo(newOwner, txAttrLocal);

    const results = await app.executeAction(action, txAttrLocal, 1, 'LogSwitchOwnerTo', expectThrow);

    if (!expectThrow) {
      assert.exists(results.LogSwitchOwnerTo, 'missing LogSwitchOwnerTo event');
      const [{ executor, storageOwner }] = results.LogSwitchOwnerTo;

      assert.strictEqual(executor, txAttrLocal.from, 'invalid executor');
      assert(areAddressesEqual(storageOwner, newOwner), 'invalid storageOwner');

      assert(areAddressesEqual(storageOwner, await app.storageOwner()), 'invalid storageOwner()');
    }

    return results;
  };

  app.kill = async (txAttr, expectThrow) => {
    const txAttrLocal = app.getTxAttr(txAttr);

    const action = () => app.instance.kill(txAttrLocal);

    const results = await app.executeAction(action, txAttrLocal, 1, 'LogKill', expectThrow);

    if (!expectThrow) {
      assert.exists(results.LogKill, 'missing LogKill event');
      const [{ balance, balanceReceiver }] = results.LogKill;

      assert.strictEqual(parseInt(balance, 10), 0, 'invalid balance');
      assert.notStrictEqual(balanceReceiver, ZERO_ADDRESS, 'invalid balanceReceiver');

      assert(isContractKilled(() => app.isKilled()), 'should be killed');
    }

    return results;
  };

  app.storageOwner = async () => app.instance.storageOwner.call();

  app.deployer = async () => app.instance.deployer.call();


  return app;
}

module.exports = MinistroContract;
