const express = require('express');
const bodyParser = require('body-parser');

const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.set('view engine', 'ejs'); //enable ejs in express
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //fetch files from file public

let address = ""

// List for Today's To-do-List
app.get("/", function(req, res) {
  address = req.url;
  let today = new Date();

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  let day = today.toLocaleDateString("en-US", options);

  res.render("list", {listTitle: day, newListItems: items, theAddress: address}); // searches views folder and finds list.ejs
});

app.post("/", function(req, res){
  let item = req.body.newItem;
  items.push(item);

  res.redirect("/");
});

// List for Work To-do-List
app.get("/work", function(req, res) {
  address = req.url;
  res.render("list", {listTitle: "Work List", newListItems: workItems, theAddress: address});
});

app.post("/work", function(req, res){
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});


app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
