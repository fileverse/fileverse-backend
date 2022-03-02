const ErrorHandler = require('../../infra/utils/errorHandler');
const { File, Comment } = require('../../infra/database/models');
const file = require('../file');

async function setRead({ fileUuid, userId }) {
  const filePermission = await file.permission(fileUuid, userId);
  return filePermission.read;
}

function setEdit({ commenter, editor }) {
  if (!commenter || !editor) {
    return false;
  }
  return commenter.toString() === editor.toString();
}

async function permission({ uuid, userId, shortId }) {
  const file = await File.findOne({ uuid });
  const comment = await Comment.findOne({ shortId });
  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }
  if (!comment) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the comment by this shortId',
    });
  }
  const permission = {
    read: false,
    edit: false,
  };
  permission.read = setRead({
    fileUuid: file.uuid,
    userId,
  });
  permission.edit = setEdit({
    commenter: comment.userId,
    editor: userId,
  });
  return permission;
}

module.exports = permission;
