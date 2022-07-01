/*




*/
const { UpsertToMongo, QueryFromMongo }                         =  require ( '../../../../common/chains/mongo/call.js' );

/*
    let objectInfo  = {
        contract:   address,
        class:      name,
        block: {
            number: blockNumber,
            tx: txHash,
        },        
    }

*/

async function _invokeObject( objectId, address, name, block ) {
    let objectInfo  = {
        contract:   address,
        class:      name,
        block:      block,
    }
    UpsertToMongo( 'objects', objectId, objectInfo );
}

async function _invokePermission( index, sender, source, accessor, permission, block ) {
    let permissionInfo  = {
        sender:         sender,
        source:         source,
        accessor:       accessor,
        permission:     permission,
        block:          block,
    }
    UpsertToMongo( 'permissions', index, permissionInfo );
}

module.exports.invokeObject         = _invokeObject;
module.exports.invokePermission     = _invokePermission;