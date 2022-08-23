require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
  //   mumbai: {
  //     url: process.env.POLYGON_MUMBAI_RPC_PROVIDER,
  //     accounts: [`${process.env.PRIVATE_KEY}`],
  //  }
  mumbai: {
    url: "https://rpc-mumbai.maticvigil.com",
    chainId: 80001,
    accounts: [process.env.PRIVATE_KEY],
    saveDeployments: true,
  },
  },etherscan: {
    apiKey: {
      //Polygon
      polygonMumbai: process.env.POLYGON_API_KEY,
    }
  }
};

