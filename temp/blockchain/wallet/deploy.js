/*




*/
const { KlaySendTransaction, EthSendTransaction } = require( "./sendtx.js")

async function klayDeploy( _object ) {

    let encodedParameters               = undefined;
    let bytecodeWithEncodedParameters   = undefined;
    let count                           = undefined ;
    let gas                             = 2100000;

    try{
        encodedParameters               = _object.provider.caver.klay.abi.encodeParameters( _object.typesArray, _object.parameters ).slice(2);
        bytecodeWithEncodedParameters   = _object.byteCode + encodedParameters;
        count                           = await _object.provider.caver.klay.getTransactionCount( _object.wallet.getAddressString() );
        
        if( _object.gas != undefined ){
            gas = _object.gas;
        }
        
        return await KlaySendTransaction( {
            provider: _object.provider,
            wallet:   _object.wallet,
            rawTransaction: {
                nonce:  _object.provider.caver.utils.toHex(count),
                gas:    gas,
                input: `0x${bytecodeWithEncodedParameters}`,
            }
        })
    } catch( e ) {
        console( e )
    }finally{
        encodedParameters               = undefined;
        bytecodeWithEncodedParameters   = undefined;
    }
}
  
async function ethDeploy( _object ) {

    let encodedParameters               = undefined;
    let bytecodeWithEncodedParameters   = undefined;
    let count                           = undefined ;
    
    let gasPrice                        = undefined;
    let gasLimit                        = undefined;

    try{

        encodedParameters               = _object.provider.web3.eth.abi.encodeParameters( _object.typesArray, _object.parameters ).slice(2);
        bytecodeWithEncodedParameters   = _object.byteCode + encodedParameters;
        count                           = await _object.provider.web3.eth.getTransactionCount( _object.wallet.getAddressString() );

        if( _object.gasPrice == undefined ){
            gasPrice = _object.provider.web3.utils.toHex( await _object.provider.web3.eth.getGasPrice() );
        } else {
            gasPrice = _object.gasPrice 
        }
        if( _object.gasLimit == undefined ){
            gasLimit = _object.provider.web3.utils.toHex( await _object.provider.web3.eth.estimateGas({ bytecodeWithEncodedParameters }) );
        } else {
            gasLimit = _object.gasLimit
        }

        return await EthSendTransaction({
            provider: _object.provider,
            wallet:   _object.wallet,
            rawTransaction: {
                nonce:      _object.provider.web3.utils.toHex(count),
                gasLimit:   gasLimit, //web3.utils.toHex(gasLimit),
                gasPrice:   gasPrice, //web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
                data:      `0x${bytecodeWithEncodedParameters}`,
            } 
        })

    } catch( e ) {
        console.log( e )
    }finally{
        encodedParameters               = undefined;
        bytecodeWithEncodedParameters   = undefined;
    }    
  
}


module.exports.KlayDeploy  = klayDeploy;
module.exports.EthDeploy  = ethDeploy;
