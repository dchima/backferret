module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CaptionTags', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    captionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Captions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    tagId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Tags',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('CaptionTags'),
};

