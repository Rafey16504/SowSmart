module.exports = {
    testEnvironment: "node",
    roots: ["./tests"],
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "js"],
  };