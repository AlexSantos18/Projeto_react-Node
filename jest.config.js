// jest.config.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  // Ative a transformação com babel-jest
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // Transforma arquivos .js e .jsx com babel-jest
  },
  // Mapear módulos CSS para um mock
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};