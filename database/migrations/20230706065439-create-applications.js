module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applications', {
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
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      message: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }).then(() => queryInterface.addIndex('applications', {
      name: 'applications_publisherId_index',
      fields: ['publisherId'],
    })).then(() => queryInterface.addIndex('applications', {
      name: 'applications_status_index',
      fields: ['status'],
    }));
  },
  async down(queryInterface) {
    await queryInterface.removeIndex(
        'applications',
        'applications_publisherId_index',
    ).then(() => queryInterface.removeIndex(
        'applications',
        'applications_status_index',
    )).then(() => queryInterface.dropTable('applications'));
  },
};
