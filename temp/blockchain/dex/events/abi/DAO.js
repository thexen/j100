/*




*/

function _getAbiProposal() {

  var abi = {
    type: 'event',
    name: 'Proposal',    
    inputs: [
      {
          type: 'function',
          name: 'method',
          indexed: true
      },{
          type: 'address',
          name: 'sender',
      },{
          type: 'uint256',
          name: 'agendaId',
      },{
          type: 'bytes',
          name: 'callData',
      },{
          type: 'uint256',
          name: 'deadline',
      }
    ]
  }
  return abi;
} 

function _proposal( eventLog, decodedEventLog ) {

}

function _getAbiInvoke() {

    //Invoke
    var abi = {
        type: 'event',
        name: 'Invoke',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'bytes',
            name: 'callData',
        }
        ]
    }
    return abi;
}

function _invoke( eventLog, decodedEventLog ) {

}

module.exports.getAbiProposal                 = _getAbiProposal;
module.exports.eventProposal                  = _proposal;
module.exports.getAbiInvoke                   = _getAbiInvoke;
module.exports.eventInvoke                    = _invoke;

