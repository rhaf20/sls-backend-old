module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/?(*.)+(spec).ts',
  ],
  testPathIgnorePatterns: ['.webpack/'],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};
