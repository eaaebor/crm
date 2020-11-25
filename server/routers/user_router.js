const express = require('express');
const router = express.Router();
const db = require('../db');

// new user
router.get('/first-user', async (req, res) => {
    let user = {
        fullname: "Admin",
        username: "Admin",
        password: "Admin",
        email: "Admin",
        phone: "Admin",
        title: "Admin",
        date: Date.now(),
        status: { text: "Ledig", class: "available" },
        imageurl: "Admin",
    }
    let response = await db.newUser(user)
    res.json({ msg: response })
});

// new user
router.post('/new-user', async (req, res) => {
    let response = await db.newUser(req.body.user, req.body.id)
    res.json({ msg: response })
});

// authenticate user
router.post('/authenticate', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let secret = process.env.SECRET || "the cake is a lie";
    // Authenticate the user
    await db.authenticateUser(username, password, secret, response)
    // Get the response from the db to send to the client
    function response(response) {
        console.log(response)
        res.status(response.status).json({msg: response.msg})
    }
});

router.get('/all-users', async (req, res) => {
    // Run the hide/show function from db
    const updated = await db.allUsers()
    res.json(updated)
})

router.get('/all-updates', async (req, res) => {
    // Run the hide/show function from db
    const updates = await db.allUpdates()
    res.json(updates)
})

// update daily calorie intake for user
router.put('/update-status', async (req, res) => {
    let status = {
        text: req.body.text,
        style: req.body.style,
        username: req.body.username
    }
    let response = await db.updateStatus(status, req.body.id, req.body.date)
    res.json(response)
});

router.put('/edit-user', async (req, res) => {
    const updateUser = await db.editUser(req.body.object, req.body.byuser, req.body.date)
    res.json(updateUser)
});

router.put('/edit-full-user', async (req, res) => {
    const updateFullUser = await db.updateFullUser(req.body.object, req.body.username, req.body.byuser, req.body.date)
    res.json(updateFullUser)
});


module.exports = router