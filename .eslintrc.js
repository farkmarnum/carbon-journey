module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint"
  ],
  "plugins": [
    "@typescript-eslint",
    "jest",
    "react",
    "react-hooks",
    "prettier"
  ],
  "parserOptions": {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    "sourceType": "module"
  },
  "env": {
    "browser": false,
    "es6": true,
    "node": true
  },
  "rules": {
    "no-console": [
      "error",
      {
        "allow": [
          "warn",
          "error",
          "info"
        ]
      }
    ],
    "prefer-destructuring": [
      "error",
      {
        "VariableDeclarator": {
          "array": false,
          "object": true
        },
        "AssignmentExpression": {
          "array": false,
          "object": false
        }
      },
      {
        "enforceForRenamedProperties": false
      }
    ],
    "prettier/prettier": "error"
  },
  "settings": {
    "react": {
      "version": "detect",
    },
  },
}
