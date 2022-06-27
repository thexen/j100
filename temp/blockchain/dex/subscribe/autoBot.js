/*




*/
const { QueryChain, QueryWS  }                                  =  require ( '../networks/active.js' );
const { builder }                                               =  require ( './inputBuilder' );


/*
  SwapPoolFactory
  TokenManager
  DAO
  Voting
  SwapHelper
  Team Vault
  GToken
*/

async function subscribe( fromblockNumber, toblockNumber, contract, abiBuilder ) {

  //-------------------------------------------------------------
  
  var filters = {
      fromBlock:  fromblockNumber,
      toBlock:    toblockNumber,
      address:    contract
  };
  
  /*
  var filters = {
    fromBlock: '94043280',
    //toBlock: '94043285',
    address: ['0x6208e0c4F54D5a86F7B2d37E2e861025191284a6'],// OR 연산 처리 됨
    //topics: [ data ] //< AND 연산 처리 됨
  };
  */

  /*
  var filters = {
    fromBlock: '94455208',
    toBlock: '94455209',
    //address: ['0x6208e0c4F54D5a86F7B2d37E2e861025191284a6'],// OR 연산 처리 됨
    topics: [ ['0x804c9b842b2748a22bb64b345453a3de7ca54a6ca45ce00d415894979e22897a', '0x526824944047da5b81071fb6349412005c5da81380b336103fbe5dd34556c776'] ] //Or 조건 처리
  };
  */


  var optsTopics = [      
    {
        type: 'function',
        name: 'method',
        indexed: true
    },
  ]

  let objs = abiBuilder();

  try{

    var subscription = QueryWS().subscribe('logs', filters, function(error, result) {
        if (error) {
          subscription.unsubscribe( (error, success) => {
              if(error) {
                console.log('Failed to disconnect from Thundercore mainnet!');
              }
              if(success) {
                console.log('disconnected');
              }
            });
        }
      }).on("data", function(log) {
        var topicMethod       =  QueryChain().abi.decodeLog( optsTopics, undefined, log.topics );
        var decodedLog        =  QueryChain().abi.decodeLog( objs[topicMethod.method].inputs, log.data, log.topics );
        objs[topicMethod.method].callBack( log, decodedLog );
    })

  } catch(e) {
    console.log( e );
  }


}

subscribe( 94043280, 94043285, ['0x6208e0c4F54D5a86F7B2d37E2e861025191284a6'], builder );