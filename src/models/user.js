module.exports = {
    model : false,
    make : function(db){
        let sequelize = db.sequelize;
        let DataTypes = db.Sequelize;

        if(this.model){
            return this.model;
        }

        const model = sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true,
                    len: [1, 50]
                }
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true,
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.VIRTUAL,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            }
        }, {
            underscored: true, //字段以下划线（_）来分割（默认是驼峰命名风格）
            tableName: 'users',
            timestamps: false, //是否需要增加createdAt、updatedAt、deletedAt字段
            indexes: [{
                unique: true,
                fields: ['email']
            }]
        });

        this.model = model;
        return this.model;
    }
}
