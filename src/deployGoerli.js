require("dotenv").config();

const ethers = require("ethers");
const { BigNumber, ContractFactory, Wallet, providers } = ethers;

const {abi, bytecode} = require("../artifacts/contracts/StakingToken.sol/StakingToken.json");

async function main() {
    const provider = new providers.JsonRpcProvider(process.env.GOERLI_RPC_HTTP, 5); // connect to goerli
    const adminSigner = new Wallet(process.env.ADMIN_KEY, provider);
    const adminAddress = adminSigner.address;
    const StakingToken = new ContractFactory(abi, bytecode, adminSigner);

    // deploy contract & mint 1Bn tokens to admin
    const stakingTokenContract = await StakingToken.deploy(adminAddress, BigNumber.from(1e9).mul(1e9).mul(1e9));
    console.log(`StakingToken deployed to ${stakingTokenContract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
