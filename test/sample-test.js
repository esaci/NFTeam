const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTeam Authenticator", () => {
  it("Should create a new user", async () => {
    const Authenticator = await ethers.getContractFactory("NFTeamAuth");
    const authContract = await Authenticator.deploy("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    await authContract.deployed();
  });

  it("should refuse multiple registeration of the same user", async () => {

  })
})
describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
