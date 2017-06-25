/* eslint-disable no-new */
var weather = new Vue({
  el: '#weather',
  data: {
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
  }
})
