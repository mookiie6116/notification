sessionStorage.setItem('i', location.href.split('?userId=')[1]);
var userId = sessionStorage.getItem('i');
var offset = 0
var limit = 6
var body = document.getElementById("body-notify");
var socket = io();

(function () {
  moment.locale('th');
  getNotify(userId, limit, offset)

  $(".loadmore-notify").click(function () {
    loadmore(userId)
  })

  function loadmore(userId) {
    offset += limit
    $.ajax({
      method: 'GET',
      url: `/api/v1/notify/view/${userId}/${limit}/${offset}`,
      statusCode: {
        200: function () {
        },
        500: function () {
        }
      }
    }).done(data => {
      if ((offset + limit + 1) >= data.total) {
        $(".loadmore-notify").addClass("d-none")
      }
      if (data.total) {
        data.data.map(function (item) {
          let div = document.createElement("div");
          let div_col8 = document.createElement("span");
          let div_col4 = document.createElement("span");
          let span_msg = document.createElement("span")
          let span_date = document.createElement("small")
          let br = document.createElement('br')
          div.setAttribute("class", `row m-0 notify notify-${item._id}`);
          div_col8.setAttribute("class", 'col-12 padding-right-0');
          div_col4.setAttribute("class", 'col-12 text-right padding-left-0');
          if (!item.read) {
            span_msg.setAttribute("class", 'font-weight-bolder');
            span_date.setAttribute("class", 'font-weight-bolder');
          }
          let msg = item.msg
          if (100 < msg.length) {
            msg = msg.substring(0, 49) + ". . ."
          }
          span_msg.append(msg)
          div_col8.appendChild(span_msg)
          let fromNow = moment(item.createdAt).fromNow()
          span_date.append(fromNow)
          span_date.appendChild(br)
          // span_date.append(moment(item.createdAt).format('DD/MM/YYYY'))
          div_col4.appendChild(span_date)
          div.appendChild(div_col8)
          div.appendChild(div_col4)
          div.setAttribute("onClick", "readNotify('" + item._id + "')");
          div.setAttribute("data-id", item.id);
          body.appendChild(div)
        })
      } else {
        let div = document.createElement("div");
        div.setAttribute("class", `row m-0 text-center font-weight-bolder`);
        div.append('ไม่พบข้อมูลการแจ้งเตือน')
        body.appendChild(div)
      }
    })
  }


})();

function getNotify(userId, limit, offset) {
  $.ajax({
    method: 'GET',
    url: `/api/v1/notify/view/${userId}/${limit}/${offset}`,
    statusCode: {
      200: function () {
      },
      500: function () {
      }
    }
  }).done(data => {
    $(".body-notify").html("")
    if ((offset + 1) * limit >= data.total) {
      $(".loadmore-notify").addClass("d-none")
    }
    if (data.total) {
      data.data.map(function (item) {
        let div = document.createElement("div");

        let div_col8 = document.createElement("span");
        let div_col4 = document.createElement("span");
        let span_msg = document.createElement("span")
        let span_date = document.createElement("small")
        let br = document.createElement('br')
        div.setAttribute("class", `row m-0 notify notify-${item._id}`);
        div_col8.setAttribute("class", 'col-12 padding-right-0');
        div_col4.setAttribute("class", 'col-12 text-right padding-left-0');
        if (!item.read) {
          span_msg.setAttribute("class", 'font-weight-bolder');
          span_date.setAttribute("class", 'font-weight-bolder');
        }
        let msg = item.msg
        if (100 < msg.length) {
          msg = msg.substring(0, 36) + "..."
        }
        span_msg.append(msg)
        div_col8.appendChild(span_msg)
        let fromNow = moment(item.createdAt).fromNow()
        span_date.append(fromNow)
        span_date.appendChild(br)
        // span_date.append(moment(item.createdAt).format('DD/MM/YYYY'))
        div_col4.appendChild(span_date)
        div.appendChild(div_col8)
        div.appendChild(div_col4)
        div.setAttribute("onClick", "readNotify('" + item._id + "')");
        div.setAttribute("data-id", item.id);
        body.appendChild(div)
      })
    } else {
      let div = document.createElement("div");
      let span = document.createElement("span")
      div.setAttribute("class", "row m-0");
      span.setAttribute("class", "col-12 text-center font-weight-bolder")
      div.appendChild(span).append('ไม่พบข้อมูลการแจ้งเตือน')
      body.appendChild(div)
    }
  })
}

function readNotify(notifyId) {
  $.ajax({
    method: 'GET',
    url: `/api/v1/notify/read/${userId}/${notifyId}`,
    statusCode: {
      200: function () {
        getNotify(userId, offset + limit, 0)
      },
      500: function () {
      }
    }
  })
}

