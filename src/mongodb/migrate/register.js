// This file is loaded by "migrate" to register TypeScript

const { register } = require("ts-node");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../../../.env.local"),
});

module.exports = () => {
  register({
    compilerOptions: {
      module: "commonjs",
      moduleResolution: "node",
      target: "es2019",
    },
  });
};
