/*
  ERC721



*/
const { AbiEncode }                   = require ( '../../utils/abi.js' );
const { QueryChain }                  = require ( '../networks/active.js' );

async function _isApprovedForAll( contract, owner, perator ) {

  try{
    var data = await AbiEncode( "isApprovedForAll(address,address)", owner, perator );
    const val = await QueryChain().call({
      to: contract, 
      data: data,
    });
    var dec = QueryChain().abi.decodeParameter( 'bool', val );
    return dec;
  } catch( e ) {
    console.log(e)
  } finally {
  }

}

async function _getApproved( contract, tokenId ) {

  try{
    var data = await AbiEncode( "getApproved(uint256)", tokenId );
    const val = await QueryChain().call({
      to: contract, 
      data: data,
    });
    var dec = QueryChain().abi.decodeParameter( 'address', val );
    return dec;
  } catch( e ) {
    console.log(e)
  } finally {
  }

}

module.exports.IsApprovedForAll           = _isApprovedForAll;
module.exports.GetApproved               = _getApproved;