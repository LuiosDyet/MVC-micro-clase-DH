const services = require("../services/services");

jest.mock("fs");

describe("services module", () => {
  describe("getCurrentSlideNumber", () => {
    it("should return the current slide number", () => {
      const currentSlideNumber = services.getCurrentSlideNumber();
      expect.objectContaining({
        currentSlideNumber: 1,
        nextSlide: 2,
        previousSlideNumber: null,
      });
    });
  });

  describe("setCurrentSlideNumber", () => {
    it("should set the current slide number", () => {
      const newSlideNumber = 2;
      services.setCurrentSlideNumber(newSlideNumber);
      const currentSlideNumber = services.getCurrentSlideNumber();
      expect(currentSlideNumber).toEqual({
        currentSlideNumber: 2,
        nextSlide: 3,
        previousSlideNumber: 1,
      });
    });
  });

  describe("getCurrentSlide", () => {
    it("should return the current slide", () => {
      const currentSlide = services.getCurrentSlide();
      expect(currentSlide).toBeDefined();
      expect(currentSlide.id).toBeDefined();
      expect(currentSlide.data).toBeDefined();
      expect(currentSlide.data.length).toBeGreaterThan(0);
    });
  });

  describe("createTitle", () => {
    it("should return the given title", () => {
      const title = "My Title";
      const result = services.createTitle(title);
      expect(result).toEqual(title);
    });
  });

  describe("createSection", () => {
    it("should create a section from the given slide data", () => {
      const slideData = [
        { h2: "Title" },
        { h3: "Subtitle" },
        { h4: "Subsubtitle" },
        { img: "image.jpg" },
        { a: [{ url: "http://example.com", title: "Link" }] },
        { ul: ["Item 1", "Item 2"] },
      ];
      const section = services.createSection(slideData);
      expect(section).toContain('<h2 class="col-12 display-4 mb-5">Title</h2>');
      expect(section).toContain('<h3 class="col-12 mb-3">Subtitle</h3>');
      expect(section).toContain(
        '<h4 class="col-12 col-md-6 mb-3">Subsubtitle</h4>'
      );
      expect(section).toContain(
        '<img class="img-thumbnail" src="/img/image.jpg" alt="image.jpg">'
      );
      expect(section).toContain('<a href="http://example.com">Link</a>');
      expect(section).toContain('<li  class="col-11 mt-1 lead">Item 1</li>');
      expect(section).toContain('<li  class="col-11 mt-1 lead">Item 2</li>');
    });
  });

  describe("createInput", () => {
    it("should create an input form", () => {
      const input = services.createInput();
      expect(input).toContain('<form class="row mb-3" ');
      expect(input).toContain('<input class="col-8" type="text" name="input">');
      expect(input).toContain(
        '<button class="btn btn-secondary " type="submit">Agregar</button>'
      );
    });
  });

  describe("createList", () => {
    it("should create a list from the given items", () => {
      const items = ["Item 1", "Item 2"];
      const list = services.createList(items);
      expect(list).toContain('<ul class="indexList">');
      expect(list).toContain('<li  class="col-11 mt-1 lead">Item 1</li>');
      expect(list).toContain('<li  class="col-11 mt-1 lead">Item 2</li>');
    });
  });

  describe("createLinks", () => {
    it("should create links from the given items", () => {
      const items = [{ url: "http://example.com", title: "Link" }];
      const links = services.createLinks(items);
      expect(links).toContain('<a href="http://example.com">Link</a>');
    });
  });

  describe("setListItem", () => {
    it("should add an item to the current slide", () => {
      const input = "New item";
      services.setListItem(input);
      const currentSlide = services.getCurrentSlide();
      expect(currentSlide.data[0].ul).toContain(input);
    });
  });

  describe("deleteListItem", () => {
    it("should delete an item from the current slide", () => {
      const itemIndex = 0;
      services.deleteListItem(itemIndex);
      const currentSlide = services.getCurrentSlide();
      expect(currentSlide.data[0].ul[itemIndex]).not.toBeDefined();
    });
  });

  describe("closeProject", () => {
    it("should disable write mode", () => {
      services.closeProject();
      const writeEnabled = services.writeEnabled();
      expect(writeEnabled).toBeFalsy();
    });
  });
});
