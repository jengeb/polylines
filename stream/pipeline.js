
var split = require('split'),
    through = require('through2'),
    model = require('pelias-model'),
    parser = require('./parser'),
    unwrap = require('./unwrap'),
    centroid = require('./centroid'),
    document = require('./document'),
    adminLookup = require('pelias-wof-admin-lookup').create;

const adminLayers = ['neighbourhood', 'borough', 'locality', 'localadmin',
  'county', 'macrocounty', 'region', 'macroregion', 'dependency', 'country'];

function pipeline( streamIn, streamOut ){
  return streamIn
    .pipe( split() )
    .pipe( parser( 6 ) )
    .pipe( unwrap() )
    .pipe( centroid() )
    .pipe( document( 'openstreetmap', 'street', 'polyline' ) )
    .pipe( adminLookup(adminLayers) )
    .pipe( model.createDocumentMapperStream() )
    .pipe( streamOut );
}

module.exports = pipeline;
