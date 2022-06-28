/*




*/

function _getAbiExchange() {

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
  return abi;
} 

function _exchange( eventLog, decodedEventLog ) {

}

module.exports.getAbiExchange                  = _getAbiExchange;
module.exports.eventExchange                   = _exchange;