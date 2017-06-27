Vue.prototype.$http = axios

const SERVER_ADDRESS = 'http://140.134.26.64:1234/wmega/webapi/'

var app = new Vue({
  el: '#app',
  data: {
    WEATHER_NOW_ADDRESS: SERVER_ADDRESS + 'weather/now/',
    AQI_NOW_ADDRESS: SERVER_ADDRESS + 'air/aqi/',
    localCoords: '24.178863/120.646648',
    weatherNow: {
      'time': '',
      'temp': 0,
      'h_24r': 0,
      'humd': 0,
      'wdir': '',
      'wdsd': 0
    },
    aqiNow: {
      'time': '',
      'aqi': 0,
      'co': 0,
      'no': 0,
      'no2': 0,
      'nox': 0,
      'o3': 0,
      'pm10': 0,
      'pm25': 0,
      'so2': 0
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
          vm.aqiNow[key] = aqiNowJson.data['values'][key]
        }
      }))
      .catch(function (error) {
        console.log(error)
      })
  }
})
