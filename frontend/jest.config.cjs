module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^axios$": require.resolve("axios"),
    },
    transformIgnorePatterns: ["node_modules/(?!(axios)/)"],
    extensionsToTreatAsEsm: [".ts", ".tsx"],
};
