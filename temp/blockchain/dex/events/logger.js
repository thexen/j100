/*




*/

const { 
  GetRPC, 
}                                                = require ( '../networks/provider.js' );
const Web3                                       = require('web3');
const web3                                       = new Web3( new Web3.providers.HttpProvider( GetRPC() ) );

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
      var topicMethod       =  web3.eth.abi.decodeLog( optsTopics, undefined, item.topics );
      var decodedLog        =  web3.eth.abi.decodeLog( abiEventMapper[topicMethod.method].inputs, item.data, item.topics );
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
    var topicMethod       =  web3.eth.abi.decodeLog( optsTopics, undefined, log.topics );
    var decodedLog        =  web3.eth.abi.decodeLog( abiEventMapper[topicMethod.method].inputs, log.data, log.topics );
    console.log( topicMethod.method );
    console.log(log.topics)
    abiEventMapper[topicMethod.method].callBack( log, decodedLog );
  } catch( e ) {
    console.log( e );
  }
  
}

module.exports.txLogger     = _txLogger;
module.exports.Logger       = _logger;
