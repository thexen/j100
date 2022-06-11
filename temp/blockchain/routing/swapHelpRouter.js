
const util = require('util')

let swapPools   = [];

var _naviSeed = function( ) {

    swapPools = [ 
        {
            pair: [ '0x21CB1A627380BAdAeF180e1346479d242aca90D3', '0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e' ],
            pool: {
                dex: 'newsSwap',
                contract:   '0xd49797b8E0A402BE748Fd07991A623912629587C',
                fee:        0.03,
            }
        },
        {
            pair: [ '0x658a3a6065E16FE42D8a51CC00b0870e850909F5', '0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e' ],
            pool: {
                dex: 'newsSwap',
                contract:   '0x54A0E6d498F16dBc63e6a1E5DB4b4F9F8D605C30',
                fee:        0.03,
            }            
        },
        {
            pair: [ '0xAeEa7333B0658158121FAbDB579d49DD10b57950', '0x0000000000000000000000000000000000000000' ],
            pool: {
                dex: 'newsSwap',
                contract:   '0xbDCDD585A2d147f3DAb0eeBBa22d5A09a07c2b4d',
                fee:        0.03,
            }  
        },
        

    ];
}

_naviSeed();

let tokens = [ '0x658a3a6065E16FE42D8a51CC00b0870e850909F5'
                , '0xAeEa7333B0658158121FAbDB579d49DD10b57950'
                , '0x0000000000000000000000000000000000000000'
                , '0x21CB1A627380BAdAeF180e1346479d242aca90D3'
                , '0x950a8536720a9571EE73689a26Ed6A4a8fC94A3e' ];

const _getPermutations = (array, selectNumber) => {
    const results = [];
    if (selectNumber === 1) {
    return array.map((element) => [element]);
    }
    array.forEach((fixed, index, origin) => {
    const rest = [...origin.slice(0, index), ...origin.slice(index + 1)];
    const permutations = _getPermutations(rest, selectNumber - 1);
    const attached = permutations.map((permutation) => [fixed, ...permutation]);

    results.push(...attached);
    });
    return results;
};

var _getMiddlePaths = function( from, to, waypointCount )  {
    let res             = [];
    let middleNodes     = [];
    try{
        for( var i=0; i<tokens.length; i++ ){
            if( tokens[i] == from || tokens[i] == to ) {
            } else {
                middleNodes.push( tokens[i] );
            }
        }

        var middleNodeCount = waypointCount;
        if( middleNodeCount > middleNodes.length || middleNodeCount == undefined )
            middleNodeCount = middleNodes.length;

        for( var i=0; i<middleNodeCount; i++ ){
            res.push(_getPermutations(middleNodes, i + 1 ));
        }
        return res;
    } catch( e ){
        throw Error( e.message );
    } finally {
        middleNodes = undefined;
        res         = undefined;
    }
}

var _getSwapPoolRoutes = function( from, to, waypointCount, debug ) {
    var res         = _getMiddlePaths(from, to, waypointCount);
    var swapPaths   = [];

    var swapPath    = [];
    var pairToken   = [];

    try{    
        pairToken = [ from, to ];
        swapPath.push( pairToken );
        swapPaths.push( swapPath );

        for( var i=0;i<res.length; i++ ) {
            for( var k=0;k<res[i].length; k++ ) {
                if( debug != undefined)
                    console.log( res[i][k] )
                swapPath    = [];
                pairToken   = [];
                for( var j=0; j<res[i][k].length; j++ ) {
                    if( j == 0 ){
                        pairToken = [ from, res[i][k][j] ];
                        swapPath.push( pairToken );
                        if( res[i][k].length > 1 ){
                            pairToken = [ res[i][k][j], res[i][k][j+1] ];
                            swapPath.push( pairToken );
                        }
                    }
                    if( j == res[i][k].length - 1 ){ 
                        pairToken = [ res[i][k][j], to ];
                        swapPath.push( pairToken );
                    }
                    if( j > 0 &&  j < res[i][k].length - 1 ) {
                        pairToken = [ res[i][k][j], res[i][k][j+1] ];
                        swapPath.push( pairToken );
                    }
                }
                if( debug != undefined)
                    console.log( swapPath );
                swapPaths.push( swapPath );
            }
        }
        return swapPaths;
    } catch( e ){
        throw Error( e.message );
    } finally {
        res         = undefined;
        pairToken   = undefined;        
        swapPath    = undefined;
        swapPaths   = undefined;        
    }    
}

var _discoverySwapRoute = function( from, to, waypointCount, inqueryAssets ) {

    var swapRoutes = {
        swap_route:     undefined,
        best_route:     undefined,
        worst_route:    undefined,
    };
    var brokenPaths         = [];

    swapRoutes.swap_route   = _getSwapPoolRoutes( from, to, waypointCount );
    try{    

        //모든 경로에서 최적화 경로를 검색한다.
        for( var i=0; i<swapRoutes.swap_route.length; i++ ) {
            //console.log( 'path: ' +  swapRoutes.swap_route[i] );
            //console.log( swapRoutes.swap_route[i] );
            //경로 검색
            var naviSwapRaing   = 0;
            var bFound          = false;
            for( var k=0; k<swapRoutes.swap_route[i].length; k++ ) {
                //중간 경로에 해당 되는 Swap Pool 검색
                bFound          = false;
                for( var j=0; j<swapPools.length; j++ ) {
                    if( ( swapPools[j].pair[0] == swapRoutes.swap_route[i][k][0] || swapPools[j].pair[1] == swapRoutes.swap_route[i][k][0] ) 
                        && ( swapPools[j].pair[0] == swapRoutes.swap_route[i][k][1] || swapPools[j].pair[1] == swapRoutes.swap_route[i][k][1] ) ){
                        
                        /*
                        var info = {}
                        info[ 'pool' ]      = swapPools[j].pool;
                        info[ 'from' ]      = { token: swapRoutes.swap_route[i][k][0], balance: _getBalance( swapPools[j].pool ) };
                        info[ 'to' ]        = { token: swapRoutes.swap_route[i][k][1], balance: _getBalance( swapPools[j].pool ) };
                        info[ 'rating' ]    = ( ( info.to.balance * ( 1 - swapPools[j].pool.fee ) ) 
                                                    / info.from.balance );
                        //같은 종류의 swap pool이 존재 한다면 교환 비율이 높은 pool로 변경 한다.
                        if( bFound ) {
                            if( swapRoutes.swap_route[i][k][2].rating < info.rating ) {
                                swapRoutes.swap_route[i][k][2] = info;
                            }
                        } else {
                            swapRoutes.swap_route[i][k].push( info );
                        }
                        */

                        
                        [firstTokenAmount, secondtokenAmount] = inqueryAssets( swapPools[j].pool );
                        console.log( firstTokenAmount );
                        console.log( secondtokenAmount );
                        var info = {}
                        info[ 'pool' ]      = swapPools[j].pool;
                        info[ 'from' ]      = { token: swapRoutes.swap_route[i][k][0], balance: 0 };
                        info[ 'to' ]        = { token: swapRoutes.swap_route[i][k][1], balance: 0 };
                        info[ 'rating' ]    = 0;
                        if( !bFound ) {
                            swapRoutes.swap_route[i][k].push( info );
                        } 
                        bFound = true;
                    }    
                }
                if( bFound ) {
                    if( k == 0 ) {
                        naviSwapRaing = swapRoutes.swap_route[i][k][2].rating;
                    } else {
                        naviSwapRaing = naviSwapRaing * swapRoutes.swap_route[i][k][2].rating;
                    }
                } else {
                    break;
                }                
                if( swapRoutes.swap_route[i][k].length > 3 ) {
                    throw( swapRoutes.swap_route[i][k] );
                }
            }
            if( bFound ) {
                swapRoutes.swap_route[i]['rating'] = naviSwapRaing;
                if( swapRoutes.best_route == undefined ) {
                    swapRoutes.best_route    = swapRoutes.swap_route[i];
                    swapRoutes.worst_route   = swapRoutes.swap_route[i];
                } else if ( swapRoutes.best_route.rating < swapRoutes.swap_route[i].rating ) {
                    swapRoutes.best_route = swapRoutes.swap_route[i];
                } else if ( swapRoutes.worst_route.rating > swapRoutes.swap_route[i].rating ) {
                    swapRoutes.worst_route = swapRoutes.swap_route[i];
                }
            } else {
                swapRoutes.swap_route.splice( i, 1 );
                i--;
            }
        }

        //단절 경로 삭제
        for( var i=0; i<brokenPaths.length; i++ ){
            swapRoutes.swap_route.splice( brokenPaths[i]-i, 1 );
        }
        return swapRoutes;
    } catch( e ){
        throw Error( e.message );
    } finally {
        brokenPaths = undefined;
    }
}

var _discoveryMiddleRoutes = function( from, to, waypointCount, inqueryAssets ) {
    try{
        var exploredRoute = [];
        var exploredswapRoutes = _discoverySwapRoute( from, to, waypointCount, inqueryAssets );
        if( exploredswapRoutes.swap_route[0].length > 1 ) {
            for( var i=0; i<exploredswapRoutes.swap_route[0].length-1; i++ ){
                exploredRoute.push( exploredswapRoutes.swap_route[0][i][2].to.token );
            }
        }
        return exploredRoute;
    } catch( e ){
        throw Error( e.message );
    } finally {
        exploredRoute   = undefined;
    }        
}

/*
function main() {
  var route = _discoveryMiddleRoutes( '0x21CB1A627380BAdAeF180e1346479d242aca90D3', '0x658a3a6065E16FE42D8a51CC00b0870e850909F5', 2 );
  console.log( route );
}
*/

module.exports.DiscoveryMiddleRoute  = _discoveryMiddleRoutes;