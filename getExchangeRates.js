const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment-timezone');

const parseHtml = (html) => {
  const $ = cheerio.load(html);
  const quotedDateText = $('.time').text();
  if (!quotedDateText.match(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}/)) {
    throw parseError;
  }
  const quotedDate = moment.tz(quotedDateText, 'YYYY/MM/DD hh:mm', 'Asia/Taipei').toDate();
  const currencyRows = $('table[title="牌告匯率"] tbody tr')
    .map((_, row) => {
      const $row = $(row);
      const currencyText = $row.find('td[data-table="幣別"] div.print_show').text().trim();
      const currencyCode = currencyText.match(/\((?<code>[A-Z]+)\)/)?.groups?.code || null;
      const exchangeSightRateText = $row
        .find('td[data-table="本行即期買入"].display_none_print_show')
        .text()
        .trim();
      const exchangeCashRateText = $row
        .find('td[data-table="本行現金買入"].display_none_print_show')
        .text()
        .trim();
      const exchangeRate =
        exchangeSightRateText !== '-'
          ? parseFloat(exchangeSightRateText)
          : parseFloat(exchangeCashRateText);
      if (isNaN(exchangeRate)) {
        throw parseError;
      }
      return [[currencyCode, exchangeRate]];
    })
    .get();

  const rates = Object.fromEntries(currencyRows);
  rates['TWD'] = 1.0;

  return {
    quotedDate,
    rates
  };
};

const getExchangeRate = async () => {
  const response = await axios.get('https://rate.bot.com.tw/xrt?Lang=zh-tw');
  const html = response.data;
  return parseHtml(html);
};

module.exports = getExchangeRate;
