/*




*/
const { QueryChain }                          =  require ( '../networks/active.js' );

async function _txLogger( tx, abiEventMapper ) {

  var optsTopics = [      
    {
        type: 'function',
        name: 'method',
        indexed: true
    },
  ]

  tx.logs.forEach( function( item ) {
    try{
      var topicMethod       =  QueryChain().abi.decodeLog( optsTopics, undefined, item.topics );
      var decodedLog        =  QueryChain().abi.decodeLog( abiEventMapper[topicMethod.method].inputs, item.data, item.topics );
      abiEventMapper[topicMethod.method].callBack( item, decodedLog );
    } catch( e ) {
    }
  })

}

module.exports.txLogger     = _txLogger;
