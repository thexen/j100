/*




*/
const Web3                            = require('web3');
const Caver                           = require("caver-js");

const { GetBaoBabNetwork }            = require ( './klayBaobab.js' );

const web3                            = new Web3( new Web3.providers.HttpProvider( _getNetwork() ) );
const caver                           = new Caver( _getNetwork() );

function _getNetwork() {
  return GetBaoBabNetwork();
}

function _getWeb3() {
  return web3;
}

function _getCaver() {
  return caver;
}

function _queryChain() {
  return web3.eth;
}

module.exports.GetWeb3                      = _getWeb3;
module.exports.GetCaver                     = _getCaver;
module.exports.QueryChain                   = _queryChain;
module.exports.GetNetwork                   = _getNetwork;
