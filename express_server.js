const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const { getUserByEmail, urlsForUser } = require("./helper");
const bcrypt = require("bcrypt");
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"]
  })
);

const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// generates unique id
function generateRandomString() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

const urlDatabase = {
  abc: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

// GET '/'
app.get("/", (req, res) => {
  res.send("Hello!");
});

// GET '/URLS.JSON'
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET '/URLS'
app.get("/urls", (req, res) => {
  let filteredData = urlsForUser(req.session.user_id, urlDatabase); // urls specific to one user
  if (!req.session.user_id) {
    res.status(403).send("Login or Register First");
  } else {
    let templateVars = {
      filteredDatabase: filteredData,
      user: users[req.session.user_id]
    };
    res.render("urls_index", templateVars);
  }
});

// POST '/URLS'
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`urls/${shortURL}`);
});

// GET '/URLS/NEW'
app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };

  if (!users[req.session.user_id]) {
    res.redirect("/login");
    return;
  }
  res.render("urls_new", templateVars);
});

// GET '/U/:shortURL'
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.send("URL for the given ID does not exist");
  }
  let longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// GET '/URLS/:shortURL'
app.get("/urls/:shortURL", (req, res) => {
  let userUrl = urlsForUser(req.session.user_id, urlDatabase);
  for (let key in userUrl) {
    if (req.params.shortURL === key) {
      let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL].longURL,
        user: users[req.session.user_id]
      };

      res.render("urls_show", templateVars);
      return;
    }
  }
  res.status(403).send("You cannot acesss a URL that is not yours");
  return;
});

// POST /URLS/:ID
app.post("/urls/:id", (req, res) => {
  let userUrl = urlsForUser(req.session.user_id, urlDatabase);
  for (let key in userUrl) {
    if (req.params.id === key) {
      let shortURL = req.params.id;
      let updatedlongURL = req.body.longURL;
      urlDatabase[shortURL] = {
        longURL: updatedlongURL,
        userID: req.session.user_id
      };
      res.redirect("/urls");
      return;
    }
  }
  res.status(403).send("You cannot update a URL that is not yours");
  return;
});

// GET '/LOGIN'
app.get("/login", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  if(!req.session.user_id) {
  res.render("login", templateVars);
} else {
  res.redirect("/urls");
}
});


// POST '/LOGIN'
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let user_id = getUserByEmail(email, users);

  //user does not exist
  if (!user_id) {
    res.status(403).send("User cannot be found");
    return;
  }
  // password is not found
  else if (!bcrypt.compareSync(password, users[user_id].password)) {
    res.status(403).send("Password is incorrect");
  // email or password match
  } else {
    req.session.user_id = user_id;
    res.redirect("/urls");
    return;
  }
});

// 'LOGOUT'
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// POST '/URLS/:shortURL/DELETE'
app.post("/urls/:shortURL/delete", (req, res) => {
  let userUrl = urlsForUser(req.session.user_id, urlDatabase);

  for (let key in userUrl) {
    if (req.params.shortURL === key) {
      delete urlDatabase[req.params.shortURL];
      res.redirect("/urls");
      return;
    }
  }
  res.status(403).send("You cannot delete a URL that is not yours");
  return;
});

// GET '/REGISTER'
app.get("/register", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  if(!req.session.user_id) {
  res.render("register", templateVars);
  } else {
    res.redirect("/urls");
  }
});

// POST '/REGISTER'
app.post("/register", (req, res) => {
  let user_id = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (email === "" || password === "") {
    res.status(400).send("Sorry, we cannot find that!");
    return;
  } else if (getUserByEmail(email, users)) {
    res.status(400).send("This e-mail already exists");
    return;
  }
  users[user_id] = { id: user_id, email: email, password: hashedPassword };

  req.session.user_id = user_id;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
