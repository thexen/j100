/*




*/

function _abiCompiling( abi ) {
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

module.exports.abiEventCompile     = _abiCompiling;