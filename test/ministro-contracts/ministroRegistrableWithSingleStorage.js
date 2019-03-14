const ministroRegistrable = require('./ministroRegistrable');

function MinistroContract() {
  const app = {};

  /* eslint-disable-next-line */
  app.__proto__ = ministroRegistrable();

  return app;
}

module.exports = MinistroContract;
