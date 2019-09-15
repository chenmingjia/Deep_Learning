const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

function getCssLoaderConfig(dev, modules = false) {

    if (modules) {
        modules = {
            localIdentName: '[name]__[local]___[hash:base64:5]',
        };
    }

    return {
        loader: require.resolve('css-loader'),
        options: {
            importLoaders: 1,
            sourceMap: dev,
            modules
        },
    };
}

const postCssLoaderConfig = {
    loader: require.resolve('postcss-loader'),
    options: {
        // Necessary for external CSS imports to work
        ident: 'postcss',
        plugins: () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
                // browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
                // please set browserslist in package.json
                flexbox: 'no-2009',
            }),
        ],
    },
};

const lessLoaderConfig = {
    loader: require.resolve('less-loader'),
    options: {
        javascriptEnabled: true,
    },
};


function getStyleCongfigs(dev, options) {
    const extractLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: dev,
        },
    };
    const styleLoader = {
        loader: require.resolve('style-loader')
    };

    const defaultLoader = extractLoader;

    const loaders = [
        {
            test: /\.css$/,
            exclude: /\.m(odule)?\.css$/,
            use: [
                defaultLoader,
                getCssLoaderConfig(dev),
                postCssLoaderConfig,
            ],
        },
        {
            test: /\.m(odule)?\.css$/,
            use: [
                defaultLoader,
                getCssLoaderConfig(dev, true),
                postCssLoaderConfig,
            ],
        },
        {
            test: /\.less$/,
            exclude: /\.m(odule)?\.less$/,
            use: [
                defaultLoader,
                getCssLoaderConfig(dev),
                postCssLoaderConfig,
                lessLoaderConfig,
            ],
        },
        {
            test: /\.m(odule)?\.less$/,
            use: [
                defaultLoader,
                getCssLoaderConfig(dev, true),
                postCssLoaderConfig,
                lessLoaderConfig,
            ],
        },
    ];
    return loaders;
}

exports.MiniCssExtractPlugin = MiniCssExtractPlugin;
exports.getStyleCongfigs = getStyleCongfigs;