 
module.exports = {
  extends: 'airbnb-base',
  env: {
    browser: true
  },
  parser: 'babel-eslint',
  plugins: ['babel'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['webpack.*.js'] }
    ],
    'no-console': 'off',
    'class-methods-use-this': 'off',
  }
};