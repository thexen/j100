//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//npm install mongodb@3.6.9
//MongoDB Server 4.4.6
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const { MongoClient, ReadPreference }   = require('mongodb');
const {MONGODBCONF}                     = require('../../../config/chain');

/*
admin 계정 정보
db.auth("admin", "abcd0110");
*/
//const mongoHost = 'mongodb://192.168.10.111:27017,192.168.10.113:27017,192.168.10.112:27018/dex_db';
const mongoHost = 'mongodb://192.168.10.111:27017/dex_db';
//const mongoHost = 'mongodb://192.168.1.33:27017/dex_db';
//const mongoHost = 'mongodb://10.10.0.121:27017/test_db';
const mongoUser = "dexUser";
const mongoPwd  = "dexUser";
const mongoConnTimeout  = 5000;
const mongoConnPool     = 100;
const mongoReplicaSet   = 'rs0'

/*
const client = new MongoClient(mongoHost, {
    authSource: 'admin',
    auth: {
        user:                   mongoUser, 
        password:               mongoPwd
    },
    replicaSet:                 mongoReplicaSet,
    readPreference:             ReadPreference.PRIMARY_PREFERRED,
    poolSize:                   mongoConnPool,
    useNewUrlParser:            true,
    useUnifiedTopology:         true,
    serverSelectionTimeoutMS:   mongoConnTimeout
});
*/

/*
const client = new MongoClient( MONGODBCONF.datasource, {
    authSource: MONGODBCONF.auth.source,
    auth: {
        user: MONGODBCONF.auth.user, 
        password: MONGODBCONF.auth.pwd
    },
    replicaSet: MONGODBCONF.replicaset,
    poolSize: MONGODBCONF.connpool,
    serverSelectionTimeoutMS: MONGODBCONF.conntimeout,
    readPreference: ReadPreference.PRIMARY_PREFERRED,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
*/

async function _newClient() {
    const client = new MongoClient(mongoHost, {
        authSource: 'admin',
        auth: {
            user:                   mongoUser, 
            password:               mongoPwd
        },
        replicaSet:                 mongoReplicaSet,
        readPreference:             ReadPreference.PRIMARY_PREFERRED,
        poolSize:                   mongoConnPool,
        useNewUrlParser:            true,
        useUnifiedTopology:         true,
        serverSelectionTimeoutMS:   mongoConnTimeout
    });
    await client.connect();
    return client;    
}

async function _connect() {
    if( !client.isConnected() ){
        console.log("not connected to MongoDB!!!")
        console.log("connecting to MongoDB...")
        await client.connect();
    }
}

async function _getFromMongo( client, _collection, _id ) {
    let databse         = client.db();
    let collection      = databse.collection(_collection);
    try{
        return await collection.findOne( {_id: _id} );
    } finally {
        databse         = undefined;
        collection      = undefined;
    }
}

async function _upsertToMongo( client, _collection, _id, _doc ) {
    let databse         = client.db();
    let collection      = databse.collection(_collection);
    try{
        return await collection.updateOne( {_id: _id}, {$set: {_timestamp: new Date(Date.now()), _source: ( typeof _doc == 'string' )? JSON.parse( _doc ) : _doc }}, {upsert: true});
    } finally {
        databse         = undefined;
        collection      = undefined;
    }
}

async function _insertToMongo( client, _collection, _id, _doc ) {
    let databse         = client.db();
    let collection      = databse.collection(_collection);
    try{
        return await collection.insertMany( [{_id: _id, _timestamp: new Date(Date.now()), _source: ( typeof _doc == 'string' )? JSON.parse( _doc ) : _doc }]);
    } finally {
        databse         = undefined;
        collection      = undefined;
    }
}

async function _updateToMogo( client, _collection, _query, _doc ) {
    let databse         = client.db();
    let collection      = databse.collection(_collection);
    try{
        return await collection.updateOne( ( typeof _query == 'string' )? JSON.parse( _query ) : _query, 
                                       {$set: ( typeof _doc == 'string' )? JSON.parse( _doc ) : _doc });
    } finally {
        databse         = undefined;
        collection      = undefined;
    }
}

async function _findToModify( client, _collection, _query, _order, _update ) {
    let databse         = client.db();
    let collection      = databse.collection(_collection);
    try{
        return await collection.findAndModify( _query, _order, _update );
    } finally {
        databse         = undefined;
        collection      = undefined;
    }
}

async function _deleteFromMongo( client, _collection, _id ) {
    let databse         = client.db();
    let collection      = databse.collection(_collection);
    try{
        return await collection.deleteOne( {_id: _id} );
    } finally {
        databse         = undefined;
        collection      = undefined;
    }
}

async function _queryFromFromMongo( client, _collection, _dslQuery ) {
    let databse         = client.db();
    let collection      = databse.collection(_collection);
    let value           = undefined;
    let sliceTemp       = [];
    try{
        if( _dslQuery == undefined ){
            throw Error( 'Requered DSLQuery.' );
        }
        let methods = Object.keys( _dslQuery );
        if( methods.length != 1 ){
            throw Error( 'Method must one in DSLQuery.' );
        }
		if( methods[0] == 'findone' ){
            value      = await collection.findOne( _dslQuery.findone );
            if( value == undefined ){
                return undefined;
            }
            return value._source;
		} else if ( methods[0] == 'find' ){
            if( _dslQuery.find['$and'] != undefined ) {
                for( var i=0; i<_dslQuery.find['$and'].length; i++ ){
                    if( Object.keys( _dslQuery.find['$and'][i] ) == '_timestamp' ){
                        for( var key in _dslQuery.find['$and'][i]._timestamp ){
                            _dslQuery.find['$and'][i]._timestamp[key] = new Date(new Date(_dslQuery.find['$and'][i]._timestamp[key]))
                        }
                    }
                }
            }
            cursor = collection.find( _dslQuery.find );
            if( await cursor.count() == 0 ){
                return undefined
            }
            while( await cursor.hasNext() ) {
                value = await cursor.next()
                sliceTemp.push( {
                    _id: value._id, 
                    _timestamp: value._timestamp,
                    _source: value._source 
                });
            }
            return sliceTemp;
        } else if( methods[0] == 'count' ){
            value = await collection.countDocuments( _dslQuery.count )
            if( value == undefined ){
                return undefined;
            }
            return value;
		} else {
		    throw Error( 'DSLQuery Method is not define' );		
        }
    } finally {
        sliceTemp       = undefined;
        value           = undefined;
        databse         = undefined;
        collection      = undefined;
    }
}

module.exports.NewMongoClient           = _newClient;
module.exports.InsertToMongo            = _insertToMongo;
module.exports.UpsertToMongo            = _upsertToMongo;
module.exports.GetFromMongo             = _getFromMongo;
module.exports.DeleteFromMongo          = _deleteFromMongo;
module.exports.QueryFromMongo           = _queryFromFromMongo;
module.exports.UpdateFromMongo          = _updateToMogo;

module.exports.FindToModify             = _findToModify
