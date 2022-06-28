/*




*/
const { QueryChain, QueryWS  }                                  =  require ( '../networks/active.js' );
const { abiEventMapper }                                        =  require ( './mappingBuilder' );


/*
  SwapPoolFactory
  TokenManager
  DAO
  Voting
  SwapHelper
  Team Vault
  GToken
*/

async function subscribe( fromblockNumber, toblockNumber, contract, mapper ) {

  //-------------------------------------------------------------
  
  var filters = {
      fromBlock:  fromblockNumber,
      toBlock:    toblockNumber,
      address:    contract
  };

  var optsTopics = [      
    {
        type: 'function',
        name: 'method',
        indexed: true
    },
  ]

  let objs = mapper;

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

subscribe( 94043280, 94043285, ['0x6208e0c4F54D5a86F7B2d37E2e861025191284a6'], abiEventMapper );