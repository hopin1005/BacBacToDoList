const Sequelize = require('sequelize');
const sequelize = require('./orm_config');

require('dotenv').config({ path: '../.env'});

var user_info = sequelize.define('user_info', {

        userid:{

                type: Sequelize.STRING(100),
                primaryKey: true

        },

        image_name: Sequelize.STRING(100)

},{
        timestamps: false
});

var user_data = sequelize.define('user_datas', {

	userid:{
		type: Sequelize.STRING(100),
		primaryKey: true
	},
	thingstodo: Sequelize.STRING(100)

},{
	timestamps: false
})

user_data.belongsTo(user_info, {foreignKey: 'userid', foreignKeyContraints:false, constraints: false});
user_info.hasMany(user_data, {foreignKey: 'userid', foreignKeyContraints:false, constraints: false})

//create user info (uid, default_image_url)
function del(uid){


	user_data.destroy({
                where:{
                        userid: uid
                }
        });

        user_info.destroy({

		where:{
			userid: uid
		}

        });

}

module.exports = del;
