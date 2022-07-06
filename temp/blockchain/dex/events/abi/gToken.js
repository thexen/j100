/*




*/
const { UpsertToMongo }                       =  require ( '../../../../common/chains/mongo/call.js' );

function _getAbiStaking() {
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
    return abi;
} 
function _staking( eventLog, decodedEventLog, mongoClient ) {

}

function _getAbiUnstaking() {
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
    return abi;
}

function _unstaking( eventLog, decodedEventLog, mongoClient ) {

}

function _getAbiTransferRewardTo() {
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
    return abi;
}

function _transferRewardTo( eventLog, decodedEventLog, mongoClient ) {
    console.log("Called _transferRewardTo ................")
    console.log(decodedEventLog)
    console.log(decodedEventLog.objectId)
}

function _getAbiBurn() {
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
    return abi;
}

function _burn( eventLog, decodedEventLog, mongoClient ) {

}

function _getAbiRecycle() {
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
    return abi;
}

function _recycle( eventLog, decodedEventLog, mongoClient ) {

}

module.exports.GetAbiStaking             = _getAbiStaking;
module.exports.eventStaking              = _staking;

module.exports.getAbiUnstaking           = _getAbiUnstaking;
module.exports.eventUnstaking            = _unstaking;

module.exports.getAbiTransferRewardTo    = _getAbiTransferRewardTo;
module.exports.eventTransferRewardTo     = _transferRewardTo;

module.exports.getAbiBurn                = _getAbiBurn;
module.exports.eventBurn                 = _burn;

module.exports.getAbiRecycle             = _getAbiRecycle;
module.exports.eventRecycle              = _recycle;
