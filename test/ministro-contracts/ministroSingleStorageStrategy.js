const ministroExecute = require('ministro-tool');
const { areAddressesEqual, ZERO_ADDRESS } = require('../helpers/functions');

function MinistroContract() {
  const app = {};

  /* eslint-disable-next-line */
  app.__proto__ = ministroExecute();

  app.detachFromStorage = async (nextInstance, txAttr, expectThrow) => {
    const txAttrLocal = app.getTxAttr(txAttr);

    const action = () => app.instance.detachFromStorage(nextInstance, txAttrLocal);

    const results = await app.executeAction(action, txAttrLocal, 1, 'detachFromStorage', expectThrow);

    if (!expectThrow) {
      assert.exists(results.detachFromStorage, 'missing detachFromStorage event');
      const [{
        executor, newInstance, balance, balanceReceiver,
      }] = results.detachFromStorage;

      assert(areAddressesEqual(executor, txAttrLocal.from), 'invalid executor');
      assert(areAddressesEqual(newInstance, nextInstance), 'invalid newInstance');
      assert.strictEqual(parseInt(balance, 16), 0, 'should be no balance');
      assert.notStrictEqual(balanceReceiver, ZERO_ADDRESS, 'invalid balanceReceiver');

      assert(app.isKilled(), 'should be killed');
    }

    return results;
  };

  app.updateSingleStorage = async (storageAddr, txAttr, expectThrow) => {
    const txAttrLocal = app.getTxAttr(txAttr);

    const action = () => app.instance.updateSingleStorage(storageAddr, txAttrLocal);

    const results = await app.executeAction(action, txAttrLocal, 1, 'LogUpdateSingleStorage', expectThrow);

    if (!expectThrow) {
      assert.exists(results.LogUpdateSingleStorage, 'missing LogUpdateSingleStorage event');
      const [{ storageAddress }] = results.LogUpdateSingleStorage;

      assert(areAddressesEqual(storageAddress, storageAddr), 'invalid storageAddress');
      assert(areAddressesEqual(storageAddress, await app.singleStorage()), 'invalid singleStorage');
    }

    return results;
  };

  app.getAllStorages = async () => {
    const list = await app.instance.getAllStorages.call();
    assert.strictEqual(list.length, 1, 'Single storage should have one storage');
    return list;
  };

  app.singleStorage = async () => app.instance.singleStorage.call();

  app.isKilled = async () => {
    try {
      await app.singleStorage();
      assert(false, 'should be killed');
    } catch (e) {
      assert(e.toString().includes('is not a contract address'), 'should be not a contract address');
    }
    return true;
  };

  return app;
}

module.exports = MinistroContract;
