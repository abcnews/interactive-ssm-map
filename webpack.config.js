const { webpackConfig } = require('@abcnews/aunty/webpacker');

let config = webpackConfig();

config.module.rules.push({
    test: /\.csv$/,
    loader: 'csv-loader',
    options: {
        dynamicTyping: true,
        header: true
    }
});

config.resolve = {
    alias: {
        react: 'preact-compat',
        'react-dom': 'preact-compat'
    }
};

module.exports = config;
