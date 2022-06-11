//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const axios = require('axios');

var _httpRequest = async function( _method, _url, _data  ) {
  let axiosConfig = {
    method: _method,
    url: _url,
    data: _data 
  }
  let res = undefined;
  
  try{
    res = await axios( axiosConfig );
    return res.data;
  } catch( e ){
    throw Error( e.message );
  } finally{
    axiosConfig = undefined;
    res         = undefined;
  }
}

var _httpRequestEx = async function( _method, _url, _headers, _data ) {
  let axiosConfig = {
    method: _method,
    url: _url,
    headers: _headers,
    data: _data 
  }
  let res = undefined;
  
  try{
    res = await axios( axiosConfig );
    return res.data;
  } catch( e ){
    throw Error( e.message );
  } finally{
    axiosConfig = undefined;
    res         = undefined;
  }
}

module.exports.HttpRequest = _httpRequest;
module.exports.HttpRequestEx = _httpRequestEx;

