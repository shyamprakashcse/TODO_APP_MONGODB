const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

// template engine setup 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// date module 

let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
const today = new Date();
const mon = today.toLocaleString('default', { month: 'long' });


var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var d = weekday[today.getDay()];
const FullDate = d + "," + " " + mon + " " + date + " " + year;
console.log(FullDate);



//database connection  
mongoose.connect("mongodb://localhost:27017/TodoDB", { useNewUrlParser: true });

//database schema 
const ItemSchema = {
    name: String
};

//database model 

const Item = mongoose.model("Item", ItemSchema);

//insert some initial values into the DB 
const item1 = new Item({
    name: "Welcome to your todolist!"
});
const item2 = new Item({
    name: "Hit the button to add a product"
});
const item3 = new Item({
    name: "Delete a product by ticking a checkbox!"
});
const defaultItems = [item1, item2, item3];











app.get("/", function(req, res) {
    Item.find({}, function(err, foundItems) {
        if (foundItems.length == 0) {

            Item.insertMany(defaultItems, function(err) {
                if (err)
                    console.log(err);
                else
                    console.log("Succsessfully saved items to db");
            });
            res.redirect("/");
        } else
            res.render("TodoMainPage", { DATE: FullDate, NEWITEM: foundItems });
    });


});

app.post("/", function(req, res) {
    const itemName = req.body.ITEM;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
});

app.post("/delete", function(req, res) {
    const checkedItemId = req.body.CHECK;
    Item.findByIdAndRemove(checkedItemId, function(err) {
        if (err)
            console.log(err);
        else {
            console.log("Successfully deleted an item from the todolist");
            res.redirect("/");
        }
    });
});

app.listen(3000, function(req, res) {
    console.log("Server is Started and running at port 3000");
});