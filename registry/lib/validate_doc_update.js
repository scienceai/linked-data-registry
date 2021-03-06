module.exports = function(newDoc, oldDoc, userCtx, secObj){

  if (!userCtx || (userCtx && !userCtx.name)) {
    throw { unauthorized: 'Please log in before writing to the db' };
  }

  function _isAdmin () {
    if (secObj &&
        secObj.admins) {
      if (secObj.admins.names &&
          secObj.admins.roles &&
          secObj.admins.names.indexOf(userCtx.name) !== -1) return true;
      for (var i=0;i<userCtx.roles.length;i++) {
        if (secObj.admins.roles.indexOf(userCtx.roles[i]) !== -1) return true;
      }
    }
    return userCtx && userCtx.roles.indexOf("_admin") >= 0;
  };

  function _canWrite () {
    if (_isAdmin()) return true;

    for (var i = 0; i< userCtx.roles.length; i ++) {
      if (userCtx.roles[i].charAt(0) === '_') continue;

      var splt = userCtx.roles[i].split('@');
      var ns = splt[0];
      var permissions = splt[1] || '';

      if (
          permissions.indexOf('w') !== -1 &&
          ns === (newDoc['@id'] || oldDoc['@id']).split(':')[1] //we use || oldDoc in case of deletion as in those cases there won't be a newDoc
      ) {
        return true;
      }
    }

    return false;
  };

  if (!_canWrite()) {
    throw { forbidden: 'user: ' + userCtx.name + ' not authorized to maintain ' + (newDoc['@id'] || oldDoc['@id']) };
  }

  if (newDoc._deleted) return;

  if (oldDoc && newDoc) {
    if(oldDoc['@id'] !== newDoc['@id']) {
      throw { forbidden: '@id should not be modified' };
    }

    if (!_isAdmin() && ('version' in oldDoc)) {
      throw { forbidden: 'versionned doc cannot be updated' };
    }

    if (!_isAdmin() && (oldDoc.latest !== newDoc.latest)) {
      throw { forbidden: 'only admin can change tags' };
    }
  }

};
