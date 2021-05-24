//import bacbac template
//full template
//action template
var main_template = require('../template_structure/bacbactemplate');
bacbactemplate = main_template['bacbactemplate'];
var action_template = main_template['action'];

//empty template
var empty_bacbactemplate = require('../template_structure/empty_bacbactemplate');
empty_template = empty_bacbactemplate['empty_bacbactemplate'];


//del template
//push user input to del template
var deltemplate = require('../template_structure/del_template');
del_template = deltemplate['deltemplate'];
push_template = deltemplate['pushtemplate'];
newcarousel = deltemplate['newcarousel'];

require('dotenv').config({ path: '../.env'});


function inserttemplate(things, image, event){
	
	
        things.then(data => {
		
		//data's structure  [{"thingstodo":"123"},{"thingstodo":"456"}]
		var things_array = JSON.parse(data)
		
		
		//input thing to template
        	var main_template = JSON.stringify(bacbactemplate);
        	main_template = JSON.parse(main_template);
		
		//insert image
		image.then(data => {
			var image_name = JSON.parse(data);
			
			image_name = image_name[0].image_name

        		main_template.contents.hero.url = `${process.env.NGROK_URL}${image_name}.jpg`;
		
		
			//extract things
			for(var i = 0; i < things_array.length; i++){
				var tmp_template = JSON.stringify(action_template);
                		tmp_template = JSON.parse(tmp_template);

                		tmp_template.contents[1].text = things_array[i].thingstodo;

                		main_template.contents.body.contents[1].contents.push(tmp_template);
			}

			event.reply(main_template);
		})

	})

}

function insertdeltemplate(things_promise, image_promise, event){
				
	things_promise.then(data => {
		
		var count = 0;
		var things_array = JSON.parse(data)
		
		var main_template = JSON.stringify(del_template);
        	main_template = JSON.parse(main_template);

		image_promise.then(data => {
			var image_name = JSON.parse(data);
                        image_name = image_name[0].image_name;

        		main_template.contents.contents[0].hero.url = `${process.env.NGROK_URL}${image_name}.jpg`;
			things_array.forEach(function(value, i){

                		count += 1;
                		var inner_template = JSON.stringify(push_template);
                		inner_template = JSON.parse(inner_template);

                		inner_template.action.data = `action=del&itemid=${value.thingstodo}`;
                		inner_template.action.label = value.thingstodo;
				

				
                		var blockcount = parseInt(count / 3);


                		if(count % 3 == 1 && count > 3){

                        		var outter_template = JSON.stringify(newcarousel);
                        		outter_template = JSON.parse(outter_template);
				
                        		outter_template.hero.url = `${process.env.NGROK_URL}${image_name}.jpg`;

                        		main_template.contents.contents.push(outter_template);


                		}

                		if(count % 3 == 0){
                        		blockcount -= 1;
                		}

                		main_template.contents.contents[blockcount].body.contents.push(inner_template);


        		})
			event.reply(main_template);
		})
	})

}


exports.inserttemplate = inserttemplate;
exports.insertdeltemplate = insertdeltemplate;
