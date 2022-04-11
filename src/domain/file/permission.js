const ErrorHandler = require('../../infra/utils/errorHandler');
const { File } = require('../../infra/database/models');
const Balance = require('../../infra/utils/balance');

const balanceInstance = new Balance();

// if token-gated then check balance of user
async function setRead({
  fileOwner,
  viewer,
  filePermission,
  viewerAddress,
  fileToken,
}) {
  if (filePermission === 'public') {
    return true;
  }
  if (filePermission === 'unlisted') {
    return true;
  }
  if (filePermission === 'token-gated') {
    if (!viewer) {
      return false;
    }
    const hasAccess = await balanceInstance.verifyGreaterBalance({
      address: viewerAddress,
      contractAddress: fileToken.contractAddress,
      tokenType: fileToken.tokenType,
      gateBalance: fileToken.gateBalance,
      chain: fileToken.chain,
    });
    return fileOwner.toString() === viewer.toString() || hasAccess;
  }
  return fileOwner.toString() === viewer.toString();
}

async function setEdit({ fileOwner, viewer }) {
  if (!fileOwner || !viewer) {
    return false;
  }

  return fileOwner.toString() === viewer.toString();
}

async function permission({ uuid, userId, address }) {
  const file = await File.findOne({ $or: [{ uuid }, { slug: uuid }] }).lean();
  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }
  const permission = {
    read: false,
    edit: false,
  };
  permission.read = await setRead({
    fileOwner: file.owner,
    viewer: userId,
    filePermission: file.permission,
    viewerAddress: address,
    fileToken: file.token,
  });
  permission.edit = await setEdit({
    fileOwner: file.owner,
    viewer: userId,
    filePermission: file.permission,
  });
  permission.token = file.token;
  if (file.token) {
    permission.token.etherScanUrl = `https://etherscan.io/token/${file.token.contractAddress}`;
  }
  return permission;
}

module.exports = permission;
