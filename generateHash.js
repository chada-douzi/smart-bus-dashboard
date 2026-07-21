const bcrypt = require("bcrypt");

bcrypt.hash("admin123", 10).then(hash => {
  console.log("NEW HASH:");
  console.log(hash);
});