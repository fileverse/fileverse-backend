async function upload({ file }) {
  console.log(file);
  return { url: 'https://google.com', mimetype: 'html' };
}

module.exports = upload;
