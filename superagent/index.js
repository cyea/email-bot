const fetch = require("../utils/superagent");
const config = require("../config");
const cheerio = require("cheerio");
const { formatDate } = require("./../utils");
const getOne = async () => {
  // 获取每日一句
  let res = await fetch(config.ONE, "GET");
  let $ = cheerio.load(res.text);
  let todayOneList = $("#carousel-one .carousel-inner .item");
  let info = $(todayOneList[0])
    .find(".fp-one-cita")
    .text()
    .replace(/(^\s*)|(\s*$)/g, "");
  let imgSrc = $(todayOneList[0])
    .find(".fp-one-imagen")
    .attr("src");
  return {
    one: {
      info,
      imgSrc
    }
  };
};

const getWeather = async () => {
  //获取墨迹天气
  let url = config.MOJI_HOST + config.CITY + "/" + config.LOCATION;
  let res = await fetch(url, "GET");
  let $ = cheerio.load(res.text);
  let weatherTip = $(".wea_tips em").text();

  const now = $(".wea_weather.clearfix");

  let nowInfo = {
    Temp: now.find("em").text(),
    WeatherText: now.find("b").text(),
    FreshText: now.find(".info_uptime").text()
  };

  let threeDaysData = [];

  $(".forecast .days").each(function(i, elem) {
    const SingleDay = $(elem).find("li");
    threeDaysData.push({
      Day: $(SingleDay[0])
        .text()
        .replace(/(^\s*)|(\s*$)/g, ""),
      WeatherImgUrl: $(SingleDay[1])
        .find("img")
        .attr("src"),
      WeatherText: $(SingleDay[1])
        .text()
        .replace(/(^\s*)|(\s*$)/g, ""),
      Temperature: $(SingleDay[2])
        .text()
        .replace(/(^\s*)|(\s*$)/g, ""),
      WindDirection: $(SingleDay[3])
        .find("em")
        .text()
        .replace(/(^\s*)|(\s*$)/g, ""),
      WindLevel: $(SingleDay[3])
        .find("b")
        .text()
        .replace(/(^\s*)|(\s*$)/g, ""),
      Pollution: $(SingleDay[4])
        .text()
        .replace(/(^\s*)|(\s*$)/g, ""),
      PollutionLevel: $(SingleDay[4])
        .find("strong")
        .attr("class")
    });
  });

  return {
    moji: {
      weatherTip,
      nowInfo,
      threeDaysData
    }
  };
};

const getAllData = async () => {
  let oneData = await getOne();
  let weatherData = await getWeather();
  const allData = { today: formatDate(), ...oneData, ...weatherData };
  console.log(allData);
  return allData;
};

module.exports = getAllData;
