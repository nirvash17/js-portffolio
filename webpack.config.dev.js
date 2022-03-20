const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'production', // LE INDICO EL MODO EXPLICITAMENTE
    entry: './src/index.js', // el punto de entrada de mi aplicación
    output: { // Esta es la salida de mi bundle
        path: path.resolve(__dirname, 'dist'),
        // resolve lo que hace es darnos la ruta absoluta de el S.O hasta nuestro archivo
        // para no tener conflictos entre Linux, Windows, etc
        filename: '[name].[contenthash].js', 
        // EL NOMBRE DEL ARCHIVO FINAL,
        // assetModuleFilename: 'assets/[hash][ext][query]'
    },
    mode: 'development',
    watch: true,
    resolve: {
        extensions: ['.js'], // LOS ARCHIVOS QUE WEBPACK VA A LEER
        alias: {
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images'),

        }
    },
    module: {
        // REGLAS PARA TRABAJAR CON WEBPACK
        rules : [
            {
                test: /\.m?js$/, // LEE LOS ARCHIVOS CON EXTENSION .JS,
                exclude: /node_modules/, // IGNORA LOS MODULOS DE LA CARPETA
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css|.styl$/i,
                use: [MiniCssExtractPlugin.loader,
                'css-loader',
                'stylus-loader'
            ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                //Se esta usando la propiedad assetModuleFilename para asignar el directorio de salida de las imagenes, asi que no es necesario usar generator - filename
                // generator: {
                //   filename: 'static/images/[hash][ext][query]',
                // },
            },
            { //Desde webpack 5 url-loader y file-loader viene ya incorporadors, dejando la configuramcion mas sencilla
                test: /\.(woff|woff2)$/i,  // Tipos de fuentes a incluir
                type: 'asset/resource',  // Tipo de módulo a usar (este mismo puede ser usado para archivos de imágenes)
                generator: {
                  filename: 'assets/fonts/[hash][ext][query]',  // Directorio de salida
                },
              },
        ]
    },
    // SECCION DE PLUGINS
    plugins: [
        new HtmlWebpackPlugin({ // CONFIGURACIÓN DEL PLUGIN
            inject: 'body', // INYECTA EL BUNDLE AL TEMPLATE HTML
            template: './public/index.html', // LA RUTA AL TEMPLATE HTML
            filename: './index.html' // NOMBRE FINAL DEL ARCHIVO
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),

        //Se esta usando el loader natural de imagenes de webpack, que las genera con un hash uncico para que se usen estas en el proyecto, asi que no es necesario el plubin para copiar
        // new CopyPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, "src", "assets/images"),
        //             to: "assets/images"
        //         }
        //     ]
        // })
        new Dotenv(),
    ],
    /* En el modo dev no se necesita la optimizacion, sino ver cuando funciona el codigo */
    // optimization: {
    //     minimize: true,
    //     minimizer: [
    //         new CssMinimizerPlugin(),
    //         new TerserPlugin(),
    //     ]
    // }
}