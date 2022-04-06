import { DataTypes, literal } from 'sequelize';

module.exports = (sequelize) => {
  const UserSocialPassport = sequelize.define(
    'UserSocialPassport',
    {
      no: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      channel: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      socialId: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      createTime: {
        type: 'TIMESTAMP',
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      updateTime: {
        type: 'TIMESTAMP',
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    },
  );

  return UserSocialPassport;
};
