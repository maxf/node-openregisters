const chai = require('chai');
const expect = chai.expect;
const Register = require('./register.js').Register;

chai.should();

describe('Register', () => {

  let countryRegister;

  before(() => {
      countryRegister = new Register({
      baseUrl: 'https://country.register.gov.uk',
      apiKey: 'my API key'
    });
  });

  it('should work when properly instantiated', () => {
    countryRegister.should.be.an.instanceOf(Register);
  });

  it('should throw an exception when badly instantiated', () => {
    const badInstantiation = () => new Register(3.14);
    expect(badInstantiation).to.throw('You need to specify a parameter object');
  });

  it('should throw an exception when missing an api key', () => {
    const badInstantiation = () => new Register({foo: 3.14});
    expect(badInstantiation).to.throw('You need to specify an API key');
  });

  it('get() should return information about the register', done => {
    countryRegister.get('/register', {}, (error, response, registerInfo) => {
      expect(response.statusCode).to.equal(200);
      expect(registerInfo.domain).to.equal('register.gov.uk');
      expect(registerInfo['total-records']).to.be.a('number');
      done();
    });
  });

  it('get() should return the first page of register records', done => {
    countryRegister.get('/records', {}, (error, response, records) => {
      expect(response.statusCode).to.equal(200);
      expect(records).to.be.an('object');
      expect(Object.keys(records).length).to.equal(100);
      done();
    });
  });


  it('getInfo should return information about the register', done => {
    countryRegister.getInfo(registerInfo => {
      expect(registerInfo.domain).to.equal('register.gov.uk');
      expect(registerInfo['total-records']).to.be.a('number');
      done();
    });
  });

  it('getRegister should return the register\'s records', done => {
    countryRegister.getRecords(records => {
      expect(Object.keys(records).length).to.equal(100);
      done();
    });
  });

  it('paginated getRegister should return records', done => {
    const callback = records =>  {
      expect(Object.keys(records).length).to.equal(20);
      done();
    };
    countryRegister.getRecords(callback, 1, 20)
  });

  it('getRecordEntries should return entries', done => {
    const callback = entries =>  {
      expect(entries).to.not.have.lengthOf.below(1);
      expect(entries[0].key).to.equal('GB');
      done();
    };
    countryRegister.getRecordEntries(callback, 'GB')
  });

  it('getRecordsByValue should return entries', done => {
    const callback = entries => {
      expect(entries.GB).to.be.an('object');
      done();
    }
    countryRegister.getRecordsByValue(
      callback,
      'citizen-names',
      'Briton;British citizen'
    );
  });

});
