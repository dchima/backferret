module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define( 'Tag', {
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{});
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Caption, {
      through: 'CaptionTags',
      as: 'captions',
      foreignKey: 'tagId'
    });
  };
  return Tag;
};
