'use strict';

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseURL = 'https://www.timeanddate.com/date/';
var duration = 'durationresult.html?d1=7&m1=7&y1=2019&d2=31&m2=7&y2=2020&ti=on&';
var workdays = 'workdays.html?d1=7&m1=7&y1=2019&d2=31&m2=7&y2=2020';
var getDays = async function getDays() {
    var html = await (0, _requestPromise2.default)(baseURL + duration);
    var days = (0, _cheerio2.default)('div.eight.columns>h2', html).text().trim().replace(/\D/gm, "");
    return new Promise(function (resolve) {
        resolve({ "days": days });
    });
};

var getWorkingDays = async function getWorkingDays() {
    var html = await (0, _requestPromise2.default)(baseURL + workdays);
    var wd_days = (0, _cheerio2.default)('div.re-result.five.columns>h2', html).text().trim().replace(/\D/gm, "");
    return new Promise(function (resolve) {
        resolve({ "wd_days": wd_days });
    });
};

var app = (0, _express2.default)();

app.get('/days', async function (req, res, next) {
    try {
        var days = await getDays();
        var wd = await getWorkingDays();
        var data = _lodash2.default.merge(days, wd);
        res.json(data);
    } catch (e) {
        next(e);
    }
});

app.listen(process.env.PORT, function () {
    return console.log('Listening on port ' + process.env.PORT + '!');
});