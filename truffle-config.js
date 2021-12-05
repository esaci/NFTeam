const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: "^0.8.6"
    },
  },
  networks: {
    development: {
      host: "127.0.0.1",
      network_id: 1337,
      port: 8544
    }
  }
};
