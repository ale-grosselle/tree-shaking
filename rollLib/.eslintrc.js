// https://eslint.org/docs/user-guide/configuring
module.exports = {
	root: true,
	parserOptions: {
		parser: 'babel-eslint'
	},
	env: {
		browser: true
	},
	// https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
	// consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
	extends: ['plugin:vue/essential'],
	// required to lint *.vue files
	plugins: ['vue', 'flowtype-errors'],
	// add your custom rules here
	rules: {
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'flowtype-errors/show-errors': 2,

        'no-extra-semi': 1,
		'no-unsafe-negation': 1,
		'curly': [1, 'all'],
        'dot-location': [1, 'property'],
		'eqeqeq': 1,
		'no-floating-decimal': 1,
        'no-multi-spaces': 1,
		'no-useless-return': 1,
		'block-spacing': 1,
		'brace-style': [1, "1tbs"],
		'comma-spacing': 1,
		'func-call-spacing': 1,
		'indent': [1, 'tab'],
		'key-spacing': 1,
		'keyword-spacing': 1,
		'new-parens': 1,
		'no-multiple-empty-lines': 1,
		'no-trailing-spaces': 1,
		'no-whitespace-before-property': 1,
		'quotes': 1,
		'semi': 1,
		'semi-spacing': 1,
		'semi-style': 1,
		'space-before-blocks': 1,
        'space-before-function-paren': [1, 'never'],
		'space-in-parens': 1,
		'space-unary-ops': 1,
		'switch-colon-spacing': 1
    }
};
