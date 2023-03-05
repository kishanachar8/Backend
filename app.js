const express = require('express');
const app = express();
const PORT = 4000;
const cors = require('cors') //while sharing data from front and backend


//require database models
const User = require('./models/users')
const Post = require('./models/posts')


const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());//cross origin resource sharing

const dbURL = "mongodb://localhost:27017/foodie"

mongoose.connect(dbURL).then(() => {
    console.log("Connected to database");
})

app.post('/', (req, res) => {
    User.findOne({ email: req.body.email }, (err, userData) => {
        if (userData) {
            if (userData.password === req.body.password) {
                res.send({ message: 'login success' })
            }
            else {
                res.send({ message: 'Invalid Creditentials' })
            }
        }
        else {
            res.send({ message: 'Account not found' })
        }
    })
})

app.post('/signup', async (req, res) => {
    User.findOne({ email: req.body.email } || { number: req.body.number }, (err, userData) => {
        if (userData) {
            res.send({ message: "User already exists" })
        }
        else {
            const data = new User({
                name: req.body.name,
                email: req.body.email,
                number: req.body.number,
                password: req.body.password,
            })
            try {
                data.save()
                res.send({ message: 'User registered successfully' })
            }
            catch (e) {
                res.send(e)
            }
        }
    })
})

app.post('/add-posts', async (req, res) => {
    let postData = new Post({
        author: req.body.author,
        title: req.body.title,
        summary: req.body.summary,
        image: req.body.image,
        location: req.body.location,
    })
    try {
        await postData.save()
        res.send({ message: "Post added successfully" })
    } catch (err) {
        res.send({ message: "Failed to add posts" })
    }
})

app.get('/posts/:id', async (req, res) => {
    // let {id}=req.params
    try {
        const singlePost = await Post.findById(req.params.id)
        res.send(singlePost)
    } catch (err) {
        res.send(err)
    }
})

app.get('/posts', async (req, res) => {
    try {
        let posts = await Post.find()
        res.send(posts)
        console.log(posts);
    }
    catch (err) {
        res.send('Unable to fetch')
    }
})

app.get('/users', async (req, res) => {
    try {
        let users = await User.find()
        res.send(users)
        console.log(users);
    }
    catch (err) {
        res.send('Unable to fetch')
    }
})


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})