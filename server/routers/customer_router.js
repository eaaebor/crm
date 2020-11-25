const express = require('express');
const router = express.Router();
const db = require('../db');

// new customer
router.post('/new-customer', async (req, res) => {
    const newCustomer = await db.newCustomer(req.body.customer, req.body.byuser, req.body.date)
    res.json(newCustomer)
});


router.get('/all-customers', async (req, res) => {
    // Run the hide/show function from db
    const customers = await db.allCustomers()
    res.json(customers)
})

router.post('/new-comment', async (req, res) => {
    const newComment = await db.newComment(req.body.id, req.body.comment, req.body.byuser)
    res.json(newComment)
});

router.delete('/delete-comment', async (req, res) => {
    const deleteComment = await db.deleteComment(req.body.commentid, req.body.customerid, req.body.byuser, req.body.date)
    res.json(deleteComment)
});

router.put('/edit-customer', async (req, res) => {
    const updateCustomer = await db.updateCustomer(req.body.object, req.body.byuser, req.body.date)
    res.json(updateCustomer)
});

router.put('/edit-full-customer', async (req, res) => {
    const updateCustomer = await db.updateFullCustomer(req.body.object, req.body.id, req.body.byuser, req.body.date)
    res.json(updateCustomer)
});

router.delete('/delete-customer', async (req, res) => {
    const deleteCustomer = await db.deleteCustomer(req.body.id, req.body.byuser, req.body.date)
    res.json(deleteCustomer)
});


module.exports = router