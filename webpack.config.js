
module.exports = {
    output: {
        path: "./dist/",
        filename: 'diteral.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            }
        ]
    }
};