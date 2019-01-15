const path = require("path");
//引入uglifyjs-webpack-plugin插件  用于压缩js
const uglify = require('uglifyjs-webpack-plugin');
//引入html-webpack-plugin插件  用于打包html
const htmlPlugin = require('html-webpack-plugin');
//css分离和图片路径处理
const extractTextPlugin = require('extract-text-webpack-plugin');
//配置路径
var website = {
	publicPath:"http://localhost:8888/"
	//publicPath:"http://192.168.1.192:8888" //根据IP地址
}

module.exports={
	mode:'development',
	//入口文件配置项
	entry:{
		//里面的main是可以随便写的
		main:'./src/main.js',
		main2:'./src/main2.js'

	},
	//出口文件配置项
	output:{
		//打包的路径
		path:path.resolve(__dirname,'../dist'),
		//打包的文件名称
		filename:'[name].js',
		publicPath:website.publicPath  //主要用来处理静态文件路径
	},
	//模块，例如解读css,图片如何转换，压缩
	module:{
		rules:[
			//css loader
			{
				test:/\.css$/,
				// use:[
				// 	{loader:"style-loader"},
				// 	{loader:"css-loader"}
				// ]
				//css分离后要重新配置
				use:extractTextPlugin.extract({
					fallback:"style-loader",
					use:"css-loader"
				})
			},
			{
				//用于非img标签的背景图片
				test:/\.(png|jpg|gif|jpeg)/,//匹配图片格式
				use:[{
					loader:"url-loader",//指定使用的loader和loader的配置参数
					options:{
						limit:500,//是把小于500B的文件打成Base64的格式，写入js
						outputPath:'images/',//打包的图片入到images文件夹下
					}
				}]
			},
			{
				//用于<img>标签引入的图片
				test:/\.(htm|html)$/i,
				use:['html-withimg-loader']
			},
		]
	},
	//插件，用于生产模板和各项功能
	plugins:[
		//js压缩  ugligy 是插件，但是webpack版本默认集成了
		new uglify(),
		new htmlPlugin({
			minify:{
				//removeAttributeQuotes是去掉属性的双引号
				removeAttributeQuotes:true
			},
			//为了开发中js有缓存效果，所以加入Hash，这样可以有效避免缓存js
			hash:true,
			template:'./src/index.html' //是要打包的html模版路径和文件名称
		}),
		new extractTextPlugin("css/index.css")
	],
	//配置webpack开发服务功能
	devServer:{
		//设置基本目录结构
		contentBase:path.resolve(__dirname,'../dist'),
		//服务器的IP地址，可以使用IP也可以使用localhost
		host:'localhost',
		//服务端压缩是否开启
		compress:true,
		//配置服务器端口号
		port:8888
	}
}