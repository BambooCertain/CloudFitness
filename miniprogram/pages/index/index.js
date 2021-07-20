//index.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    signuped: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    noticeText: '',
    ready: false,
    noticeArr: []
  },
  onLoad: function () {
    //console.log(wx.getStorageSync('myInfo'))
    wx.getWeRunData({}) //调用微信运动授权
    wx.getUserInfo({})
    this.setData({
      signuped: wx.getStorageSync("signup"),
      ready: true
    })
    const db = wx.cloud.database()
    db.collection('notice').get().then(res => {
      //console.log(res)
      this.setData({
        noticeArr: res.data[0].notice
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: '欢迎加入杭师大健身走',
      path: '/pages/loadding/loadding',
      success: function (res) {}
    }
  },
  getUserInfo: function () {
    //读取openId,查询数据库，是否存在此用户，如果存在跳转到daily,否则跳转至注册页

    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.werun']) {
          wx.showModal({
            title: '授权不足',
            content: '请打开微信运动授权，否则无法参加活动',
            cancelText: '不参加！',
            confirmText: '打开授权',
            success(res) {
              if (res.cancel) {
                // 用户点击了取消属性的按钮，对应选择了'女'
              } else if (res.confirm) {
                // 用户点击了确定属性的按钮，对应选择了'男'
                wx.openSetting({})
              }
            }
          })
        } else if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res2) {
              var tempInfo = {
                "avatarUrl": res2.userInfo.avatarUrl,
                "nickName": res2.userInfo.nickName
              }
              wx.setStorage({
                key: 'myInfo',
                data: tempInfo,
              })
              wx.navigateTo({
                url: '../signUp/signUp',
              })
            }
          })
        }
      }
    })
  },
  viewDaily: function () {
    wx.navigateTo({
      url: '../daily/daily',
    })
  },
  closeGrant: function () {
    wx.openSetting({})
  }
})