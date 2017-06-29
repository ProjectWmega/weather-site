Vue.prototype.$http = axios

const SERVER_ADDRESS = 'http://140.134.26.64:1234/wmega/webapi/'
const AQI_MAX = {
  'pm25': 250.4,
  'so2': 604,
  'no2': 1249,
  'pm10': 424,
  'o3': 404,
  'co': 30.4
}
const AQI_BAR_WIDTH = 92
// const AQI_BAR_X = 3

const AQI_LEVEL = {
  GOOD: ['#82a050', '良好'],
  NORMAL: ['#c0b158', '普通'],
  ALLERGIES: ['#b9844c', '敏感族群不健康'],
  ALL: ['#a4495d', '所有族群不健康'],
  BAD: ['#784b86', '非常不健康'],
  DANGER: ['#8a6455', '危害']
}

var app = new Vue({
  el: '#app',
  data: {
    WEATHER_NOW_ADDRESS: SERVER_ADDRESS + 'weather/now/',
    AQI_NOW_ADDRESS: SERVER_ADDRESS + 'air/aqi/',
    localCoords: '24.178863/120.646648',
    weatherNow: {
      'time': '--:--',
      'temp': 0,
      'h_24r': 0,
      'humd': 0,
      'wdir': '',
      'wdsd': 0
    },
    aqiNow: {
      'time': '--:--',
      'pollutant': '',
      'aqi': 0,
      'pm25': 0,
      'so2': 0,
      'no2': 0,
      'pm10': 0,
      'o3': 0,
      'co': 0
    },
    aqiPercent: {
      'pm25': 0,
      'so2': 0,
      'no2': 0,
      'pm10': 0,
      'o3': 0,
      'co': 0
    }
  },
  computed: {
    wdirEng: function () {
      const oriWdirText = this.weatherNow['wdir']
      var wdirTextEng = ''
      for (let index in oriWdirText) {
        switch (oriWdirText[index]) {
          case '東':
            wdirTextEng = wdirTextEng.concat('E')
            break
          case '南':
            wdirTextEng = wdirTextEng.concat('S')
            break
          case '西':
            wdirTextEng = wdirTextEng.concat('W')
            break
          case '北':
            wdirTextEng = wdirTextEng.concat('N')
            break
        }
      }
      return wdirTextEng.length === 2
        ? wdirTextEng.split('').reverse().join('') : wdirTextEng
    },
    weatherNowTimeText: function () {
      return this.time2text(this.weatherNow.time)
    },
    aqiNowTimeText: function () {
      return this.time2text(this.aqiNow.time)
    },
    aqiValueColor: function () {
      const COLOR = 0

      let level = this.aqiLevelCalc(this.aqiNow.aqi)
      return AQI_LEVEL[level][COLOR]
    },
    aqiValueText: function () {
      const TEXT = 1

      let level = this.aqiLevelCalc(this.aqiNow.aqi)
      return AQI_LEVEL[level][TEXT]
    }
  },
  methods: {
    dateToday: function () {
      let dateToday = new Date()
      let weekdayText = [
        '日', '一', '二', '三',
        '四', '五', '六'
      ]

      return dateToday.getFullYear() + '年' +
             dateToday.getMonth() + '月' +
             dateToday.getDate() + '日' +
             '(' + weekdayText[dateToday.getDay()] + ')'
    },
    time2text: function (time) {
      let releaseDate = new Date(this.aqiNow.time)

      let formatedHour = this.fillTimeText(releaseDate.getHours())
      let formatMinuts = this.fillTimeText(releaseDate.getMinutes())

      return formatedHour + ':' + formatMinuts
    },
    fillTimeText: function (time) {
      return String(time).length === 1 ? '0' + time : String(time)
    },
    aqiLevelCalc: function (value) {
      if (value < 51) {
        return 'GOOD'
      } else if (value >= 51 && value < 101) {
        return 'NORMAL'
      } else if (value >= 101 && value < 151) {
        return 'ALLERGIES'
      } else if (value >= 151 && value < 201) {
        return 'ALL'
      } else if (value >= 201 && value < 301) {
        return 'BAD'
      } else {
        return 'DANGER'
      }
    },
    aqiBarColor: function (value) {
      if (value < 6) {
        return '#43acdb'
      } else if (value >= 6 && value < 11) {
        return '#42b9bc'
      } else if (value >= 11 && value < 16) {
        return '#a1af56'
      } else if (value >= 16 && value < 21) {
        return '#c0b158'
      } else if (value >= 21 && value < 26) {
        return '#bc9b51'
      } else if (value >= 26 && value < 31) {
        return '#b9844c'
      } else if (value >= 31 && value < 41) {
        return '#b7624e'
      } else if (value >= 41 && value < 51) {
        return '#b15456'
      } else if (value >= 51 && value < 61) {
        return '#a0485d'
      } else {
        return '#857197'
      }
    }
  },
  created () {
    const vm = this
    this.$http.all([
      this.$http.get(this.WEATHER_NOW_ADDRESS + this.localCoords),
      this.$http.get(this.AQI_NOW_ADDRESS + this.localCoords)
    ])
      .then(this.$http.spread(function (weatherNowJson, aqiNowJson) {
        // Weather JSON Process
        for (let key in vm.weatherNow) {
          vm.weatherNow[key] = weatherNowJson.data[key]
        }

        // AQI JSON Processs
        for (let key in vm.aqiNow) {
          if ((key !== 'time') || (key !== 'aqi') || (key !== 'pollutant')) {
            vm.aqiNow[key] = aqiNowJson.data['values'][key]
            let apiPercent = aqiNowJson.data['values'][key] / AQI_MAX[key]
            vm.aqiPercent[key] = apiPercent * AQI_BAR_WIDTH
          } else {
            vm.aqiNow[key] = aqiNowJson.data['values'][key]
          }
        }
      }))
      .catch(function (error) {
        console.log(error)
      })
  }
})
