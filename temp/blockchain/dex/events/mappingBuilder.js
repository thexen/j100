/*




*/
const {abiEventBuild}                                           = require ( './utils/abiBuilder.js' );
const abiEventMappers                                           = require ( './mapper/abiEventMappers.js' );

const abiEventMapper                                            = abiEventBuild( undefined, abiEventMappers.abiEventMapper_info );

module.exports = {
  abiEventMapper,
}