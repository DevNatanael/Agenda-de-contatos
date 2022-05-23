require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/'
mongoose.connect(uri, {useNewUrlParser: true})
    .then(() =>{
        console.log('conectei a base de dados');
        app.emit('pronto');
    })
    .catch(e => console.log(e));

const session = require('express-session');

const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const {requires} = require('./src/middlewares/middleware');

app.use(express.urlencoded({extended: true}));

const sessionOptions = session({
    secret: 'lalalalalalalalalalala',
    store: MongoStore.create(mongoose.connection) ,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

app.use(express.static(path.resolve(__dirname, 'public')));

app.set('views', path.resolve(__dirname,'src' ,'views'));
app.set('view engine', 'ejs');

app.use(requires);
app.use(routes);

app.on('pronto', () => {

    app.listen(3000, () =>{
        console.log('acessar http://localhost:3000')
        console.log('Servidor ativo !!');
    });

})




