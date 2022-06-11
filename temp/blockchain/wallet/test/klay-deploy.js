/*
  - ERC20: eth, klay 랑 같은 bytecode를 사용 해도 됨
  - ERC721: eth - https://remix.ethereum.org/ 에서 bytecode 구해야 함
            klay - https://ide.klaytn.com/ 에서 bytecode 구해야 함
            > 같은걸로 하니 한쪽이 안됨
*/
const fs = require('fs');
const Caver = require("caver-js");
const { OpenWalletFromPrivateKey, OpenWalletFromKeystoreV3, OpenWalletFromMnemonic, OpenHDWallet } = require( '../import.js' );
const { KlayDeploy } = require( "../deploy.js")

async function deployERC20(){

  const caver             = new Caver('https://kaikas.baobab.klaytn.net:8651')
  //remix > compiler > bytecode 
  const rawCodeFs         = fs.readFileSync('./bytecode/erc20.json', 'utf8');
  const rawcode           = rawCodeFs.toString();
  const contractBytecode  = JSON.parse( rawcode );

  //Open Wallet
  const MNEMONIC = "captain behave spider puppy cart define post kitchen scout response fame aunt"
  
  const receipt = await KlayDeploy( {
      provider: {
        caver: caver,
      },    
      wallet: await OpenWalletFromMnemonic(MNEMONIC),
      gas: 2100000,
      byteCode: contractBytecode.object,
      typesArray: ['string','string'], 
      parameters: ['xen-deploy', 'XNT'] 
    })

    console.log('Contract Address:', receipt.contractAddress); // > 0x1720d9e8fce5b2efd0e19f0b699c2dcf746fee7d
    console.log('Transaction Hash:', receipt.transactionHash);

}

async function deployERC721(){

  const caver             = new Caver('https://kaikas.baobab.klaytn.net:8651')
  //remix > compiler > bytecode 
  const rawCodeFs         = fs.readFileSync('./bytecode/klay-erc721.json', 'utf8');
  const rawcode           = rawCodeFs.toString();
  const contractBytecode  = JSON.parse( rawcode );

  //Open Wallet
  const MNEMONIC = "captain behave spider puppy cart define post kitchen scout response fame aunt"
  
  const receipt = await KlayDeploy( {
      provider: {
        caver: caver,
      },    
      wallet: await OpenWalletFromMnemonic(MNEMONIC),
      gas: 4200000,     //gas 가 부족 할수 있음
      byteCode: contractBytecode.object,
      typesArray: ['string','string'], 
      parameters: ['xen-test-erc721-burnable', 'X721'] 
    })

  console.log('Contract Address:', receipt.contractAddress); // > 0xb790c5eba20295553c8f9083db1c6db3c2518761
  console.log('Transaction Hash:', receipt.transactionHash);
  

}

//deployERC20()
deployERC721()