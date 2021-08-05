

let params = {}
// const baseUrl = 'http://10.220.185.177:8080'
const baseUrl = window.location.origin
//页面ready方法 在加载完成html的时候执行
$(document).ready(function () {
  params = getQueryVariable()
  $.ajax({
    //请求方式
    type: "get",
    timeout: 3000,
    //请求的媒体类型
    contentType: "application/json;charset=UTF-8",
    //请求地址
    url: `${baseUrl}/meeting/qr/room?roomCode=${params.roomCode}`,
    //请求成功
    success: function (res) {
      // console.log(res)
      if (res.code == 200) {
        let data = res.data
        $('.room').text(data.name)
        $('.people').text(data.capacity)

        if (getCookie(params.roomCode)) {
          showYetSign()
          return
        }

        if (data.tips) {
          showRemind(data.tips)
        }

      } else {
        showRemind(res.msg)
      }
    },
    error: function (err) {
      console.log(err)
    }
  });
})


const INPUT = $("#code-input")
INPUT.on('input', function (e) {
  let checkCode = INPUT.val()
  for (i = 0; i < 4; i++) {
    $(`#num${i}`).text(checkCode.substr(i, 1) || '')
  }
  isHideCodeErr()
  if (checkCode.length == 4) {
    INPUT.blur()
    submitCode(checkCode)
  }
});



//输入完成四位验证码提交
function submitCode(checkCode) {
  if (getCookie(params.roomCode)) {
    showYetSign()
    return
  }
  $.ajax({
    //请求方式
    type: "post",
    //请求的媒体类型
    contentType: "application/json;charset=UTF-8",
    //请求地址
    url: `${baseUrl}/meeting/qr/check`,
    //数据，json字符串
    dataType: "json",
    data: JSON.stringify({
      roomCode: params.roomCode,
      checkCode: checkCode
    }),
    //请求成功
    success: function (res) {
      if (res.code == 200) {
        $('#success').show()
        setCookie(params.roomCode, true, 1000 * 60 * 15)
      } else if (res.code == 400) {
        $('#error').show()
      } else {
        showRemind(res.msg)
      }
    },
    //请求失败，包含具体的错误信息
    error: function (err) {
    }
  });
}

function showRemind(text) {
  $('.qrcode_input_box').hide()
  $('#remind').show()
  $('#tips').text(text)
}

function showYetSign() {
  $('.qrcode_input_box').hide()
  $('#yet').show()
  $('#success').hide()
}

function isHideCodeErr() {
  if ($('#error').css('display') !== 'none') {
    $('#error').hide()
  }
}

// 设置 cookie
const setCookie = (name, value, time) => {
  let currentTime = new Date().getTime();
  let expireTime = new Date(currentTime + time);
  document.cookie = name + "=" + value + ";expires=" + expireTime.toGMTString();
}
// 获取 cookie
const getCookie = name => {
  let strCookie = document.cookie;
  let arrCookie = strCookie.split(';');
  // 遍历匹配
  for (let i = 0; i < arrCookie.length; i++) {
    let temp = arrCookie[i].split('=');
    if (temp[0].trim() == name) {
      return temp[1];
    }
  }
  return '';
}
//获取参数方法
function getQueryVariable() {
  let href = window.location.href
  let query = href.substring(href.indexOf('?') + 1);
  let vars = query.split("&");
  let obj = {}
  for (var i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    obj[pair[0]] = pair[1]
  }
  return obj;
}

// function showModelTip() {
//   $('.model_wrapper').fadeIn(100)
//   $('.model_success').css({ 'transform': 'scale(1)' });
// }

// function hideModelTip() {
//   $('.model_wrapper').fadeOut()
//   $('.model_success').css({ 'display': 'none' })
//   setTimeout(() => {
//     $('.model_success').css({ 'transform': 'scale(0)', 'display': 'block' });
//   }, 200)
// }
// $('#hide').click(function () {
//   console.log(getCookie('username'))
// })