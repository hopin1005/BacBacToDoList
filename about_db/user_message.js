const Sequelize = require('sequelize');
const sequelize = require('./orm_config');


require('dotenv').config({ path: '../.env'});


var user_data = sequelize.define('user_datas', {

	id:{
                type: Sequelize.STRING(100),
                primaryKey: true
        },

	userid: Sequelize.INTEGER,
        thingstodo: Sequelize.STRING(100)

},{
        timestamps: false
})

var user_info = sequelize.define('user_infos', {

	id:{
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	userid: Sequelize.STRING(100),
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


async function message(uid, thing, count){
	var primary_id = await user_info.findAll({

		raw: true,
		attributes: ['id'],
		where:{
			userid: uid
		}
	})	
	
	primary_id = primary_id[0].id
	

	user_data.create({
		userid: primary_id,
		thingstodo: thing,
	});

	user_info.update({
		count: count
	},{
		where:{
			userid: uid
		}
	})
}


async function getimage(uid){
	var image_promise = await user_info.findAll({
		raw: true,
		attributes: ['image_name', 'count'],
		where:{
			userid: uid
		}

	})

	return JSON.stringify(image_promise);

}

async function getthings(uid){

	var primary_id = await user_info.findAll({

                raw: true,
                attributes: ['id'],
                where:{
                        userid: uid
                }
        })

        primary_id = primary_id[0].id	

	var data_promise = await user_data.findAll({
		raw: true,
		attributes: ['thingstodo'],
		where:{
			userid: primary_id
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
