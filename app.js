const express = require('express');
const app = express();
// const port = 3000;
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const User = require('./models/user');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ================auto refresh================
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname);
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});
app.use(connectLivereload());

// ================Connect to MongoDB================
mongoose.connect('mongodb+srv://root:root@cluster0.uwyix0f.mongodb.net/?appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
}).then(() => {
    app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// ================Routes================
app.get('/', (req, res) => {
  res.render('index.ejs', { title: 'Home Page' });
});

app.get('/user/add.html', (req, res) => {
  res.render('user/add');
});

app.post('/user/add', async (req, res) => {
  try {

    const { name, email, age } = req.body;

    const newUser = new User({
      name,
      email,
      age
    });

    await newUser.save();

    res.redirect('/'); 

  } catch (err) {
    console.log(err);
    res.send('Error adding user');
  }
});

app.get('/user/users.html', async (req, res) => {
  try {
    const users = await User.find();

    res.render('user/users', {
      title: 'Users List',
      users: users || []
    });

  } catch (err) {
    console.log(err);

    res.render('user/users', {
      title: 'Users List',
      users: []
    });
  }
});




app.get('/user/profile.html', async (req, res) => {
  try {
    const username = req.query.name;
    const user = await User.findOne({ name: username });

    res.render('user/profile', {
      title: 'Profile',
      user
    });

  } catch (err) {
    console.log(err);

    res.render('user/profile', {
      title: 'Profile',
      user: null
    });
  }
});

app.get('/user/delete/:name', async (req, res) => {
  try {
    await User.findOneAndDelete({ name: req.params.name });
    res.redirect('/user/users.html');
  } catch (err) {
    console.log(err);
    res.send('Error deleting user');
  }
});

app.get('/user/edit/:name', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });

    res.render('user/edit', {
      title: 'Edit User',
      user
    });

  } catch (err) {
    console.log(err);
    res.redirect('/users');
  }
});

app.post('/user/edit/:name', async (req, res) => {
  try {
    await User.findOneAndUpdate({ name: req.params.name }, {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age
    });

    res.redirect('/');

  } catch (err) {
    console.log(err);
    res.send('Error updating user');
  }
});
