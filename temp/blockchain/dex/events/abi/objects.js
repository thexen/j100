/*




*/
const { UpsertToMongo, InsertToMongo, FindToModify }                       =  require ( '../../../../common/chains/mongo/call.js' );

function _getAbiRegistObject() {

  var abi = {
    type: 'event',
    name: 'RegistObject',    
    inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'object',
        },{
            type: 'uint16',
            name: 'objectId',
        }
    ]
  }
  return abi;
} 

var objectClass = {
    0  : 'WORLDCURRENCY',
    1  : 'PERMISSION',
    2  : 'TEAMVAULT',

    3  : 'GBUILDER',
    4  : 'MINE',
    5  : 'GTOKEN',

    6  : 'DAOBUILDER',
    7  : ' DAO',

    8  : 'MANAGERBUILDER',
    9  : 'SWAPPOOLMANAGER',
    10 : 'TOKENMANAGER',

    11 : 'LPTFACTORY',
    12 : 'LPTSTAKINGHOLDERFACTORY',
    13 : 'SWAPPOOLFACTORY',

    14 : 'RARITY',
    15 : 'SWAPHELPER'    
}

async function _registObject( eventLog, decodedEventLog, mongoClient ) {
    console.log("ENTRY _registObject()");

    let objectInfo  = {
        contract:   decodedEventLog.object,
        class:      objectClass[decodedEventLog.objectId],
        block:      {
            number: eventLog.blockNumber,
            tx:     eventLog.transactionHash,
        }
    }
    await UpsertToMongo( mongoClient, 'objects', decodedEventLog.objectId, objectInfo );
}

function _getAbiRegistPermission() {

    //Invoke
    var abi = {
        type: 'event',
        name: 'RegistPermission',       
        inputs: [
            {
                type: 'function',
                name: 'method',
                indexed: true
            },{
                type: 'address',
                name: 'source',
            },{
                type: 'address',
                name: 'accessor',
            },{
                type: 'uint16',
                name: 'permission',
            }
        ]
    }
    return abi;
}

var permissionType = {
    0  : 'DENY',
    1  : 'DEFAULT',
    2  : 'FACTORY',

    3  : 'SPFACTORY',
    4  : 'DAO',
    5  : 'RARITY',

    6  : 'OWNER',
    7  : 'CREATOR'
}

async function _registPermission( eventLog, decodedEventLog, mongoClient ) {
    console.log("ENTRY _registPermission()");

    let permissionInfo  = {
        source:     decodedEventLog.source,
        accessor:   decodedEventLog.accessor,
        permission: permissionType[ decodedEventLog.permission ],
        block:      {
            number: eventLog.blockNumber,
            tx:     eventLog.transactionHash,
        }
    }
    
    var res = await FindToModify( mongoClient, 'counters',{_id: 'permissions'}, { seq: 1 }, { '$inc': {seq: 1} } )
    if( res.lastErrorObject.updatedExisting ) {
        await InsertToMongo( mongoClient, 'permissions', res.value.seq, permissionInfo );    
    } 
    
}

module.exports.getAbiRegistObject             = _getAbiRegistObject;
module.exports.eventRegistObject              = _registObject;
module.exports.getAbiRegistPermission         = _getAbiRegistPermission;
module.exports.eventRegistPermission          = _registPermission;

