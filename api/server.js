const express = require('express'); //we import express to manage the server and routes
const app = express();
const bodyParser = require('body-parser');
const guitarRouter = require('./routers/guitars');
const brandRouter = require('./routers/brands');
const usersRouter = require('./routers/users');
const cors = require("cors");
const port = 3000;

app.use(cors()); //we enable cors for all incoming requests
app.use(bodyParser.json());// this enables JSON body parsing
app.use(express.static('public')); //public folder is our static folder

app.use('/guitar', guitarRouter); //we use the routers established in the router folder
app.use('/brands', brandRouter);
app.use('/users', usersRouter);

app.listen(port, () => { //app.listen starts the server.
  console.log(`guitar database listening on port ${port}`)
});