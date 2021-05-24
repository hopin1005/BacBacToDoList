const Sequelize = require('sequelize');
const sequelize = require('./orm_config');

require('dotenv').config({ path: '../.env'});

var user_info = sequelize.define('user_info', {

	userid:{

		type: Sequelize.STRING(100),
		primaryKey: true

	},

	image_name: Sequelize.STRING(100),
	count: Sequelize.STRING(50)

},{
	timestamps: false
});

var user_data = sequelize.define('user_datas',{

	userid:{
		
		type: Sequelize.STRING(100),
		primaryKey: true

	},	

	thingstodo: Sequelize.STRING(100)
},{
	timestamps: false
});


//create user info (uid, default_image_url)
function create(uid){

	user_info.create({

		userid: uid,
		image_name: 'default',
		count: '0'

	});
}


module.exports = create;
