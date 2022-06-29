/*




*/
const { QueryChain, QueryWS  }                                  =  require ( '../networks/active.js' );
const { abiEventMapper }                                        =  require ( './mappingBuilder' );
const { Logger }                                                =  require ( './logger' );

/*
  SwapPoolFactory
  TokenManager
  DAO
  Voting
  SwapHelper
  Team Vault
  GToken
*/

async function subscribe( fromblockNumber, toblockNumber, contract ) {

  //-------------------------------------------------------------
  
  var filters = {
      fromBlock:  fromblockNumber,
      toBlock:    toblockNumber,
      address:    contract
  };

  try{
    var subscription = QueryWS().subscribe('logs', filters, function(error, result) {
      console.log("in.....");
        if (error) {
          subscription.unsubscribe( (error, success) => {
              if(error) {
                console.log('Failed to disconnect from Thundercore mainnet!');
              }
              if(success) {
                console.log('disconnected');
              }
            });
        } else {
          Logger( result, abiEventMapper );
        }
      })

  } catch(e) {
    console.log( e );
  }

}

subscribe( 94043280, 94043285, ['0x6208e0c4F54D5a86F7B2d37E2e861025191284a6'] );