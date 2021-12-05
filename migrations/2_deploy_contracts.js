const { artifacts } = require("hardhat");

const NFTeamAuth = artifacts.require("NFTeamAuth");
const SimpleStorage = artifacts.require("./SimpleStorage.sol");

const NFTeamTokenAddress = ""
module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(NFTeamAuth, NFTeamTokenAddress = "");
};
