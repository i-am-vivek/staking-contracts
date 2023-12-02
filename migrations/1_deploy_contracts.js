const StakingToken = artifacts.require("BeautifulBEP20Token");
const StakingContract = artifacts.require("StakingContract");

module.exports = async function (deployer, network, accounts) {
  const sourceAccount = '0x1952fc9Afb32f93755CE29CE12Fcf7631529FE97';//accounts[0]
  await deployer.deploy(StakingToken, { from: sourceAccount });
  const stakingTokenInstance = await StakingToken.deployed();
  await deployer.deploy(StakingContract, stakingTokenInstance.address);
};
