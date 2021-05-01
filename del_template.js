var deltemplate = {
  "type": "template",
  "altText": "Delete item",
  "template": {
      "type": "carousel",
      "columns": [
          {
            "title": "點擊你想刪除的!",
            "text": "勇敢點下去!",
            "actions": [
            ]
          }
      ],
  }
}

var pushtemplate = {
  "type": "postback",
  "label": "del",
  "data": "action=del&itemid="
}

exports.deltemplate = deltemplate;
exports.pushtemplate = pushtemplate;
