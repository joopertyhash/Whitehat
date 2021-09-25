const hre = require("hardhat");

// syntactic sugar
const ethers = hre.ethers;
const { BigNumber, Contract, Wallet, utils } = ethers;
const formatEther = utils.formatEther;
const { ETHER } = require("./util");

// hardhat info
const adminKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // hardhat account 0

// get contract info
const stakingTokenABI = require("../artifacts/contracts/StakingToken.sol/StakingToken.json").abi;
const stakingTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // same for every local deployment

// get eth provider & admin signer
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const adminSigner = new Wallet(adminKey, provider);

// create random account to represent victim
// and connect it to provider for more syntactical sugar possibilities
const victimSigner = Wallet.createRandom().connect(provider);

// generic contract instance; read-only
const stakingTokenContractGeneric = new Contract(stakingTokenAddress, stakingTokenABI, provider);

// create contract for victim to interact with
const stakingTokenContractVictim = new Contract(stakingTokenAddress, stakingTokenABI, victimSigner);

// create contract for admin to interact with
const stakingTokenContractAdmin = new Contract(stakingTokenAddress, stakingTokenABI, adminSigner);

const logBalances = async () => {
    // get admin balances
    const adminTokenBalance = await stakingTokenContractGeneric.balanceOf(adminSigner.address);
    const adminEthBalance = await provider.getBalance(adminSigner.address);
    const adminTokenStake = await stakingTokenContractGeneric.stakeOf(adminSigner.address);
    const adminTokenRewards = await stakingTokenContractAdmin.rewardOf(adminSigner.address);

    // get victim balances
    const victimTokenBalance = await stakingTokenContractGeneric.balanceOf(victimSigner.address);
    const victimEthBalance = await provider.getBalance(victimSigner.address);
    const victimTokenStake = await stakingTokenContractGeneric.stakeOf(victimSigner.address);
    const victimTokenRewards = await stakingTokenContractVictim.rewardOf(victimSigner.address);

    // log 'em
    console.log(`Admin Balance  (BORK):\t${formatEther(adminTokenBalance)}`);
    console.log(`Admin Balance   (ETH):\t${formatEther(adminEthBalance)}`);
    console.log(`Admin Stake    (BORK):\t${formatEther(adminTokenStake)}`);
    console.log(`Admin Rewards  (BORK):\t${formatEther(adminTokenRewards)}`);
    console.log("---------------------");
    console.log(`Victim Balance (BORK):\t${formatEther(victimTokenBalance)}`);
    console.log(`Victim Balance  (ETH):\t${formatEther(victimEthBalance)}`);
    console.log(`Victim Stake   (BORK):\t${formatEther(victimTokenStake)}`);
    console.log(`Victim Rewards (BORK):\t${formatEther(victimTokenRewards)}`);

    return {
        admin: {
            eth: adminEthBalance,
            token: adminTokenBalance,
            stake: adminTokenStake,
            rewards: adminTokenRewards,
        },
        victim: {
            eth: victimEthBalance,
            token: victimTokenBalance,
            stake: victimTokenStake,
            rewards: victimTokenRewards,
        }
    };
}

async function main() {
    console.log(`Victim Address:\t${victimSigner.address}\n`);
    const startBalances = await logBalances();

    if (startBalances.victim.eth.lt(ETHER.mul(1))) {
        // transfer 0.1 ETH into victim account from admin (hardhat admin has 1000 ETH)
        await adminSigner.sendTransaction({
            value: ETHER.div(10),
            to: victimSigner.address,
        });
        console.log("Transferred 1 ETH to victim account to pay for transactions");
    }

    // transfer 1000 tokens into victim account from admin (admin gets all tokens on contract deploy)
    const tokenAmount = ETHER.mul(1000);
    const transferBorkRes = await stakingTokenContractAdmin.transfer(victimSigner.address, tokenAmount);
    console.log(transferBorkRes && "\nTransferred 1000 BORK to Victim account.\n");

    await logBalances();

    // stake BORK from victim's account
    const stakeBorkRes = await stakingTokenContractVictim.createStake(tokenAmount);
    console.log(stakeBorkRes && "\nStaked 1000 BORK from Victim account.\n");

    await logBalances();

    // distribute rewards to stakeholders
    const distributeRewardsRes = await stakingTokenContractAdmin.distributeRewards();
    console.log(distributeRewardsRes && "\nAdmin distributed rewards.\n");

    await logBalances();

    // claim rewards from victim account
    const claimRewardsRes = await stakingTokenContractVictim.withdrawReward();
    console.log(claimRewardsRes && "\nVictim claimed rewards.\n");

    await logBalances();

    // unstake BORK from victim's account
    const unstakeBorkRes = await stakingTokenContractVictim.removeStake(tokenAmount);
    console.log(unstakeBorkRes && "\nUnstaked 1000 BORK from Victim account.\n");

    await logBalances();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
