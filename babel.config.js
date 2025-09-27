module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'], // dónde busca imports “absolutos”
        alias: {
          '@': './src',   // '@' → carpeta src
        },
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
        ],
      },
    ],
    // Plugin de worklets (para Reanimated u otros casos)
    'react-native-reanimated/plugin',
  ],
};
