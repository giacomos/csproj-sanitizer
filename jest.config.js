module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json'
        }
    },
    moduleFileExtensions: [
        'ts',
        'js',
        'json'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    testMatch: [
        '**/test/**/*.test.(ts|js)'
    ],
    testEnvironment: 'node',
    collectCoverageFrom: [
        "src/**/*.{js,ts}",
        "!<rootDir>/node_modules/",
        "!<rootDir>/dist/",
        "!<rootDir>/src/types/*"
    ]
};