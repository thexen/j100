/*




*/
const Caver = require("caver-js");
const { AbiEncode } = require ( '../utils/abi.js' )

const { OpenWalletFromPrivateKey, OpenWalletFromKeystoreV3, OpenWalletFromMnemonic, OpenHDWallet } = require( '../wallet/import.js' );
const { DiscoveryFirstMiddleiRoute, DiscoveryRoutes, DiscoveryMiddleiRoutes } = require ( '../routing/swapHelpRouter.js' );
const { GetNetwork }                                      =  require ( './networks/active.js' );
const { SwapHelperExchange }                              =  require ( './klaytn/swapHelper.js' );
const { BalanceOf }                                       =  require ( './inquery/balance.js' );
const { InqueryExpectedAmount  }                          =  require ( './inquery/swapHelper.js' );
const { InqueryDailyStat }                                =  require ( './inquery/dailyStat.js' );
const { InqueryAssets }                                   =  require ( './inquery/assets.js' );
const { InqueryStakingRewardConst }                       =  require ( './inquery/lptStaking.js' );

BalanceOf( "0x21CB1A627380BAdAeF180e1346479d242aca90D3", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B" );
BalanceOf( "0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B" );

async function main01() {
  var middleRoute  = DiscoveryFirstMiddleiRoute( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                                    , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                                    , 5 );
  
  var expectedValue = await InqueryExpectedAmount( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                    , 1000000000 
                    , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                    , middleRoute );
  console.log( "expectedValue" + expectedValue );                                        
  
  const wallet          = await OpenWalletFromPrivateKey("0x69908c50c12b5e7aa84fe245a107431ea666ceb650b31a55c28e9bf2987d74c3");
  await SwapHelperExchange( wallet, "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
        , 1000000000
        , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
        , 19999601
        , middleRoute );

}
//main01();      

async function main02() {
  var miningConst = await InqueryStakingRewardConst( "0x0Ac1dE414c29e5295eFfBE99282aE11A36Df58a5" );
  //var stat        = await InqueryDailyStat( "0x9A3a88729913267DEC84c3aac09499BD816f8DA4", (Date.now()/1000).toFixed(0) ) ;
  //var asset       = await InqueryAssets( "0x9A3a88729913267DEC84c3aac09499BD816f8DA4" );
  //console.log( stat );
  //console.log( asset );
  console.log( miningConst );
}

main02();

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
    var expectedValue   = await InqueryExpectedAmount( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                          , 1000000000 
                          , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                          , middleRoute );
    console.log( "expectedValue" + expectedValue );                                        

}
//routerTest(); 

var year              = 86400 * 365;
let _invokedLastTime  = 1655017609 - year * 1;
let _startYears       = (( 1655017609 - year * 10 ) ).toFixed(0);

async function  mining( _invokedLastTime, holderWeight, holderTotalWeight ) {

  var amountPerSec      = 0.5;
  let current           = (Date.now()/1000).toFixed(0);
  let thisYear          = (current / year).toFixed(0) * year;
  let pastYears         = ( ( current - _invokedLastTime ) / year ).toFixed(0);

  let miningAmount = 0;
  if( pastYears > 0 ) {
    for( var i=0; i<=pastYears; i++ ) {
      var currentYear     = ( ( _invokedLastTime + ( year * i) ) / year ).toFixed(0) * year;
      var nextYear        = ( ( _invokedLastTime + ( year * ( i + 1 ) ) ) / year ).toFixed(0) * year;
      var halfLife        = ( ( currentYear - _startYears ) / ( 2 * year ) ).toFixed(0);      
      if( i == 0 ) {
        miningAmount      += nextYear - _invokedLastTime * ( amountPerSec / 2 ** halfLife );
        console.log( (i) + ">>" + ( nextYear - _invokedLastTime ) + " : " + ( halfLife )  );
      } else if( currentYear == thisYear ) {
        miningAmount      += current - thisYear * ( amountPerSec / 2 ** halfLife );
        console.log( (i) + ">>" + ( current - thisYear ) + " : " + ( halfLife )  );
      } else {
        miningAmount      += nextYear - currentYear * ( amountPerSec / 2 ** halfLife );
        console.log( (i) + ">>" + ( nextYear - currentYear ) + " : " + ( halfLife )  );
      }
    }

  } else {
    var halfLife    = ( ( _invokedLastTime  - start ) / (2 * year) ).toFixed(0);
    miningAmount    = ( current - _invokedLastTime ) * ( amountPerSec / 2 ** halfLife );
  }  

  miningAmount = (miningAmount * 15) / 100; //수수료 적용
  miningAmount = (miningAmount * holderWeight) / holderTotalWeight; //holder 가중치 적용
  console.log( miningAmount );

}

mining( _invokedLastTime );