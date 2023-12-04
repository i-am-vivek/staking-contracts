const StakingToken = artifacts.require("BeautifulBEP20Token");
const StakingContract = artifacts.require("StakingContract");
const web3 = require('web3');
module.exports = async function (deployer, network, accounts) {
  const gasPrice = network === 'bnb' ? '50' : '20'; // Set different gas prices for mainnet and testnets

  // const sourceAccount = '0x1952fc9Afb32f93755CE29CE12Fcf7631529FE97';//accounts[0]
  // await deployer.deploy(StakingToken, { from: sourceAccount });
  // const stakingTokenInstance = await StakingToken.deployed();
  await deployer.deploy(StakingContract, '0xED9B3D9A4B8f1a567761c793bb88214904832d17', { gasPrice: web3.utils.toWei(gasPrice, 'gwei') });
};
