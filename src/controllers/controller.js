const services = require("../services/services");

const controller = {
  slide: function (req, res) {
    const slidesNumber = services.getCurrentSlideNumber();
    const slide = services.getCurrentSlide();
    const title = services.createTitle(slide.title);
    const section = services.createSection(slide.data);
    const index = services.getIndex();
    res.render("index", { title, section, slidesNumber, index });
  },
  changeSlide: function (req, res) {
    services.setCurrentSlideNumber(req.query.slide);
    res.redirect("/");
  },
  addInput: function (req, res) {
    services.setListItem(req.body.input);
    res.redirect("/");
  },
  deleteItem: function (req, res) {
    services.deleteListItem(req.query.itemIndex);
    res.redirect("/");
  },
  closeProject: function (req, res) {
    services.closeProject();
    res.redirect("/");
  },
};

module.exports = controller;
