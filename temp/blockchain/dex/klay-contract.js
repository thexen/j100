/*




*/

const { OpenWalletFromPrivateKey, OpenWalletFromKeystoreV3, OpenWalletFromMnemonic, OpenHDWallet } = require( '../wallet/import.js' );
const { DiscoveryFirstMiddleiRoute, DiscoveryRoutes, DiscoveryMiddleiRoutes } = require ( '../routing/swapHelpRouter.js' );
const { GetNetwork }                                            =  require ( './networks/active.js' );
const { GetContract }                                           =  require ( './contracts/contracts.js' );
const { SHExchange }                                            =  require ( './klaytn/swapHelper.js' );
const { CreateSwapPool }                                        =  require ( './klaytn/spFactory.js' );
const { InquerySHExpectedAmount }                               =  require ( './inquery/swapHelper.js' );
const { 
        InquerySPMDailyStat,
        InquerySPMPoolSize, 
        InquerySPMSwapPool, 
        InquerySPMSPagingSwapPool,
      }                                                         =  require ( './inquery/swapPoolManager.js' );       
const { InqueryTMTokenGrade, InqueryTMToken }                   =  require ( './inquery/tokenManager.js' );
const { InquerySPAssets, InquerySPPoolnfo, InquerySPToken }     =  require ( './inquery/swapPool.js' );
const { InqueryLSHStakingRewardConst }                          =  require ( './inquery/lptStaking.js' );
const { CalcMiningAmount }                                      =  require ( './utils/mining/calcMiningAmount.js' );
const { BalanceOf, Allowance }                                  =  require ( './inquery/erc20.js' );

async function main00() {
  var balance = await BalanceOf( "0x658a3a6065E16FE42D8a51CC00b0870e850909F5", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B" );
  console.log( "balance---> " + balance[0] );
}
//main00();

//console.log( BalanceOf( "0x21CB1A627380BAdAeF180e1346479d242aca90D3", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B" )[0]);
//BalanceOf( "0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B" );


//교환하기 예제1
async function main01() {
  var middleRoute  = DiscoveryFirstMiddleiRoute( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                                    , "0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e"
                                    , 5 );
  console.log( middleRoute );
  
  var expectedValue = await InquerySHExpectedAmount( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                    , 1000000000 
                    , "0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e"
                    , middleRoute );
  console.log( expectedValue['0'] );                                        
  
  const wallet          = await OpenWalletFromPrivateKey("0x69908c50c12b5e7aa84fe245a107431ea666ceb650b31a55c28e9bf2987d74c3");
  var   allowance       = await Allowance( "0x21CB1A627380BAdAeF180e1346479d242aca90D3", wallet.getAddressString(), GetContract("swapHelper") );
  
  var amount = 1000000000;
  if( allowance['0']  >= amount ) {
    await SHExchange( wallet, "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
          , amount
          , "0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e"
          , expectedValue['0']
          , middleRoute );
  } else {
    console.log( "required allowance" );
    console.log( allowance['0'] );
  }
}
//main01();    

//교환하기 예제2
async function main11() {
  var middleRoute  = DiscoveryFirstMiddleiRoute( "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                                    , "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                                    , 5 );
  
  var expectedValue = await InquerySHExpectedAmount( "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                    , 1000000000 
                    , "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                    , middleRoute );
  console.log(middleRoute)
  console.log( expectedValue );                                        
  
  const wallet          = await OpenWalletFromPrivateKey("0x69908c50c12b5e7aa84fe245a107431ea666ceb650b31a55c28e9bf2987d74c3");
  var   allowance       = await Allowance( "0x658a3a6065E16FE42D8a51CC00b0870e850909F5", wallet.getAddressString(), GetContract("swapHelper") );
  
  var amount = 1000000000;
  if( allowance >= amount ) {
    await SHExchange( wallet, "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
          , amount
          , "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
          , expectedValue
          , middleRoute );
  } else {
    console.log( "required allowance" );
  }

}
//main11();      

//통계 정보 구하기 예제
//swap pool 자산 구하기 예제
//LPT Staking Holder mining 보상 계산 constant 구하기 예제
async function main02() {
  //var stat        = await InquerySPMDailyStat( "0x6a72Ffb94a5E24529fa27107297CcdccF7C95E8B", (Date.now()/1000).toFixed(0) ) ;
  //var asset       = await InquerySPAssets( "0x9A3a88729913267DEC84c3aac09499BD816f8DA4" );
  //var poolInfo    = await InquerySPPoolnfo( "0x2BEa7c33B8636a761be888E55037AFd2ee0c43c5" );
  //var miningConst = await InqueryLSHStakingRewardConst( "0x6ee6bE58DBa446dDdb75B2d979cEd3c3d6196196", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B" );  
  //var token1      = await InquerySPToken( "0x9A3a88729913267DEC84c3aac09499BD816f8DA4", 1 );
  //var grade       = await InqueryTMTokenGrade( "0x21CB1A627380BAdAeF180e1346479d242aca90D3" );
  //var token2      = await InqueryTMToken( 1 );
  var poolSize     = await InquerySPMPoolSize();

  //console.log( stat );
  //console.log( asset );
  //console.log( miningConst );
  //console.log( poolInfo );
  //console.log( token1 );
  //console.log( grade );
  //console.log( token2 );
  console.log( poolSize['0'] );
}
//main02();

//mining 채굴량 계산하기 예제( StakingHolder s + mining fee )
async function main03() {
  var amount = CalcMiningAmount( 1655096040, 1655096064, 1655096134 );
  console.log( amount );
}
//main03();

//라우팅(경로) 구하기 예제
async function main04() {

    //중간 경로 구하기 
    var middleRoute       = DiscoveryFirstMiddleiRoute( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                          , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                          , 5 );
    console.log( middleRoute );                          
    
    //모든 경로의 swap pool 정보 구하기
    var routes            = DiscoveryRoutes( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                            , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                            , 5 );
    console.log( JSON.stringify( routes, null, 2 ) );        
        
    //모든 중간 경로 구하기
    var middleRoutes      = DiscoveryMiddleiRoutes( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                          , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                          , 5 );
    console.log( JSON.stringify( middleRoutes, null, 2 ) );       

    //교환시 받을 수 있는 token 수량 구하기
    var expectedValue   = await InquerySHExpectedAmount( "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                          , 1000000000 
                          , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                          , middleRoute );
    console.log( ">>>>>>>>>:" +  expectedValue[0] );                                        
    console.log( expectedValue );                                        

}
//main04(); 

//Swap Pool Lising
async function main05() {
  var obj = await InquerySPMSPagingSwapPool( 1, 4 );
  console.log( obj );
}
//main05();

//create swap pool
async function main06() {

  //var poolSize     = await InquerySPMPoolSize();
  //console.log( poolSize['0'] );

  const wallet          = await OpenWalletFromPrivateKey("0x69908c50c12b5e7aa84fe245a107431ea666ceb650b31a55c28e9bf2987d74c3");
  //var   allowance       = await Allowance( "0xfe8c5F82DD2D74e344f94a19Be0bf1BBb59DDFdb", wallet.getAddressString(), "0x125e64F6594Ff13479B0d9525B9dd2FF6098552c" );  
  //console.log( allowance );

  //CreateSwapPool( wallet, "0xfe8c5F82DD2D74e344f94a19Be0bf1BBb59DDFdb", "0x21CB1A627380BAdAeF180e1346479d242aca90D3", 10000 );
  
  var poolSize     = await InquerySPMPoolSize();
  console.log( poolSize['0'] );

  var obj = await InquerySPMSPagingSwapPool( poolSize['0'], 1 );
  console.log( obj[2][0]);

  var poolInfo    = await InquerySPPoolnfo( obj[2][0] );
  console.log( poolInfo );
}

main06();