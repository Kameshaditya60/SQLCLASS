const { faker } = require('@faker-js/faker');

const mysql = require('mysql2');

const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require("method-override");

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'MSi_(0826)!#'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    // faker.internet.userName(),
    // faker.internet.email(),
    // //   avatar: faker.image.avatar(),
    // faker.internet.password(),

    //   birthdate: faker.date.birthdate(),
    //   registeredAt: faker.date.past(),
  ];
};
// inserting data in table
let q = "INSERT INTO user(id, username, email, password ) VALUES ?";
// let users =[
//   ["456", "user2" , "user2@gmail.com","u2"],
//   ["789","user3", "user3@gmail.com", "u3"],
// ];



// let data = [];
// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomUser()); //100 fake datas
// }
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

//home page
app.get("/", (req, res) => {

  let q = ' SELECT count(*) FROM user';

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("NOT FOUND HOME PAGE");
  };


});
// user page 
app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("users.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("NOT FOUND USer PAGE");
  };


});

//Add new User 
app.get("/user/add", (req, res) => {
  res.render("adduser.ejs",);
});

// submit new user data
app.post("/user/adduser", (req, res) => {

  console.log("new user submiting");
  let id = getRandomUser();
  console.log(id);
  console.log(req.body);
  let { username: newUsername, email: newEmail, password: newPassword } = req.body;
  let qq = `INSERT into user (id, username, email, password) VALUES ('${id}','${newUsername}','${newEmail}','${newPassword}')`;
  console.log(q);

  try {
    connection.query(qq, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Submit Successfull");

    });
  } catch (err) {
    console.log(err);
    res.send("something wrong");
  };
  // let { username: newUsername, email: newEmail, password: newPassword } = req.body;



});
// DELETE user
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  console.log(id);
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result);
      if (result.length === 0) {
        console.log("No user found with given id");
        res.send("No user found");
      } else {
        let user = result[0];
        console.log(user);
        res.render("deleteuser.ejs", { user });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in Database ");
  };
});

//delete user from db by authentication
app.delete("/user/:id", (req, res) => {
  console.log("delete user")
  let { id } = req.params;
  let { email: confirmEmail, password: confirmPassword } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, res) => {
      if (err) throw err;
      console.log("delete user2");
      let user = result[0];
      if (confirmEmail != user.email && confirmPassword != user.password) {
        res.send("you entered wrong password and email is incorrect");
      } else {
        let q2 = `DELETE FROM user WHERE id=${user}`;
        res.send("delete successfully");
      }
    }
    );

  } catch (err) {
    console.log(err);
    res.send("Some thing happened");
  }
  });
    // edit respose 
    app.get("/user/:id/edit", (req, res) => {
      let { id } = req.params;
      console.log(id);
      let q = `SELECT * FROM user WHERE id = '${id}'`;
      try {
        connection.query(q, (err, result) => {
          if (err) throw err;
          console.log(result);
          let user = result[0];
          res.render("edituser.ejs", { user });
        });
      } catch (err) {
        console.log(err);
        res.send("NOT FOUND USer PAGE");
      };


    });


    //update (db) route
    app.patch("/user/:id", (req, res) => {
      console.log("hi");
      let { id } = req.params;

      let { password: formPass, username: newUsername } = req.body;// yha se user input kiya form me wo data nikal rahe
      let q = `SELECT * FROM user WHERE id = '${id}'`;
      try {
        connection.query(q, (err, result) => {
          if (err) throw err;
          console.log(result, "hello");
          let user = result[0];
          if (formPass != user.password) {
            console.log("hello");
            res.send("You enter wrong password");
          } else {
            let q2 = `UPDATE user SET username='${newUsername}' WHERE id = '${id}'`;
            connection.query(q2, (err, result) => {
              console.log(result);
              if (err) throw err;
              res.send("Update Successfully");
              // res.redirect("/user");

            });

          }
        });
      } catch (err) {
        console.log(err);
        res.send("Some error in DataBase");
      };

    })




    let port = 3000
    app.listen(port, () => {
      console.log(`Server is started, listieng port number ${port}`);
    });