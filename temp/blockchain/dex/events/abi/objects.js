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

function _registObject( eventLog, decodedEventLog ) {

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

}

module.exports.getAbiRegistObject             = _getAbiRegistObject;
module.exports.eventRegistObject              = _registObject;
module.exports.getAbiRegistPermission         = _getAbiRegistPermission;
module.exports.eventRegistPermission          = _registPermission;

