const should = require("should");
const request = require("request");
var chai = require("chai");
let {expect, assert} = require("chai");
const axios = require("axios").default;
const baseURL = "https://wcg-apis.herokuapp.com/";
let chaiHttp = require("chai-http");
chai.use(chaiHttp);

const kleeJSON = {
    citizen_id: "1103703125435",
    name: "Sahatsawat",
    surname: "Kanpai",
    birth_date: "21 Oct 2000",
    occupation: "student",
    address: "Samutprakarn"
}
const keybuayJSON = {
    citizen_id: "1103703125439",
    name: "Sahatsawuay",
    surname: "Huacut",
    birth_date: "12 Dec 1992",
    occupation: "student",
    address: "Samutprakarn"
}

function register(JSONdata) {
    var feedback = "";
    request.post({
        headers: {'content-type': 'application/json'},
        url: baseURL + "registration",
        form: JSONdata
    }, function(error, response, body){
        feedback = JSON.parse(body)["feedback"];
    });
    return feedback;
}

register(kleeJSON);
register(keybuayJSON);

// initial test
describe("API web service status check", function() {
    it("Test OK status code 200", function(done) {
        request.get({url: baseURL}, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});

describe("API Test", function() {
    it("Test an endpoint of getting citizen JSON by a valid citizen id correctly", function(done) {
        request.get({url: baseURL + 'citizen/' + keybuayJSON.citizen_id}, function(error, response, body) {
            expect(JSON.parse(body)["citizen-id"]).to.equal(keybuayJSON.citizen_id);
            done();
        });
    });

    it("Test an endpoint of getting citizen JSON by an invalid citizen id", function(done) {
        request.get({url: baseURL + 'citizen/' + "kore-wa-id-janain-da"}, function(error, response, body) {
            expect(response.statusCode).to.not.equal(200);
            done();
        });
    });

    
});
