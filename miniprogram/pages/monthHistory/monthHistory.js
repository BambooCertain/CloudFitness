// pages/monthHistory/monthHistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    monthLists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var myDb = wx.cloud.database()
    //console.log(wx.getStorageSync('leoOID'))
    myDb.collection('record').where({
      _openid: wx.getStorageSync('leoOID')
    }).get().then(res => {
      // console.log(res)
      for(let i=0;i<res.data.length;i++){
        //console.log(res.data[i].month)
        //var year=res.data[i].month.subString(0,4)
        //var month=res.data[i].month.subString(5,7)
        //console.log(year,month)
        var tempArr=this.data.monthLists
        var obj={
          "month":res.data[i].month
        }
        tempArr[tempArr.length]=obj
        tempArr.reverse()
        this.setData({
          monthLists:tempArr
        })
        //console.log(this.data.monthLists)
        this.onShow()
      }
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

  },viewDayList:function(event){
    wx.navigateTo({
      url: '../dayHistory/dayHistory?month='+event.currentTarget.dataset.month,
    })
  }
})