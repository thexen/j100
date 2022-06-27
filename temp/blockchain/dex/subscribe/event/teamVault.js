/*




*/
const { GetWeb3 }                                               = require ( '../../networks/active.js' );
const { abiCompile }                                            = require ( '../inputCompiler.js' )

function _callBack_addMember( eventLog, decodedEventLog ) {

}

function _addMember() {

  //AddMember
  var abi = {
    type: 'event',
    name: 'AddMember',       
    inputs: [
    {
        type: 'function',
        name: 'method',
        indexed: true
    },{
        type: 'address',
        name: 'newMember',
    }
  ]
}
  //var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
  var key  = GetWeb3().utils.keccak256( abiCompile(abi) )
  var data = {  name:       abi.name,
                inputs:     abi.inputs,
                callBack:   _callBack_addMember,
            } 
  return { key: key, data: data };
} 

function _callBack_remveMember( eventLog, decodedEventLog ) {

}

function _removeMember() {

    //RemoveMember
    var abi = { 
        type: 'event',
        name: 'RemoveMember',      
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'member',
        }
    ]
    }
    //var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
    var key  = GetWeb3().utils.keccak256( abiCompile(abi) )
    var data = {  name:       abi.name,
                  inputs:     abi.inputs,
                  callBack:   _callBack_remveMember,
              } 
    return { key: key, data: data };
}

function _callBack_approval( eventLog, decodedEventLog ) {

}

function _approval() {

    //Approval
    var abi = {
        type: 'event',
        name: 'Approval',        
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'approvor',
        },{
            type: 'uint256',
            name: 'docId',
        }
    ]
    }
    //var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
    var key  = GetWeb3().utils.keccak256( abiCompile(abi) )
    var data = {  name:       abi.name,
                  inputs:     abi.inputs,
                  callBack:   _callBack_approval,
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
            type: 'address',
            name: 'sender',
        },{
            type: 'uint256',
            name: 'docId',
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

module.exports.eventAddMember               = _addMember;
module.exports.eventRemoveMember            = _removeMember;
module.exports.eventApproval                = _approval;
module.exports.eventInvoke                  = _invoke;
