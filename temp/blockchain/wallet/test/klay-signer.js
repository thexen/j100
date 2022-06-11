/*




*/
const Caver = require("caver-js");
const { OpenWalletFromPrivateKey, OpenWalletFromKeystoreV3, OpenWalletFromMnemonic, OpenHDWallet } = require( '../import.js' );
const caver = new Caver('https://kaikas.baobab.klaytn.net:8651')

async function testKlaytnSendRawTx() {

  const MNEMONIC = "captain behave spider puppy cart define post kitchen scout response fame aunt"
  const wallet = await OpenWalletFromMnemonic(MNEMONIC);

  // create keyring
  const keyring = caver.wallet.keyring.createFromPrivateKey( wallet.getPrivateKeyString() )

	// Create value transfer transaction
	const vt = caver.transaction.valueTransfer.create({
		from: keyring.address,
		to: '0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B',
		value: 1000000,//caver.utils.toPeb(0.1, 'KLAY'),
		gas: 25000,
	})

  // signing
  await vt.sign(keyring)

  // Send transaction to the Klaytn blockchain platform (Klaytn)
  const receipt = await caver.rpc.klay.sendRawTransaction(vt)
  console.log(receipt)

}

testKlaytnSendRawTx() 