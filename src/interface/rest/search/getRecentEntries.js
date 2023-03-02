const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getRecentEntriesValidation = {
  query: Joi.object({}),
};

async function getRecentEntries(req, res) {
  res.json({
    searches: [
      {
        name: "Dalai Llama",
        ipfsHash: "bafybeiemgfsgj5fzn26x7fs27eeuuaa6yeevlsp45hrj3tu4xvhnpfs6l4",
        previewURL: null,
        prefferedGateway: 'https://w3s.link/api/v0',
        timestamp: 1677760068527
      },
      {
        name: "Dalai Llama",
        ipfsHash: "bafybeiemgfsgj5fzn26x7fs27eeuuaa6yeevlsp45hrj3tu4xvhnpfs6l4",
        previewURL: null,
        prefferedGateway: 'https://w3s.link/api/v0',
        timestamp: 1677760068527
      },
      {
        name: "Dalai Llama",
        ipfsHash: "bafybeiemgfsgj5fzn26x7fs27eeuuaa6yeevlsp45hrj3tu4xvhnpfs6l4",
        previewURL: null,
        prefferedGateway: 'https://w3s.link/api/v0',
        timestamp: 1677760068527
      },
      {
        name: "Dalai Llama",
        ipfsHash: "bafybeiemgfsgj5fzn26x7fs27eeuuaa6yeevlsp45hrj3tu4xvhnpfs6l4",
        previewURL: null,
        prefferedGateway: 'https://w3s.link/api/v0',
        timestamp: 1677760068527
      },
      {
        name: "Dalai Llama",
        ipfsHash: "bafybeiemgfsgj5fzn26x7fs27eeuuaa6yeevlsp45hrj3tu4xvhnpfs6l4",
        previewURL: null,
        prefferedGateway: 'https://w3s.link/api/v0',
        timestamp: 1677760068527
      },
      {
        name: "Dalai Llama",
        ipfsHash: "bafybeiemgfsgj5fzn26x7fs27eeuuaa6yeevlsp45hrj3tu4xvhnpfs6l4",
        previewURL: null,
        prefferedGateway: 'https://w3s.link/api/v0',
        timestamp: 1677760068527
      },
      {
        name: "Dalai Llama",
        ipfsHash: "bafybeiemgfsgj5fzn26x7fs27eeuuaa6yeevlsp45hrj3tu4xvhnpfs6l4",
        previewURL: null,
        prefferedGateway: 'https://w3s.link/api/v0',
        timestamp: 1677760068527
      },
      {
        name: "Dalai Llama",
        ipfsHash: "bafybeiemgfsgj5fzn26x7fs27eeuuaa6yeevlsp45hrj3tu4xvhnpfs6l4",
        previewURL: null,
        prefferedGateway: 'https://w3s.link/api/v0',
        timestamp: 1677760068527
      },
      {
        name: "Dalai Llama",
        ipfsHash: "bafybeiemgfsgj5fzn26x7fs27eeuuaa6yeevlsp45hrj3tu4xvhnpfs6l4",
        previewURL: null,
        prefferedGateway: 'https://w3s.link/api/v0',
        timestamp: 1677760068527
      },
      {
        name: "Dalai Llama",
        ipfsHash: "bafybeiemgfsgj5fzn26x7fs27eeuuaa6yeevlsp45hrj3tu4xvhnpfs6l4",
        previewURL: null,
        prefferedGateway: 'https://w3s.link/api/v0',
        timestamp: 1677760068527
      },
    ]
  });
}

module.exports = [validate(getRecentEntriesValidation), getRecentEntries];
