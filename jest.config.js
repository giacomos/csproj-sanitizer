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
        '**/test/**/*.test.ts'
    ],
    testPathIgnorePatterns: [
        '/(node_modules|lib)/'
    ],
    testEnvironment: 'node',
    collectCoverageFrom: [
        "src/**/*.{js,ts}",
        "!<rootDir>/src/cli.ts",
        "!<rootDir>/node_modules/",
        "!<rootDir>/dist/",
        "!<rootDir>/src/types/*"
    ],
    coverageReporters: [
        "json-summary",
        "text",
        "lcov"
    ]
};
