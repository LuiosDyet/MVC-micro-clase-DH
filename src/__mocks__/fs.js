const data = require("./mock_database.json");

let mockData = JSON.stringify(data);

module.exports = {
  readFileSync: jest.fn(() => mockData),
  writeFileSync: jest.fn((filePath, data) => {
    mockData = data;
  }),
};
