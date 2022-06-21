/*




*/
const { QueryChain, QueryWS, GetWeb3 }                          =  require ( '../networks/active.js' );

/*
  SwapPoolFactory
  TokenManager
  DAO
  Voting
  SwapHelper
  Team Vault
  GToken
*/

function _compile( abi ) {
  if( abi.type == 'event' ) {
    var func = abi.name + '(';
    var paramCnt = 0;
    for(var i=0; i<abi.inputs.length; i++ ){
      if( abi.inputs[i].type != 'function' ) {
        if( paramCnt > 0 )
          func += ',';
        paramCnt ++;
        func += abi.inputs[i].type;
      }
    }
    func += ')';
    return func;
  }
}

function _build() {

  let objInputs = {};

  //-----------------------------------------------------------------------------------
  //SwapPoolFactory

  //CreateSwapPool
  var abi = {
        type: 'event',
        name: 'CreateSwapPool',
        inputs: [
          {
              type: 'function',
              name: 'method',
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
      }
  //var data = GetWeb3().utils.keccak256( "CreateSwapPool(address,address,address,address,address,uint256)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )
  objInputs[ data ] = abi.inputs;
  
  //-----------------------------------------------------------------------------------
  //TokenManager

  //SetToken
  var abi = {
        type: 'event',
        name: 'SetToken',
        inputs: [
          {
              type: 'function',
              name: 'method',
              indexed: true
          },{
              type: 'address',
              name: 'token',
          },{
              type: 'uint256',
              name: 'expireDate',
          },{
              type: 'uint8',
              name: 'weight',
          }
        ]
      } 
  //var data = GetWeb3().utils.keccak256( "SetToken(address,uint256,uint8)" );        
  var data = GetWeb3().utils.keccak256( _compile(abi) )
  objInputs[ data ] = abi.inputs;
  
  //-----------------------------------------------------------------------------------
  //DAO

  //Proposal
  var abi = {
        type: 'event',
        name: 'Proposal',    
        inputs: [
          {
              type: 'function',
              name: 'method',
              indexed: true
          },{
              type: 'address',
              name: 'sender',
          },{
              type: 'uint256',
              name: 'agendaId',
          },{
              type: 'bytes',
              name: 'callData',
          },{
              type: 'uint256',
              name: 'deadline',
          }
        ]
      }
  //var data = GetWeb3().utils.keccak256( "Proposal(address,uint256,bytes,uint256)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;

  //Invoke
  var abi = {
        type: 'event',
        name: 'Invoke',       
        inputs: [
          {
              type: 'function',
              name: 'method',
              indexed: true
          },{
              type: 'bytes',
              name: 'callData',
          }
        ]
      }
  //var data = GetWeb3().utils.keccak256( "Invoke(bytes)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;

  //-----------------------------------------------------------------------------------
  //SwapHelper

  //Exchange
  var abi = { 
        type: 'event',
        name: 'Exchange',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'sender',
        },{
            type: 'address',
            name: 'from',
        },{
            type: 'uint256',
            name: 'fromAmount',
        },{
            type: 'address',
            name: 'to',
        },{
            type: 'uint256',
            name: 'minimumReceipt',
        },{
            type: 'uint256',
            name: 'receiptAmount',
        }
      ]
  }
  //var data = GetWeb3().utils.keccak256( "Exchange(address,address,uint256,address,uint256,uint256)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;

  //-----------------------------------------------------------------------------------
  //TeamVault

  //AddMember
  var abi = {
        type: 'event',
        name: 'AddMember',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'newMember',
        }
      ]
    }
  //var data =  GetWeb3().utils.keccak256( "AddMember(address)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;

  //RemoveMember
  var abi = { 
        type: 'event',
        name: 'RemoveMember',      
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'member',
        }
      ]
    }
  //var data =  GetWeb3().utils.keccak256( "RemoveMember(address)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;

  //Proposal
  var abi = { 
        type: 'event',
        name: 'Proposal',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'drafter',
        },{
            type: 'uint256',
            name: 'docId',
        },{
            type: 'bytes',
            name: 'callData',
        }
      ]
    }
  //var data =  GetWeb3().utils.keccak256( "Proposal(address,uint256,bytes)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;

  //Approval
  var abi = {
        type: 'event',
        name: 'Approval',        
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'approvor',
        },{
            type: 'uint256',
            name: 'docId',
        }
      ]
    }
  //var data =  GetWeb3().utils.keccak256( "Approval(address,uint256)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;

  //Invoke
  var abi = {
        type: 'event',
        name: 'Invoke',         
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'sender',
        },{
            type: 'uint256',
            name: 'docId',
        }
      ]
    }
  //var data =  GetWeb3().utils.keccak256( "Invoke(address,uint256)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;

  //-----------------------------------------------------------------------------------
  //Governance Token

  //Staking
  var abi = {
        type: 'event',
        name: 'Staking',        
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'sender',
        },{
            type: 'uint256',
            name: 'id',
        },{
            type: 'uint256',
            name: 'amount',
        },{
            type: 'uint256',
            name: 'period',
        }
      ]
    }
  //var data =  GetWeb3().utils.keccak256( "Staking(address,uint256,uint256,uint256)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;

  //Unstaking
  var abi = {
        type: 'event',
        name: 'Unstaking',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'sender',
        },{
            type: 'uint256',
            name: 'id',
        },{
            type: 'uint256',
            name: 'amount',
        }
      ]
    }
  //var data =  GetWeb3().utils.keccak256( "Unstaking(address,uint256,uint256)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;

  //TransferRewardTo
  var abi = {
        type: 'event',
        name: 'TransferRewardTo',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'to',
        }
      ]
    }
  //var data =  GetWeb3().utils.keccak256( "TransferRewardTo(address)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;

  //Burn
  var abi = {
        type: 'event',
        name: 'Burn',      
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'uint256',
            name: 'amount',
        }
      ]
    }
  //var data =  GetWeb3().utils.keccak256( "Burn(uint256)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;

  //Recycle
  var abi = {
        type: 'event',
        name: 'Recycle',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'uint256',
            name: 'amount',
        }
      ]
    }
  //var data =  GetWeb3().utils.keccak256( "Recycle(uint256)" );
  var data = GetWeb3().utils.keccak256( _compile(abi) )  
  objInputs[ data ] = abi.inputs;
    
  return objInputs;
}

async function main10() {

  //-------------------------------------------------------------
  var filters = {
      fromBlock: '94043280',
      //toBlock: '94043285',
      address: ['0x6208e0c4F54D5a86F7B2d37E2e861025191284a6'],//
      //topics: [ data ]
  };

  var optsTopics = [      
    {
        type: 'function',
        name: 'method',
        indexed: true
    },
  ]

  let objInputs = _build();

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
        console.log(log);
        var topicMethod       =  QueryChain().abi.decodeLog( optsTopics, undefined, log.topics );
        var decodedLog        =  QueryChain().abi.decodeLog( objInputs[topicMethod.method], log.data, log.topics );
        console.log(decodedLog);    
    })

  } catch(e) {
    console.log( e );
  }


}

main10()