//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const {ESCONF} = require('../../../config/chain');
const requester = require('../../utils/request/request');

  
var _insertToElasticSearch = async function ( _index, _id, _doc ) {

    let result = {
      code: 501
    }
  
    let reqResult = undefined;
    try {

      try {
        let url       = ESCONF.host + '/' + _index + '/_doc/' + _id + '?refresh=true';
        reqResult     = await requester.HttpRequest('put', url, _doc);
        if (reqResult.status != undefined) {
          result["code"] = reqResult.status;
          throw Error(reqResult.reason);
        }
        result["code"] = 200;
        result["result"] = reqResult.result;
      } catch (e) {
        result["reason"] = e.message.replace( /\"/g, "'" );
      }
      return result;

    } finally {
      reqResult = undefined;
      result    = undefined;
    }

  }

var _updateToElasticSearch = async function ( _index, _id, _doc ) {

  let result = {
    code: 501
  }

  let reqResult = undefined;
  try {

    try {
      let url   = ESCONF.host + '/' + _index + '/_update/' + _id + '?refresh=true';

      reqResult = await requester.HttpRequest('post', url, _doc);
      if (reqResult.status != undefined) {
        result["code"] = reqResult.status;
        throw Error(reqResult.reason);
      }
      result["code"] = 200;
      result["result"] = reqResult.result;

    } catch (e) {
      result["reason"] = e.message.replace( /\"/g, "'" );
    }
    return result;

  } finally {
    reqResult = undefined;
    result    = undefined;
  }

}

var _getFromElasticSearch = async function ( _index, _id, _source ) {

  let result = {
    code: 501,
    docs: [],
  };

  let reqResult = undefined;
  try {

    try {
      let url ='';
      if( _source == undefined ) {
        url = ESCONF.host + '/' + _index + '/_doc/' + _id;
      } else {
        url = ESCONF.host + '/' + _index + '/_doc/' + _id + '?pretty&_source=' + _source;
      }

      reqResult = await requester.HttpRequest('get', url, {} );
      if (reqResult .status != undefined) {
        result["code"] = reqResult .status;
        throw Error(reqResult .reason);
      }

      if( reqResult .found ){ 
        result['code']      = 200;
        result['count']     = 1;
        result['docs'].push( reqResult ._source );
      } else {
        result['code']      = 404;
        result['count']     = 0;
      }
      
    } catch (e) {
      result["reason"] = e.message.replace( /\"/g, "'" );
    }
    return result;

  } finally {
    reqResult = undefined;
    result    = undefined;
  }


}

var _deleteFromElasticSearch = async function ( _index, _id ) {

  let result = {
    code: 501
  }
  
  let reqResult = undefined;
  try {

    try {
      let url   = ESCONF.host + '/' + _index + '/_doc/' + _id;

      reqResult = await requester.HttpRequest('delete', url, {} );
      if (reqResult.status != undefined) {
        result["code"] = reqResult.status;
        throw Error(reqResult.reason);
      }
      result["code"] = 200;
      result["result"] = reqResult.result;

    } catch (e) {
      result["reason"] = e.message.replace( /\"/g, "'" );
    }
    return result;

  } finally {
    reqResult = undefined;
    result    = undefined;
  }

}

var _queryFromElasticSearch = async function ( _index, _size, _source, _query ) {

  let result = {
    code: 501,
    docs: [],
  };

  let query = {
    size: _size,
    sort: {
      created_time: {
        order: "desc"
      }
    }
  }

  let reqResult = undefined;
  try {

    try {
      let size = 1000;
      if( _size != undefined ){
        size = _size;
      }

      let url ='';
      if( _source == undefined ) {
        url = ESCONF.host + '/'  +_index+ '/_search';
      } else {
        url = ESCONF.host + '/'  +_index+ '/_search?_source=' + _source;
      }

      if( _query != undefined ){
        query['query'] = _query
      }
      reqResult = await requester.HttpRequest( 'get', url, query );

      if (reqResult .status != undefined) {
        result["code"] = reqResult .status;
        throw Error(reqResult .reason);
      }

      result['code']      = 200;
      result['count']     = reqResult.hits.total.value;
      result['docs']      = reqResult.hits.hits;
      
    } catch (e) {
      result["reason"] = e.message.replace( /\"/g, "'" );
    }
    return result;

  } finally {
    reqResult = undefined;
    query     = undefined;    
    result    = undefined;
  }

}


module.exports.InsertToElasticSearch = _insertToElasticSearch;
module.exports.UpdateToElasticSearch = _updateToElasticSearch;
module.exports.GetFromElasticSearch = _getFromElasticSearch;
module.exports.DeleteFromElasticSearch = _deleteFromElasticSearch;
module.exports.QueryFromElasticSearch = _queryFromElasticSearch;
