// pages/checkUser/checkUser.js
var tempArr=[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let db = wx.cloud.database()
    let obj = {}
    let that =this
    for (let i = 0; i < 1120; i = i + 20) {
      db.collection("uUsers").skip(i).limit(20).get().then(res => {
        for (let j = 0; j < res.data.length; j++){
          obj=res.data[j]
          tempArr.push(obj)
        }
      })
    }
    
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

  },dispRecord:function(){
    this.setData({
      result:tempArr
    })
  }
})