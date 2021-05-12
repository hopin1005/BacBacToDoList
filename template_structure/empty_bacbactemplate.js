var empty_bacbactemplate = {
  "type" : "flex",
  "altText" : "empty_bac",
  "contents": {
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
          "label": "教我怎麼新增!",
          "data": "teachadd",
          "displayText": "教我怎麼新增!"
        }
      }
    ]
  }
  }
}

exports.empty_bacbactemplate = empty_bacbactemplate;
