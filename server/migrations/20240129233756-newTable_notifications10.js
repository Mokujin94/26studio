"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notifications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      recipientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      // Add other columns for your Notifications table here

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Create associations for the Like-Notification relationship
    await queryInterface.addColumn("notifications", "likeId", {
      type: Sequelize.INTEGER,
      references: {
        model: "likes",
        key: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    // Create associations for the Comment-Notification relationship
    await queryInterface.addColumn("notifications", "commentId", {
      type: Sequelize.INTEGER,
      references: {
        model: "comments",
        key: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("notifications", {
      fields: ["likeId"],
      type: "foreign key",
      name: "fk_like",
      references: {
        table: "likes",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("notifications", {
      fields: ["commentId"],
      type: "foreign key",
      name: "fk_comment",
      references: {
        table: "comments",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notifications");
  },
};
