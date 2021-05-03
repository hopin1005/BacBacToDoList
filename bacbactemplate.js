var bacbactemplate = {
  "type": "flex",
  "altText": "BACBACToDoList",
  "contents" : {
  "type": "bubble",
  "hero": {
    "type": "image",
    "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ93rKZdHAerhqktsVJc2BMAwE0Y8NF2zx1OSKmrsriB1yJbNob8vW9oNoPUCVcqyJTOj0&usqp=CAU",
    "size": "full",
    "aspectRatio": "20:13",
    "aspectMode": "cover",
    "action": {
      "type": "uri",
      "uri": "https://linecorp.com"
    }
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "spacing": "md",
    "action": {
      "type": "uri",
      "uri": "https://linecorp.com"
    },
    "contents": [
      {
        "type": "text",
        "text": "BAC BAC To Do List",
        "size": "xl",
        "weight": "bold"
      },
      {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          
        ]
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "button",
        "style": "primary",
        "color": "#905c44",
        "action": {
          "type": "postback",
          "label": "刪除",
          "data": "del",
        }
      },
      {
        "type": "button",
        "style": "primary",
        "color": "#905c44",
        "action": {
          "type": "postback",
          "label": "顯示",
          "data": "show",
        },
        "offsetTop": "5px"
      }
    ]
  }
}

}

var action  = {
    "type": "box",
    "layout": "baseline",
    "contents": [
      {
        "type": "icon",
        "url": "https://image.flaticon.com/icons/png/512/197/197335.png"
      },
      {
        "type": "text",
        "text": "吃飯",
        "weight": "bold",
        "margin": "sm",
        "flex": 0
      }
    ]
}

exports.action = action;
exports.bacbactemplate = bacbactemplate;
