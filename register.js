const request = require('request');

class Register {
  constructor (params) {
    if (typeof params !== 'object')
      throw 'You need to specify a parameter object';
    if (!params.apiKey || typeof params.apiKey !== 'string')
      throw 'You need to specify an API key as a string';
    if (!params.baseUrl || typeof params.baseUrl !== 'string')
      throw 'You need to specify a base URL as a string';

    this.apiKey = params.apiKey;
    this.baseUrl = params.baseUrl;
  }

  get(path, options, callback) {
    let httpOptions = {
      url: `${this.baseUrl}${path}`,
      headers: {
        Authorization: this.apiKey,
        Accept: 'application/json'
      }
    }

    let queryStringParams = {};
    Object.keys(options).forEach(key => {
      if (['page-index', 'page-size'].includes(key)) {
        queryStringParams[key] = options[key];
      }
    });
    if (queryStringParams !== {}) httpOptions.qs = queryStringParams;

    request.get(httpOptions, (error, response, body) => {
      callback(
        error,
        response,
        !error && response.statusCode === 200 ? JSON.parse(body) : {}
      );
    });
  }

  get2(path, options, functionName, callback) {
    this.get(path, options, (error, response, data) => {
      if (error || response.statusCode !== 200) {
        throw `${functionName} failed on ${this.baseUrl}`;
      } else {
        callback(data);
      }
    });
  }

  getInfo(callback) {
    this.get2('/register', {}, 'getInfo', callback);
  }

  getRecords(callback, pageIndex, pageSize) {
    const options = {'page-size': pageSize, 'page-index': pageIndex };
    this.get2('/records', options, 'getRecords', callback);
  }

  getRecordEntries(callback, fieldVal) {
    this.get2(`/records/${fieldVal}/entries`, {}, 'getRecordEntries', callback);
  }



}



exports.Register = Register;
