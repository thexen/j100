/*




*/
// const { QueryChain, QueryWS  }                                  =  require ( '../networks/active.js' );
const { abiEventMapper }                                        =  require ( './mappingBuilder' );
const { Logger }                                                =  require ( './logger' );
const { 
  GetBaoBabNetwork, 
  GetBaoBabWebSocket 
}                                                               =  require ( '../networks/klayBaobab.js' );
const Caver                                                     =  require ( 'caver-js' );
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
    const caver = new Caver( GetBaoBabNetwork() );
    const result = await caver.rpc.klay.getLogs(filters);
    console.log(result.length);

    result.forEach( function ( item ) {
      Logger(item, abiEventMapper);
    });
  } catch(e) {
    console.log( e );
  }

}

/*
subscribe( 95153503, 95153504, [ '0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D'
                            , '0x632CFFf2560603D46EeD6D1cbEFF3fc2Fa8aACc8'
                            , '0x8E3E9359c6411928D2Ce4cE9e3A5C535632f7458'
                            , '0x0c59304143A49a93cf41e122eBaACC3be413Eb1a' ] );
*/
/*
subscribe( 95153514, 95153614, [ '0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D'
                            , '0x632CFFf2560603D46EeD6D1cbEFF3fc2Fa8aACc8'
                            , '0x8E3E9359c6411928D2Ce4cE9e3A5C535632f7458'
                            , '0x0c59304143A49a93cf41e122eBaACC3be413Eb1a' ] );
*/
subscribe( 95153614, 95154614, [ '0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D'
                            , '0x632CFFf2560603D46EeD6D1cbEFF3fc2Fa8aACc8'
                            , '0x8E3E9359c6411928D2Ce4cE9e3A5C535632f7458'
                            , '0x0c59304143A49a93cf41e122eBaACC3be413Eb1a'
                            , '0x7e545d567ABD995242a2415e9522e9d7CC986E60'] );                            