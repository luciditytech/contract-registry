const ministroExecute = require('ministro-tool');
const { areAddressesEqual } = require('../helpers/functions');

function MinistroContract() {
  const app = {};

  /* eslint-disable-next-line */
  app.__proto__ = ministroExecute();


  app.register = async (txAttr, expectThrow) => {
    const txAttrLocal = app.getTxAttr(txAttr);

    const action = () => app.instance.register(txAttrLocal);

    const results = await app.executeAction(action, txAttrLocal, 1, 'LogRegister', expectThrow);

    if (!expectThrow) {
      assert.exists(results.LogRegister, 'missing LogRegister event');
      const [{ executor, registered, isRegistered }] = results.LogRegister;

      assert.strictEqual(executor, txAttrLocal.from, 'invalid executor');
      assert(areAddressesEqual(registered, app.instance.address), 'invalid registered address');
      assert.isTrue(isRegistered, 'should be register');
      assert.isTrue(await app.isRegistered(), 'invalid isRegistered()');
    }

    return results;
  };

  app.unregister = async (newContract, txAttr, expectThrow) => {
    const txAttrLocal = app.getTxAttr(txAttr);

    const action = () => app.instance.unregister(newContract, txAttrLocal);

    const results = await app.executeAction(action, txAttrLocal, 1, 'LogRegister', expectThrow);

    if (!expectThrow) {
      assert.exists(results.LogRegister, 'missing LogRegister event');
      const [{ executor, registered, isRegistered }] = results.LogRegister;

      assert.strictEqual(executor, txAttrLocal.from, 'invalid executor');
      assert(areAddressesEqual(registered, app.instance.address), 'invalid registered address');
      assert.isTrue(isRegistered, 'should be register');
      assert.isFalse(await app.isRegistered(), 'invalid isRegistered()');
    }

    return results;
  };

  app.isRegistered = async () => app.instance.isRegistered.call();
  app.contractRegistry = async () => app.instance.contractRegistry.call();
  app.contractName = async () => app.instance.contractName.call();

  return app;
}

module.exports = MinistroContract;
