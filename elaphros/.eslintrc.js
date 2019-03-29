module.exports = {
  parserOptions: {
    ecmaFeatures: {
      arrowFunctions: true,
      binaryLiterals: true,
      blockBindings: true,
      classes: true,
      defaultParams: true,
      destructuring: true,
      forOf: true,
      generators: true,
      modules: true,
      objectLiteralComputedProperties: true,
      objectLiteralDuplicateProperties: true,
      objectLiteralShorthandMethods: true,
      objectLiteralShorthandProperties: true,
      octalLiterals: true,
      regexUFlag: true,
      regexYFlag: true,
      restParams: true,
      spread: true,
      superInFunctions: true,
      templateStrings: true,
      unicodeCodePointEscapes: true,
      globalReturn: true,
      jsx: true,
      experimentalObjectRestSpread: true,
      experimentalClassProperties: true
    }
  },
  env: {
    browser: true,
    node: true,
    jasmine: true
  },
  plugins: [
    'import'
  ],
  parser: 'babel-eslint',
  extends: [
    'airbnb-base',
    'plugin:import/errors'
  ],
  rules: {
    semi: [ "error", "never" ],
    'max-len': 0,
    'object-curly-spacing': [2, 'always'],
    'no-unused-vars': 1,
    'no-underscore-dangle': 0,
    'one-var': 0,
    'one-var-declaration-per-line': 0,
    'no-multiple-empty-lines': 0,
    'no-negated-condition': 0,
    'arrow-parens': 0,
    'arrow-body-style': [1, 'always'],
    'comma-dangle': 0,
    camelcase: 0,
    'padded-blocks': 0,
    'eol-last': 0,
    'array-bracket-spacing': 0,
    'no-useless-escape': 0,
    'no-tabs': 0,
    'operator-linebreak': 0,
    'no-control-regex': 0,
    'no-else-return': 0,
    'no-plusplus': 0,
    'no-console': 0,
    'prefer-arrow-callback': 0
  }
}
