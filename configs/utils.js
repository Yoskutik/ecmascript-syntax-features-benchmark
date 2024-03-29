const path = require('path');
const glob = require('glob');
const HtmlPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

const createSWCConfig = (target) => ({
  jsc: { target, externalHelpers: true },
});

const createBaseWebpackConfig = (dir, loader, options, type, entries, isMobile) => ({
  mode: 'production',
  entry: entries,
  output: {
    path: path.join(__dirname, `../build/${dir}`),
    filename: '[name].js',
    clean: type === 'execution',
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [{ test: /\.ts?$/, loader, options }],
  },
  plugins: [
    new DefinePlugin({
      BUILD_TYPE: JSON.stringify(type),
      IS_FOR_MOBILE: JSON.stringify(isMobile),
    }),
    ...Object.keys(entries).map(key => (
      new HtmlPlugin({
        template: `./src/${type}.template.html`,
        filename: `${key}.html`,
        inject: false,
        asset: key,
      })
    )),
  ],
});

exports.createConfigs = (type, entries, isMobile) => {
  const createConfig = (dir, loader, options) => (
    createBaseWebpackConfig(`${type}/${dir}`, loader, options, type, entries, isMobile)
  );

  return [
    createConfig('typescript-legacy', 'ts-loader', {
      configFile: 'tsconfig.legacy.json',
    }),

    createConfig('babel-legacy', 'babel-loader', {
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-env',
          {
            targets: '> 0.01%',
            bugfixes: true,
          },
        ],
      ],
      plugins: [
        '@babel/plugin-transform-runtime',
      ],
    }),

    createConfig('swc-legacy', 'swc-loader', createSWCConfig('es5')),

    createConfig('modern', 'swc-loader', createSWCConfig('es2022')),
  ];
};
