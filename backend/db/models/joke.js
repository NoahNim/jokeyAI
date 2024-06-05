'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Joke extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Joke.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Joke.init({
    joke: DataTypes.TEXT,
    userid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Joke',
  });
  return Joke;
};