import { ERC20__factory } from "../typechain";
import { task } from "hardhat/config";
import '@nomiclabs/hardhat-ethers'


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
        const erc20 = await ERC20Factory.attach("0xD03862Df0484703946cFA7DD5Dd1c15aff58858E");

        // сохраняем баланс до отправки
        const balanceBefore = await erc20.balanceOf(args.to);

        // вызываем функцию на контракте
        const tx = await erc20.transfer(args.to, args.value);
        await tx.wait();

        // сохраняем баланс после отправки
        const balanceAfter = await erc20.balanceOf(args.to);

        console.log("The sending of the funds was successful.")
        console.log(`The balance of the ${args.to} address has changed from ${balanceBefore} to ${balanceAfter}`)
});

// функция трансфера с разрешением
task("transferFrom", "Sending funds by permission")
    .addParam("from")
    .addParam("to")
    .addParam("value")
    .setAction(async (args, hre) => {
        // подключаемся к контракту
        const ERC20Factory = (await hre.ethers.getContractFactory("ERC20")) as ERC20__factory;
        const erc20 = await ERC20Factory.attach("0xD03862Df0484703946cFA7DD5Dd1c15aff58858E");

        // сохраняем баланс до отправки
        const balanceBefore = await erc20.balanceOf(args.to);
        
        // вызываем функцию на контракте
        const tx = await erc20.transferFrom(args.from, args.to, args.value);
        await tx.wait();

        // сохраняем баланс после отправки
        const balanceAfter = await erc20.balanceOf(args.to);

        console.log("The sending of the funds was successful ")
        console.log(`The balance of the ${args.to} address has changed from ${balanceBefore} to ${balanceAfter}`)
});

  // функция разрешения
task("approve", "Permission to send funds")
    .addParam("spender")
    .addParam("value")
    .setAction(async (args, hre) => {
        // подключаемся к контракту
        const ERC20Factory = (await hre.ethers.getContractFactory("ERC20")) as ERC20__factory;
        const erc20 = await ERC20Factory.attach("0xD03862Df0484703946cFA7DD5Dd1c15aff58858E");

        // сохраняем баланс до отправки
        const accounts = await hre.ethers.getSigners();
        const approveeBefore = await erc20.allowance(accounts[0].address, args.spender);
        
        // вызываем функцию на контракте
        const tx = await erc20.approve(args.spender, args.value);
        await tx.wait();

        // сохраняем баланс после отправки
        const approveAfter = await erc20.allowance(accounts[0].address, args.spender);

        console.log("approval successfully changed")
        console.log(`Address ${args.spender} was allowed to spend ${approveeBefore} tokens of address ${accounts[0].address}.`)
        console.log(`Now address ${args.spender} is allowed to spend ${approveAfter} tokens of address ${accounts[0].address}.`)
});