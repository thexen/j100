/*




*/

function _getAbiFounding() {

    var abi = { 
        type: 'event',
        name: 'Founding',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'object',
            indexed: true            
        },{
            type: 'uint256',
            name: 'firstAmount',
        },{
            type: 'uint256',
            name: 'secondAmount',
        },{
            type: 'uint256',
            name: 'lptAmount',
        }
      ]
    }
  return abi;
} 

function _founding( eventLog, decodedEventLog ) {

    console.log("Called _founding ................")
    console.log(decodedEventLog)

}

function _getAbiDeposit() {

    var abi = { 
        type: 'event',
        name: 'Deposit',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'object',
            indexed: true            
        },{
            type: 'uint256',
            name: 'firstAmount',
        },{
            type: 'uint256',
            name: 'returnFirst',
        },{
            type: 'uint256',
            name: 'secondAmount',
        },{
            type: 'uint256',
            name: 'returnSecond',
        },{
            type: 'uint256',
            name: 'totalLPTSupply',
        }
      ]
    }
  return abi;
} 

function _deposit( eventLog, decodedEventLog ) {

    console.log("Called _deposit ................")
    console.log(decodedEventLog)

}

function _getAbiWithdrawal() {

    var abi = { 
        type: 'event',
        name: 'Withdrawal',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'object',
            indexed: true            
        },{
            type: 'uint256',
            name: 'lptAmount',
        },{
            type: 'uint256',
            name: 'firstAmount',
        },{
            type: 'uint256',
            name: 'secondAmount',
        },{
            type: 'uint256',
            name: 'totalLPTSupply',
        }
      ]
    }
  return abi;
} 

function _withdrawal( eventLog, decodedEventLog ) {

    console.log("Called _withdrawal ................")
    console.log(decodedEventLog)

}

function _getAbiStatistics() {

    var abi = { 
        type: 'event',
        name: 'Statistics',       
        inputs: [
        {
            type: 'function',
            name: 'method',
            indexed: true
        },{
            type: 'address',
            name: 'object',
            indexed: true            
        },{
            type: 'uint256',
            name: 'firstBalance',
        },{
            type: 'uint256',
            name: 'secondBalance',
        },{
            type: 'uint256',
            name: 'firstTradingVolume',
        },{
            type: 'uint256',
            name: 'secondTradingVolume',
        },{
            type: 'uint256',
            name: 'firstFee',
        },{
            type: 'uint256',
            name: 'secondFee',
        }
      ]
    }
  return abi;
} 

function _statistics( eventLog, decodedEventLog ) {

    console.log("Called _statistics ................")
    console.log(decodedEventLog)

}


module.exports.getAbiFounding                  = _getAbiFounding;
module.exports.eventFounding                   = _founding;

module.exports.getAbiDeposit                   = _getAbiDeposit;
module.exports.eventDeposit                    = _deposit;

module.exports.getAbiWithdrawal                   = _getAbiWithdrawal;
module.exports.eventWithdrawal                 = _withdrawal;

module.exports.getAbiStatistics                = _getAbiStatistics;
module.exports.eventStatistics                 = _statistics;