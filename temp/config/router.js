module.exports = {
  server_port: 8080,
  route_info: [
    
    {file:'./metadata/create',        path:'/metadata/create',          method:'create',          type:'post'},
    {file:'./metadata/download',      path:'/metadata/download/:cid',   method:'download',        type:'get'},
    {file:'./metadata/get',           path:'/metadata/get/:cid',        method:'get',             type:'get'},

    {file:'./metadata/dumy',          path:'/metadata/dumy',            method:'dumy',            type:'post'},

    {file:'./restapi/query',          path:'/restapi/search/query',     method:'searchQuery',     type:'post'},
    {file:'./restapi/update',         path:'/restapi/update/query',     method:'updateQuery',     type:'post'},

    {file:'./ipfs/ipfs',              path:'/ipfs/get/:CID',           method:'ipfsGetFile',      type:'get'},

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
