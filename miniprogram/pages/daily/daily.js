// pages/daily/daily.js
var jutils = require('../../js/jUnit.js')
var app = getApp();
var lineChart = null;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    totalPersons: 0, //总报名人数
    todayPersons: 0, //今日打卡人数
    days: 0, //本月打卡天数
    stepCircle: 100,
    runDate: 0,
    runStep: 0,
    cellHeight: 667,
    cellWidth: 375,
    ratioH: 1,
    ratioW: 1,
    userInfo: {},
    minStep: 6000,
    distance: 0,
    Energy: 0,
    cola: 0,
    drumstick: 0,
    isprizes: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 是否参与抽奖
    var myDate = jutils.formatTime(new Date(this.data.runDate * 1000))
    var prizeCheck = wx.cloud.database()
    prizeCheck.collection('prizeLists').where({
      _openid: wx.getStorageSync('leoOID')
    }).get().then(res => {
      if(res.data.length > 0)
      {
        this.setData({
          isprizes: true
        })
      }
    })



    // 获取总参与人数
    var totalDB = wx.cloud.database()
    totalDB.collection('uUsers').count({
      success: res => {
        this.setData({
          totalPersons: res.total
        })
      }
    })
    this.setData({
      ratioH: wx.getSystemInfoSync().windowHeight / 10,
      userInfo: wx.getStorageSync('myInfo')
    })
    wx.getWeRunData({
      success: res => {
        wx.cloud.callFunction({
          name: "run",
          data: {
            info: wx.cloud.CloudID(res.cloudID),
          },
          
        }).then(res => {
          this.setData({
            runDate: res.result.info.data.stepInfoList[30].timestamp,
            runStep: res.result.info.data.stepInfoList[30].step
          })
          this.setData({
            // 步数换算距离
            distance: Math.round(this.data.runStep / 14) / 100,
            // 热量
            Energy: Math.round(this.data.runStep * 2.6) / 100,
            // 鸡腿
            drumstick: Math.floor(this.data.runStep * 26 / 1800) / 100,
            // 可乐
            cola: Math.round(this.data.runStep * 0.058)
          })
          // 统计今日打卡人数
          var todayBD = wx.cloud.database()
          todayBD.collection('record').where({
            stepLists: {
              date: this.data.runDate,
            }
          }).count({
            success: res => {
              console.log(res)
              this.setData({
                todayPersons: res.total
              })
            }
          })
          var myDate = jutils.formatTime(new Date(this.data.runDate * 1000))
          console.log("myDate: " + myDate.toString())
          var myDb = wx.cloud.database()
          // 统计本月已经打卡天数
          myDb.collection('record').where({
            month: myDate.substring(0, 7),
            _openid: wx.getStorageSync('leoOID')
          }).get().then(res => {
            console.log(res)
            if (res.data.length > 0) {

              this.setData({
                days: res.data[0].stepLists.length
              })
            } else {
              this.setData({
                days: 0
              })
            }
          })


          if (this.data.runStep >= this.data.minStep) {
            this.setData({
              iCan: true
            })
          }
        })
      }
    })
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          stepCircle: 100 * result.windowHeight / 667
        })
      },
    });
  },
  onShow: function () {
    wx.getWeRunData({
      success: res => {
        wx.cloud.callFunction({
          name: "run",
          data: {
            info: wx.cloud.CloudID(res.cloudID),
          },
        }).then(res => {
          this.setData({
            runDate: res.result.info.data.stepInfoList[30].timestamp,
            runStep: res.result.info.data.stepInfoList[30].step
          })
          this.setData({
            distance: Math.round(this.data.runStep / 14) / 100,
            Energy: Math.round(this.data.runStep * 2.6) / 100,
            drumstick: Math.floor(this.data.runStep * 26 / 1800) / 100,
            cola: Math.round(this.data.runStep * 0.058)
          })
          console.log(this.data.runDate)
          var todayBD = wx.cloud.database()
          todayBD.collection('record').where({
            stepLists: {
              date: this.data.runDate,
            }
          }).count({
            success: res => {
              this.setData({
                todayPersons: res.total
              })
            }
          })
          // 获取本月打卡天数
          var myDate = jutils.formatTime(new Date(this.data.runDate * 1000))
          var myDb = wx.cloud.database()
          console.log("leoOID: " + wx.getStorageSync('leoOID'))
          myDb.collection('record').where({
            month: myDate.substring(0, 7),
            _openid: wx.getStorageSync('leoOID')
          }).get().then(res => {

            if (res.data.length > 0) {
              this.setData({
                days: res.data[0].stepLists.length
              })
            } else {
              this.setData({
                days: 0
              })
            }
          })


          if (this.data.runStep >= this.data.minStep) {
            this.setData({
              iCan: true
            })
            console.log("lastRecordDay: " + wx.getStorageSync('lastRecordDay'))
            if (wx.getStorageSync('lastRecordDay') != this.data.runDate) {
              let that = this
              wx.showModal({
                title: '今日打卡提醒',
                content: '你已满足打卡打条件，现在就打卡吗',
                cancelText: '暂不打卡',
                confirmText: '打卡',
                success(res) {
                  if (res.cancel) {
                    // 用户点击了取消属性的按钮，对应选择了'女'
                  } else if (res.confirm) {
                    // 用户点击了确定属性的按钮，对应选择了'男'
                    that.recordNow()
                  }
                }
              })
            }
          }

        })
      }
    })
  },
  viewHistory: function () {
    wx.navigateTo({
      url: '../monthHistory/monthHistory',
    })
  },
  viewGame: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  viewPersonal: function () {
    wx.navigateTo({
      url: '../signUp/signUp',
    })
  },
  showSorry: function () {
    wx.showToast({
      title: '步数不够，起来走走~',
      icon: 'none'
    })
  },
  myPrize: function () {
    wx.navigateTo({
      url: '../prizeList/prizeList',
    })
  },
  recordNow: function () {
    if (this.data.runStep >= this.data.minStep) {
      console.log("LOG: " + wx.getStorageSync('leoOID'))
      var myDate = jutils.formatTime(new Date(this.data.runDate * 1000))
      var myDb = wx.cloud.database()
      myDb.collection('record').where({
        month: myDate.substring(0, 7),
        _openid: wx.getStorageSync('leoOID')
      }).get().then(res => {
        var todayDB = wx.cloud.database()
        console.log("LOG: " + res.data.toString())
        if (res.data.length > 0) {
          console.log("res.data.length: " + res.data.length)
          //本月有打卡记录
          var monthArr = res.data[0].stepLists
          var monthLenght = monthArr.length
          var toastTitle = "今日打卡成功！"
          console.log("monthLeght: " + monthArr.length)
          wx.setStorageSync('lastRecordDay', this.data.runDate) //记录打卡日期

          if (res.data[0].stepLists[res.data[0].stepLists.length - 1].date == this.data.runDate) {
            //今日已打卡，更新本月打卡记录后上传
            monthArr[monthLenght - 1].step = this.data.runStep
            toastTitle = "今日步数记录已更新"

          } else {
            console.log("今日未打卡")
            //今日未打卡，插入今日记录后，更新本月打卡记录

            var todayR = {
              "date": this.data.runDate,
              "step": this.data.runStep
            }
            monthArr[monthLenght] = todayR
            this.setData({
              todayPersons: this.data.todayPersons + 1,
              days: this.data.days + 1
            })
          }
          todayDB.collection('record').doc(res.data[0]._id).update({
            data: {
              stepLists: monthArr 
            }
          }).then(res => {
            wx.showToast({
              title: toastTitle,
              icon: 'none',
              duration: 2000
            })
          })
        } else {
          // insert
          var myRecord = {
            "date": this.data.runDate,
            "step": this.data.runStep
          }
          var tempArr = []
          tempArr[0] = myRecord
          var insertDb = wx.cloud.database()
          todayDB.collection('record').add({
            data: {
              month: myDate.substring(0, 7),
              stepLists: tempArr
            }
          }).then(res => {
            this.setData({
              days: 1,
              todayPersons: this.data.todayPersons + 1
            })
            wx.showToast({
              title: '你已开启新的一个月，加油！',
              icon: 'none',
              duration: 2000
            })
          })
        }
      })
    }
  },
  viewPrize: function () {

    let now = new Date();
    let year = now.getFullYear()
    let month = now.getMonth()
    let prizeDate = now.getDate()
    let prizeHour = now.getHours()
    if (month == 0) {
      month = 12
      year = year - 1
    }
    if (month < 10) {
      month = '0' + month
    }
    this.setData({
      nowMonth: year + "-" + month,
      //userInfo: wx.getStorageSync("myInfo") //用户信息收集
    })
    if(this.data.isprizes)
    {
      wx.showToast({
        title: '每人仅有一次抽奖机会',
        duration: 2000,
        icon: 'none'
      })
    }
    else{
      var db = wx.cloud.database()
      var prizeid = {}
      // 奖品名称
      var prizeName = {}
      // 奖品等级
      var prizeGrade = {}
      // 奖品个数
      var prizeRemain = {}
      // 奖品总数
      var prizeSum = 0
      var pos = -1
      let prize = wx.cloud.database()
      db.collection("prizes").get().then(res => {
        for(var i = 0 ; i < res.data.length ; ++ i)
        {
          prizeid[i] = res.data[i]._id
          prizeName[i] = res.data[i].prize
          prizeGrade[i] = res.data[i].prizeGrade
          prizeRemain[i] = res.data[i].prizeRemain
          prizeSum = prizeSum + prizeRemain[i]
        }
        //console.log("打卡条件：prizeDate == 1 && prizeHour < 20 && prizeHour >= 8 && this.data.days >= 20")
        var num = Math.ceil(Math.random() * prizeSum)
        // 获奖等级
        if(num <= prizeRemain[0])
        {
            pos = 0
        }
        else if(num - prizeRemain[0] <= prizeRemain[1])
        {
            pos = 1
        }
        else if(num - prizeRemain[0] - prizeRemain[1] <= prizeRemain[2])
        {
            pos = 2
        }
        else if(num - prizeRemain[0] - prizeRemain[1] - prizeRemain[2] <= prizeRemain[3])
        {
            pos = 3
        }
        else if(num - prizeRemain[0] - prizeRemain[1] - prizeRemain[2] - prizeRemain[3] <= prizeRemain[4])
        {
            pos = 4
        }
        else
        {
            pos = 5
        }
        console.log(prizeRemain)
        console.log("num = " + num)
        console.log("prizeHour:" + prizeHour)
        console.log("this.data.days:" + this.data.days)
        if ((prizeDate == 11 || prizeDate == 21 || prizeDate == 12) && prizeHour >= 8 && prizeHour <= 23 && this.data.days >= 7) {
          wx.showToast({
            title: "恭喜您获得" + prizeGrade[pos] + prizeName[pos],
            duration: 2000,
            icon:'none'
          })
          this.setData({
            isprizes:true
          })
          var DB1 = wx.cloud.database()
          DB1.collection('prizes').doc(prizeid[pos]).update({
            data :{
              prizeRemain: (prizeRemain[pos] - 1)
            }
          })
          var myDate = jutils.formatTime(new Date(this.data.runDate * 1000))
          DB1.collection('prizeLists').add({
            data:{
              _openid: wx.getStorageSync('leoOID'),
              month: myDate.substring(0 , 7),
              prizeName: prizeName[pos],
              prizeGrade: prizeGrade[pos]
            }
          })
        } else {
          wx.showToast({
            title: '现在不是抽奖时间内或您打卡次数不足！',
            duration: 2000,
            icon: 'none'
          })
  
        }
      })
    }




  },
  sorryPrize:function(){
    wx.showToast({
      title: '每人仅有一次抽奖机会',
      duration: 2000,
      icon: 'none'
    })
  }
})