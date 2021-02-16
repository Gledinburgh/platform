const express = require("express")
const app = express();
const PORT = 3000;
const path = require("path")

app.use(express.static(__dirname + '/client'));
console.log(__dirname + 'client');
app.listen(PORT, () => console.log (`server running on port ${PORT}`))