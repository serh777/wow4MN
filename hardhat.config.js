require('@nomicfoundation/hardhat-ethers');
// Remover: require('@nomiclabs/hardhat-ethers');
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.8.20",
      },
      {
        version: "0.8.22",
      },
    ],
  },
  paths: {
    sources: "./src/contracts/contracts",
    artifacts: "./src/artifacts"
  }
};
