// babel.config.js
export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current', // Ou a versão do Node que você usa
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic', // Para React 17+ (JSX Transform automático)
      },
    ],
  ],
};