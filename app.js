const express = require('express');
const path = require('path');

const app = express();

const controller = require('./controllers/controller');
const validation = require('./middleware/validation');
const validationRules = require('./middleware/validationRules');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Escuchando puerto ${PORT}`);
});

app.get('/', controller.slide);
app.post('/changeSlide', controller.changeSlide);
app.post('/deleteItem', controller.deleteItem);
app.post('/closeProject', controller.closeProject);
app.post('/', validationRules, validation, controller.addInput);
