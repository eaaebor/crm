const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const checkJwt = require('express-jwt');

/**** Configuration ****/
const appName = "CRM - PBA";
const port = process.env.PORT || 8080; 
const app = express(); 

app.use(bodyParser.json()); // Parses JSON from body
app.use(morgan('combined')); // Logs requests to console
app.use(cors()); // Avoid CORS errors
app.use(express.static('../client/build'));

// Paths that does not require authorization
let openPaths = [
    { url: '/api/user/new-user', methods: ['POST'] },
    { url: '/api/user/authenticate', methods: ['POST'] },
    { url: /^\/(?!api\/).*/, methods: ['GET']}
];

// Validate the user using authentication. checkJwt checks for auth token.
const secret = process.env.SECRET || "the cake is a lie";
app.use(checkJwt({ secret: secret }).unless({ path: openPaths }));

// This middleware checks the result of checkJwt
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') { // If the user didn't authorize correctly
        if(err.message.includes("No authorization token was found"))
        {
            res.status(401).json({ error: "You need to be logged in to perform this action" });
        } else {
            res.status(401).json({ error: err.message }); // Return 401 with error message.
        }
        
    } else {
        next(); // If no errors, forward request to next middleware or route
    }
});

const userRouter = require('./routers/user_router');
app.use('/api/user', userRouter);

const customerRouter = require('./routers/customer_router');
app.use('/api/customer', customerRouter);

const projectRouter = require('./routers/project_router');
app.use('/api/project', projectRouter);

app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
);

app.listen(port, () => console.log(`${appName} Server running on port ${port}!`));