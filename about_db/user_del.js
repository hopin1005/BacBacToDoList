const Sequelize = require('sequelize');
const sequelize = require('./orm_config');


require('dotenv').config({ path: '../.env'});


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

async function deldata(uid, delthings){

	var primary_id = await user_info.findAll({

                raw: true,
                attributes: ['id'],
                where:{
                        userid: uid
                }
        })

        primary_id = primary_id[0].id

	await user_data.destroy({
		where:{
			userid: primary_id,
			thingstodo: delthings
		}
	})

}

exports.deldata = deldata;
