/*




*/
const { UpsertToMongo }                       =  require ( '../../../../common/chains/mongo/call.js' );

function _getAbiAddMember() {
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
    return abi;
} 

function _addMember( eventLog, decodedEventLog, mongoClient ) {
    console.log("Called _addMember ................")
    console.log(decodedEventLog)
}

function _getAbiRemoveMember() {
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
    return abi;
}

function _removeMember( eventLog, decodedEventLog, mongoClient ) {
    console.log("Called _removeMember ................")
    console.log(decodedEventLog)
}

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
                name: 'approvor',
            },{
                type: 'uint256',
                name: 'docId',
            },{
                type: 'bytes',
                name: 'callData',
            }
        ]
    }
    return abi;
}

function _Proposal( eventLog, decodedEventLog, mongoClient ) {
    console.log("Called _Proposal ................")
    console.log(decodedEventLog)
}

function _getAbiApproval() {
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
    return abi;
}

function _approval( eventLog, decodedEventLog, mongoClient ) {
    console.log("Called _approval ................")
    console.log(decodedEventLog)
}

function _getAbiInvoke() {
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
    return abi;
}

function _invoke( eventLog, decodedEventLog, mongoClient ) {
    console.log("Called _invoke ................")
    console.log(decodedEventLog)
}

module.exports.getAbiAddMember              = _getAbiAddMember;
module.exports.eventAddMember               = _addMember;

module.exports.getAbiRemoveMember           = _getAbiRemoveMember;
module.exports.eventRemoveMember            = _removeMember;

module.exports.getAbiProposal               = _getAbiProposal;
module.exports.eventProposal                = _Proposal;

module.exports.getAbiApproval               = _getAbiApproval;
module.exports.eventApproval                = _approval;

module.exports.getAbiInvoke                 = _getAbiInvoke;
module.exports.eventInvoke                  = _invoke;
