var deltemplate = {
  "type" : "flex",
  "altText" : "empty_bac",
  "contents":{
  "type": "carousel",
  "contents": [
	  //new block insert 
    {
      "type": "bubble",
      "size": "micro",
      "hero": {
        "type": "image",
        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ93rKZdHAerhqktsVJc2BMAwE0Y8NF2zx1OSKmrsriB1yJbNob8vW9oNoPUCVcqyJTOj0&usqp=CAU",
        "size": "full",
        "aspectMode": "cover",
        "aspectRatio": "320:213"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "weight": "bold",
            "size": "sm",
            "wrap": true,
            "text": "你要刪除什麼?"
          }//single block insert
        ],
        "spacing": "sm",
        "paddingAll": "13px"
      }
    }
  ]
}
}


var pushtemplate = {
  "type": "button",
  "action": {
  	"type": "postback",
  	"label": "del",
  	"data": "action=del&itemid="
  	//"displayText": ""
  },
  "style": "primary",
  "color": "#905c44"
}

var newcarousel = {
      "type": "bubble",
      "size": "micro",
      "hero": {
        "type": "image",
        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ93rKZdHAerhqktsVJc2BMAwE0Y8NF2zx1OSKmrsriB1yJbNob8vW9oNoPUCVcqyJTOj0&usqp=CAU",
        "size": "full",
        "aspectMode": "cover",
        "aspectRatio": "320:213"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "weight": "bold",
            "size": "sm",
            "wrap": true,
            "text": "你要刪除什麼?"
          }
        ],
        "spacing": "sm",
        "paddingAll": "13px"
      }
    }

exports.deltemplate = deltemplate;
exports.pushtemplate = pushtemplate;
exports.newcarousel = newcarousel;
