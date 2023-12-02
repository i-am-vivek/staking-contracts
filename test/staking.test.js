const { expect } = require("chai");

const MyToken = artifacts.require("BeautifulBEP20Token");
const StakingContract = artifacts.require("StakingContract");

contract("MyToken", (accounts) => {
    let myTokenInstance;
    const sourceAccount = '0x1952fc9Afb32f93755CE29CE12Fcf7631529FE97';  //accounts[0]
    const recipientAccount = '0xeA662673B00685911D11a2b496505B40723e5212';// accounts[1]
    const thirdAccount = '0x57b8E19Bb238DBf5F0EFBf1E64e6b73596D902B4';// accounts[2]
    const totalSupply = 1000000000;
    const tokenDecimals = 1;
    const tokenName = 'MyStakingToken';
    const tokenSymbol = 'MST';

    const getAmount = (amount) => amount * (10 ** tokenDecimals)
    const amountToString = (amount) => String(amount)

    before(async () => {
        myTokenInstance = await MyToken.deployed();
        stakingInstance = await StakingContract.deployed();
    });

    it("should have the correct name and symbol", async () => {
        const name = await myTokenInstance.name();
        const symbol = await myTokenInstance.symbol();
        const decimals = await myTokenInstance.decimals();
        expect(name).to.equal(tokenName);
        expect(symbol).to.equal(tokenSymbol);
        expect(amountToString(decimals)).to.equal(amountToString(tokenDecimals));
    });

    it("should assign initial balance to the deployer", async () => {
        const balance = await myTokenInstance.balanceOf(sourceAccount);
        expect(balance.toString()).to.equal(amountToString(getAmount(totalSupply)));
    });

    it("should transfer tokens between accounts", async () => {
        const amountToTransfer = getAmount(1000);
        await myTokenInstance.transfer(recipientAccount, amountToTransfer);

        const balanceSender = await myTokenInstance.balanceOf(sourceAccount);
        const balanceReceiver = await myTokenInstance.balanceOf(recipientAccount);
        expect(amountToString(balanceSender)).to.equal(amountToString((getAmount(totalSupply) - amountToTransfer)));
        expect(amountToString(balanceReceiver)).to.equal(amountToString(amountToTransfer));
    });

    it("Token should be staked", async () => {
        const amountToTransfer = getAmount(1000);
        await myTokenInstance.approve(stakingInstance.address, amountToTransfer);
        await stakingInstance.stake(amountToTransfer)
        const stakedBalance = await stakingInstance.getStakedTokenAmount(sourceAccount)
        expect(stakedBalance.toString()).to.equal(amountToString(amountToTransfer));
    })

    it("Change the staking wallet holder", async () => {
        await stakingInstance.changeWalletHolder(thirdAccount);
        const newHolder = await stakingInstance.getWalletHolder();
        expect(newHolder.toString()).to.equal(thirdAccount);
    })

    it("new  holder should get the tokens", async () => {
        const amountToTransfer = getAmount(1000);
        await myTokenInstance.approve(stakingInstance.address, amountToTransfer);
        await stakingInstance.stake(amountToTransfer)
        const stakedBalanceAsTokenBalance = await myTokenInstance.balanceOf(thirdAccount)
        expect(stakedBalanceAsTokenBalance.toString()).to.equal(amountToString(amountToTransfer));
    })


}, );