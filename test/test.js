const should = require("should");
const request = require("request");
const chai = require("chai");
const {expect, assert} = require("chai");
const axios = require("axios").default;
const baseURL = "https://wcg-apis.herokuapp.com/";
let chaiHttp = require("chai-http");
chai.use(chaiHttp);

const missingCitizenParamMessage = "registration failed: missing some attribute";
const invalidCitizenIdMessage = "registration failed: invalid citizen ID";
const alreadyRegisteredMessage = "registration failed: this person already registered";
const alreadyReservedMessage = "reservation failed: there is already a reservation for this citizen";
const invalidVaccineNameMessage = "report failed: invalid vaccine name";
const cancelReservationMessage = "cancel reservation successfully";
const futureVaccineMessage = "report failed: can only reserve vaccine in the future";

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
    birth_date: "12 Dec 2000",
    occupation: "cat",
    address: "Bangkok"
}

function register(citizen_id, name, surname, birth_date, occupation, address) {
    var queryString = generateQueryString(citizen_id, name, surname, birth_date, occupation, address);
    request.post({url: baseURL + 'registration' + queryString}, function(error, response, body) {
        console.log(body);
    });
}

function registerJSON(JSONData) {
    var queryString = generateQueryStringJSON(JSONData);
    request.post({url: baseURL + 'registration' + queryString}, function(error, response, body) {
        console.log(body);
    });
}

function generateQueryString(citizen_id, name, surname, birth_date, occupation, address) {
    return `?citizen_id=${citizen_id}&name=${name}&surname=${surname}&birth_date=${birth_date}&occupation=${occupation}&address=${address}`;
}

function generateQueryStringJSON(JSONData) {
    return generateQueryString(JSONData.citizen_id, JSONData.name, JSONData.surname, JSONData.birth_date, JSONData.occupation, JSONData.address);
}


function test() {
    // initial test
    describe("API web service status check", function() {
        it("Test OK status code 200", function(done) {
            request.get({url: baseURL}, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });


    describe("WCG API Test citizen GET method", function() {
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


    describe("WCG API Test citizen DELETE method" , function() {
        it("Test to destroy citizen database", function(done) {
            request.delete({url: baseURL + 'citizen'});
            request.get({url: baseURL + 'registration'}, function(error, response, body) {
                expect(body.length).to.not.equal(0);
                done();
            });
        });
    });


    describe("WCG API Test registration POST method", function() {
        it("Test register new citizen with an already registered citizen", function(done) {
            var queryString = generateQueryStringJSON(kleeJSON);
            request.post({url: baseURL + 'registration' + queryString}, function(error, response, body) {
                expect(JSON.parse(body)["feedback"]).to.equal(alreadyRegisteredMessage);
                done();
            });
        });

        it("Test register new citizen with an invalid citizen id", function(done) {
            var queryString = generateQueryString("WAAA-040", "Johnny", "Potae", "12 Dec 1992", "student", "Venus");
            request.post({url: baseURL + 'registration' + queryString}, function(error, response, body) {
                expect(JSON.parse(body)["feedback"]).to.equal(invalidCitizenIdMessage);
                done();
            });
        });

        it("Test register new citizen without citizen id given", function(done) {
            var queryString = generateQueryString("", "Johnny", "Potae", "12 Dec 1992", "student", "Venus");
            request.post({url: baseURL + 'registration' + queryString}, function(error, response, body) {
                expect(JSON.parse(body)["feedback"]).to.equal(missingCitizenParamMessage);
                done();
            });
        });

        it("Test register new citizen without name given", function(done) {
            var queryString = generateQueryString("1126210545629", "", "Potae", "12 Dec 1992", "student", "Venus");
            request.post({url: baseURL + 'registration' + queryString}, function(error, response, body) {
                expect(JSON.parse(body)["feedback"]).to.equal(missingCitizenParamMessage);
                done();
            });
        });

        it("Test register new citizen without surname given", function(done) {
            var queryString = generateQueryString("1126210545631", "Johnny", "", "12 Dec 1992", "student", "Venus");
            request.post({url: baseURL + 'registration' + queryString}, function(error, response, body) {
                expect(JSON.parse(body)["feedback"]).to.equal(missingCitizenParamMessage);
                done();
            });
        });

        it("Test register new citizen without birth date given", function(done) {
            var queryString = generateQueryString("1126210545632", "Johnny", "Potae", "", "student", "Venus");
            request.post({url: baseURL + 'registration' + queryString}, function(error, response, body) {
                expect(JSON.parse(body)["feedback"]).to.equal(missingCitizenParamMessage);
                done();
            });
        });

        it("Test register new citizen without occupation given", function(done) {
            var queryString = generateQueryString("1126210545633", "Johnny", "Potae", "12 Dec 1992", "", "Venus");
            request.post({url: baseURL + 'registration' + queryString}, function(error, response, body) {
                expect(JSON.parse(body)["feedback"]).to.equal(missingCitizenParamMessage);
                done();
            });
        });

        it("Test register new citizen without address given", function(done) {
            var queryString = generateQueryString("1126210545633", "Johnny", "Potae", "12 Dec 1992", "student", "");
            request.post({url: baseURL + 'registration' + queryString}, function(error, response, body) {
                expect(JSON.parse(body)["feedback"]).to.equal(missingCitizenParamMessage);
                done();
            });
        });
    });
}

async function main() {
    await registerJSON(kleeJSON);
    await registerJSON(keybuayJSON);
    await test();
}

main();