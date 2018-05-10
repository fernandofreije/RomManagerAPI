// https://eslint.org/docs/user-guide/configuring

module.exports = {
  "extends": "airbnb-base",
  "env": {
      "es6": true,
      "browser": true,
      "node": true
  },
  "rules": {
      "linebreak-style": ["error", "windows"],
      "no-console": "off",
      "comma-dangle": "off",
      "arrow-parens": ["error", "as-needed"]
  }
}
