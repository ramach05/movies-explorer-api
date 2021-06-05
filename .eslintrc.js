module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'airbnb-base'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  rules: {
    // 'no-console': 0, // вывод консоли в коде
    // 'max-len': 0, // ограничение длины строки
    'no-underscore-dangle': [
      'error',
      { allow: ['_id', '_doc'] }, // позволяет указанным идентификаторам иметь нижнее подчеркивания
    ],
  },
};
