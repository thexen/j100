/*




*/
const Caver = require("caver-js");
const { OpenWalletFromPrivateKey, OpenWalletFromKeystoreV3, OpenWalletFromMnemonic, OpenHDWallet } = require( '../wallet/import.js' );
const { KlaySendTransaction } = require( "../wallet/sendtx.js")
const { AbiEncode } = require ( '../utils/abi.js' )
const { DiscoveryFirstMiddleiRoute, DiscoveryRoutes, DiscoveryMiddleiRoutes } = require ( '../routing/swapHelpRouter.js' )

const netWork         = "https://kaikas.baobab.klaytn.net:8651";
const swapHolder      = "0x659aCd70df7e021302aA2907FE1Dbb7eE50DBc38";
const swapPoolManager = "0x7F29d1A9B3c0D9aa386dd4d3470ED125cABBf2F4";

async function klayExpectedReceipt( from, amount, to, route ) {

  const caver = new Caver(netWork);

  try{
    var data = await AbiEncode( "inqueryExpectedReceipt(address,uint256,address,address[])"
                , from
                , amount
                , to
                , route );
    const val = await caver.klay.call({
      to: swapHolder, 
      data: data,});
    var dec = caver.klay.abi.decodeParameter( 'uint256', val );
    return dec;
  } catch( e ) {
    console.log(e)
  } finally {
  }

}

async function klayBalanceOf( token, sender ) {

  const caver = new Caver(netWork);

  try{
    var data = await AbiEncode( "balanceOf(address)", sender );
    const val = await caver.klay.call({
      to: token, 
      data: data,
    });
    var dec = caver.klay.abi.decodeParameter( 'uint256', val );
    console.log( token + " - "  + dec )
  } catch( e ) {
    console.log(e)
  } finally {
  }

}

async function exchange(from, amount, to, minimum, route ) {

  //Open Wallet
  const wallet          = await OpenWalletFromPrivateKey("0x69908c50c12b5e7aa84fe245a107431ea666ceb650b31a55c28e9bf2987d74c3");

  ///Encoding ABI 
  var data = await AbiEncode( "exchange(address,uint256,address,uint256,address[])"
            , from
            , amount
            , to
            , minimum
            , route );

  var receipt = await KlaySendTransaction( {
    provider: {
      url: netWork,
    },
    wallet: wallet,
    rawTransaction: {
      to:     swapHolder,
      value:  0,
      gas:    21000000,
      input:  data,
    }
  })
      
}

async function inqueryAssets( swapPool ) {

  try{
      //TODO
      const caver = new Caver(netWork);
      var data = caver.klay.abi.encodeFunctionSignature( "inqueryAssets()" );
      const val = await caver.klay.call({
        to: swapPool.pool.contract, 
        data: data,
      });
      var obj = caver.klay.abi.decodeParameters( ['uint256','uint256'], val );

      return [ obj["0"], obj["1"] ];
  } catch( e ) {
    console.log(e)
  } finally {
  }

}

//inqueryAssets( "0x9A3a88729913267DEC84c3aac09499BD816f8DA4" );

async function routerTest() {

    //처음 중간 경로 구하기 
    var middleRoute    = DiscoveryFirstMiddleiRoute( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                          , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                          , 5 );
    console.log( middleRoute );                          
    
    //모든 경로의 swap pool 정보 구하기
    var routes    = DiscoveryRoutes( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                          , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                          , 5 );
    console.log( JSON.stringify( routes, null, 2 ) );        
        
    //모든 중간 경로 구하기
    var middleRoutes    = DiscoveryMiddleiRoutes( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                          , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                          , 5 );
    console.log( JSON.stringify( middleRoutes, null, 2 ) );       

    //교환시 받을 수 있는 token 수량 구하기
    var expectedValue   = await klayExpectedReceipt( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                          , 1000000000 
                          , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                          , middleRoute );
    console.log( "expectedValue" + expectedValue );                                        

}
routerTest(); 


//klayBalanceOf( "0x21CB1A627380BAdAeF180e1346479d242aca90D3", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B" );
//klayBalanceOf( "0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B" );

async function main() {
  var middleRoute  = DiscoveryFirstMiddleiRoute( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                                    , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                                    , 5 );
  
  var expectedValue = await klayExpectedReceipt( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                    , 1000000000 
                    , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                    , middleRoute );
  console.log( "expectedValue" + expectedValue );                                        
  
  await exchange( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
        , 1000000000
        , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
        , 19999601
        , middleRoute );

}
//main();      


async function dailyStat( swapPool, date ) {
  const caver = new Caver(netWork);
  try{
    var data = await AbiEncode( "inqueryDailyStat(address,uint256,uint256)"
                      , swapPool
                      , date
                      , 1 );
    const val = await caver.klay.call({
      to: swapPoolManager, 
      data: data,
    });

    //모르겠음, index(1부터), 시간 / 86400, first token 거래량, second token 거래량, first token 수수료 수익, second token 수수료 수익
    var decoded = caver.klay.abi.decodeParameters(['uint256','uint256','uint256','uint256','uint256','uint256','uint256'], val );    

    console.log( JSON.stringify( decoded, null, 2 ) );

  } catch( e ) {
    console.log(e)
  } finally {
  }
}
//dailyStat( "0x9A3a88729913267DEC84c3aac09499BD816f8DA4", (Date.now()/1000).toFixed(0) );

