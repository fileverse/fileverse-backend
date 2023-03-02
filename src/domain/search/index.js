const data = require('./data.json');
const LRUCache = require('lru-cache');

const cache = new LRUCache({
  max: 10,
});

cache.load(data);

function searchEntry({ ipfsHash, name, previewURL, prefferedGateway }) {
  cache.set(ipfsHash, {
    ipfsHash,
    name,
    previewURL,
    prefferedGateway,
    timestamp: Date.now(),
  });
  return;
}

async function getRecents() {
  const entries = [];
  cache.forEach((value, key) => {
    console.log({ value, key });
    entries.push(value);
  });
  console.log(JSON.stringify(cache.dump()));
  return entries;
}

module.exports = { searchEntry, getRecents };
