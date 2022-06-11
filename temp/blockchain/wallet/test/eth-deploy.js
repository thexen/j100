/*
  - ERC20: eth, klay 랑 같은 bytecode를 사용 해도 됨
  - ERC721: eth - https://remix.ethereum.org/ 에서 bytecode 구해야 함
            klay - https://ide.klaytn.com/ 에서 bytecode 구해야 함
            > 같은걸로 하니 한쪽이 안됨
*/
const fs = require('fs');
const Web3 = require('web3')
const { OpenWalletFromPrivateKey, OpenWalletFromKeystoreV3, OpenWalletFromMnemonic, OpenHDWallet } = require( '../import.js' );
const { EthDeploy } = require( "../deploy.js")
const { Sign } = require( '../sign.js' );

/*
//MetaMask >> 네트워크 추가 > 네트워크 > Rinkeby 테스트 네트워크 > 새 RPC URL
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'))

async function ethDeploy( _dataObject ) {

  const encodedParameters               = web3.eth.abi.encodeParameters( _dataObject.typesArray, _dataObject.parameters ).slice(2);
  const bytecodeWithEncodedParameters   = _dataObject.byteCode + encodedParameters;
  const count                           = await web3.eth.getTransactionCount( _dataObject.wallet.getAddressString() );
 
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = await web3.eth.estimateGas({ bytecodeWithEncodedParameters });    

  const rawTransaction = {
    nonce: web3.utils.toHex(count),
    gasLimit: web3.utils.toHex(21000000), //web3.utils.toHex(gasLimit),
    gasPrice: web3.utils.toHex(gasPrice), //web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    data: `0x${bytecodeWithEncodedParameters}`,
  };

  
  const rawTx   = await Sign( _dataObject.wallet, rawTransaction );
  var   receipt = await web3.eth.sendSignedTransaction( rawTx );
  
  console.log('Contract Address:', receipt.contractAddress);
  console.log('Transaction Hash:', receipt.transactionHash);

}
*/

async function deployERC20(){

  const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'))

  //remix > compiler > bytecode 
  try{
    const rawCodeFs = fs.readFileSync('./bytecode/erc20.json', 'utf8');
    const rawcode = rawCodeFs.toString();
    const contractBytecode = JSON.parse( rawcode );

    //Open Wallet
    const MNEMONIC = "captain behave spider puppy cart define post kitchen scout response fame aunt"

    var   receipt = await EthDeploy( {
        provider: {
          web3: web3,
        },  
        wallet: await OpenWalletFromMnemonic(MNEMONIC),
        gasLimit: web3.utils.toHex(21000000),
        byteCode: contractBytecode.object, 
        typesArray: ['string','string'], 
        parameters: ['xen-deploy', 'XNT'] 
      })

    console.log('Contract Address:', receipt.contractAddress);
    console.log('Transaction Hash:', receipt.transactionHash);
  }
  catch( e ){
    console.log(e)
  }

}

async function deployERC721(){

  const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'))

  //remix > compiler > bytecode 
  try{
    const rawCodeFs = fs.readFileSync('./bytecode/erc721.json', 'utf8');
    const rawcode = rawCodeFs.toString();
    const contractBytecode = JSON.parse( rawcode );

    //Open Wallet
    const MNEMONIC = "captain behave spider puppy cart define post kitchen scout response fame aunt"

    var   receipt = await EthDeploy( {
        provider: {
          web3: web3,
        },  
        wallet: await OpenWalletFromMnemonic(MNEMONIC),
        gasLimit: web3.utils.toHex(21000000),
        byteCode: contractBytecode.object, 
        typesArray: ['string','string'], 
        parameters: ['xen-test-erc721-burnable', 'X721'] 
      })

    console.log('Contract Address:', receipt.contractAddress); // > 0xf8364f38943FA72692B812C0BcdB337950669726
    console.log('Transaction Hash:', receipt.transactionHash);
  }
  catch( e ){
    console.log(e)
  }

}

//deployERC20()
deployERC721()