// pages/dayHistory/dayHistory.js
var jutils = require('../../js/jUnit.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayLists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.month)
    var dayDB = wx.cloud.database()
    dayDB.collection("record").where({
      _openid:wx.getStorageSync('leoOID'),
      month:options.month
    }).get().then(res=>{
      var tempArr=res.data[0].stepLists
      // var tempArr=[]
      // var aLength=tempArr2.length
      for(let i=0;i<tempArr.length;i++){
          var myDate = jutils.formatTime(new Date(tempArr[i].date * 1000))
          tempArr[i].date=myDate
      }
      tempArr.reverse()
      this.setData({
        dayLists:tempArr
      })

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})