/*




*/
const Web3 = require('web3')
const { OpenWalletFromPrivateKey, OpenWalletFromKeystoreV3, OpenWalletFromMnemonic, OpenHDWallet } = require( '../import.js' );

const config = require('./config')
const { Sign } = require( '../sign.js' );

//MetaMask >> 네트워크 추가 > 네트워크 > Rinkeby 테스트 네트워크 > 새 RPC URL
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'))

async function txSign() {

  var count = await web3.eth.getTransactionCount( '0x373d6f42f8Fb276BEA08942BD27a8848A48962c4' );
  console.log('Tx Count: ' + count)

  var rawTransaction = {
    //from: '0x373d6f42f8Fb276BEA08942BD27a8848A48962c4',
    to: '0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B', //prvKey -> 0x69908c50c12b5e7aa84fe245a107431ea666ceb650b31a55c28e9bf2987d74c3
    value: 1000000000,
    gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    gasLimit: web3.utils.toHex(21000000),
    nonce: web3.utils.toHex(count),
  }

  web3.eth.accounts.privateKeyToAccount('0xeb0aff4170a349ceda6549af42d91b56f9365428189d2f193b308f349eb46d07');
  const signed = await web3.eth.accounts.signTransaction( rawTransaction, '0xeb0aff4170a349ceda6549af42d91b56f9365428189d2f193b308f349eb46d07' );
  console.log( signed.rawTransaction )

}

async function testCode() {

  //Open Wallet
  const MNEMONIC = "captain behave spider puppy cart define post kitchen scout response fame aunt"
  const wallet = await OpenWalletFromMnemonic(MNEMONIC);

  //Get Balance
  const val = await web3.eth.getBalance('0x373d6f42f8Fb276BEA08942BD27a8848A48962c4');
  console.log('Balance: ' + val)

  //Get Tx Count
  var count = await web3.eth.getTransactionCount( '0x373d6f42f8Fb276BEA08942BD27a8848A48962c4' );
  console.log('Tx Count: ' + count)

  var rawTransaction = {
    //from: '0x373d6f42f8Fb276BEA08942BD27a8848A48962c4',
    to: '0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B', //prvKey -> 0x69908c50c12b5e7aa84fe245a107431ea666ceb650b31a55c28e9bf2987d74c3
    value: 1000000000,
    gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    gasLimit: web3.utils.toHex(21000000),
    nonce: web3.utils.toHex(count),
  }
  
  const rawTx = await Sign( wallet, rawTransaction );

  console.log('Send Raw Tx >>>>>')
  var receipt = await web3.eth.sendSignedTransaction( rawTx );
  console.log(receipt)
  console.log('Send Raw Tx <<<<<')

}


txSign()
//testCode()

/*

let minABI = [
// transfer
{
    "constant": false,
    "inputs": [
        {
            "name": "_to",
            "type": "address"
        },
        {
            "name": "_value",
            "type": "uint256"
        }
    ],
    "name": "transfer",
    "outputs": [
        {
            "name": "success",
            "type": "bool"
        }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}
];
let contractAddres="put the erc20 contract address here";

let contract = await new web3.eth.Contract(minABI, contractAddr);

contract.methods.transfer("your account", "amount of erc20 tokens you want transfer").send({
        from: "your account"
    });

    */