const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const extractLess = new ExtractTextPlugin({
	filename: '[name].css'
});

const serverConfig = {
	/* Build Target is Node Server, not Browser */
	target: 'node',
	node: {
		__dirname: false,
		__filename: false
	},

	/* Create Source Maps */
	devtool: 'cheap-eval-source-map',

	/* Main Entry Point for Server */
	entry: {
		www: './bin/www.js'
	},

	output: {
		filename: 'server.compiled.js',
		path: path.resolve(__dirname),
		libraryTarget: 'commonjs2',
		pathinfo: true,

		/* Path prefix when importing assets */
		publicPath: '/assets/'
	},

	plugins: [
		/* Put all CSS into separate file */
		extractLess,

		/* For the future, break output files into chunks */
		new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
	],

	module: {
		rules: [
			/* Process Javascript files with Babel */
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: [{
					loader: 'babel-loader'
				}]
			},

			/* Process LESS and CSS files */
			{
				test: /\.less$/,
				use: extractLess.extract({
					use: [{
						loader: 'css-loader/locals'
					}, {
						loader: 'less-loader'
					}],
					fallback: 'css-loader/locals'
				})
			},

			/* Process Image files */
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader?emitFile=false&name=[name].[ext]'
				]
			}
		]
	},

	/* Exclude external dependencies from bundle */
	externals: [nodeExternals()],

	// resolve: {
	// 	/* redirect imports to preact */
	// 	alias: {
	// 		react: 'preact-compat',
	// 		'react-dom': 'preact-compat',
	// 		'react-addons-test-utils': 'preact-test-utils',
	// 		'react-addons-css-transition-group': 'preact-css-transition-group',
	// 		'create-react-class': 'preact-compat/lib/create-react-class'
	// 	}
	// }
};

module.exports = serverConfig;
