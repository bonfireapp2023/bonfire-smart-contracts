const BonfireFactory = artifacts.require("BonfireFactory");

module.exports = function (deployer) {
  deployer.deploy(BonfireFactory);
};
