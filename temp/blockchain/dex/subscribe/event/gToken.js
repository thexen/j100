/*




*/
const { GetWeb3 }                                               = require ( '../../networks/active.js' );
const { abiCompile }                                            = require ( '../inputCompiler.js' )

function _callBack_staking( eventLog, decodedEventLog ) {

}

function _staking() {

    //Staking
    var abi = {
        type: 'event',
        name: 'Staking',        
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
            name: 'id',
        },{
            type: 'uint256',
            name: 'amount',
        },{
            type: 'uint256',
            name: 'period',
        }
    ]
    }
  //var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
  var key  = GetWeb3().utils.keccak256( abiCompile(abi) )
  var data = {  name:       abi.name,
                inputs:     abi.inputs,
                callBack:   _callBack_staking,
            } 
  return { key: key, data: data };
} 

function _callBack_unstaking( eventLog, decodedEventLog ) {

}

function _unstaking() {

    //Unstaking
    var abi = {
        type: 'event',
        name: 'Unstaking',       
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
            name: 'id',
        },{
            type: 'uint256',
            name: 'amount',
        }
    ]
    }
    //var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
    var key  = GetWeb3().utils.keccak256( abiCompile(abi) )
    var data = {  name:       abi.name,
                  inputs:     abi.inputs,
                  callBack:   _callBack_unstaking,
              } 
    return { key: key, data: data };
}

function _callBack_transferRewardTo( eventLog, decodedEventLog ) {

}

function _transferRewardTo() {

    var abi = {
        type: 'event',
        name: 'TransferRewardTo',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'to',
        }
      ]
    }
    //var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
    var key  = GetWeb3().utils.keccak256( abiCompile(abi) )
    var data = {  name:       abi.name,
                  inputs:     abi.inputs,
                  callBack:   _callBack_transferRewardTo,
              } 
    return { key: key, data: data };
}

function _callBack_burn( eventLog, decodedEventLog ) {

}

function _burn() {

    var abi = {
        type: 'event',
        name: 'Burn',      
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'uint256',
            name: 'amount',
        }
      ]
    }
    //var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
    var key  = GetWeb3().utils.keccak256( abiCompile(abi) )
    var data = {  name:       abi.name,
                  inputs:     abi.inputs,
                  callBack:   _callBack_burn,
              } 
    return { key: key, data: data };
}

function _callBack_rcycle( eventLog, decodedEventLog ) {

}

function _recycle() {

    var abi = {
        type: 'event',
        name: 'Recycle',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'uint256',
            name: 'amount',
        }
      ]
    }
    //var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
    var key  = GetWeb3().utils.keccak256( abiCompile(abi) )
    var data = {  name:       abi.name,
                  inputs:     abi.inputs,
                  callBack:   _callBack_rcycle,
              } 
    return { key: key, data: data };
}

module.exports.eventStaking              = _staking;
module.exports.eventUnstaking            = _unstaking;
module.exports.eventTransferRewardTo     = _transferRewardTo;
module.exports.eventBurn                 = _burn;
module.exports.eventRecycle              = _recycle;
