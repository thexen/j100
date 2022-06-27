/*




*/
const { GetWeb3 }                                               = require ( '../../networks/active.js' );
const { abiCompile }                                            = require ( '../inputCompiler.js' )

function _callBack_exchange( eventLog, decodedEventLog ) {

}

//-----------------------------------------------------------------------------------
//SwapPoolFactory

function _exchange() {

    var abi = { 
        type: 'event',
        name: 'Exchange',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'sender',
        },{
            type: 'address',
            name: 'from',
        },{
            type: 'uint256',
            name: 'fromAmount',
        },{
            type: 'address',
            name: 'to',
        },{
            type: 'uint256',
            name: 'minimumReceipt',
        },{
            type: 'uint256',
            name: 'receiptAmount',
        }
      ]
  }
  //var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
  var key  = GetWeb3().utils.keccak256( abiCompile(abi) )
  var data = {  name:       abi.name,
                inputs:     abi.inputs,
                callBack:   _callBack_exchange,
            } 
  return { key: key, data: data };
} 

module.exports.eventExchange                  = _exchange;