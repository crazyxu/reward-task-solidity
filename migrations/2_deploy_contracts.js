var StdTaskS = artifacts.require("./StdTasks.sol");

module.exports = function(deployer) {
  deployer.deploy(StdTaskS);
};