const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

const app = express();

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.set('view engine', 'ejs'); //enable ejs in express
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //fetch files from file public

let address = ""

// List for Today's To-do-List
app.get("/", function(req, res) {
  address = req.url;

  const day = date.getDay();

  res.render("list", {listTitle: day, newListItems: items, theAddress: address}); // searches views folder and finds list.ejs
});

app.post("/", function(req, res) {
  const item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});

// List for Work To-do-List
app.get("/work", function(req, res) {
  address = req.url;
  res.render("list", {listTitle: "Work List", newListItems: workItems, theAddress: address});
});

app.post("/work", function(req, res) {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
