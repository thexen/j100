/*




*/
const Caver     = require("caver-js");
const Web3      = require('web3');
const { Sign }  = require( './sign.js' );

async function klaySendTransaction( _object ) {

    let caver   = undefined;
    let keyring = undefined;
    let vt      = undefined;

    try{
        if( _object.provider.caver != undefined ){
            caver = _object.provider.caver;
        } else {
            caver   = await new Caver( _object.provider.url );
        }
        // create keyring
        keyring = await caver.wallet.keyring.createFromPrivateKey( _object.wallet.getPrivateKeyString() )
        // create Transaction : https://ko.docs.klaytn.com/dapp/sdk/caver-js/api-references/caver.transaction/basic#valuetransfer
        vt      = await caver.transaction.legacyTransaction.create( _object.rawTransaction )
        // signing
        await vt.sign(keyring)
        // Send transaction to the Klaytn blockchain platform (Klaytn)
        return await caver.rpc.klay.sendRawTransaction(vt)
    }
    catch( e ) {
        console.log( e );
    } finally {
        if( _object.provider.caver == undefined ){
            caver   = undefined;
        }
        keyring = undefined;
        vt      = undefined;
    }
}

async function ethSendTransaction2( _object ) {
    
    let web3    = undefined;
    let rawTx   = undefined;
    try{
        if( _object.provider.web3 != undefined ){
            web3 = _object.provider.web3;
        } else {            
            web3  = new Web3( new Web3.providers.HttpProvider(_object.provider.url) );
        }
        rawTx = await web3.eth.accounts.signTransaction( _object.rawTransaction, _object.wallet.getPrivateKeyString() );
        return await web3.eth.sendSignedTransaction( rawTx.rawTransaction );
    } catch( e ) {
        console.log( e )
    } finally {
        if( _object.provider.web3 == undefined ){
            web3    = undefined;
        }
        rawTx   = undefined
    }
}
  
async function ethSendTransaction( _object ) {

    let web3    = undefined;
    let rawTx   = undefined;
    try{    
        if( _object.provider.web3 != undefined ){
            web3 = _object.provider.web3;
        } else {            
            web3  = new Web3( new Web3.providers.HttpProvider(_object.provider.url) );
        }
        rawTx = await Sign( _object.wallet, _object.rawTransaction );
        return await web3.eth.sendSignedTransaction( rawTx );
    } catch( e ) {
        console.log( e )
    } finally {
        if( _object.provider.web3 == undefined ){
            web3    = undefined;
        }
        rawTx   = undefined
    }        
}
  

module.exports.KlaySendTransaction  = klaySendTransaction;
module.exports.EthSendTransaction   = ethSendTransaction;
module.exports.EthSendTransaction2  = ethSendTransaction2;
