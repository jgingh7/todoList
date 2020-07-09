const express = require('express');
const bodyParser = require('body-parser');
// requiring a module located in the address
const date = require(__dirname + '/date.js'); //local, not installed using npm, so need __dirname

const app = express();

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.set('view engine', 'ejs'); //enable ejs in express
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //fetch files from file public

// List for Today's To-do-List
app.get("/", function(req, res) {
  const day = date.getDate(); // requireing from date.js module
  res.render("list", {listTitle: day, newListItems: items}); // searches views folder and finds list.ejs
});

// List for Work To-do-List
app.get("/work", function(req, res) {
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

// Posting from across the templates
app.post("/", function(req, res){
  const item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/about", function(req, res) {
  res.render("about");
});


app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
