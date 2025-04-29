const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
const logger = require('logger');
var audit = require('express-requests-logger');
const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

app.use(bodyParser.json());
// app.use(audit({
//     logger: logger, // Existing bunyan logger
//     shouldSkipAuditFunc: function(req, res){
//         // Custom logic here.. i.e: return res.statusCode === 200
//         return false;
//     }
// }));
app.use(cors({origin: "http://localhost:4200", credentials: true}));
app.set('port', port);

mongoose.set('strictQuery', false);
mongoose.connect(mongoURI).then(connection => {
    console.log('connected to MongoDB')

    app.listen(port, () => {
        console.log(`app running on localhost ${port}`)
    });
}).catch(error => console.log(error));

app.use('/images', express.static(path.join(__dirname, 'images')));

const privateRouter = require('./routes/private.js');
const publicRouter = require('./routes/public.js');

app.use('/private', privateRouter);
app.use('/public', publicRouter);
