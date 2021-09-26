const hre = require("hardhat");

// syntactic sugar
const ethers = hre.ethers;
const { BigNumber } = ethers;

module.exports = {
    ETHER: BigNumber.from(1e9).mul(1e9),
    GWEI: BigNumber.from(1e9),
};
