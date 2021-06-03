module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"airbnb-base",
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
	},
	rules: {
		"no-console": 0,
		"no-tabs": 0,
		"spaced-comment": 0,
		"max-len": 0,
		"no-underscore-dangle": [
			"error",
			{ allow: ["_id", "_doc"] }, //позволяет указанным идентификаторам иметь нижнее подчеркивания
		],
		indent: [
			"error",
			"tab",
		],
		"linebreak-style": [
			"error",
			"unix",
		],
		quotes: [
			"error",
			"double",
		],
		semi: [
			"error",
			"always",
		],
	},
};
