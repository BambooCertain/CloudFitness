function myNavigate(myUrl){
  wx.navigateTo({
    url: "../"+myUrl+"/"+myUrl,
  })
}
module.exports = {
  myNavigate: myNavigate
}