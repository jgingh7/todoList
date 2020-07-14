const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
// requiring a module located in the address
const date = require(__dirname + '/date.js'); //local, not installed using npm, so need __dirname

const app = express();

app.set('view engine', 'ejs'); //enable ejs in express
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); //fetch files from file public

//mongodb://localhost:27017/todolistDB
mongoose.connect("mongodb+srv://admin-jin:q9LG1ymsaUrWcoAl@clustertodolist.sbqc3.mongodb.net/todolistDB?retryWrites=true&w=majority/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema); // new collection with Schema of itemSchema

const item1 = new Item({
  name: "Welcom to you todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

let address = ""

// List for Today's To-do-List
app.get("/", function(req, res) {
  address = req.url;

  const day = date.getDate();

  Item.find({}, function(err, items) {
    if (items.length == 0) { // empty array, add the default items
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        }
      });
      res.redirect("/");
    }

    if (err) {
      console.log(err);
    } else {
      res.render("list", {
        listTitle: day,
        newListItems: items,
        theAddress: address
      }); // searches views folder and finds list.ejs
    }
  });
});

app.get("/:todoList", function(req, res) {
  const todoListName = _.capitalize(req.params.todoList);
  List.findOne({
    name: todoListName
  }, function(err, existingList) {
    if (err) {
      console.log(err);
    } else {
      if (!existingList) { // if the object does not exist
        const list = new List({
          name: todoListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + todoListName);
      } else {
        res.render("list", {
          listTitle: existingList.name,
          newListItems: existingList.items,
          theAddress: "/" + todoListName
        });
      }
    }
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listURLName = req.body.listURL;

  const item = new Item({ // making new document
    name: itemName
  });

  if (listURLName == "/") {
    item.save();
    res.redirect(listURLName);
  } else {
    List.findOne({
      name: listURLName.substring(1)
    }, function(err, otherList) {
      otherList.items.push(item);
      otherList.save();
      res.redirect(listURLName);
    });
  }
});

// app.post("/:todoList", function(req, res) {
//
// }); 나중에 다시 만들자

app.post("/delete", function(req, res) { //make deleting button instead
  const checkedItemId = req.body.deletingItem;
  const listURLName = req.body.listURL;

  if (listURLName === "/") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      console.log(err);
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({
      name: listURLName.substring(1)
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, function(err, otherList) {
      res.redirect(listURLName);
    });
  }
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3500, function() {
  console.log("Server started on port 3500.");
});
