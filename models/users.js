'use strict';
module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define(
    'users', {
      UserId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      FirstName: DataTypes.STRING,
      LastName: DataTypes.STRING,
      Email: {
        type: DataTypes.STRING,
        unique: true
      },
      Username: {
        type: DataTypes.STRING,
        unique: true
      },
      Password: DataTypes.STRING,
      Admin: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    }, {}
  );
  users.associate = function (models) {
    // associations can be defined here
  };
  users.prototype.comparePassword = function (password, cb) {
    const user = this;
    if (password === user.Password) {
      console.log("Match");
      return cb(null, true);
    } else {
      console.log("No match");
      return cb("No Match", false);
    }
    // bcrypt.compare(password, user.password, function (err, isMatch) {
    //   console.log(user.password);
    //   if (!isMatch) {

    //   } else {

    //   }
    // });
  };


  return users;
};