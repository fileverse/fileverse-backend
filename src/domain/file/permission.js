const ErrorHandler = require('../../infra/utils/errorHandler');
const { File } = require('../../infra/database/models');

function setRead({ fileOwner, viewer, filePermission }) {
  if (filePermission === 'public') {
    return true;
  }
  if (filePermission === 'unlisted') {
    return true;
  }
  return fileOwner.toString() === viewer.toString();
}

function setWrite({ fileOwner, viewer }) {
  if (!fileOwner || !viewer) {
    return false;
  }
  return fileOwner.toString() === viewer.toString();
}

async function permission({ uuid, userId }) {
  const file = await File.findOne({ uuid });
  if (!file) {
    return ErrorHandler.throwError({ code: 404, message: 'Cannot find the file by this uuid' });
  }
  const permission = {
    read: false,
    edit: false,
  };
  permission.read = setRead({
    fileOwner: file.owner,
    viewer: userId,
    filePermission: file.permission,
  });
  permission.write = setWrite({
    fileOwner: file.owner,
    viewer: userId,
    filePermission: file.permission,
  });
  return permission;
}

module.exports = permission;
