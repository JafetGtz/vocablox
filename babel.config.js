module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],       // dónde busca imports “absolutos”
        alias: {
          '@': './src',         // '@' → carpeta src
        },
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
        ],
      },
    ],
  ],
};
