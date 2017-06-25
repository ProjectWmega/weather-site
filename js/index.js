/* eslint-disable no-new */
Vue.prototype.$http = axios

const SERVER_ADDRESS = 'http://140.134.26.64:1234/wmega/webapi/'

var weather = new Vue({
  el: '#weather',
  data: {
    WEATHER_NOW_ADDRESS: SERVER_ADDRESS + 'weather/now/',
    AQI_NOW_ADDRESS: SERVER_ADDRESS + 'air/aqi/',
    localCoords: '24.178863/120.646648',
    wjson: '',
    weatherNow: {
      'h_24r': 0,
      'humd': 0,
      'temp': 0,
      'wdir': '',
      'wdsd': 0
    },
    aqiNow: {
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
    }
  },
  created () {
    this.$http.all([
      this.$http.get(this.WEATHER_NOW_ADDRESS + this.localCoords),
      this.$http.get(this.AQI_NOW_ADDRESS + this.localCoords)
    ])
      .then(this.$http.spread(function (weatherNowJson, aqiNowJson) {
        // Weather JSON Process
        for (let key in weather.$data.weatherNow) {
          weather.$data.weatherNow[key] = weatherNowJson.data[key]
        }

        // AQI JSON Processs
        for (let key in weather.$data.aqiNow) {
          weather.$data.aqiNow[key] = aqiNowJson.data['values'][key]
        }
      }))
      .catch(function (error) {
        console.log(error)
      })
  }
})
