/*




*/

function _getAbiCreateSwapPool() {

    var abi = {
        type: 'event',
        name: 'CreateSwapPool',
        inputs: [
          {
                type: 'function',
                name: 'method',
                indexed: true
          },{
                type: 'uint256',
                name: 'index',
          },{
                type: 'address',
                name: 'firstToken',
          },{
                type: 'address',
                name: 'secondToken',
          },{
                type: 'address',
                name: 'sp',
          },{
                type: 'address',
                name: 'holder',
          },{
                type: 'address',
                name: 'lpt',
          },{
                type: 'uint256',
                name: 'fee',
          }
        ]
    }
      
    return abi;
}

function _createSwapPool( eventLog, decodedEventLog ) {
    console.log("Called _createSwapPool ................")
    console.log(decodedEventLog)
}

module.exports.getAbiCreateSwapPool                    = _getAbiCreateSwapPool;
module.exports.eventCreateSwapPool                     = _createSwapPool;
