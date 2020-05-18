let express = require("express");
let app = express();

app.use(express.static("./src"));

app.listen(8080, function () {
  console.log("Listening on port http://localhost:8080");
});
