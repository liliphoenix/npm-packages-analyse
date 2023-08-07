module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['prettier', 'standard-with-typescript'],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
};
