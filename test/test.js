const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'http://wcg-apis-test.herokuapp.com/';
const year = new Date().getFullYear();

// Assertion Style
chai.should();

chai.use(chaiHttp);

const REGISTRATION_FEEDBACK = {
    'success':              'registration success!',
    'missing_key':          'registration failed: missing some attribute',
    'registered':           'registration failed: this person already registered',
    'invalid_id':           'registration failed: invalid citizen ID',
    'invalid_birthdate':    'registration failed: invalid birth date format',
    'invalid_age':          'registration failed: not archived minimum age',
    'other':                'registration failed: something go wrong, please contact admin'
};

const kleeJSON = {
    citizen_id: '1103703125435',
    name: 'Kleeboard',
    surname: 'FiNeSiTe',
    birth_date: '2000-10-21',
    occupation: 'INFP',
    phone_number: '0923995853',
    is_risk: 'False',
    address: 'INFP 9w1 sp/sx 945 RLUAI Phlegmatic-Melancholic'
};
const enfjJSON = {
    citizen_id: '0212792791210',
    name: 'Protagonist',
    surname: 'FeNiSeTi',
    birth_date: '2000-12-12',
    occupation: 'ENFJ',
    phone_number: '0212792791',
    is_risk: 'False',
    address: 'ENFJ 2w1 so/sx 279 SCOAI Sanguine-Melancholic'
};
const mockerJSON = {
    citizen_id: '0126210545459',
    name: 'Boss',
    surname: 'TeNiSeFi',
    birth_date: '2000-12-5',
    occupation: 'ENTJ',
    phone_number: '0878358351',
    is_risk: 'True',
    address: 'ENTJ 8w7 sx/so 835 SCOEI Choleric-Sanguine'
};


describe('WCG API Tests', () => {

    /**
     * Setup before the test is started
     */
        before((done) => {
        chai.request(server)
        .delete(`/registration/${kleeJSON['citizen_id']}`)
        .end((err, response) => {
            done();
        });
    })

    /**
     * Test the GET registration
     */
    describe('Registration GET tests', () => {

        /**
         * Setup before the test is started
         * GET only once so that not to mess up the server and timeout
         */
        before((done) => {
            chai.request(server)
            .post('/registration')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(kleeJSON)
            .end((err, response) => {
                chai.request(server)
                    .post('/registration')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(enfjJSON)
                    .end((err, response) => {
                        chai.request(server)
                        .get(`/registration/${kleeJSON['citizen_id']}`)
                        .end((err, response) => {
                            this.res_data = JSON.parse(response.text);
                            done();
                        });
                    });
            });
        });
        
        for (const [key, value] of Object.entries(kleeJSON)) {
            it(`GET /registration/{{ citizen_id }} checking ${key}`, (done) => {
                this.res_data.should.have.property(key).eq(value);
                done();
            });
        }
    });

    /**
     * Test POST registration
     */
    describe('Registration POST tests', () => {

        /**
         * Setup before the test is started
         */
        before((done) => {
            chai.request(server)
            .delete(`/registration/${mockerJSON['citizen_id']}`)
            .end((err, response) => {
                done();
            });
        })

        it('POST /registration with registered citizen', (done) => {
            chai.request(server)
            .post('/registration')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(kleeJSON)
            .end((err, response) => {
                (JSON.parse(response.text)).should.have.property('feedback').eq(REGISTRATION_FEEDBACK['registered']);
                done();
            });
        });
        
        it('POST /registration with invalid citizen_id length', (done) => {
            let mockeryJSON = Object.assign(this, mockerJSON);
            mockeryJSON['citizen_id'] = '1150';
            chai.request(server)
            .post('/registration')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(mockeryJSON)
            .end((err, response) => {
                (JSON.parse(response.text)).should.have.property('feedback').eq(REGISTRATION_FEEDBACK['invalid_id']);
                done();
            });
        });

        it('POST /registration with invalid citizen_id format', (done) => {
            let mockeryJSON = Object.assign(this, mockerJSON);
            mockeryJSON['citizen_id'] = '~~~ kore wa id janain da ~~~';
            chai.request(server)
            .post('/registration')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(mockeryJSON)
            .end((err, response) => {
                (JSON.parse(response.text)).should.have.property('feedback').eq(REGISTRATION_FEEDBACK['invalid_id']);
                done();
            });
        });

        it('POST /registration with invalid age', (done) => {
            let mockeryJSON = Object.assign(this, mockerJSON);
            mockeryJSON['birth_date'] = `${year-7}-01-01`;
            chai.request(server)
            .post('/registration')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(mockeryJSON)
            .end((err, response) => {
                (JSON.parse(response.text)).should.have.property('feedback').eq(REGISTRATION_FEEDBACK['invalid_age']);
                done();
            });
        });

        it('POST /registration with invalid month in birth_date', (done) => {
            let mockeryJSON = Object.assign(this, mockerJSON);
            mockeryJSON['birth_date'] = `${year-19}-19-01`;
            chai.request(server)
            .post('/registration')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(mockeryJSON)
            .end((err, response) => {
                (JSON.parse(response.text)).should.have.property('feedback').eq(REGISTRATION_FEEDBACK['invalid_birthdate']);
                done();
            });
        });

        it('POST /registration with invalid day in birth_date', (done) => {
            let mockeryJSON = Object.assign(this, mockerJSON);
            mockeryJSON['birth_date'] = `${year-19}-12-79`;
            chai.request(server)
            .post('/registration')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(mockeryJSON)
            .end((err, response) => {
                (JSON.parse(response.text)).should.have.property('feedback').eq(REGISTRATION_FEEDBACK['invalid_birthdate']);
                done();
            });
        });

        it('POST /registration with invalid birth_date format', (done) => {
            let mockeryJSON = Object.assign(this, mockerJSON);
            mockeryJSON['birth_date'] = 'tanjoubi-da-yo';
            chai.request(server)
            .post('/registration')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(mockeryJSON)
            .end((err, response) => {
                (JSON.parse(response.text)).should.have.property('feedback').eq(REGISTRATION_FEEDBACK['invalid_birthdate']);
                done();
            });
        });

        it('POST /registration with a html tag in name', (done) => {
            let mockeryJSON = Object.assign(this, mockerJSON);
            mockeryJSON['citizen_id'] = '0126210545460'
            mockeryJSON['name'] = `<a href="https://libredd.it/img/8s4cuxfboxd71.jpg">Horny INFP belike(2)</a>`;
            mockeryJSON['surname'] = '<- Click';
            chai.request(server)
            .delete(`/registration/${mockeryJSON['citizen_id']}`)
            .set('content-type', 'application/none')
            .end((err, response) => {
                chai.request(server)                
                .post('/registration')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(mockeryJSON)
                .end((err, response) => {
                    (JSON.parse(response.text)).should.have.property('feedback').eq(REGISTRATION_FEEDBACK['other']);
                    done();
                });
            });
        });

        it('POST /registration with a html tag in surname', (done) => {
            let mockeryJSON = Object.assign(this, mockerJSON);
            mockeryJSON['citizen_id'] = '0126210545459'
            mockeryJSON['name'] = "Horny INFP belike(1):";
            mockeryJSON['surname'] = `<a href="https://i.redd.it/3zen79gyj0y51.png">Click!</a>`;
            chai.request(server)
            .delete(`/registration/${mockeryJSON['citizen_id']}`)
            .set('content-type', 'application/none')
            .end((err, response) => {
                chai.request(server)                
                .post('/registration')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(mockeryJSON)
                .end((err, response) => {
                    (JSON.parse(response.text)).should.have.property('feedback').eq(REGISTRATION_FEEDBACK['other']);
                    done();
                });
            });
        });

        it('POST /registration with a html tag in address', (done) => {
            let mockeryJSON = Object.assign(this, mockerJSON);
            mockeryJSON['citizen_id'] = '0126210545458'
            mockeryJSON['name'] = `Mediator`;
            mockeryJSON['surname'] = 'Over there! ->';
            mockeryJSON['occupation'] = `<a href="https://libredd.it/img/8s4cuxfboxd71.jpg">Horny INFP belike(3)</a>`
            chai.request(server)
            .delete(`/registration/${mockeryJSON['citizen_id']}`)
            .set('content-type', 'application/none')
            .end((err, response) => {
                chai.request(server)                
                .post('/registration')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(mockeryJSON)
                .end((err, response) => {
                    (JSON.parse(response.text)).should.have.property('feedback').eq(REGISTRATION_FEEDBACK['other']);
                    done();
                });
            });
        });

        it('POST /registration with a html tag in occupation', (done) => {
            let mockeryJSON = Object.assign(this, mockerJSON);
            mockeryJSON['citizen_id'] = '0126210545457'
            mockeryJSON['name'] = `INFP`;
            mockeryJSON['surname'] = 'The idealist';
            mockeryJSON['occupation'] = `Fi dom, Ne aux`
            mockeryJSON['address'] = '<a href="https://i.redd.it/ib6ot6pwf3k71.jpg">Please forgot what I have mentioned!</a>'
            chai.request(server)
            .delete(`/registration/${mockeryJSON['citizen_id']}`)
            .set('content-type', 'application/none')
            .end((err, response) => {
                chai.request(server)                
                .post('/registration')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(mockeryJSON)
                .end((err, response) => {
                    (JSON.parse(response.text)).should.have.property('feedback').eq(REGISTRATION_FEEDBACK['other']);
                    done();
                });
            });
        });

        for (const [key, value] of Object.entries(mockerJSON)) {
            it(`POST /registration with missing ${key}`, (done) => {
                let mockeryJSON = Object.assign(this, mockerJSON);
                delete mockeryJSON[key];
                chai.request(server)
                .post('/registration')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(mockeryJSON)
                .end((err, response) => {
                    (JSON.parse(response.text)).should.have.property('feedback').not.eq(REGISTRATION_FEEDBACK['missing_key']);
                    done();
                });
            });
        }
    });
    
});
