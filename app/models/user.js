export default function(sequelize, DataTypes) {
  // sequelize.define('name', {attributes}, {options})
  // 字段定义（主键、created_at、updated_at默认包含，不用特殊定义）
  // 是否需要增加createdAt、updatedAt、deletedAt字段  'timestamps': true,
  const User = sequelize.define('User', {
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
  },{
    underscored: true, //字段以下划线（_）来分割（默认是驼峰命名风格）
    tableName: 'users',
    timestamps: false, //是否需要增加createdAt、updatedAt、deletedAt字段
    indexes: [{ unique: true, fields: ['email'] }]
  });

  /*
  User.beforeCreate(function(user, options, callback) {
    // user.email = user.email.toLowerCase();
    // if (user.password){
    //   hasSecurePassword(user, options, callback);
    // }
    // else{
    //   return callback(null, options);
    // }
  });
  User.beforeUpdate(function(user, options, callback) {
    // user.email = user.email.toLowerCase();
    // if (user.password){
    //
    // }
    // else{
    //   return callback(null, options);
    // }
  });
  */
  return User;
}
