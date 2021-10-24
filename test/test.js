const should = require("should");
const request = require("request");
const expect = require("chai").expect;
const baseURL = "https://wcg-apis.herokuapp.com/";
const jsdom = require("jsdom");
const dom = new jsdom.JSDOM("");
const $ = require("jquery")(dom.window);

const kleeJSON = {
    citizen_id: "1103703125435",
    name: "Sahatsawat",
    surname: "Kanpai",
    birth_date: "21 Oct 2000",
    occupation: "student",
    address: "Samutprakarn"
}

function postKlee() {
    $.ajax({
        type: "POST",
        url: baseURL + "registration",
        data: JSON.stringify(kleeJSON),
        // success: function () {
        //     if (xhr.readyState === 4) {
        //         console.log(xhr.status);
        //         console.log(xhr.responseText);
        // }},
        dataType: "json"
    })
}

// initial test
describe("API status check", function() {
    it("OK status code 200", function(done) {
        request.get({url: baseURL}, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});

describe("API Test", function() {
    it("Test an endpoint of getting citizen JSON by citizen id correctly", function(done) {
        request.get({url: baseURL + 'citizen/' + kleeJSON["citizen_id"]}, function(error, response, body) {
            postKlee();
            expect(JSON.parse(body)["citizen-id"]).to.equal(kleeJSON.citizen_id);
            done();
        });
    });
});
