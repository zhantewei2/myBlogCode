module.exports={
	rules:[
				{test: /\.ts$/,use:[
					'awesome-typescript-loader',
					'angular2-template-loader',
					'angular-router-loader?aot=true'
				]},
				{test:/\.json$/,use:'json-loader'},

				{test:/\.html$/,use:'raw-loader'},
				{test:/\.(jpg|png|gif)/,use:'file-loader?name=[path][name].[ext]'},
				{test:/\.css$/,use:['to-string-loader','css-loader']}
			]
}