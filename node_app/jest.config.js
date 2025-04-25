module.exports = {
    testEnvironment: "node", // Use Node.js environment for backend tests
    roots: ["./tests"], // Specify the folder containing your tests
    transform: {
      "^.+\\.tsx?$": "ts-jest", // Transform TypeScript files using ts-jest
    },
    moduleFileExtensions: ["ts", "js"], // Support both TypeScript and JavaScript files
  };