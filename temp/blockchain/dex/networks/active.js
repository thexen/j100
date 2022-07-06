/*




*/
const Web3                            = require('web3');
const Caver                           = require("caver-js");

const { 
      GetRPC, 
      GetWebSocket 
      }                               = require ( './provider.js' );

const web3                            = new Web3( new Web3.providers.HttpProvider( _getRPC() ) );
const web3ws                          = new Web3( _getWebSocket() );
const caver                           = new Caver( _getRPC() );

function _getRPC() {
  return GetRPC();
}

function _getWebSocket() {
  return GetWebSocket();
}

function _getWeb3() {
  return web3;
}

function _getWeb3WS() {
  return web3ws;
}

function _getCaver() {
  return caver;
}

function _queryChain() {
  return web3.eth;
}

function _queryWS() {
  return web3ws.eth;
}

module.exports.GetWeb3                      = _getWeb3;
module.exports.GetWeb3WS                    = _getWeb3WS;
module.exports.GetCaver                     = _getCaver;
module.exports.QueryChain                   = _queryChain;
module.exports.QueryWS                      = _queryWS;

