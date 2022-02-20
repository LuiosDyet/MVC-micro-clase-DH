const express = require('express');
const path = require('path');

const app = express();

const controller = require('./controllers/controller');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(80, () => {
    console.log(
        'Escuchando puerto 80, cambiá a otro puerto (por ejemplo 3000) para utilizarlo en localhost'
    );
});

app.get('/', controller.slide);
app.post('/changeSlide', controller.changeSlide);
app.post('/deleteItem', controller.deleteItem);
app.post('/closeProject', controller.closeProject);
app.post('/', controller.addInput);
