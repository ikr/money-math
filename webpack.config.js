module.exports = function (env) {
	'use strict'

	const webpack = require('webpack'),
		path = require('path'),
		source = 'src',
		output = 'lib',
		config = [];

	return [{
		name: 'Money',
		entry: './dist/money',
		mode: "production",
		resolve: {
			// modules: [source]
		},
		output: {
			filename: './money.min.js',
			library: 'Money',
			libraryTarget: 'umd',
			umdNamedDefine: false
		}
	}];
}
