module.exports = (sequelize, DataTypes) => {
  const CaptionTag = sequelize.define(
    'CaptionTag',
    {
      captionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Caption',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tag',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    },
    {}
  );
  CaptionTag.associate = () => {
  };
  return CaptionTag;
};
