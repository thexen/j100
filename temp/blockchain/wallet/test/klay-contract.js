/*




*/
const Caver = require("caver-js");
const { OpenWalletFromPrivateKey, OpenWalletFromKeystoreV3, OpenWalletFromMnemonic, OpenHDWallet } = require( '../import.js' );
const { KlaySendTransaction } = require( "../sendtx.js")
const { AbiEncode } = require ( '../../utils/abi.js' )

async function main() {

  //Open Wallet
  const MNEMONIC = "captain behave spider puppy cart define post kitchen scout response fame aunt"
  const wallet = await OpenWalletFromMnemonic(MNEMONIC);

  ///Encoding ABI 
  //const data = contract.methods.setApprovalForAll("0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B", true ).encodeABI();
  const data = await AbiEncode( "setApprovalForAll(address,bool)", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B", true );

  var receipt = await KlaySendTransaction( {
    provider: {
      url: 'https://kaikas.baobab.klaytn.net:8651',
    },
    wallet: wallet,
    rawTransaction: {
      to:     '0xf42d21cc990a495a06b7a45fcabb7cc0606fae4c',
      value:  0,
      gas:    2100000,
      input:  data,
    }
  })
  console.log(receipt)
  
}

async function testKlayCallFromContract() {
  
  const caver = new Caver('https://kaikas.baobab.klaytn.net:8651')
  const nftconfig = require('./config')

  const DEPLOYED_ADDRESS  = nftconfig.DEPLOYED_ADDRESS; // ERC721, 제이미
  //const DEPLOYED_ADDRESS  = '0x01c1A270DEDB6f3201e3fCCfBf4C1EE16226723f'; //ERC721
  const DEPLOYED_ABI      = nftconfig.DEPLOYED_ABI; // 컨트랙트 ABI

  const contract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS); 
  
  try{

    const symbol = await contract.methods.symbol().call();
    console.log( 'Symbol: ' + symbol )

    //https://web3js.readthedocs.io/en/v1.2.8/web3-eth-contract.html#methods-mymethod-encodeabi
    const data = contract.methods.isApprovedForAll("0x373d6f42f8Fb276BEA08942BD27a8848A48962c4", "0x373d6f42f8Fb276BEA08942BD27a8848A48962c4").encodeABI();
    console.log( data )

    console.log(DEPLOYED_ADDRESS)
    console.log(contract.options.address)

    //제이미 constract만 있음
    const val =  await contract.methods.walletOfOwner( '0x373d6f42f8Fb276BEA08942BD27a8848A48962c4' ).call();
    console.log( 'My NFT: ' + val )

    const operator = await contract.methods.isApprovedForAll( "0x373d6f42f8Fb276BEA08942BD27a8848A48962c4", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B" ).call()
    console.log( 'Operator: ', operator)


  } catch( e ) {
    console.log(e)
  } finally {
  }

}

async function testKlayCallFromAbi() {

  const caver = new Caver('https://kaikas.baobab.klaytn.net:8651')

  try{
    
    //IERC721Enumerable.sol :: walletOfOwner
    var data = await AbiEncode( "walletOfOwner(address):(uint256[])", "0x373d6f42f8Fb276BEA08942BD27a8848A48962c4");
    console.log( data )

    const val = await caver.klay.call({
      //to: '0x01c1A270DEDB6f3201e3fCCfBf4C1EE16226723f', //ERC721, xen
      to: '0xf42d21cc990a495a06b7a45fcabb7cc0606fae4c', //ERC721, 제이미
      data: data,
    });
    console.log( val )

    var dec = caver.klay.abi.decodeParameter( 'uint256[]', val );
    console.log( 'walletOfOwner+: ' + dec )

  } catch( e ) {
    console.log(e)
  } finally {
  }

}

async function mintERC721() {

  //Open Wallet
  const MNEMONIC = "captain behave spider puppy cart define post kitchen scout response fame aunt"
  const wallet = await OpenWalletFromMnemonic(MNEMONIC);

  const contractAddress = '0x01c1A270DEDB6f3201e3fCCfBf4C1EE16226723f'

  ///Encoding ABI 
  var data = await AbiEncode( "mint(address,uint256,string)", "0x373d6f42f8Fb276BEA08942BD27a8848A48962c4", 1, 'http://127.0.0.1:8080/metadata/get/TODO:CID' )

  var receipt = await KlaySendTransaction( {
    provider: {
      url: 'https://kaikas.baobab.klaytn.net:8651',
    },
    wallet: wallet,
    rawTransaction: {
      to:     contractAddress,
      value:  0,
      gas:    2100000,
      input:  data,
    }
  })
  console.log(receipt)
  
}

async function simbol() {

  const caver = new Caver('https://kaikas.baobab.klaytn.net:8651')
  const nftconfig = require('./config')

  const DEPLOYED_ADDRESS  = nftconfig.DEPLOYED_ADDRESS; // ERC721, 제이미
  //const DEPLOYED_ADDRESS  = '0x01c1A270DEDB6f3201e3fCCfBf4C1EE16226723f'; //ERC721
  const DEPLOYED_ABI      = nftconfig.DEPLOYED_ABI; // 컨트랙트 ABI

  const contract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS); 
  
  try{

    const symbol = await contract.methods.symbol().call();
    console.log( 'Symbol: ' + symbol )

  } catch( e ) {
    console.log(e)
  } finally {
  }

}

async function isAddress() {

  let res = await Caver.utils.isAddress('0xf8364f38943FA72692B812C0BcdB337950669726');
  console.log( res );

}

async function isContract() {

  const caver = new Caver('https://kaikas.baobab.klaytn.net:8651')

  const contractAddress = '0xf42d21cc990a495a06b7a45fcabb7cc0606fae4c'; //ERC721
  var res = await caver.klay.getCode(contractAddress);
  if( res.length > 2 ){
    //console.log( resContract );
    console.log( "true" )
  } else {
    console.log( "false" )
  }

  var res = await caver.klay.getCode("0x373d6f42f8Fb276BEA08942BD27a8848A48962c4");//"0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8");
  if( res.length > 2 ){
    //console.log( resContract );
    console.log( "true" )
  } else {
    console.log( "false" )
  }  

}

//testKlayCallFromContract();
//testKlayCallFromAbi();
main()
//mintERC721()
//simbol()
//isAddress()
//isContract()

async function klayExpectedReceipt() {

  const caver = new Caver('https://kaikas.baobab.klaytn.net:8651')

  try{

    var data = await AbiEncode( "inqueryExpectedReceipt(address,uint256,address,address[])"
                , "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                , 1000000000
                , "0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e"
                , [] );
    console.log( data )

    const val = await caver.klay.call({
      to: '0x0fE5322F52D13Fe39194d8d1B3a7F0559ea9F4CB', 
      data: data,
    });
    console.log( val )

    var dec = caver.klay.abi.decodeParameter( 'uint256', val );
    console.log( 'receipt+: ' + dec )

  } catch( e ) {
    console.log(e)
  } finally {
  }

}

async function klayExpectedReceipt() {

  const caver = new Caver('https://kaikas.baobab.klaytn.net:8651')

  try{

    var data = await AbiEncode( "inqueryExpectedReceipt(address,uint256,address,address[])"
                , "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                , 1000000000
                , "0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e"
                , [] );
    console.log( data )

    const val = await caver.klay.call({
      to: '0x0fE5322F52D13Fe39194d8d1B3a7F0559ea9F4CB', 
      data: data,
    });
    console.log( val )

    var dec = caver.klay.abi.decodeParameter( 'uint256', val );
    console.log( 'receipt+: ' + dec )

  } catch( e ) {
    console.log(e)
  } finally {
  }

}

//klayExpectedReceipt();