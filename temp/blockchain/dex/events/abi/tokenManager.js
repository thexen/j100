/*




*/

function _getAbiSetToken() {

  var abi = {
    type: 'event',
    name: 'SetToken',
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
          name: 'token',
      },{
          type: 'uint256',
          name: 'expireDate',
      },{
          type: 'uint8',
          name: 'weight',
      }
    ]
  } 
    
  return abi;
}

function _setToken( eventLog, decodedEventLog ) {
  console.log("Called _setToken ................")
  console.log(decodedEventLog)
}

module.exports.getAbiSetToken                       = _getAbiSetToken;
module.exports.eventSetToken                        = _setToken;