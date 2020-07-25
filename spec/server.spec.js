const request = require("request");

describe("get messages", () => {
  it("should respond with 200 OK", (done) => {
    request.get("http://localhost:3000/messages", (err, resp) => {
      expect(resp.statusCode).toEqual(200);
      done();
    });
  });
  it("should return a list, that is not empty", (done) => {
    request.get("http://localhost:3000/messages", (err, resp) => {
      expect(JSON.parse(resp.body).length).toBeGreaterThan(0);
      done();
    });
  });
});

describe("get messages from a user", () => {
  it("should respond with 200 OK", (done) => {
    request.get("http://localhost:3000/messages/tim", (err, resp) => {
      expect(resp.statusCode).toEqual(200);
      done();
    });
  });
  it("should have name as tim", (done) => {
    request.get("http://localhost:3000/messages/tim", (err, resp) => {
      expect(JSON.parse(resp.body)[0].name).toEqual('tim');
      done();
    });
  });
});
