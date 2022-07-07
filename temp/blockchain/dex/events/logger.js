/*




*/
const Web3ABI                                    = require('web3-eth-abi');

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
      var topicMethod       =  Web3ABI.decodeLog( optsTopics, undefined, item.topics );
      var decodedLog        =  Web3ABI.decodeLog( abiEventMapper[topicMethod.method].inputs, item.data, item.topics );
      abiEventMapper[topicMethod.method].callBack( item, decodedLog );
    } catch( e ) {
    }
  })

}

async function _logger( log, abiEventMapper, mongoClient ) {

  var optsTopics = [      
    {
        type: 'function',
        name: 'method',
        indexed: true
    },
  ]

  try{

    //TODO item.address << contract address 이므로 유효한 contract 인지 확인 할 것
    var topicMethod       =  Web3ABI.decodeLog( optsTopics, undefined, log.topics );
    if( abiEventMapper[topicMethod.method] != undefined ) {
      var decodedLog        =  Web3ABI.decodeLog( abiEventMapper[topicMethod.method].inputs, log.data, log.topics );
      await abiEventMapper[topicMethod.method].callBack( log, decodedLog, mongoClient );
    }
  } catch( e ) {
    console.log( e );
  }
  
}

module.exports.txLogger     = _txLogger;
module.exports.Logger       = _logger;
