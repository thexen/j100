//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
//const indy = require('indy-sdk');
const { InsertToElasticSearch, UpdateToElasticSearch, DeleteFromElasticSearch, GetFromElasticSearch, QueryFromElasticSearch } = require('./es/call');
const { SyncInvokeIntoEth, AsyncInvokeIntoEth, GetFromEth, SyncQueryFromEth } = require('./eth/call');
const { SyncInvokeIntoRedis, SyncDeleteFromRedis, SyncExpireFromRedis, GetFromRedis, GetOnetimeFromRedis, SyncQueryFromRedis } = require('./redis/call');
const { SyncInvokeIntoQuorum, AsyncInvokeIntoQuorum, GetFromQuorum } = require('./quorum/call');
const { InsertToMongo, UpsertToMongo, DeleteFromMongo, GetFromMongo, QueryFromMongo, UpdateFromMongo } = require('./mongo/call');

function _onTransactionHash( transactionHash, _contractName, _param ){

	console.log( 'onTransactionHash' );
	console.log( transactionHash );
}

function _onReceipt( receipt, _contractName, _param ){

	console.log( '_onReceipt' );
	console.log( receipt.blockHash );
	console.log( receipt.blockNumber );	
}

function _onConfirmation( confirmationNumber, receipt, _contractName, _param ){

	console.log( '_onConfirmation' );
	console.log( confirmationNumber );
}

function _onError( err, transactionHash, _contractName, _param ){

	console.log( '_onError' );
	console.log( transactionHash );
}

var _asyncInvoke = async function ( _chainType, _contractName, _key, _value, _param ) {

  let paramInvoke = undefined;
  let reqResult   = undefined;

  try{
    if( _chainType == 'quo') {
      //-----------------------------------------------------------------------
      //Invoke Into Quorum
      paramInvoke = {
        key: _key,
        value: _value,
        contract: {
          name: _contractName
        },
        isPrivate: _param.isPrivate,
        callback: {
            onError: _onError,
            onTransactionHash: _onTransactionHash,
            onReceipt: _onReceipt,
            onConfirmation: _onConfirmation,
        }
      }
      return await AsyncInvokeIntoQuorum( paramInvoke );
    } else if( _chainType == 'redis') { 
      //-----------------------------------------------------------------------
      //Invoke Into REDIS
      return await SyncInvokeIntoRedis( _key, _value, _param );
    } else if( _chainType == 'es') { 
      //-----------------------------------------------------------------------
      //Invoke To ElasticSearch        
      reqResult = await InsertToElasticSearch( _contractName, _key,  _value );
      if( reqResult.code != 200 ){
          throw Error(reqResult.reason);
      }      
      return _key;
    } else if( _chainType == 'eth' ){
      //-----------------------------------------------------------------------
      //Invoke Into Ethereum    
      paramInvoke = {
        key: _key,
        value: _value,
        contract: {
          name: _contractName
        },
        callback: {
            param: _param,
            onError: _onError,
            onTransactionHash: _onTransactionHash,
            onReceipt: _onReceipt,
            onConfirmation: _onConfirmation,
        }
      }
      return await AsyncInvokeIntoEth( paramInvoke );
    } 
    throw Error( 'There is no supported chain.' );
  } finally {
    reqResult   = undefined;
    paramInvoke = undefined;
  }
}

var _syncInvoke = async function ( _chainType, _contractName, _key, _value, _param ) {

  let paramInvoke = undefined;
  let reqResult   = undefined;

  try{
    if( _chainType == 'quo') {
      //-----------------------------------------------------------------------
      //Invoke Into Quorum
      paramInvoke = {
        key: _key,
        value: _value,
        contract: {
          name: _contractName
        }
      }
      return await SyncInvokeIntoQuorum( paramInvoke );
    } else if( _chainType == 'redis') { 
      //-----------------------------------------------------------------------
      //Invoke Into REDIS
      return await SyncInvokeIntoRedis( _key, _value, _param );
    } else if( _chainType == 'es') { 
      //-----------------------------------------------------------------------
      //Invoke To ElasticSearch        
      if( typeof _value != 'object' ){
        throw Error( 'The type of the 3rd param must be object' );
      }
      reqResult = await InsertToElasticSearch( _contractName, _key,  _value );
      if( reqResult.code != 200 ){
          throw Error(reqResult.reason);
      }      
      return _key;
    } else if( _chainType == 'eth' ){
      //-----------------------------------------------------------------------
      //Invoke Into Ethereum    
      paramInvoke = {
        key: _key,
        value: _value,
        contract: {
            name: _contractName
        }
      }
      return await SyncInvokeIntoEth( paramInvoke );
    } else if( _chainType == 'mongo' ){
      reqResult = await UpsertToMongo( _contractName, _key, _value );
      if( reqResult.n == 0 ){
        throw Error( 'Failed Invoke into Mongo' );
      }
      return _key;
    }
    throw Error( 'There is no supported chain.' );
  } finally {
    reqResult   = undefined;
    paramInvoke = undefined;
  }
}

var _syncInsert = async function ( _chainType, _contractName, _key, _value, _param ) {

  let paramInvoke = undefined;
  let reqResult   = undefined;

  try{
    if( _chainType == 'mongo' ){
      reqResult = await InsertToMongo( _contractName, _key, _value );
      if( reqResult.n == 0 ){
        throw Error( 'Failed Invoke into Mongo' );
      }
      return _key;
    }
    throw Error( 'There is no supported chain.' );
  } finally {
    reqResult   = undefined;
    paramInvoke = undefined;
  }

}

var _get = async function ( _chainType, _contractName, _key ) {

  let paramGet  = undefined;
  let value     = undefined;
  let reqResult = undefined;

  try{
    if( _chainType == 'quo') {
      //-----------------------------------------------------------------------
      //Get from Quorum
      paramGet = {
        key: _key,
        contract: {
          name: _contractName
        }
      }
      value = await GetFromQuorum( paramGet );
      if ( value.length == 0 ) {
        return undefined;
      }
      return JSON.parse( value );
    } else if( _chainType == 'redis') { 
      //-----------------------------------------------------------------------
      //Get Schema from REDIS    
      value = await GetFromRedis( _key );
      if( value == undefined ){
        return undefined;
      }
      return JSON.parse( value );
    } else if( _chainType == 'es') { 
      //-----------------------------------------------------------------------
      //Get from ElasticSearch
      reqResult = await GetFromElasticSearch( _contractName, _key, undefined );
      if( reqResult.count == undefined || reqResult.count == 0 ){
        return undefined;
      } 
      return reqResult.docs[0];
    } else if( _chainType == 'eth' ){
      //-----------------------------------------------------------------------       
      //Get from Ethereum
      paramGet = {
        key: _key,
        contract: {
        name: _contractName
        }
      }
      
      value = await GetFromEth( paramGet );
      if( value.length == 0 ){
        return undefined;
      } 
      return JSON.parse( value );
    } else if( _chainType == 'mongo') { 
      reqResult = await GetFromMongo( _contractName, _key );
      if( reqResult == undefined ){
        return undefined;
      }
      return reqResult._source;
    }
    throw Error( 'There is no supported chain.' );
  } finally {
    paramGet  = undefined;
    value     = undefined;
    reqResult = undefined;
  }
}

var _del = async function ( _chainType, _contractName, _key ) {
  
  if( _chainType == 'redis') {
    return await SyncDeleteFromRedis( _key ) ;
  } else if( _chainType == 'es') {
    return await DeleteFromElasticSearch( _contractName, _key );
  } else if( _chainType == 'mongo') {
    return await DeleteFromMongo( _contractName, _key );
  }
  throw Error( 'There is no supported chain.' );

}

var _expire = async function ( _chainType, _contractName, _key, _expire ) {

  if( _chainType == 'redis') {
    return await SyncExpireFromRedis( _key, _expire ) ;
  }
  throw Error( 'There is no supported chain.' );

}

var _update = async function ( _chainType, _contractName, _key, _doc ) {

  if( _chainType == 'es') {
    return await UpdateToElasticSearch( _contractName, _key, _doc ) ;
  }else  if( _chainType == 'mongo') {
    return await UpdateFromMongo( _contractName, _key, _doc );
  }  
  throw Error( 'There is no supported chain.' );

}

var _query = async function ( _chainType, _contractName, _size, _source, _query ) {
  
  let value = undefined;

  try{
    if( _chainType == 'es') {
      value = await QueryFromElasticSearch( _contractName, _size, _source, _query );
      if( value.count == undefined || value.count == 0 ){
        return undefined;
      }
      return value.docs;
    } else if( _chainType == 'redis') { 
      value = await SyncQueryFromRedis( _query );
      if( value == undefined ){
        return undefined;
      } 
      return (typeof value == 'object') ? value : JSON.parse( value );
    } else if( _chainType == 'eth') { 
      return SyncQueryFromEth( _contractName, _query );
    } else  if( _chainType == 'quo') {
      //TODO
    } else  if( _chainType == 'mongo') {
      return await QueryFromMongo( _contractName, _query );
    }
    throw Error( 'There is no supported chain.' );
  } finally{
    value = undefined;
  }

}

module.exports.AsyncInvokeIntoChain = _asyncInvoke;
module.exports.SyncInvokeIntoChain = _syncInvoke;
module.exports.SyncInsertIntoChain = _syncInsert;
module.exports.GetFromChain = _get;
module.exports.DeleteFromChain = _del;
module.exports.ExpireFromChain = _expire;
module.exports.UpdateIntoChain = _update;
module.exports.QueryFromChain = _query;
