import path from "path";
import webpack from "webpack";

module.exports = {
    entry: './charrez_architecture_gui/pages/index.tsx',
    output: {
        path: path.join(__dirname, 'charrez_architecture_gui'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }
        },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }]
    }
}