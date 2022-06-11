/*




*/
const { ExportToKeystoreV3 } = require('../export.js');
const { OpenWalletFromPrivateKey, OpenWalletFromKeystoreV3, OpenWalletFromMnemonic, OpenHDWallet } = require( '../import.js' );
const { CWallets } = require( '../wallets.js' );

async function testCode(){

  const MNEMONIC = "captain behave spider puppy cart define post kitchen scout response fame aunt"

  const wallet = await OpenWalletFromMnemonic(MNEMONIC);
  //const wallet = await OpenWalletFromKeystoreV3('\keystore.json', 'abcd0110');
  //const wallet = await OpenWalletFromPrivateKey( '0xeb0aff4170a349ceda6549af42d91b56f9365428189d2f193b308f349eb46d07');
 
  //0x373d6f42f8Fb276BEA08942BD27a8848A48962c4
  //0xeb0aff4170a349ceda6549af42d91b56f9365428189d2f193b308f349eb46d07
  console.log( wallet.getAddressString() )
  console.log( wallet.getPrivateKeyString() )
  console.log( wallet.getPrivateKey().toString("hex") )

  //ExportToKeystoreV3( wallet, 'abcd0110', true)
  hdWallets = new CWallets() 

  hdWallets.AddWallet( wallet )
  console.log( hdWallets.GetAddresses() )

  //대소문자 구분을 안하는 듯 하다... 덴장
  findW =  hdWallets.GetWallet('0x373d6f42f8Fb276BEA08942BD27a8848A48962c4')
  console.log( "find" )
  console.log( findW )

  console.log( "Remove" )
  hdWallets.RemoveWallet('0x373d6f42f8Fb276BEA08942BD27a8848A48962c4')
  console.log( hdWallets.GetAddresses() )
}

testCode()
