var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var config = require('./config/DB');
var docRoutes = require('./routes/docRoutes')
var userRoutes = require('./routes/userRoutes')
var romRoutes = require('./routes/romRoutes')
var morgan = require('morgan')

var port = process.env.PORT || 8080; // set our port

mongoose.Promise = global.Promise;
mongoose.connect(config.DB).then(
    () => {
        console.log('Database is connected')
    },
    err => {
        console.log('Can not connect to the database' + err)
    }
);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'))

app.use('/users', userRoutes)
app.use('/roms', romRoutes)
app.use('/', docRoutes)

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);