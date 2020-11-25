const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;

// Connect to the database
try {
    const url = process.env.MONGODB_URL || 'mongodb://localhost/crm';
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log("Database connected:", mongoose.connection.name);
} catch (e) {
    console.error(e)
}

// Schema for new user
const userSchema = new mongoose.Schema({
    username: String,
    fullname: String,
    password: String,
    isadmin: Boolean,
    imageurl: String,
    date: Number,
    title: String,
    status: Object,
    email: String,
    phone: String,
});

const customerSchema = new mongoose.Schema({
    company: String,
    address: String,
    cvr: String,
    url: String,
    description: String,
    contactpersonname: String,
    contactpersonphone: String,
    contactpersonemail: String,
    facebook: String,
    instagram: String,
    linkedin: String,
    pinterest: String,
    hours: String,
    hourprice: String,
    paymentoptions: String,
    comments: Array
});

const projectSchema = new mongoose.Schema({
    company: String,
    description: String,
    deadline: String,
    team: Array,
    date: String,
    projectname: String,
    comments: Array,
    status: String
})

const newsSchema = new mongoose.Schema({
    byuser: String,
    text: String,
    date: String,
    about: String
})

// Models
const User = mongoose.model('User', userSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Project = mongoose.model('Project', projectSchema);
const News = mongoose.model('News', newsSchema);

mongoose.set('useFindAndModify', false);

/**************** USER RELATED FUNCTIONS ****************/

async function allUsers() {
    // Return the users but ignore password field
    const users = mongoose.model('User').find().select(['-password'])
    return users
};

async function newUser(user, id) {
    // Get the users to check if username is taken
    const users = mongoose.model('User').find()
    // Trying to find users with same username
    let userExists = await users.findOne({ username: user.username })
    // If no user was found, hash the password and create user
    if (!userExists) {
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(user.password, 10, function (err, hash) {
                if (err) reject(err); else resolve(hash);
            });
        });

        user.isadmin = false
        user.password = hashedPassword

        if (user.imageurl === undefined) {
            user.imageurl = "https://mlxu1gotfrgy.i.optimole.com/WVAxt0U.zSPY~2e2a9/w:auto/h:auto/q:auto/https://thomsenogco.dk/wp-content/uploads/2020/08/emilprotræt.jpg"
        }

        const newUser = new User(user)

        // Save to the db
        try {
            console.log("New user has been created.", await newUser.save());
            await updateNews(id, "Har oprettet en ny bruger til: ", user.date, user.fullname)
        } catch (error) {
            console.error(error);
        }
        return "User was succesfully created!" // Success
    } else {
        return "The username is already taken." // Username is taken
    }
}

async function authenticateUser(username, password, secret, callback) {
    // Checking wether username or password is missing
    if (!username || !password) {
        return callback({ msg: "Username or password are missing!", status: 401 })
    }

    // Get the models for the users
    const users = mongoose.model('User').find()
    let user = await users.findOne({ username: username })

    if (user) { // If the user is found
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let payload = { username: username };
                let token = jwt.sign(payload, secret, { expiresIn: '10h' });
                let msg = { username: username, token: token }
                callback({ msg: msg, status: 200 })
                console.log(`${username} logged in`)
            } else { callback({ msg: "Username or password was incorrect!", status: 401 }) }
        })
    } else { callback({ msg: "Username or password was incorrect!", status: 404 }) }
}

async function updateStatus(status, id, date) {
    // Verifying that the text matches one from the array, so you cant manipulate the text
    let text = ["Ledig", "I et møde", "Arbejder hjemmefra", "Syg", "Ude af kontoret"]
    if (!text.includes(status.text)) {
        return
    }

    let newStatus = {
        text: status.text,
        class: status.style
    }
    try {
        const users = mongoose.model('User').find()
        await users.findOneAndUpdate({ username: status.username }, { status: newStatus })
        await updateNews(id, "Har opdateret sin tilgængelighed til: ", date, status.text)
        console.log(status.username + " updated their status to " + status.text)
    } catch (error) {
        console.log(error)
    }


    return 200
}

async function editUser(object, byuser, date) {
    let users = mongoose.model('User')
    try {

        // Find the user so we can display the name
        const u = mongoose.model('User').find()
        let uN = await u.findOne({ _id: object.id })

        await users.findByIdAndUpdate(
            { _id: object.id },
            { [object.name]: object.newValue }
        );
        await updateNews(byuser, "Har opdateret profilen: ", date, uN.fullname)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}

async function updateFullUser(object, username, byuser, date) {
    let users = mongoose.model('User')
    try {

        // Find the user so we can display the name
        const u = mongoose.model('User').find()
        let un = await u.findOne({ username: username })

        for (const [key, value] of Object.entries(object)) {
            await users.findOneAndUpdate({ username: username }, { [key]: value });
        }

        await updateNews(byuser, "Har opdateret en medarbejder: ", date, un.fullname)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}


/* Customer related functions */

async function allCustomers() {
    const customers = mongoose.model('Customer').find()
    return customers
};

async function newCustomer(customer, byuser, date) {
    const newCustomer = new Customer(customer)
    // Save to the db
    try {
        console.log("New customer has been created.", await newCustomer.save());
        await updateNews(byuser, "Har oprettet en ny kunde: ", date, customer.company)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}

async function newComment(id, comment, byuser) {

    let customers = mongoose.model('Customer')

    try {
        // Find the customer so we can display the name
        const c = mongoose.model('Customer').find()
        let cN = await c.findOne({ _id: id })
        comment._id = new ObjectID().toHexString()
        await customers.findByIdAndUpdate({ _id: id }, { $push: { comments: comment } });
        await updateNews(byuser, "Har tilføjet en kommentar til: ", comment.date, cN.company)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}

async function deleteComment(commentid, customerid, byuser, date) {
    let customers = mongoose.model('Customer')
    try {

        // Find the customer so we can display the name
        const c = mongoose.model('Customer').find()
        let cN = await c.findOne({ _id: customerid })

        await customers.findByIdAndUpdate({ _id: customerid }, { $pull: { comments: { _id: commentid } } });

        await updateNews(byuser, "Har slettet en kommentar på kunden: ", date, cN.company)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 404 // Failure
    }
}

async function updateCustomer(object, byuser, date) {
    let customers = mongoose.model('Customer')
    try {

        // Find the customer so we can display the name
        const c = mongoose.model('Customer').find()
        let cN = await c.findOne({ _id: object.id })

        await customers.findByIdAndUpdate(
            { _id: object.id },
            { [object.name]: object.newValue }
        );
        await updateNews(byuser, "Har opdateret en kunde: ", date, cN.company)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}

async function updateFullCustomer(object, id, byuser, date) {
    let customers = mongoose.model('Customer')
    try {

        // Find the customer so we can display the name
        const c = mongoose.model('Customer').find()
        let cN = await c.findOne({ _id: id })

        for (const [key, value] of Object.entries(object)) {
            await customers.findByIdAndUpdate({ _id: id }, { [key]: value });
        }

        await updateNews(byuser, "Har opdateret en kunde: ", date, cN.company)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}

async function deleteCustomer(id, byuser, date) {
    let customers = mongoose.model('Customer')
    try {

        // Find the customer so we can display the name
        const c = mongoose.model('Customer').find()
        let cN = await c.findOne({ _id: id })

        await customers.findByIdAndDelete({ _id: id });
        await updateNews(byuser, "Har slettet en kunde: ", date, cN.company)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}

/* Project related functions */
async function allProjects() {
    const projects = mongoose.model('Project').find()
    return projects
};

async function newProject(project, byuser, date) {

    // Find the customer so we can display the name
    const c = mongoose.model('Customer').find()
    let cN = await c.findOne({ _id: project.company })

    project.status = "Igangværende"

    if (project.projectname === undefined) {
        project.projectname = "Unavngivet projekt"
    }

    const newProject = new Project(project)
    // Save to the db
    try {
        console.log("New project has been created.", await newProject.save());
        await updateNews(byuser, "Har oprettet et nyt projekt for: ", date, cN.company)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}

async function newCommentProject(id, comment, byuser) {
    let projects = mongoose.model('Project')
    try {
        // Find the customer so we can display the name
        const p = mongoose.model('Project').find()
        let pN = await p.findOne({ _id: id })
        comment._id = new ObjectID().toHexString()
        await projects.findByIdAndUpdate({ _id: id }, { $push: { comments: comment } });
        await updateNews(byuser, "Har tilføjet en kommentar til: ", comment.date, pN.projectname)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}

async function deleteProject(id, byuser, date) {
    let projects = mongoose.model('Project')
    try {

        const p = mongoose.model('Project').find()
        let pN = await p.findOne({ _id: id })

        await updateNews(byuser, "Har slettet projektet: ", date, pN.projectname)
        await projects.findByIdAndDelete({ _id: id });
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}

async function updateNews(id, text, date, about) {
    const news = new News({
        byuser: id,
        text: text,
        date: date,
        about: about
    })
    // Save to the db
    try {
        console.log("New update has been created.", await news.save());
        return
    } catch (error) {
        console.error(error);
        return
    }
}

async function addToProject(user, byuser, date, id) {
    let projects = mongoose.model('Project')
    try {
        // Find the project so we can display the name
        const p = mongoose.model('Project').find()
        let pN = await p.findOne({ _id: id })

        await projects.findByIdAndUpdate({ _id: id }, { $push: { team: user } });
        await updateNews(byuser, "Har tilføjet en medarbejder til projektet: ", date, pN.projectname)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}

async function deleteFromTeam(uid, pid, byuser, date) {
    let projects = mongoose.model('Project')
    try {
        // Find the project so we can display the name
        const p = mongoose.model('Project').find()
        let pN = await p.findOne({ _id: pid })

        await projects.findByIdAndUpdate({ _id: pid }, { $pull: { team: { _id: uid } } });
        await updateNews(byuser, "Har fjernet en medarbejder fra projektet: ", date, pN.projectname)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}

async function deleteCommentProject(commentid, customerid, byuser, date) {
    let projects = mongoose.model('Project')
    try {

        // Find the customer so we can display the name
        const c = mongoose.model('Project').find()
        let cN = await c.findOne({ _id: customerid })

        await projects.findByIdAndUpdate({ _id: customerid }, { $pull: { comments: { _id: commentid } } });

        await updateNews(byuser, "Har slettet en kommentar på projektet: ", date, cN.projectname)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 404 // Failure
    }
}

async function updateProject(object, id, byuser, date) {

    let projects = mongoose.model('Project')
    try {

        await projects.findOneAndUpdate(
            { _id: id },
            { $set: { "deadline": object.deadline, "description": object.description, "projectname": object.projectname, "status": object.status } },
        );
        await updateNews(byuser, "Har opdateret et projekt: ", date, object.projectname)
        return 200 // Success
    } catch (error) {
        console.error(error);
        return 501 // Failure
    }
}

async function allUpdates() {
    const updates = mongoose.model('News').find()
    return updates
};

module.exports = {
    newUser: newUser,
    allUsers: allUsers,
    editUser: editUser,
    updateFullUser: updateFullUser,
    authenticateUser: authenticateUser,
    updateStatus: updateStatus,
    allCustomers: allCustomers,
    newCustomer: newCustomer,
    newComment: newComment,
    deleteComment: deleteComment,
    updateCustomer: updateCustomer,
    updateFullCustomer: updateFullCustomer,
    deleteCustomer: deleteCustomer,
    allProjects: allProjects,
    newProject: newProject,
    deleteProject: deleteProject,
    newCommentProject: newCommentProject,
    addToProject: addToProject,
    deleteFromTeam: deleteFromTeam,
    deleteCommentProject: deleteCommentProject,
    updateProject: updateProject,
    allUpdates: allUpdates,
}