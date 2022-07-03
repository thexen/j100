/*




*/

function _getAbiEnhance() {

  var abi = {
    type: 'event',
    name: 'Enhance',    
    inputs: [
      {
          type: 'function',
          name: 'method',
          indexed: true
      },{
          type: 'address',
          name: 'object',
          indexed: true
      },{
          type: 'address',
          name: 'sender',
      },{
          type: 'string',
          name: 'currentRarity',
      },{
          type: 'uint',
          name: 'rand',
      }
    ]
  }
  return abi;
} 

function _enhance( eventLog, decodedEventLog ) {
    console.log("Called _enhance ................")
    console.log(decodedEventLog)
}

module.exports.getAbiEnhance                 = _getAbiEnhance;
module.exports.eventEnhance                  = _enhance;

