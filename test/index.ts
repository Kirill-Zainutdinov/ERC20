import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20, ERC20__factory } from "../typechain";

describe("Testing ERC20",  function () {

  let erc20 : ERC20;
  let ERC20Factory : ERC20__factory;
  let signers : SignerWithAddress[];
  // аргументы для конструктора контракта
  const name = "KirillZaynutdinovToken";
  const symbol = "KZT";
  const decimals = BigNumber.from(3);

  before(async function(){
    signers = await ethers.getSigners();

    ERC20Factory = (await ethers.getContractFactory("ERC20"));
    erc20 = await ERC20Factory.deploy(name, symbol, decimals);
  })

  // проверяем публичное поле name
  it("check name()", async function(){
    expect(await erc20.name()).equal(name);
  })

  // проверяем публичное поле symbol
  it("check symbol()", async function(){
    expect(await erc20.symbol()).equal(symbol);
  })

  // проверяем публичное поле decimals
  it("check decimals()", async function(){
    expect(await erc20.decimals()).equal(decimals);
  })

  // проверяем работу функции mint() а за одно функцию balanceOf() и публичное поле totalSupply
  it("check mint(), balanceOf() and totalSupply()", async function () {

    // будем выпускать 10000 KZT-копеек
    const value = BigNumber.from(10000);

    // баланс целевого адреса и общее количество выпущенных токенов
    // до вызова функции mint()
    const balanceBefore = await erc20.balanceOf(signers[1].address);
    const totalSupplyBefore = await erc20.totalSupply();

    // делаем эмиссию value KZT-копеек нашего токена на адресе signers[1].address
    let tx  = await erc20.mint(signers[1].address, value);
    await tx.wait();

    // баланс целевого адреса и общее количество выпущенных токенов
    // после вызова функции mint()
    const balanceAfter = await erc20.balanceOf(signers[1].address);
    const totalSupplyAfter = await erc20.totalSupply();

    // проверка результатов
    //console.log(balanceBefore);
    //console.log(balanceAfter);
    expect(await balanceBefore.add(value)).equal(balanceAfter);
    //console.log(totalSupplyBefore);
    //console.log(totalSupplyAfter);
    expect(await totalSupplyBefore.add(value)).equal(totalSupplyAfter);

    // попытка вызвать функцию mint() не от имени owner
    await expect(
      erc20.connect(signers[1]).mint(signers[1].address, value)
    ).to.be.revertedWith("You are not owner");
  });

  it("check burn(), balanceOf() and totalSupply()", async function () {
    
    // будем сжигать 5000 KZT-копеек
    let value = BigNumber.from(5000);

    // баланс целевого адреса и общее количество выпущенных токенов
    // до вызова функции burn()
    const balanceBefore = await erc20.balanceOf(signers[1].address);
    const totalSupplyBefore = await erc20.totalSupply();

    // сжигаем value KZT-копеек нашего токена на адресе signers[1].address
    let tx  = await erc20.connect(signers[1]).burn(value);
    await tx.wait();

    // баланс целевого адреса и общее количество выпущенных токенов
    // после вызова функции burn()
    const balanceAfter = await erc20.balanceOf(signers[1].address);
    const totalSupplyAfter = await erc20.totalSupply();

    // проверка результатов
    //console.log(balanceBefore);
    //console.log(balanceAfter);
    expect(await balanceBefore.sub(value)).equal(balanceAfter);
    //console.log(totalSupplyBefore);
    //console.log(totalSupplyAfter);
    expect(await totalSupplyBefore.sub(value)).equal(totalSupplyAfter);

    // попытка сжечь токенов больше, чем осталось на адресе
    value = BigNumber.from(15000);
    await expect(
      erc20.connect(signers[1]).burn(value)
    ).to.be.revertedWith("not enough tokens");
  });

  it("check approve() and allowance()", async function () {
    
    // апрувнем 2000 KZT-копеек
    const value = BigNumber.from(2500);

    // баланс целевого адреса и общее количество выпущенных токенов
    // до вызова функции burn()
    const allowedBefore = await erc20.allowance(signers[1].address, signers[2].address);

    // сжигаем value KZT-копеек нашего токена на адресе signers[1].address
    let tx  = await erc20.connect(signers[1]).approve(signers[2].address, value);
    await tx.wait();

    // баланс целевого адреса и общее количество выпущенных токенов
    // после вызова функции burn()
    const allowedAfter = await erc20.allowance(signers[1].address, signers[2].address);

    // проверка результатов
    //console.log(allowedBefore);
    //console.log(allowedAfter);
    expect(await allowedBefore.add(value)).equal(allowedAfter);
  });

  it("check transfer()", async function () {
    
    // будем отправлять 2500 KZT-копеек
    const value = BigNumber.from(3000);

    // баланс целевого адреса и общее количество выпущенных токенов
    // до вызова функции transfer()
    const senderBalanceBefore = await erc20.balanceOf(signers[1].address);
    const recipientBalanceBefore = await erc20.balanceOf(signers[2].address);

    // сжигаем value KZT-копеек нашего токена на адресе signers[1].address
    let tx  = await erc20.connect(signers[1]).transfer(signers[2].address, value);
    await tx.wait();

    // баланс целевого адреса и общее количество выпущенных токенов
    // после вызова функции transfer()
    const senderBalanceAfter = await erc20.balanceOf(signers[1].address);
    const recipientBalanceAfter = await erc20.balanceOf(signers[2].address);

    // проверка результатов
    //console.log(senderBalanceBefore);
    //console.log(senderBalanceAfter);
    expect(await senderBalanceBefore.sub(value)).equal(senderBalanceAfter);
    //console.log(recipientBalanceBefore);
    //console.log(recipientBalanceAfter);
    expect(await recipientBalanceBefore.add(value)).equal(recipientBalanceAfter);

    // попытка отправить токенов больше, чем осталось на адресе
    await expect(
      erc20.connect(signers[1]).transfer(signers[2].address, value)
    ).to.be.revertedWith("not enough tokens");
  });

  it("check transferFrom()", async function () {
    
    // будем отправлять 1500 KZT-копеек
    let value = BigNumber.from(1500);

    // баланс целевого адреса и общее количество выпущенных токенов
    // до вызова функции transfer()
    const senderBalanceBefore = await erc20.balanceOf(signers[1].address);
    const recipientBalanceBefore = await erc20.balanceOf(signers[3].address);
    const allowedBefore = await erc20.allowance(signers[1].address, signers[2].address);

    // сжигаем value KZT-копеек нашего токена на адресе signers[1].address
    let tx  = await erc20.connect(signers[2]).transferFrom(signers[1].address, signers[3].address, value);
    await tx.wait();

    // баланс целевого адреса и общее количество выпущенных токенов
    // после вызова функции transfer()
    const senderBalanceAfter = await erc20.balanceOf(signers[1].address);
    const recipientBalanceAfter = await erc20.balanceOf(signers[3].address);
    const allowedAfter = await erc20.allowance(signers[1].address, signers[2].address);

    // проверка результатов
    //console.log(senderBalanceBefore);
    //console.log(senderBalanceAfter);
    expect(await senderBalanceBefore.sub(value)).equal(senderBalanceAfter);
    //console.log(recipientBalanceBefore);
    //console.log(recipientBalanceAfter);
    expect(await recipientBalanceBefore.add(value)).equal(recipientBalanceAfter);
    //console.log(allowedBefore);
    //console.log(allowedAfter);
    expect(await allowedBefore.sub(value)).equal(allowedAfter);

    // попытка отправить токенов больше, чем разрешено
    await expect(
      erc20.connect(signers[2]).transferFrom(signers[1].address, signers[3].address, value)
    ).to.be.revertedWith("no permission to spend");

    // попытка отправить токенов больше, чем осталось на адресе
    value = BigNumber.from(1000);
    await expect(
      erc20.connect(signers[2]).transferFrom(signers[1].address, signers[3].address, value)
    ).to.be.revertedWith("not enough tokens");
  });
});
