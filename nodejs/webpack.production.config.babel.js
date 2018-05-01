const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const nodeExternals = require('webpack-node-externals');
const ImageMinPlugin = require('imagemin-webpack-plugin').default;

const extractLess = new ExtractTextPlugin({
	filename: 'style.[name].[contenthash].css'
});

const serverConfig = {
	/* Build Target is Node Server, not Browser */
	target: 'node',
	node: {
		__dirname: false,
		__filename: false
	},

	/* Create Source Maps */
	/* devtool: 'source-map',*/

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
					'file-loader?emitFile=false&name=[name].[hash].[ext]'
				]
			}
		]
	},
  resolve: {
		alias: {
			react: 'preact-compat',
			'react-dom': 'preact-compat',
			'react-addons-test-utils': 'preact-test-utils',
			'react-addons-css-transition-group': 'preact-css-transition-group',
			'create-react-class': 'preact-compat/lib/create-react-class'
		}
	}
	// resolve: {
	// 	/* redirect imports to preact */
	// 	alias: {
	// 		react: 'preact-compat',
	// 		'react-dom': 'preact-compat',
	// 		'react-addons-test-utils': 'preact-test-utils',
	// 		'react-addons-css-transition-group': 'preact-css-transition-group',
	// 		'create-react-class': 'preact-compat/lib/create-react-class'
	// 	}
	// },

	/* Exclude external dependencies from bundle */
	externals: [
		'./public/assets/manifest.json',
		nodeExternals()
	]
};

const clientConfig = {
	/* Build Target is Client/Browser */
	target: 'web',

	/* Create Source Maps */
	devtool: 'source-map',

	/* Main Entry Points for Client */
	entry: {
		/* Events Admin */
		main: './app/main.js',

		/* Standalone Features wrapped by Rails */
		SingleEvent: './app/standalone/SingleEvent/main.js',
		PasswordChange: './app/standalone/PasswordChange/main.js',
		PlanDiscovery: './app/standalone/PlanDiscovery/main.js',
		Bible: './app/standalone/Bible/main.js',
		SubscribeUser: './app/standalone/SubscribeUser/main.js',
		Footer: './app/standalone/Footer/main.js',
		Header: './app/standalone/Header/main.js',
		Unsubscribe: './app/standalone/Unsubscribe/main.js',
		Notifications: './app/standalone/Notifications/main.js',
		VOTD: './app/standalone/VOTD/main.js',
		Explore: './app/standalone/Explore/main.js',
		Snapshot: './app/standalone/Snapshot/main.js'
	},

	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'public/assets'),

		/* Path prefix when importing assets */
		publicPath: '/assets/'
	},

	plugins: [
		/* 3.0 Scope-Hoisting */
		new webpack.optimize.ModuleConcatenationPlugin(),

		/* Extract all Vendor Javascript to separate bundle */
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks(module, count) {

				/* Exclude Specific Modules */
				if (module.context && module.context.indexOf('moment-timezone') !== -1) {
					return false;
				}

				if (module.context && module.context.indexOf('quill') !== -1) {
					return false;
				}

				return module.context && module.context.indexOf('node_modules') !== -1 && count > 1;
			}
		}),

		/* Create manifest.json file with name to fingerprint mappings */
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			minChunks: Infinity
		}),

		/* Don't Uglify JS on Staging */
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			comments: false
		}),

		/* Build this bundle with NODE_ENV=staging */
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),

		/* Extract CSS into separate file */
		extractLess,

		/* Used for generating manifest.json */
		new ManifestPlugin(),

		/* Run images through ImageMin */
		new ImageMinPlugin({
			pngquant: {
				quality: '65-80'
			}
		})
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
						loader: 'css-loader',
						options: {
							minimize: true
						}
					}, {
						loader: 'less-loader'
					}],
					fallback: 'style-loader'
				})
			},

			/* Process Image files */
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader?name=[name].[hash].[ext]'
				]
			}
		]
	},
  resolve: {
		alias: {
			react: 'preact-compat',
			'react-dom': 'preact-compat',
			'react-addons-test-utils': 'preact-test-utils',
			'react-addons-css-transition-group': 'preact-css-transition-group',
			'create-react-class': 'preact-compat/lib/create-react-class'
		}
	}
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

module.exports = [ serverConfig, clientConfig ];
