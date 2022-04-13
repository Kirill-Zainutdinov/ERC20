import * as dotenv from "dotenv";

import { ERC20, ERC20__factory } from "./typechain";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import '@nomiclabs/hardhat-ethers'
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const MNEMONIC = process.env.MNEMONIC;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// функция трансфера
task("transfer", "Sending funds")
  .addParam("to")
  .addParam("value")
  .setAction(async (args, hre) => {
    // подключаемся к контракту
    const ERC20Factory = (await hre.ethers.getContractFactory("ERC20")) as ERC20__factory;
    const erc20 = await ERC20Factory.attach("0x318E2860D790a0A7c3fDfAe834c8Eb20f7Eb4C1F");

    // вызываем функцию на контракте
    const tx = await erc20.transfer(args.to, args.value);
    await tx.wait();

    console.log("The sending of the funds was successful ")
});

// функция трансфера с разрешением
task("transferFrom", "Sending funds by permission")
  .addParam("from")
  .addParam("to")
  .addParam("value")
  .setAction(async (args, hre) => {
    // подключаемся к контракту
    const ERC20Factory = (await hre.ethers.getContractFactory("ERC20")) as ERC20__factory;
    const erc20 = await ERC20Factory.attach("0x318E2860D790a0A7c3fDfAe834c8Eb20f7Eb4C1F");

    // вызываем функцию на контракте
    const tx = await erc20.transferFrom(args.from, args.to, args.value);
    await tx.wait();

    console.log("The sending of the funds was successful ")
});

// функция разрешения
task("approve", "Permission to send funds")
  .addParam("spender")
  .addParam("value")
  .setAction(async (args, hre) => {
    // подключаемся к контракту
    const ERC20Factory = (await hre.ethers.getContractFactory("ERC20")) as ERC20__factory;
    const erc20 = await ERC20Factory.attach("0x318E2860D790a0A7c3fDfAe834c8Eb20f7Eb4C1F");

    // вызываем функцию на контракте
    const tx = await erc20.approve(args.spender, args.value);
    await tx.wait();

    console.log("The sending of the funds was successful ")
});

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: {
        mnemonic: MNEMONIC
      }
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
