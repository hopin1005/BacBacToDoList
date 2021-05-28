const Sequelize = require('sequelize');
const sequelize = require('./orm_config');

require('dotenv').config({ path: '../.env'});

var user_info = sequelize.define('user_info', {

        id:{

                type: Sequelize.INTEGER,
                primaryKey: true

        },
	userid: Sequelize.STRING(100),
        image_name: Sequelize.STRING(100)

},{
        timestamps: false
});

var user_data = sequelize.define('user_datas', {

	id:{
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	userid: Sequelize.INTEGER,
	thingstodo: Sequelize.STRING(100)

},{
	timestamps: false
})


//create user info (uid, default_image_url)
async function del(uid){

	var userid =await user_info.findAll({
		raw: true,
                attributes: ['id'],
                where:{
                        userid: uid
                }
	})
	
	userid = userid[0].id
	user_data.destroy({
                where:{
                        userid: userid
                }
        });

        user_info.destroy({

		where:{
			userid: uid
		}

        });

}

module.exports = del;
