const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

function generateRandomString () {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

  const emailLookup = (emailToCheck,users) => {
    
    for (let user_id in users) {
      if (users[user_id].email === emailToCheck) {
  
        return user_id;
      }
    }
    return false;
  };


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies.user_id] };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
let shortURL = generateRandomString()
urlDatabase[shortURL] = req.body.longURL
  res.redirect(`urls/${shortURL}`); 
});

app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let updatedlongURL = req.body.longURL;
  urlDatabase[shortURL] = updatedlongURL;
  res.redirect('/urls')
})

app.get("/login", (req, res) => {
let templateVars = {user: users[req.cookies.user_id]};
  res.render("login", templateVars)
})

app.post("/login", (req, res) => {
  let email = req.body.email
  let password = req.body.password
  let user_id = emailLookup(email, users)

  if (!user_id) {
    res.status(403).send("User cannot be found")
    return;
  } else if (password === users[user_id].password) {
    res.cookie('user_id', user_id)
    res.redirect("/urls");
   } else {
    res.status(403).send("Password is incorrect")
    return;
  }

})

app.get("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect("/urls")
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
})

app.get("/register", (req, res) => {
  let templateVars = {user: users[req.cookies.user_id]}
  res.render("register", templateVars)
})

app.post("/register", (req, res) => {
let user_id = generateRandomString()
let email = req.body.email
let password = req.body.password

if (email === "" || password === "") {
res.status(400).send('Sorry, we cannot find that!');
return;
} 
else if (emailLookup(email, users)) {
  res.status(400).send('This e-mail already exists');
  return;
}
users[user_id] = {id: user_id,
  email: email,
  password: password}

res.cookie("user_id", user_id);
res.redirect("/urls")
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {user: users[req.cookies.user_id]}
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL], 
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
