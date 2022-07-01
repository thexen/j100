module.exports = {
  server_port: 8080,
  route_info: [
    
    {file:'./metadata/create',        path:'/metadata/create',          method:'create',          type:'post'},
    {file:'./metadata/download',      path:'/metadata/download/:cid',   method:'download',        type:'get'},
    {file:'./metadata/get',           path:'/metadata/get/:cid',        method:'get',             type:'get'},

    {file:'./metadata/dumy',          path:'/metadata/dumy',            method:'dumy',            type:'post'},

    {file:'./restapi/query',          path:'/restapi/search/query',     method:'searchQuery',     type:'post'},
    {file:'./restapi/getPairs',       path:'/restapi/find/pairs',       method:'findPairs',       type:'post'},
    {file:'./restapi/getTokens',      path:'/restapi/find/tokens',      method:'findTokens',      type:'post'},
    {file:'./restapi/getSwapPools',   path:'/restapi/find/sp',          method:'findSwapPools',   type:'post'},

  ],
  doRelease : function(connection)
  {
    connection.release(
      function(err) {
        if (err) {
          console.error(err.message);
        }
      });
  }
}
