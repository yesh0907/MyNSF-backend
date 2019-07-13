import request_promise from 'request-promise';
import cheerio from 'cheerio';
import express from 'express';
import lodash from 'lodash';

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();

const baseURL = 'https://www.timeanddate.com/date/';
const duration = `durationresult.html?d1=${day}&m1=${month}&y1=${year}&d2=31&m2=7&y2=2020&ti=on&`;
const workdays = `workdays.html?d1=${day}&m1=${month}&y1=${year}&d2=31&m2=7&y2=2020`;
const getDays = async () => {
    const html = await request_promise(baseURL + duration);
    const days = cheerio('div.eight.columns>h2', html).text().trim().replace(/\D/gm, "");
    return new Promise(resolve => {
        resolve({"days": days});
    });
}

const getWorkingDays = async () => {
    const html = await request_promise(baseURL + workdays);
    const wd_days= cheerio('div.re-result.five.columns>h2', html).text().trim().replace(/\D/gm, "");
    return new Promise(resolve => {
        resolve({"wd_days": wd_days});
    });
}

const app = express();

app.get('/', async (req, res, next) => {
    try {
        const days = await getDays();
        const wd = await getWorkingDays();
        const data = lodash.merge(days, wd);
        res.json(data);
    }
    catch (e) {
        next(e);
    }
});

module.exports = app;