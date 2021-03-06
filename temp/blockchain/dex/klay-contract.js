/*




*/

const { AbiEncode }                                             = require ( '../utils/abi.js' );
const { OpenWalletFromPrivateKey, OpenWalletFromKeystoreV3, OpenWalletFromMnemonic, OpenHDWallet } = require( '../wallet/import.js' );
const { LoadPairs,
        LoadTokens,
        DiscoveryFirstMiddleiRoute,
        DiscoveryRoutes,
        DiscoveryMiddleiRoutes,
      }                                                         = require ( '../routing/swapHelpRouter.js' );
const { QueryChain, QueryWS, GetWeb3 }                          =  require ( './networks/active.js' );
const { GetContract }                                           =  require ( './contracts/contracts.js' );
const { SHExchange, Test }                                      =  require ( './klaytn/swapHelper.js' );
const { CreateSwapPool }                                        =  require ( './klaytn/spFactory.js' );
const { InquerySHExpectedAmount }                               =  require ( './inquery/swapHelper.js' );
const { 
        InquerySPMDailyStat,
        InquerySPMPoolSize, 
        InquerySPMSwapPool, 
        InquerySPMSPagingSwapPool,
      }                                                         =  require ( './inquery/swapPoolManager.js' );       
const { 
        InqueryTMTokenGrade, 
        InqueryTMToken,
        InqueryTMTokenCount 
      }                                                         =  require ( './inquery/tokenManager.js' );
const { InquerySPAssets, InquerySPPoolnfo, InquerySPToken }     =  require ( './inquery/swapPool.js' );
const { InqueryLSHStakingRewardConst }                          =  require ( './inquery/lptStaking.js' );
const { CalcMiningAmount }                                      =  require ( './utils/mining/calcMiningAmount.js' );
const { BalanceOf, Symbol, Allowance }                          =  require ( './inquery/erc20.js' );
const { UpsertToMongo, QueryFromMongo }                         =  require ( '../../common/chains/mongo/call.js' );

const { NewMongoClient  }                                       =  require ( '../../common/chains/mongo/call.js' );




async function main00() {
  var balance = await BalanceOf( "0x658a3a6065E16FE42D8a51CC00b0870e850909F5", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B" );
  console.log( "balance---> " + balance[0] );
}
main00();

//console.log( BalanceOf( "0x21CB1A627380BAdAeF180e1346479d242aca90D3", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B" )[0]);
//BalanceOf( "0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e", "0xFf8EF2b0054Edf1A722186CE62BBE4323951e99B" );


//???????????? ??????1
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
    var tx = await SHExchange( wallet, "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
          , amount
          , "0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e"
          , expectedValue['0']
          , middleRoute );
    console.log( tx );
  } else {
    console.log( "required allowance" );
    console.log( allowance['0'] );
  }
}
//main01();    

//???????????? ??????2
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

//?????? ?????? ????????? ??????
//swap pool ?????? ????????? ??????
//LPT Staking Holder mining ?????? ?????? constant ????????? ??????
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

//mining ????????? ???????????? ??????( StakingHolder s + mining fee )
async function main03() {
  var amount = CalcMiningAmount( 1655096040, 1655096064, 1655096134 );
  console.log( amount );
}
//main03();

//?????????(??????) ????????? ??????
async function main04() {

    // set swap pool info
    var pairs = await LoadPairs();

    // set token info
    var tokens = await LoadTokens(5);

    //?????? ?????? ????????? 
    var middleRoute       = DiscoveryFirstMiddleiRoute( pairs, tokens, "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                          , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                          , 5 );
    console.log( middleRoute );                          
    
    //?????? ????????? swap pool ?????? ?????????
    var routes            = DiscoveryRoutes( pairs, tokens, "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                            , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                            , 5 );
    console.log( JSON.stringify( routes, null, 2 ) );        
        
    //?????? ?????? ?????? ?????????
    var middleRoutes      = DiscoveryMiddleiRoutes( pairs, tokens, "0x21CB1A627380BAdAeF180e1346479d242aca90D3"
                          , "0x658a3a6065E16FE42D8a51CC00b0870e850909F5"
                          , 5 );
    console.log( JSON.stringify( middleRoutes, null, 2 ) );       

    //????????? ?????? ??? ?????? token ?????? ?????????
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

  let mongoClient = await NewMongoClient();
  //var poolSize     = await InquerySPMPoolSize();
  //console.log( poolSize['0'] );

  const wallet          = await OpenWalletFromPrivateKey("0x69908c50c12b5e7aa84fe245a107431ea666ceb650b31a55c28e9bf2987d74c3");
  //var   allowance       = await Allowance( "0xfe8c5F82DD2D74e344f94a19Be0bf1BBb59DDFdb", wallet.getAddressString(), "0x125e64F6594Ff13479B0d9525B9dd2FF6098552c" );  
  //console.log( allowance );

  //CreateSwapPool( wallet, "0xfe8c5F82DD2D74e344f94a19Be0bf1BBb59DDFdb", "0x21CB1A627380BAdAeF180e1346479d242aca90D3", 10000 );
  
  var poolSize     = await InquerySPMPoolSize();
  console.log( poolSize['0'] );

  var obj         = await InquerySPMSPagingSwapPool( poolSize['0'], 1 );
  console.log(obj  )
  var poolInfo    = await InquerySPPoolnfo( obj[2][0] );
  var query1      = {
    findone: { 
      "_source.contract": poolInfo[0]
    }
  }
  var query2  = {
    findone: { 
      "_source.contract": poolInfo[3]
    }
  }    
  console.log( query1 );
  var res1      = await QueryFromMongo( mongoClient, "tokens", query1 );
  console.log( res1 );
  var res2      = await QueryFromMongo( mongoClient, "tokens", query2 );
  console.log( res2 );

}
//main06();

//sync swap pool to mongoDB
async function main07() {
  
  var poolSize    = await InquerySPMPoolSize();
  var obj         = await InquerySPMSPagingSwapPool( 1, poolSize[0] );    //Number(poolSize[0])
  for( var i=0; i<Number(poolSize[0]); i++ ){

    var poolInfo    = await InquerySPPoolnfo( obj[2][0 + (i*3)] );

    //onsole.log( JSON.stringify( swapPool, null, 2 ) );
    //console.log( obj[2][0 + (i*3)] );
    //UpsertToMongo( 'swappools', i+1, swapPool );
    var query1     = {
      findone: { 
        "_source.contract": poolInfo[0]
      }
    }
    var query2  = {
      findone: { 
        "_source.contract": poolInfo[3]
      }
    }    
    var res1      = await QueryFromMongo( "tokens", query1 );
    var res2      = await QueryFromMongo( "tokens", query2 );

    var firstToken = {
        contract:       poolInfo[0],
        symbol:         res1.symbol,
        icon:           res1.icon,
    };

    var secodToken = {
        contract:       poolInfo[3],
        symbol:         res2.symbol,
        icon:           res2.icon,
    };

    var assets = {
      first:          poolInfo[1],
      second:         poolInfo[4],
      totalSupply:    poolInfo[9], 
    };

    //console.log( poolInfo )     
    invokeSwapPool( i + 1, firstToken, secodToken, obj[2][0 + (i*3)], obj[2][1 + (i*3)], obj[2][2 + (i*3)],  poolInfo[8], assets, {number: 0,tx: 0,} ); 
  }
 
}
//main07()

//regist token
async function main08() {
    var res =  await InqueryTMTokenCount();
    for( var i = 1; i<= Number(res[0]); i++ ){
      var token   = await InqueryTMToken( i );
      console.log(  token );
      
      var symbol  = undefined;
      var grade   = undefined;

      if( token[0] == '0x0000000000000000000000000000000000000000' ) {
        symbol  = 'klay';        
      } else  {
        symbol  = await Symbol( token[0] );
        symbol  = symbol[0];
      }
      grade   = await InqueryTMTokenGrade( token[0] );

      /*
      let tokenInfo = {
        contract: token[0],
        symbol:  symbol,
        icon: 'http://',
        grade: Number(grade[0]),
      }
      
      UpsertToMongo( 'tokens', i, tokenInfo );
      */
    invokeToken( i, token[0], symbol, 'http://', Number(grade[0]) )
  }

}
//main08();

function ??getRandomInt(min,??max)??{??//min??~??max??????????????????????????????????????????????
  return??Math.floor(Math.random()??*??(max??-??min))??+??min;
}

async function main09() {

  var rand1 = getRandomInt( 1, 4 );
  var rand2 = undefined;
  for(;;){
    rand2 = getRandomInt( 1, 4 );
    if( rand1 != rand2 )
      break
  }
  console.log( rand1 + " : " + rand2 );

  var query1  = {
    findone: { 
      "_id": rand1
    }
  }
  var query2  = {
    findone: { 
      "_id": rand2
    }
  } 

  var res1      = await QueryFromMongo( "tokens", query1 );
  var res2      = await QueryFromMongo( "tokens", query2 );

  console.log( res1.contract );     
  console.log( res2.contract );     

 //?????? ?????? ????????? 
  var middleRoute       = DiscoveryFirstMiddleiRoute( res1.contract
    , res2.contract
    , 5 );
  console.log( middleRoute );                          

  var query3  = {
    find: {}
  } 

  var res3      = await QueryFromMongo( "swappools", query3 );

  console.log( JSON.stringify(res3,null,2) );     
  console.log( res3[0]._source.tokens.first.contract );     


/*
  //????????? ?????? ??? ?????? token ?????? ?????????
  var expectedValue   = await InquerySHExpectedAmount( res1.contract
                        , 1000000000 
                        ,res2.contract
                        , middleRoute );
  console.log( ">>>>>>>>>:" +  expectedValue[0] );                                        
  console.log( expectedValue );   
  */

 
}
//main09();

//baobob

async function main10() {
  
  //-------------------------------------------------------------
  var options = {
      fromBlock: '94043280',
      toBlock: '94043281',
      address: '0x6208e0c4F54D5a86F7B2d37E2e861025191284a6'//
  };
//0x6208e0c4F54D5a86F7B2d37E2e861025191284a6
  //-------------------------------------------------
  //topics[0]
  var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
  console.log( data )
  //-------------------------------------------------

  var opts = [
      {
          type: 'string',
          name: 'abi',
          indexed: true
      },{
          type: 'address',
          name: 'firstToken',
      },{
          type: 'address',
          name: 'secondToken',
      },{
          type: 'address',
          name: 'sp',
      },{
          type: 'address',
          name: 'holder',
      },{
          type: 'address',
          name: 'lpt',
      },{
          type: 'uint256',
          name: 'fee',
      }
  ]

  
  var subscription = QueryWS().subscribe('logs', options, function(error, result){
      if (!error){
          //console.log(result);
          //console.log(result.topics);
          var obj =  QueryChain().abi.decodeLog( opts, result.data, result.topics );
          console.log(obj);
      }
  });
}
//main10()

const { abiEventMapper }                                    =  require ( './events/mappingBuilder' );
const { txLogger }                                          =  require ( './events/logger' );
async function main11() {

  /*
  var  data = QueryChain().abi.encodeEventSignature( "OwnerSet(address,address,uint256)" );
  console.log( data );
  var data = QueryChain().abi.decodeParameters(['uint256'], '0x0000000000000000000000000000000000000000000000000000000000000002');
  console.log( data[0] );
  //'0x7da4606c33938e8c15b5228e4f7be78c8080d22411bf1df3a638bdc17715c66e',
  */
  //Tx
  //0x5472f367b98733699ec66aaae745733f25aded002c2606c49558c84371601423

  QueryChain().getTransactionReceipt( '0x18cd4316f325321f6e42f2274d3a5cb0bad429b226c67b222a2659c520d8d261', function(err,tx) {
    //txLogger( tx, abiEventMapper );
  });

  //0xA59F83Fa82CeF4086D762259D589deAA3584fFFd
  //0xA59F83Fa82CeF4086D762259D589deAA3584fFFd

/*
  const wallet          = await OpenWalletFromPrivateKey("0x69908c50c12b5e7aa84fe245a107431ea666ceb650b31a55c28e9bf2987d74c3");
  var tx = await Test( wallet, wallet.getAddressString() );
  console.log( tx );
  console.log( tx.logs[0].topics );
  txLogger( tx, abiEventMapper );
*/

}
//main11();


console.log( 3000000 / 1000000000 ); //0.3