// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "node",
//   // Root directory adalah tempat jest.config.js berada
//   rootDir: ".",
//   // Direktori utama untuk kode sumber (untuk module resolution)
//   roots: ["<rootDir>/src"],
//   // Pola pencarian file test
//   testMatch: [
//     "<rootDir>/tests/**/*.test.ts",
//     // "<rootDir>/src/tests/**/*.test.ts", // Test di folder src/tests/
//     // "<rootDir>/src/**/__tests__/**/*.test.ts", // Test di __tests__/ dalam src/
//     // "<rootDir>/tests/**/*.test.ts",
//   ],
//   // Mapping path (opsional, jika menggunakan alias import)
//   moduleNameMapper: {
//     "^@/(.*)$": "<rootDir>/src/$1", // Contoh: Gunakan @/ untuk merujuk ke src/
//   },
//   // File yang diabaikan saat coverage
//   coveragePathIgnorePatterns: ["/node_modules/", "/uploads/", "/src/tests/"],
// };

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/uploads/", "/tests/"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  coverageReporters: ["html"],
  collectCoverage: true,

  setupFiles: ["<rootDir>/src/config/load-env.ts"],
};