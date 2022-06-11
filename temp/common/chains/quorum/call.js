const Web3 = require("web3");
const { QUORUMCONF } = require('../../../config/chain');

const web3 = new Web3( QUORUMCONF.rpcurl );

function _getContract( contractName ) {
    for ( let i = 0; i < QUORUMCONF.contracts.length; i++ ) {
        if ( QUORUMCONF.contracts[i].name == contractName ) {
            let contract = {};
            try {
                contract = new web3.eth.Contract( QUORUMCONF.contracts[i].abi, QUORUMCONF.contracts[i].address );
                return Object.assign({}, contract)
            } catch (e) {
                throw Error( e.message );
            } finally {
                contract = undefined;                
            }
        }
    }
    throw Error( 'Not found contract' );
}

function _getTxnParam( account, param, tmSender, tmReceiver ) {
    if ( param.isPrivate == 'true' ) {
        txnParams = {
            from: account,
            isPrivate: true,
            privateFrom: tmSender,  //"BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=",
            privateFor: tmReceiver, //["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="],
            privacyFlag: 0  /* 0: Standard, 1: PartyProtection, 3: PrivateStateValidation */
        }
    } else {
        txnParams = { from: account };
    }
    return txnParams;
}

function _payload( value ) {
    let payload = '';
    let holder = {};

    if ( typeof value == 'object' ) {
        Object.assign( holder, value );

        payload = JSON.stringify( holder );
        holder  = undefined;
        value   = undefined;        
    } else if( typeof value == 'string' ) {
        payload = value;
    }
    return payload;
}

async function _getFromQuorum( param ) {
    let web3Contract = _getContract( param.contract.name );
    return web3Contract.methods.get( param.key ).call();
}

async function _asyncInvokeIntoQuorum( _param ) {
    let holder          = {};
    let param           = Object.assign( holder, _param );

	let accounts        = await web3.eth.getAccounts();
    let account         = accounts[0];

    let web3Contract    = _getContract( param.contract.name );
    let payload         = _payload( param.value )
    let web3Method      = web3Contract.methods.invoke( param.key, payload );

    let txnParams       = _getTxnParam( account, param, "", [""] );
    let result          = await web3Method.send( txnParams );
    let txHash          = result.transactionHash;


    if( param.callback.onTransactionHash != undefined ) {
        param.callback.onTransactionHash( txHash, param.callback.param );
    }

    return new Promise( function( resolve, reject ){
        web3.eth.getTransactionReceipt( txHash )
            .then( receipt => {
                if( param.callback.onReceipt != undefined ){
                    param.callback.onReceipt( receipt, param.callback.param );
                }
                resolve( receipt.transactionHash );
            })
            .catch( error => {
                if( param.callback.onError != undefined ){
                    param.callback.onError( error, txHash, param.callback.param );
                }
                reject( error );
            })
            .finally( function() {
                param       = undefined;
                holder      = undefined;
                accounts    = undefined;
                web3Contract= undefined;
                web3Method  = undefined;
                txnParams   = undefined;
                result      = undefined;
            }); 
    })
}

async function _syncInvokeIntoQuorum( _param ) {
    let holder          = {};
    let param           = Object.assign( holder, _param );

    let accounts        = await web3.eth.getAccounts();
    let account         = accounts[0];

    let web3Contract    = _getContract( param.contract.name );
    let payload         = _payload( param.value )
    let web3Method      = web3Contract.methods.invoke( param.key, payload );

    let txnParams       = _getTxnParam( account, param, "", [""] );

    let txn = {};
    try {
        txn = await web3Method.send( txnParams );
        return txn;
    } catch ( e ) {
        throw Error( e.message );
    } finally {
        param       = undefined;
        holder      = undefined;
        accounts    = undefined;
        txnParams   = undefined;
        web3Contract= undefined;
        web3Method  = undefined;        
        txn         = undefined;
    }
}

module.exports.GetFromQuorum            = _getFromQuorum;
module.exports.AsyncInvokeIntoQuorum    = _asyncInvokeIntoQuorum;
module.exports.SyncInvokeIntoQuorum     = _syncInvokeIntoQuorum;
