/*




*/
//ERC20 발행 영상
//https://www.youtube.com/watch?v=Yy5_x5SWS4U

//contract - 0x36ed71ba21f6a6d6423d54fd782d9b4448c28744

const Web3 = require('web3')
const { OpenWalletFromPrivateKey, OpenWalletFromKeystoreV3, OpenWalletFromMnemonic, OpenHDWallet } = require( '../import.js' );
const { EthSendTransaction, EthSendTransaction2 } = require( "../sendtx.js")
const { AbiEncode } = require ( '../../utils/abi.js' )

async function main() {

  const web3            = new Web3( new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161') )

  //Open Wallet
  const MNEMONIC  = "captain behave spider puppy cart define post kitchen scout response fame aunt"
  const wallet    = await OpenWalletFromMnemonic(MNEMONIC);

  //nonce
  let count       = await web3.eth.getTransactionCount( wallet.getAddressString() );

  //Encoding ABI 
  var data = await AbiEncode( "transfer(address,uint256):(bool)", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B", Web3.utils.toWei('1', 'ether') )
  console.log( data );

  const contractAddress = '0x36ed71ba21f6a6d6423d54fd782d9b4448c28744'
  
  var receipt = await EthSendTransaction2( {
    provider: {
      url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    },
    wallet: wallet,
    rawTransaction: {
      nonce:    Web3.utils.toHex(count),
      to:       contractAddress, 
      value:    0,
      gasPrice: Web3.utils.toHex(Web3.utils.toWei('10', 'gwei')),
      gasLimit: Web3.utils.toHex(21000000),
      data:     data
    },
  })
  console.log(receipt)
  
}

async function testEthCallFromContract() {
  
  const ABI = require('./erc20-abi')

  //MetaMask >> 네트워크 추가 > 네트워크 > Rinkeby 테스트 네트워크 > 새 RPC URL
  const web3            = new Web3( new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161') )

  //const contractAddress = '0x36ed71ba21f6a6d6423d54fd782d9b4448c28744'; //ERC20
  const contractAddress = '0xf8364f38943FA72692B812C0BcdB337950669726'; //ERC721
  const contract        = new web3.eth.Contract(ABI.ERC20, contractAddress); 

  const balance = await contract.methods.balanceOf("0x373d6f42f8Fb276BEA08942BD27a8848A48962c4").call();
  console.log( 'Balance: ' + balance )

  const symbol = await contract.methods.symbol().call();
  console.log( 'Symbol: ' + symbol )

  const abi = await contract.methods.symbol().encodeABI();
  console.log( 'abi: ' + abi )


}

async function testEthCallFromAbi() {

  const web3            = new Web3( new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161') )
  //const contractAddress = '0x36ed71ba21f6a6d6423d54fd782d9b4448c28744'; //ERC20
  const contractAddress = '0xf8364f38943FA72692B812C0BcdB337950669726'; //ERC721

  //-----------------------------------------------------------------------------------------------------------
  //var data = await AbiEncode( "balanceOf(address):(uint256)", "0x373d6f42f8Fb276BEA08942BD27a8848A48962c4");
  var data = await AbiEncode( "walletOfOwner(address):(uint256[])", "0x373d6f42f8Fb276BEA08942BD27a8848A48962c4");

  const val = await web3.eth.call({
    to: contractAddress,
    data: data,
  });

  var dec = web3.eth.abi.decodeParameter( 'uint256', val );
  console.log( 'Balance+: ' + dec )

}

async function mint721() {

  const web3            = new Web3( new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161') )

  //Open Wallet
  const MNEMONIC  = "captain behave spider puppy cart define post kitchen scout response fame aunt"
  const wallet    = await OpenWalletFromMnemonic(MNEMONIC);

  //nonce
  let count       = await web3.eth.getTransactionCount( wallet.getAddressString() );

  //Encoding ABI 
  var data = await AbiEncode( "mint(address,uint256,string)", "0x373d6f42f8Fb276BEA08942BD27a8848A48962c4", 1, 'http://127.0.0.1:8080/metadata/get/TODO:CID' )
  console.log( data );

  const contractAddress = '0xf8364f38943FA72692B812C0BcdB337950669726'
  
  var receipt = await EthSendTransaction2( {
    provider: {
      url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    },
    wallet: wallet,
    rawTransaction: {
      nonce:    Web3.utils.toHex(count),
      to:       contractAddress, 
      value:    0,
      gasPrice: Web3.utils.toHex(Web3.utils.toWei('10', 'gwei')),
      gasLimit: Web3.utils.toHex(21000000),
      data:     data
    },
  })
  console.log(receipt)
  
}

async function symbol() {

  const web3            = new Web3( new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161') )
  const contractAddress = '0xf8364f38943FA72692B812C0BcdB337950669726'; //ERC721

  //symbol() = '0x95d89b41';
  var data = web3.eth.abi.encodeFunctionSignature( "symbol()" );

  const val = await web3.eth.call({
    to: contractAddress,
    data: data,
  });

  //symbol() 함수
  var dec = web3.eth.abi.decodeParameter( 'string', val );
  console.log( 'Symbol: ' + dec )

}

async function isAddress() {

  let res = await Web3.utils.isAddress('0xf8364f38943FA72692B812C0BcdB337950669726');
  console.log( res );

}

async function isContract() {

  const web3            = new Web3( new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161') )

  const contractAddress = '0xf8364f38943FA72692B812C0BcdB337950669726'; //ERC721
  
  var res = await web3.eth.getCode(contractAddress);
  if( res.length > 2 ){
    //console.log( resContract );
    console.log( "true" )
  } else {
    console.log( "false" )
  }

  var res = await web3.eth.getCode("0x373d6f42f8Fb276BEA08942BD27a8848A48962c4");
  if( res.length > 2 ){
    //console.log( resContract );
    console.log( "true" )
  } else {
    console.log( "false" )
  }  

}


//testEthCallFromContract()
//testEthCallFromAbi()
//main();
//mint721()
symbol();
isAddress();
isContract();
