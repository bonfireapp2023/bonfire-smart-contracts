const BonfireApp = artifacts.require("BonfireApp");

module.exports = function (deployer) {
  deployer.deploy(BonfireApp);
};
