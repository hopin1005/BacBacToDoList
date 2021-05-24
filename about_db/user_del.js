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

async function deldata(uid, delthings){

	await user_data.destroy({
		where:{
			userid: uid,
			thingstodo: delthings
		}
	})

}

exports.deldata = deldata;
