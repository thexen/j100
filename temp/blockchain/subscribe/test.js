/*




*/
const Web3                            = require('web3')
const Caver                           = require("caver-js");
const { QueryChain }                  = require ( '../dex/networks/active.js' );

async function main() {

    //const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'))
    const web3ws = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161'))
    
    //contract address: 0x46dc3bfe838544f8b00b99bb9a4bab68c7f175a6
    //deploy topics: 0x60806040
    //-------------------------------------------------------------
    var options = {
        fromBlock: '10182088',
        toBlock: '10182088',
        address: '0x46dc3bfe838544f8b00b99bb9a4bab68c7f175a6', //<Contract Address
    };
    var subscription = web3ws.eth.subscribe('logs', options, function(error, result){
        if (!error){
            console.log( "-----Deploy-----" )
            console.log(result);
        }
    });

    //0x00000000000000000000000000000000000000000000003635c9adc5dea00000

    //-------------------------------------------------------------
    var encoding = web3ws.eth.abi.encodeEventSignature('Transfer(address,address,uint256)')
    //encoding => Transfer: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
    var options = {
        fromBlock: '10181294',
        toBlock: '10181294',
        address: '0x36ed71ba21f6a6d6423d54fd782d9b4448c28744',  //<Contract Address
        topics: [encoding]
    };
    var subscription = web3ws.eth.subscribe('logs', options, function(error, result){
        if (!error){
            console.log( "-----Transfer-----" )
            console.log(result);
        }
    });

    //-------------------------------------------------------------
    var txData = await web3ws.eth.getTransactionReceipt('0xa29b8acb29e1d2985e2cfaf4ccf28dea51c40ee07c218a70e138654ddd1e995e');
    console.log( "-----Receipt-----" )
    console.log( txData.logs )
    var dec = await web3ws.eth.abi.decodeParameter( 'uint256', txData.logs[0].data );
    console.log( dec )

}
//main();

//baobob
async function main2() {

    const web3ws = new Web3('wss://api.baobab.klaytn.net:8652')

    //-------------------------------------------------------------
    var options = {
        fromBlock: '93944331',
        toBlock: '93944519',
        address: '0xf8b1C0a378166E46a186c3eb3E35231C731B19B8', //<Contract Address
    };
  
    var opts = [
        {
            type: 'string',
            name: 'abi',
            indexed: true
        },{
            type: 'address',
            name: 'caller',
            indexed: true
        },{
            type: 'address',
            name: 'from',
            indexed: true
        },{
            type: 'address',
            name: 'to',
            indexed: true
        },{
            type: 'uint256',
            name: 'amount',
        },{
            type: 'uint256',
            name: 'slppage',
        },{
            type: 'uint256',
            name: 'receipt',
        }
    ]

    
    var subscription = web3ws.eth.subscribe('logs', options, function(error, result){
        if (!error){
            //console.log(result);
            //console.log(result.topics);
            var obj =  QueryChain().abi.decodeLog( opts, result.data, result.topics );
            //console.log(result);
            console.log(obj);
        } else {
            console.log( "aa")
            subscription.unsubscribe( (error, success) => {
                if(error) {
                  console.log('Failed to disconnect from Thundercore mainnet!');
                }
                if(success) {
                  console.log('disconnected');
                }
              });

        }
    });
    

    
}

main2()
