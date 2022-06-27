/*




*/
const { GetWeb3 }                                               = require ( '../../networks/active.js' );
const { abiCompile }                                            = require ( '../inputCompiler.js' )

function _callBack_proposal( eventLog, decodedEventLog ) {

}

function _proposal() {

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
  //var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
  var key  = GetWeb3().utils.keccak256( abiCompile(abi) )
  var data = {  name:       abi.name,
                inputs:     abi.inputs,
                callBack:   _callBack_proposal,
            } 
  return { key: key, data: data };
} 

function _callBack_invoke( eventLog, decodedEventLog ) {

}

function _invoke() {

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
    //var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
    var key  = GetWeb3().utils.keccak256( abiCompile(abi) )
    var data = {  name:       abi.name,
                  inputs:     abi.inputs,
                  callBack:   _callBack_invoke,
              } 
    return { key: key, data: data };
  }

module.exports.eventProposal                = _proposal;
module.exports.eventInvoke                  = _invoke;

