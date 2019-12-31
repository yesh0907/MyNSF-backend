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

var date = new Date();
var y1 = date.getFullYear();
var m1 = date.getMonth() + 1;
var d1 = date.getDate();

var baseURL = 'https://www.timeanddate.com/date/';
var duration = function duration(d2, m2, y2) {
    return 'durationresult.html?d1=' + d1 + '&m1=' + m1 + '&y1=' + y1 + '&d2=' + d2 + '&m2=' + m2 + '&y2=' + y2 + '&ti=on&';
};
var workdays = function workdays(d2, m2, y2) {
    return 'workdays.html?d1=' + d1 + '&m1=' + m1 + '&y1=' + y1 + '&d2=' + d2 + '&m2=' + m2 + '&y2=' + y2;
};

var getDays = async function getDays(d2, m2, y2) {
    var html = await (0, _requestPromise2.default)(baseURL + duration(d2, m2, y2));
    var days = (0, _cheerio2.default)('div.eight.columns>h2', html).text().trim().replace(/\D/gm, "");
    return new Promise(function (resolve) {
        resolve({ "days": days });
    });
};

var getWorkingDays = async function getWorkingDays(d2, m2, y2) {
    var html = await (0, _requestPromise2.default)(baseURL + workdays(d2, m2, y2));
    var wd_days = (0, _cheerio2.default)('div.re-result.five.columns>h2', html).text().trim().replace(/\D/gm, "");
    return new Promise(function (resolve) {
        resolve({ "wd_days": wd_days });
    });
};

var app = (0, _express2.default)();

app.get('/', async function (req, res, next) {
    try {
        var _req$query = req.query,
            d2 = _req$query.d2,
            m2 = _req$query.m2,
            y2 = _req$query.y2;

        var days = await getDays(d2, m2, y2);
        var wd = await getWorkingDays(d2, m2, y2);
        var data = _lodash2.default.merge(days, wd);
        res.json(data);
    } catch (e) {
        next(e);
    }
});

app.listen(8080, function () {
    return console.log('Serving on port 8080');
});

// module.exports = app;