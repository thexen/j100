const util = require('util')

let swapPools   = [];

var _naviSeed = function( ) {
    // query paris info
    const method    = "POST";
    const url       = "http://127.0.0.1:8080/restapi/find/pairs";
    const data      = { query: { find: {} } };
    let res = await HttpRequest(method, url, data);
    // console.log(JSON.stringify(res, null, 4));

    // set swap pool info
    res.data.forEach(function (item) {
        swapPools.push({ pair: [item._source.first, item._source.second] });
    });
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

var _discoverySwapRoute = function( from, to, waypointCount ) {

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
                        var info = {}
                        info[ 'from' ]      = { token: swapRoutes.swap_route[i][k][0], balance: 0 };
                        info[ 'to' ]        = { token: swapRoutes.swap_route[i][k][1], balance: 0 };
                        info[ 'rating' ]    = 0;
                        if( !bFound ) {
                            swapRoutes.swap_route[i][k].push( info );
                        } else {
                            console.log("execptions...found sampe swap pool");
                        }
                        bFound = true;
                    }    
                }
                if( !bFound ) {
                    break;
                }                
                if( swapRoutes.swap_route[i][k].length > 3 ) {
                    throw( swapRoutes.swap_route[i][k] );
                }
            }
            if( !bFound ) {
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

var _discoveryFirstMiddleRoute = function( from, to, waypointCount ) {
    try{
        var exploredRoute = [];
        var exploredswapRoutes = _discoverySwapRoute( from, to, waypointCount );
        if( exploredswapRoutes.swap_route.length > 0 ) {
            if( exploredswapRoutes.swap_route[0].length > 1 ) {
                for( var i=0; i<exploredswapRoutes.swap_route[0].length-1; i++ ){
                    exploredRoute.push( exploredswapRoutes.swap_route[0][i][2].to.token );
                }
            }
        } else {
            //발견된 경로가 없다
            exploredRoute = undefined;
        }
        return exploredRoute;
    } catch( e ){
        throw Error( e.message );
    } finally {
        exploredswapRoutes  = undefined;
        exploredRoute       = undefined;
    }        
}

var _discoveryMiddleRoutes = function( from, to, waypointCount ) {
    try{
        var exploredRoutes = [];
        var exploredswapRoutes = _discoverySwapRoute( from, to, waypointCount );
        if( exploredswapRoutes.swap_route.length > 0 ) {
            for( var i=0; i<exploredswapRoutes.swap_route.length; i ++ ){
                var exploredRoute = [];
                if( exploredswapRoutes.swap_route[i].length > 1 ) {
                    for( var k=0; k<exploredswapRoutes.swap_route[i].length-1; k++ ){
                        exploredRoute.push( exploredswapRoutes.swap_route[i][k][2].to.token );
                    }
                }
                exploredRoutes.push( exploredRoute );
                exploredRoute = undefined;
            }
        } else {
            //발견된 경로가 없다
            exploredRoutes = undefined;
        }
        return exploredRoutes;
    } catch( e ){
        throw Error( e.message );
    } finally {
        exploredswapRoutes  = undefined;
        exploredRoutes      = undefined;
    }          
}

//모든 중간 경로의 swap pool 정보 구하기
module.exports.DiscoveryRoutes                  = _discoverySwapRoute;
//모든 중간 경로중 처음 발견된 경로 구하기
module.exports.DiscoveryFirstMiddleiRoute       = _discoveryFirstMiddleRoute;
//모든 중간 경로 구하기
module.exports.DiscoveryMiddleiRoutes           = _discoveryMiddleRoutes;
