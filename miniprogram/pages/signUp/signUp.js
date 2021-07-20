// pages/daily/daily.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 个人信息
    userInfo: {},
    openid: "",
    recordCount: 0,
    inputNumber: "",
    inputName: "",
    inputTel: "",
    inputDepart: "",
    depart: [],
    bindSource: [],
    hideScroll: true,
    arrayHeight: 0,
    casArray: ["生命与环境科学学院","马克思主义学院","沈钧儒法学院","外国语学院" , "教育学院", "材料与化工学院" , "阿里巴巴商学院" , "国际教育学院" , "信息科学与工程学院" , "经亨颐教师教育学院" , "体育与健康学院" , "美术学院"],
    casIndex: 0,
    displayCas: '',
    recordID: "",
    lang: 1,
    tDepart: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('myInfo'),
      openid: wx.getStorageSync("leoOID")
    })

    //获取部门信息，用于填充下拉框，，，，改：将数组改为本地，减少读取数据库次数
    // 获取部门信息
    var dbDepart = wx.cloud.database()
    dbDepart.collection("dGroups").get().then(res => {
      // console.log("departName: " + res.data[0].departName)
      this.setData({
        casArray: res.data[0].departName,
        depart: res.data[0].departName,
        inputDepart: res.data[0].departName[0]
      })
    })
    // this.setData({
    //   depart: this.data.casArray,
    //   inputDepart: this.data.casArray[0]
    // })

    var myDb = wx.cloud.database()
    //console.log("leoOID:" + wx.getStorageSync("leoOID"))
    myDb.collection("uUsers").where({
      _openid: wx.getStorageSync("leoOID")
    }).count({
      success: res => {
        this.setData({
          recordCount: res.total
        })
      }
    })
    var tempInfo = wx.getStorageSync("myInfo")
    if (tempInfo.uNumber) {
      this.setData({
        inputNumber: tempInfo.uNumber,
        inputName: tempInfo.uName,
        inputTel: tempInfo.uTel,
        inputDepart: tempInfo.uDepart,
        lang: tempInfo.lang
      })
    }
    // 自动获取参加人的信息
    // const db1 = wx.cloud.database()
    // db1.collection("uUsers").limit(1).where({
    //   _openid: this.data.openid
    // }).get().then(res => {
    //   if (res.data.length > 0) {
    //     this.setData({
    //       recordID: res.data[0]._id,
    //       casIndex: this.data.depart.indexOf(res.data[0].uDepart),
    //       inputDepart: this.data.depart[this.data.depart.indexOf(res.data[0].uDepart)]
    //     })
    //   }
    // }).catch(err => {
    //   console.log(err)
    // })
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
    this.setData({
      userInfo: wx.getStorageSync("myInfo")
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

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

  },
  iDep: function (e) {
    this.setData({
      inputDepart: e.detail.value
    })
  },
  iNumber: function (e) {
    this.setData({
      inputNumber: e.detail.value
    })
  },
  iName: function (e) {
    this.setData({
      inputName: e.detail.value
    })
  },
  iTel: function (e) {
    this.setData({
      inputTel: e.detail.value
    })
  },
  bindGetUserInfo(e) {
    this.setData({
      avatarUrl: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName
    })
    UserInfoButton.hide()
  },
  changeSex: function (e) {
    this.setData({
      lang: e.detail.value
    })
  },
  mySignUp: function () {
    if (this.data.inputName.length < 2) {
      wx.showToast({
        title: '姓名不符合要求！',
        icon: 'none'
      })
    } else if (this.data.inputNumber.length < 8) {
      wx.showToast({
        title: '学号格式不符合要求！',
        icon: 'none'
      })
    } else if (this.data.inputTel.length < 4) {
      wx.showToast({
        title: '电话格式不符合要求！',
        icon: 'none'
      })
    } else if (this.data.depart.indexOf(this.data.inputDepart) < 0) {
      wx.showToast({
        title: '不规范部门名',
        icon: 'none'
      })
    } else if (this.data.recordCount == 0) {
      //wx.setStorageSync('signup', true)
      var myCheck = wx.cloud.database()
      //console.log(this.data.inputName)
      //console.log(this.data.inputDepart)
      //console.log(this.data.inputNumber)
      myCheck.collection("userGroup").limit(1).where({
        uName: this.data.inputName,
        uNumber: "hznu"+this.data.inputNumber,
        uPart: this.data.inputDepart
      }).get().then(res => {
        if (res.data.length > 0) {
          var tempInfo = {}
          tempInfo = {
            "avatarUrl": this.data.userInfo.avatarUrl,
            "uDepart": this.data.inputDepart,
            "uName": this.data.inputName,
            "uNumber": this.data.inputNumber,
            "lang": this.data.lang,
            "uTel": this.data.inputTel,
            "uchecked": true
          }
          wx.setStorageSync("myInfo", tempInfo)
          var myDb = wx.cloud.database()
          myDb.collection("uUsers").add({
            data: {
              uDepart: this.data.inputDepart,
              uTel: this.data.inputTel,
              uName: this.data.inputName,
              uNumber: this.data.inputNumber,
              avatarUrl: this.data.userInfo.avatarUrl, //无数据
              lang: this.data.lang,
              uchecked: true
            },
            success: res => {
              this.setData({
                recordCount: this.data.recordCount + 1
              })
              wx.showToast({
                title: '报名成功！',
                icon: 'none',
              })
              wx.navigateTo({
                url: '../daily/daily',
              })
            }
          })
        } else {
          wx.showToast({
            title: '记录填写有误或信息库没有您的记录，请及时联系小程序管理员',
            icon: 'none',
            duration: 2000
          })
        }
      })


    } else {
      wx.setStorageSync('signup', true)
      var myCheck = wx.cloud.database()
      myCheck.collection("userGroup").limit(1).where({
        uName: this.data.inputName,
        uNumber: "hznu"+this.data.inputNumber,
        uPart: this.data.inputDepart
      }).get().then(res => {
        if (res.data.length > 0) {
          var tempInfo = {}
          wx.setStorageSync('signup', true)
          if (wx.getStorageSync("myInfo").stepLists == []) {
            tempInfo = {
              "avatarUrl": this.data.userInfo.avatarUrl,
              "uDepart": this.data.inputDepart,
              "uName": this.data.inputName,
              "lang": this.data.lang,
              "uNumber": this.data.inputNumber,
              "uTel": this.data.inputTel,
              "uchecked": this.data.userInfo.uchecked
            }
          } else {
            tempInfo = {
              "avatarUrl": this.data.userInfo.avatarUrl,
              "uDepart": this.data.inputDepart,
              "uName": this.data.inputName,
              "uNumber": this.data.inputNumber,
              "lang": this.data.lang,
              "uTel": this.data.inputTel,
              "uchecked": this.data.userInfo.uchecked
            }
          }
          wx.setStorageSync('myInfo', tempInfo)
          const db = wx.cloud.database()
          const _ = db.command
          db.collection("uUsers").doc(this.data.recordID).update({
            data: {
              uDepart: this.data.inputDepart,
              uTel: this.data.inputTel,
              lang: this.data.lang,
              uName: this.data.inputName,
              uNumber: this.data.inputNumber,
            },
            success: res => {
              wx.showToast({
                title: '修改成功！',
                icon: 'none',
              })
              wx.navigateTo({
                url: '../daily/daily',
              })
            }
          })
        }else{
          wx.showToast({
            title: '记录填写有误或信息库没有您的记录，请联系小程序管理员',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  bindCasPickerChange: function (e) {
    this.setData({
      casIndex: e.detail.value,
      inputDepart: this.data.casArray[e.detail.value]
    })
  },
  showText: function (i) {
    wx.showToast({
      title: i,
      icon: 'none'
    })
  }
})