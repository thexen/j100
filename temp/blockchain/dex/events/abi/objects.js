/*




*/

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

function _registObject( eventLog, decodedEventLog ) {
    console.log("Called _registObject ................")
    console.log(decodedEventLog)
    console.log( objectClass[decodedEventLog.objectId] )
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

function _registPermission( eventLog, decodedEventLog ) {
    console.log("Called _registPermission ................")
    console.log(decodedEventLog)
}

module.exports.getAbiRegistObject             = _getAbiRegistObject;
module.exports.eventRegistObject              = _registObject;
module.exports.getAbiRegistPermission         = _getAbiRegistPermission;
module.exports.eventRegistPermission          = _registPermission;

