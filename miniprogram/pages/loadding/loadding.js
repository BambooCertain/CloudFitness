const app = getApp()

Page({
  data: {
    runDate: new Date(),
    runStep: 0,
    openId: ""
  },
  onShow: function () {},
  onLoad: function () {

    wx.login({
      success: res => {
        wx.cloud.callFunction({
          name: 'login',
          success: res => {

            wx.setStorageSync("leoOID", res.result.userInfo.openId)
            
            const db = wx.cloud.database()
            console.log(res.result.userInfo.openId) 
            db.collection("uUsers").where({
              _openid: wx.getStorageSync("leoOID")
            }).get().then(res => {
              if (res.data.length > 0) {
                var tempInfo = {
                  "uRecordID": res.data[0]._id,
                  "avatarUrl": res.data[0].avatarUrl,
                  "nickName": res.data[0].nickName,
                  "openID": res.data[0].openID,
                  "uDepart": res.data[0].uDepart,
                  "uName": res.data[0].uName,
                  "lang":res.data[0].lang,
                  "uNumber": res.data[0].uNumber,
                  "uTel": res.data[0].uTel,
                  "stepLists": res.data[0].stepLists,
                  "uchecked": res.data[0].uchecked
                }
                wx.setStorage({
                  key: 'myInfo',
                  data: tempInfo,
                })
                wx.setStorageSync('signup', true)
                wx.redirectTo({
                  url: '../daily/daily',
                })
              } else {
                wx.setStorageSync('signup', false)
                wx.redirectTo({
                  url: '../index/index',
                })
              }
            })
          }
        })
      }
    })

  }
})