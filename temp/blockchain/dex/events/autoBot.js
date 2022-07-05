/*




*/
const cron                                                      = require ( 'node-cron' );
const { rpcRequest }                                            = require( '../utils/rpcRequest/rpcRequest.js' );
const { encodeParams }                                          = require( '../utils/encoder/encoder.js' );
const { Logger }                                                = require ( './logger' );
const { 
  GetRPC, 
  GetWebSocket 
}                                                               = require ( '../networks/provider.js' );

const {abiEventBuild}                                           = require ( './utils/abiBuilder.js' );
const abiEventMappers                                           = require ( './mapper/abiEventMappers.js' );
const abiEventMapper  = abiEventBuild( undefined, abiEventMappers.abiEventMapper_info );


/*
  SwapPoolFactory
  TokenManager
  DAO
  Voting
  SwapHelper
  Team Vault
  GToken
*/

async function subscribe( id, fromblockNumber, toblockNumber, contract, topics ) {

  //-------------------------------------------------------------
  var filters = {
      fromBlock:  fromblockNumber,
      toBlock:    toblockNumber,
      address:    contract,
      topics:     topics,
  };

  try{
    // get logs
    var res = await rpcRequest( GetRPC(), 'klay_getLogs', filters, id );
    res.result.forEach( function ( item ) {
      Logger(item, abiEventMapper);
    });
  } catch(e) {
    console.log( e );
  }
}



subscribe( 1, 95425355, 95425355//95335966, 95335966
                          , [ 
                                '0x896aCc84F8215b43a4AEA1FA2BecFd2cea589DA1'    //Objects
                              //, '0x6a8Ba3365271508171F38de33bD4087eBE55ce9E'    //TokenManager
                              //, '0x3832a5C445c6fb5793D5287D720cc5AF88C63cD9'    //SwapPoolFactory                            
                              //, '0x38799a6c39B77cA13562B77A222F488f05EE924d'    //SwapHelper
                              //, '0x745699B50cE70AfC2DD80aC3525271F6fAdFAeff'    //DAO
                              //, '0xaC062cC76FE249B0E0B6a942486FB0FC919c30D7'    //TeamVault
                              , '0x69b81B5F03E6Db66e4D8a4Fc9126542660157D12'    //GToken
                            ]
                          , undefined);

/*
const addressObjects = encodeParams( ['address'], ['0x896acc84f8215b43a4aea1fa2becfd2cea589da1']);
subscribe( 1, 95427037, 95427037//95335966, 95335966
                          , undefined
                          , [ 
                              [],
                              addressObjects
                          ] );
*/

//subscribe( 1, 95153614, 95154614, [ '0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D'
//                            , '0x632CFFf2560603D46EeD6D1cbEFF3fc2Fa8aACc8'
//                            , '0x8E3E9359c6411928D2Ce4cE9e3A5C535632f7458'
//                            , '0x0c59304143A49a93cf41e122eBaACC3be413Eb1a'
//                            , '0x7e545d567ABD995242a2415e9522e9d7CC986E60'] );

//               ┌────────────── second (optional)
//               │ ┌──────────── minute
//               │ │ ┌────────── hour
//               │ │ │ ┌──────── day of month
//               │ │ │ │ ┌────── month
//               │ │ │ │ │ ┌──── day of week
//               │ │ │ │ │ │
//               │ │ │ │ │ │
//               * * * * * *
//cron.schedule('*/5 * * * * *', async function() {
//  // get block number
//  const blockNumber = await caver.klay.getBlockNumber();
//  console.log(blockNumber);
//
//  // 5초 마다 이전 10개의 블록에 대한 log를 가져와서 update한다.
//  const fromBlock = Number(blockNumber) - 10;
//  const toBlock = blockNumber;
//  console.log(fromBlock);
//  subscribe( 1, fromBlock, toBlock, ['0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D',
//                                  '0x632CFFf2560603D46EeD6D1cbEFF3fc2Fa8aACc8',
//                                  '0x8E3E9359c6411928D2Ce4cE9e3A5C535632f7458',
//                                  '0x0c59304143A49a93cf41e122eBaACC3be413Eb1a',
//                                  '0x7e545d567ABD995242a2415e9522e9d7CC986E60']);
//});


/*
// log from `startBlock` to `endBlock`
// block range
const startBlock = 95153503;
const endBlock = 95154614;
let currentBlock = startBlock;
*/
//cron.schedule('*/5 * * * * *', async function() {
/*
  // check end block
  if (currentBlock >= endBlock){
    // stop
    return;
  }

  // get block number
  const blockNumber = await caver.klay.getBlockNumber();
  console.log(blockNumber);

  // 5초 마다 10개의 블록에 대한 log를 가져와서 update한다.
  const fromBlock = Number(currentBlock);
  const toBlock = fromBlock + 10;
  console.log(toBlock);

  // 현재 block number 보다 작을 때만 실행
  if ( blockNumber > toBlock ) {
    subscribe( fromBlock, toBlock, ['0xC2FDEa5647C0bf3F19a049Fb95f4A58BfdFf044D',
                                    '0x632CFFf2560603D46EeD6D1cbEFF3fc2Fa8aACc8',
                                    '0x8E3E9359c6411928D2Ce4cE9e3A5C535632f7458',
                                    '0x0c59304143A49a93cf41e122eBaACC3be413Eb1a',
                                    '0x7e545d567ABD995242a2415e9522e9d7CC986E60']);

    // set next block
    currentBlock = toBlock;
  }
});
*/

