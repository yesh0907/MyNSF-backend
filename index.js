import request_promise from 'request-promise';
import cheerio from 'cheerio';
import express from 'express';
import lodash from 'lodash';

const date = new Date();
const y1 = date.getFullYear();
const m1 = date.getMonth() + 1;
const d1 = date.getDate();

const baseURL = 'https://www.timeanddate.com/date/';
const duration = (d2, m2, y2) => (`durationresult.html?d1=${d1}&m1=${m1}&y1=${y1}&d2=${d2}&m2=${m2}&y2=${y2}&ti=on&`);
const workdays = (d2, m2, y2) => (`workdays.html?d1=${d1}&m1=${m1}&y1=${y1}&d2=${d2}&m2=${m2}&y2=${y2}`);

const getDays = async (d2, m2, y2) => {
    const html = await request_promise(baseURL + duration(d2, m2, y2));
    const days = cheerio('div.eight.columns>h2', html).text().trim().replace(/\D/gm, "");
    return new Promise(resolve => {
        resolve({"days": days});
    });
}

const getWorkingDays = async (d2, m2, y2) => {
    const html = await request_promise(baseURL + workdays(d2, m2, y2));
    const wd_days= cheerio('div.re-result.five.columns>h2', html).text().trim().replace(/\D/gm, "");
    return new Promise(resolve => {
        resolve({"wd_days": wd_days});
    });
}

const app = express();

app.get('/', async (req, res, next) => {
    try {
        const {d2, m2, y2} = req.query;
        const days = await getDays(d2, m2, y2);
        const wd = await getWorkingDays(d2, m2, y2);
        const data = lodash.merge(days, wd);
        res.json(data);
    }
    catch (e) {
        next(e);
    }
});

module.exports = app;