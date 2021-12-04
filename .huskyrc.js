// .huskyrc.js
module.exports = {
  "hooks": {
    "pre-commit": "npm run lint:fix && git add ."
  }
}
