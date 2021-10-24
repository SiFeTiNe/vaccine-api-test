var should = require("should");
var request = require("request");
var expect = require("chai").expect;
var baseURL = "https://wcg-apis.herokuapp.com/"
var util = require("util");

describe("Status 200 check", function() {
    it("Status 200 check", function() {
        request.get({ url: baseURL }, 
            function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    console.log(body);
                done();
            });
    });
});
