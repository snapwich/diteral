
module.exports = {
    output: {
        path: "./dist/",
        filename: 'diteral.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015"]
                }
            }
        ]
    }
};