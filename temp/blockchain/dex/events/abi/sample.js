/*




*/

function _getAbi01() {

    var abi = {
        type: 'event',
        name: 'OwnerSet',
        inputs: [
          {
              type: 'function',
              name: 'method',
              indexed: true
          },{
              type: 'address',
              name: 'oldOwner',
              indexed: true
          },{
              type: 'address',
              name: 'newOwner',
              indexed: true
          },{
              type: 'uint256',
              name: 'cnt',
          }
        ]
    }
      
    return abi;
}

function _sampleCallBack01( eventLog, decodedEventLog ) {
    console.log("Called _sampleCallBack01 ................")
    console.log(decodedEventLog)
}

function _getAbi02() {

    var abi = {
        type: 'event',
        name: 'EventSet',
        inputs: [
          {
              type: 'function',
              name: 'method',
              indexed: true
          },{
              type: 'address',
              name: 'newOwner',
              indexed: true
          },{
              type: 'uint256',
              name: 'cnt',
          }
        ]
    }
      
    return abi;
}

function _sampleCallBack02( eventLog, decodedEventLog ) {
    console.log("Called _sampleCallBack02 ................")
    console.log(decodedEventLog)
}

module.exports.getAbi01                                  = _getAbi01;
module.exports.eventSampleCallBack01                     = _sampleCallBack01;

module.exports.getAbi02                                  = _getAbi02;
module.exports.eventSampleCallBack02                     = _sampleCallBack02;
