var fs = require('fs')
  , path = require('path');


//want to use url and datapackage-jsonld in couchdb => install all the deps.
//TODO find a better way to do this, this is hacky and shitty
exports.punycode = fs.readFileSync(require.resolve('../../node_modules/url/node_modules/punycode'), 'utf8');
exports.querystring = fs.readFileSync(require.resolve('../../node_modules/url/node_modules/querystring'), 'utf8');
exports.url = fs.readFileSync(require.resolve('../../node_modules/url'), 'utf8');
exports['is-url'] = fs.readFileSync(require.resolve('is-url'), 'utf8');

exports.semver = fs.readFileSync(require.resolve('semver'), 'utf8'); 

exports.tv4 = fs.readFileSync(require.resolve('tv4'), 'utf8') + '\n'; //note the '\n' (fuck my life)
exports['container-jsonld'] = fs.readFileSync(require.resolve('container-jsonld'), 'utf8');
exports['padded-semver'] = fs.readFileSync(require.resolve('padded-semver'), 'utf8');
exports['ctnr-util'] =
  [ 'exports.root = root',
    function root(req){     
      //hacky: TO BE IMPROVED
      var protocol = (req.query.secure) ? 'https' : 'http';
      if(req.headers.Host.split(':')[1] == 443){
        protocol = 'https';
      }
      return protocol + '://' + req.headers.Host;
    },

    'exports.clean = clean',
    function clean(ctnr, req){
      delete ctnr._id; 
      delete ctnr._rev;
      delete ctnr._revisions;
      delete ctnr._attachments;

      if(! req.query.contentData){
        if('dataset' in ctnr){
          ctnr.dataset.forEach(function(d){
            if(d.distribution){
              delete d.distribution.contentData;
            }
          });
        }
      }

      return ctnr;
    },

    'exports.extname = extname',
    function extname(filename) {
      var i = filename.lastIndexOf('.');
      return (i < 0) ? '' : filename.substr(i);
    }    
  ].map(function (s) { return s.toString() + ';' }).join('\n');
