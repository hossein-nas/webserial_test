module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/essential"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "parser": "babel-eslint",
  "plugins": [
    "vue"
  ],
  "rules": {
    "no-undef" : "off",
    "no-empty" : "off",
    "no-prototype-builtins" : "off",
    "no-unused-vars" : "off",
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
