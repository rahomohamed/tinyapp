// checks if email already exists 
const getUserByEmail = (emailToCheck, users) => {
  for (let user_id in users) {
    if (users[user_id].email === emailToCheck) {
      return user_id;
    }
  }
};

// returns urls for user 
const urlsForUser = (id, urlDatabase) => {
  let filteredDatabase = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      filteredDatabase[key] = urlDatabase[key];
    }
  }
  return filteredDatabase;
}


module.exports = { getUserByEmail, urlsForUser };