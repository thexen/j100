/*
  Prefix: TM ( Token Manager )



*/
const { AbiEncode }                   = require ( '../../utils/abi.js' );
const { GetContract }                 = require ( '../contracts/contracts.js' );
const { QueryChain }                  = require ( '../networks/active.js' );

async function _inqueryTokenGrade( token ) {
  try{
    var data  = await AbiEncode( "inqueryTokenGrade(address)", token );
    const val = await QueryChain().call({
      to: GetContract("tokenManager"),
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['uint8'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _inqueryTokenCount() {
  try{
      var data = QueryChain().abi.encodeFunctionSignature( "inqueryTokenCount()" );
      const val = await QueryChain().call({
        to: GetContract("tokenManager"), 
        data: data,
      });
      return QueryChain().abi.decodeParameters( ['uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _inqueryToken( index ) {
  try{
    var data  = await AbiEncode( "inqueryToken(uint256)", index );
    const val = await QueryChain().call({
      to: GetContract("tokenManager"),
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['address'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

module.exports.InqueryTMTokenGrade     = _inqueryTokenGrade;
module.exports.InqueryTMTokenCount     = _inqueryTokenCount;
module.exports.InqueryTMToken          = _inqueryToken;


