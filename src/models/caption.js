module.exports = (sequelize, DataTypes) => {
  const Caption = sequelize.define( 'Caption', {
    caption: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{});
  Caption.associate = (models) => {
    Caption.belongsToMany(models.Tag, {
      through: 'CaptionTags',
      as: 'tags',
      foreignKey: 'captionId'
    });
  };
  return Caption;
};
