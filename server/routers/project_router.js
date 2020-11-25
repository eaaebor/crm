const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/new-project', async (req, res) => {
    const newProject = await db.newProject(req.body.project, req.body.byuser, req.body.date)
    res.json(newProject)
});


router.get('/all-projects', async (req, res) => {
    const allProjects = await db.allProjects()
    res.json(allProjects)
})

router.post('/edit-project', async (req, res) => {
    const updateProject = await db.updateProject(req.body.object, req.body.id, req.body.byuser, req.body.date)
    res.json(updateProject)
});

router.delete('/delete-project', async (req, res) => {
    const deleteProject = await db.deleteProject(req.body.id, req.body.byuser, req.body.date)
    res.json(deleteProject)
});

router.post('/new-comment', async (req, res) => {
    const newComment = await db.newCommentProject(req.body.id, req.body.comment, req.body.byuser)
    res.json(newComment)
});

router.put('/add-to-project', async (req, res) => {
    const addToProject = await db.addToProject(req.body.user, req.body.byuser, req.body.date, req.body.id)
    res.json(addToProject)
});

router.delete('/delete-from-team', async (req, res) => {
    console.log(req.body.uid, req.body.pid, req.body.byuser, req.body.date)
    const deleteFromTeam = await db.deleteFromTeam(req.body.uid, req.body.pid, req.body.byuser, req.body.date)
    res.json(deleteFromTeam)
});

router.delete('/delete-comment', async (req, res) => {
    const deleteCommentProject = await db.deleteCommentProject(req.body.commentid, req.body.customerid, req.body.byuser, req.body.date)
    res.json(deleteCommentProject)
});

module.exports = router