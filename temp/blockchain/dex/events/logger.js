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
      //TODO item.address << contract address 이므로 유효한 contract 인지 확인 할 것
      var topicMethod       =  QueryChain().abi.decodeLog( optsTopics, undefined, item.topics );
      var decodedLog        =  QueryChain().abi.decodeLog( abiEventMapper[topicMethod.method].inputs, item.data, item.topics );
      abiEventMapper[topicMethod.method].callBack( item, decodedLog );
    } catch( e ) {
    }
  })

}

async function _logger( log, abiEventMapper ) {

  var optsTopics = [      
    {
        type: 'function',
        name: 'method',
        indexed: true
    },
  ]

  try{
    //TODO item.address << contract address 이므로 유효한 contract 인지 확인 할 것
    var topicMethod       =  QueryChain().abi.decodeLog( optsTopics, undefined, log.topics );
    var decodedLog        =  QueryChain().abi.decodeLog( abiEventMapper[topicMethod.method].inputs, log.data, log.topics );
    console.log( topicMethod.method );
    abiEventMapper[topicMethod.method].callBack( log, decodedLog );
  } catch( e ) {
    console.log( e );
  }
  
}

module.exports.txLogger     = _txLogger;
module.exports.Logger       = _logger;
