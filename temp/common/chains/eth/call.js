//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const http = require('http');
const Web3 = require('web3');
const web3 = new Web3('http://10.10.0.111:8545');


//Accout Password
const password = 'abcd0110';

//HelloWorld
const helloABI = [{ "constant": false, "inputs": [{ "name": "did", "type": "string" }, { "name": "didDoc", "type": "string" }], "name": "invokeDIDDoc", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_str", "type": "string" }], "name": "setName", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [{ "name": "did", "type": "string" }], "name": "getDIDDoc", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "run", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "str", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }];
const helloContractAddress = '0x797b1c67253baE29483013F8AE0164caE1B7eF41';
const helloContract = new web3.eth.Contract(helloABI, helloContractAddress);

//Schema
const schemaABI = [{"constant":false,"inputs":[{"name":"key","type":"string"},{"name":"value","type":"string"}],"name":"invoke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getVersion","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"key","type":"string"}],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"strVersion","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
const schemaContractAddress = '0x4180Cd33B62aDef43c322373658F93A4CD00f274';
let schemaContract = new web3.eth.Contract( schemaABI, schemaContractAddress );

//CredDef
const creddefABI = [{"constant":false,"inputs":[{"name":"key","type":"string"},{"name":"value","type":"string"}],"name":"invoke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getVersion","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"key","type":"string"}],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"strVersion","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
const creddefContractAddress = '0x8CFE65D654E1ea357d05C8c98EB17cFa56E7D7Ea';
let creddefContract = new web3.eth.Contract( creddefABI, creddefContractAddress );

/*
	let param = {
		key: 'did:0001',
		value: jsonData,
		contract: {
			name: 'helloworld'
		},
		callback: {
			param: {
				req: req,
				res: res,
			},
			onError: _onError,
			onTransactionHash: _onTransactionHash,
			onReceipt: _onReceipt,
			onConfirmation: _onConfirmation,
		}
	}
*/

async function _getContract( _contractName ) {

	if (_contractName == 'helloworld') {
		return helloContract;
	} if (_contractName == 'schemas') {
		return schemaContract;
	} if (_contractName == 'creddefs') {
		return creddefContract;
	}
	throw Error( 'Not found contract' );
}

async function _getFromEth( _param ) {

	let contract = await _getContract( _param.contract.name );
	return contract.methods.get( _param.key ).call();
}

async function _asyncInvokeIntoEth( _param ) {

	let contract 	= await _getContract( _param.contract.name );
	let accounts 	= await web3.eth.getAccounts();
	
	await web3.eth.personal.unlockAccount( accounts[0], password );

	let txHash = undefined;
	return new Promise( function(resolve){
		contract.methods.invoke( _param.key, (typeof _param.value == 'object') ? JSON.stringify(_param.value) : _param.value )
			.send({ from: accounts[0] })
				.on('error', function(error){ 
					if( _param.callback.onError != undefined ){
						_param.callback.onError( error, txHash, _param.callback.param );
					}
				})
				.on('transactionHash', function(transactionHash){ 
					txHash = transactionHash;
					if( _param.callback.onTransactionHash != undefined ){
						_param.callback.onTransactionHash(transactionHash, _param.callback.param );
					}
					resolve( txHash );
				})
				.on('receipt', function(receipt){
					if( _param.callback.onReceipt != undefined ){
						_param.callback.onReceipt(receipt, _param.callback.param );
					}
				})
				.on('confirmation', function(confirmationNumber, receipt){ 
					//default: confirmationNumber이 24 까지 event 발생
					//요청한 transaction이 block에 추가되어 생성되면  confirmationNumber == 0
					//confirmationNumber 만큼 이 후에 생성된 block 수를 의미 함
					if( _param.callback.onConfirmation != undefined ){
						_param.callback.onConfirmation(confirmationNumber, receipt, _param.callback.param );
					}
				})
	} )
}

async function _syncInvokeIntoEth( _param ) {
	let contract = await _getContract( _param.contract.name );
	let accounts = await web3.eth.getAccounts();

	await web3.eth.personal.unlockAccount( accounts[0], password );
	return await contract.methods.invoke( _param.key, (typeof _param.value == 'object') ? JSON.stringify(_param.value) : _param.value ).send( { from: accounts[0] } );
}

async function _syncQueryFromEth( _contractName, _dslQuery ){
	if( _dslQuery == undefined || _dslQuery.query == undefined ){
		throw Error( 'Requered DSLQuery.' );
	}

	let methods = Object.keys( _dslQuery.query );
	if( methods.length != 1 ){
		throw Error( 'Method must one in DSLQuery.' );
	}
	let key = _dslQuery.query[ methods[0] ].key;
	if( key == undefined ){
		throw Error( 'Requered key.' );
	}	
	let ret = {
	}
	try{
		if( methods[0] == 'tx' ){
			ret['tx'] = await web3.eth.getTransactionReceipt( key );
			if( ret.tx == undefined ){
				return undefined;
			} 
			return ret;
		}
		throw Error( 'DSLQuery Method is not define' );
	} finally{
		methods	= undefined;
		ret 	= undefined;
	}

}

module.exports.GetFromEth = _getFromEth;
module.exports.SyncQueryFromEth = _syncQueryFromEth;
module.exports.AsyncInvokeIntoEth = _asyncInvokeIntoEth;
module.exports.SyncInvokeIntoEth = _syncInvokeIntoEth;


