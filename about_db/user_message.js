const Sequelize = require('sequelize');
const sequelize = require('./orm_config');


require('dotenv').config({ path: '../.env'});


var user_data = sequelize.define('user_datas', {

	userid:{
                type: Sequelize.STRING(100),
                primaryKey: true
        },
        thingstodo: Sequelize.STRING(100)

},{
        timestamps: false
})

var user_info = sequelize.define('user_infos', {

	userid:{
		type: Sequelize.STRING(100),
		primaryKey: true
	},
	image_name: Sequelize.STRING(100),
	count: Sequelize.STRING(50)

},{
	timestamps: false
})


function image(uid, image_name){

	user_info.update({
		userid: uid,
		image_name: image_name
	},{
		where:{
			userid: uid
		}
	});
}


function message(uid, thing){

	user_data.create({
		userid: uid,
		thingstodo: thing,
	});
}


async function getimage(uid){
	var image_promise = await user_info.findAll({
		raw: true,
		attributes: ['image_name'],
		where:{
			userid: uid
		}

	})

	return JSON.stringify(image_promise);

}

async function getthings(uid){

	
	var data_promise = await user_data.findAll({
		raw: true,
		attributes: ['thingstodo'],
		where:{
			userid: uid
		}
	})

	return JSON.stringify(data_promise);
	
	
	/*user_data.findALL({

		....

	})
	.then(data => {
		//why undefined?
		return data;
	})*/
	

}

exports.message = message;
exports.getthings = getthings;
exports.image = image;
exports.getimage = getimage;
