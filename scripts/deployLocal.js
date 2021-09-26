require("@nomiclabs/hardhat-waffle");
const ethers = hre.ethers;
const { BigNumber } = ethers;

async function main() {
    const adminAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"; // hardhat account 0
    const StakingToken = await ethers.getContractFactory("StakingToken");

    // deploy contract & mint 1B tokens to admin
    const stakingTokenContract = await StakingToken.deploy(adminAddress, BigNumber.from(1e9).mul(1e9).mul(1e9)); 
    console.log(`StakingToken deployed to ${stakingTokenContract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
