module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('application_comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      publisherId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'users',
            schema: 'public',
          },
          key: 'id',
        },
        allowNull: false,
      },
      applicationId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'applications',
            schema: 'public',
          },
          key: 'id',
        },
        allowNull: false,
      },
      message: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }).then(() => queryInterface.addIndex('application_comments', {
      name: 'application_comments_publisherId_index',
      fields: ['publisherId'],
    })).then(() => queryInterface.addIndex('application_comments', {
      name: 'application_comments_applicationId_index',
      fields: ['applicationId'],
    }));
  },
  async down(queryInterface) {
    await queryInterface.removeIndex(
        'application_comments',
        'application_comments_publisherId_index',
    ).then(() => queryInterface.removeIndex(
        'application_comments',
        'application_comments_applicationId_index',
    )).then(() =>  queryInterface.dropTable('application_comments'));
  },
};
