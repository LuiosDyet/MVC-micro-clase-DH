const { disable } = require('express/lib/application');
const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(__dirname, '../model/database.json');

const services = {
    getData: function () {
        const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
        return data;
    },
    writeData: function (newData) {
        const data = JSON.stringify(newData, null, 2);
        fs.writeFileSync(dataFilePath, data, 'utf-8');
    },
    writeEnabled: function () {
        const [metaData, slidesData] = this.getData();
        return metaData.writeEnabled;
    },
    getIndex: function () {
        const [, { slides }] = this.getData();
        const index = slides.map((slide) => {
            return {
                id: slide.id,
                title: slide.title,
            };
        });
        return index;
    },
    getCurrentSlideNumber: function () {
        const db = this.getData();
        const slidesQty = db[1].slides.length;
        const currentSlideNumber = Number(db[0].currentSlideNumber);
        const nextSlide =
            currentSlideNumber + 1 > slidesQty ? null : currentSlideNumber + 1;
        const previousSlideNumber =
            currentSlideNumber - 1 < 1 ? null : currentSlideNumber - 1;
        let slidesNumbers = {
            previousSlideNumber,
            currentSlideNumber,
            nextSlide,
        };
        return slidesNumbers;
    },
    setCurrentSlideNumber: function (number) {
        let [metaData, slidesData] = this.getData();
        currentSlideNumber = { currentSlideNumber: number };
        db = [{ ...metaData, ...currentSlideNumber }, slidesData];
        this.writeData(db);
    },
    getCurrentSlide: function () {
        let [, ...data] = this.getData();
        const { currentSlideNumber } = this.getCurrentSlideNumber();
        const [slide] = data[0].slides.filter(
            (slide) => slide.id == currentSlideNumber
        );
        return slide;
    },
    createTitle: function (title) {
        return title;
    },
    createSection: function (slideData) {
        let section = '';
        slideData.forEach((article) => {
            for (let component of Object.entries(article)) {
                switch (component[0]) {
                    case 'h2':
                        section += `<h2 class="col-12 display-4 mb-5">${component[1]}</h2>`;
                        break;
                    case 'h3':
                        section += `<h3 class="col-12 mb-3">${component[1]}</h3>`;
                        break;
                    case 'h4':
                        section += `<h4 class="col-12 col-md-6 mb-3">${component[1]}</h4>`;
                        break;
                    case 'img':
                        section += `<div class="imgDiv order-1 order-md-0 mb-5">
                                        <img class="img-thumbnail" src="/img/${component[1]}" alt="${component[1]}">
                                    </div>`;
                        break;
                    case 'a':
                        section += `${this.createLinks(component[1])}`;
                        break;
                    case 'ul':
                        section += `<div class="col-12 col-md-6 order-2 order-md-0">
                                        ${this.createInput()}
                                        ${this.createList(component[1])}
                                    </div>`;
                        break;
                    default:
                        break;
                }
            }
        });
        return section;
    },
    createInput() {
        const writeEnabled = this.writeEnabled();
        const input = ` <form class="row mb-3" ${
            writeEnabled ? 'action="/" method="post"' : ''
        }>
                            <input class="col-8" type="text" name="input">
                            <div class="col-4">
                                <button class="btn btn-secondary ${
                                    writeEnabled ? '' : 'disabled'
                                }" type="submit">Agregar</button>
                            </div>
                        </form>`;
        return input;
    },
    createList(items) {
        const writeEnabled = this.writeEnabled();
        let list = '';
        for (let i in items) {
            list += `<div class="row">
                        <li  class="col-11 mt-1 lead">${items[i]}</li>
                    ${
                        writeEnabled
                            ? ' <div  class="col-1"> <button class="btn btn-secondary btn-sm " formaction="deleteItem/?itemIndex=${i}">x</button></div>'
                            : ''
                    }            
                    </div>    `;
        }
        const ul = `   <form method="POST">
                            <ul class="indexList">
                                ${list}
                            </ul>
                        </form>`;
        return ul;
    },
    createLinks(items) {
        let links = '';
        for (let link of items) {
            links += `<div>
                        <a href="${link.url}">${link.title}</a>
                    </div>`;
        }
        return links;
    },
    setListItem(input) {
        const [metaData, slidesData] = this.getData();
        const currentSlide = this.getCurrentSlide();
        currentSlide.data[0].ul.push(input);
        const newSlidesData = slidesData.slides.map((slide) => {
            return slide.id == currentSlide.id ? currentSlide : slide;
        });
        const db = [metaData, { slides: newSlidesData }];
        this.writeData(db);
    },
    deleteListItem(itemIndex) {
        const [metaData, slidesData] = this.getData();
        const currentSlide = this.getCurrentSlide();
        currentSlide.data[0].ul.splice(itemIndex, 1);
        const newSlidesData = slidesData.slides.map((slide) => {
            return slide.id == currentSlide.id ? currentSlide : slide;
        });
        const db = [metaData, { slides: newSlidesData }];
        this.writeData(db);
    },
    closeProject() {
        const [metaData, slidesData] = this.getData();
        const db = [{ ...metaData, writeEnabled: false }, slidesData];
        this.writeData(db);
    },
};

module.exports = services;
