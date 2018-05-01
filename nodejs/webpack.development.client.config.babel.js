const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const extractLess = new ExtractTextPlugin({
	filename: '[name].css'
});

const clientConfig = {
	/* Build Target is Node Server, not Browser */
	target: 'web',

	/* Create Source Maps */
	devtool: 'cheap-eval-source-map',

	devServer: {
		compress: true,
		overlay: true,
		port: 9000,
		publicPath: '/assets/',
		headers: {
			'X-From-Webpack-Dev-Server': 'true'
		},
		watchOptions: {
			aggregateTimeout: 4000,
			ignored: /node_modules/
		},
	},


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
		filename: '[name].js',
		path: path.resolve(__dirname, 'public/assets'),

		/* Path prefix when importing assets */
		publicPath: '/assets/'
	},

	plugins: [
		/* Extract all Vendor Javascript to separate bundle */
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks(module) {
				return module.context && module.context.indexOf('node_modules') !== -1;
			}
		}),

		/* Create manifest.json file with name to fingerprint mappings */
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest'
		}),

		/* Build this bundle with NODE_ENV=staging */
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('staging')
		}),

		/* Extract CSS into separate file */
		extractLess,

		/* Used for generating manifest.json */
		new ManifestPlugin(),
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
						loader: 'css-loader'
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
					'file-loader?name=[name].[ext]'
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

module.exports = clientConfig;
