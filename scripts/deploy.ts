import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20, ERC20__factory } from "../typechain";
import { ethers } from "hardhat";

async function main() {

  let erc20 : ERC20;
  let signers : SignerWithAddress[];
  const name = "KirillZaynutdinovToken";
  const symbol = "KZT";
  const decimals = 3;

  const ERC20Factory = (await ethers.getContractFactory("ERC20")) as ERC20__factory;
  
  erc20 = await ERC20Factory.deploy(name, symbol, decimals);

  console.log("erc20 deployed to:", erc20.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
