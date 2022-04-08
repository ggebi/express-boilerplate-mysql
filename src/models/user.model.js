import bcrypt from 'bcryptjs';
import { DataTypes, literal } from 'sequelize';

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      userid: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        set(value) {
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue('password', hash);
        },
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(13),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      createTime: {
        type: DataTypes.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updateTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'User',
      freezeTableName: true,
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
      ],
    },
  );

  /**
   * 패스워드 체크
   * @param {*} plaintextPassword
   * @param {*} hashedPassword
   * @returns boolean
   */
  User.comparePassword = async function (plaintextPassword, hashedPassword) {
    return bcrypt.compare(plaintextPassword, hashedPassword);
  };

  /**
   * 유저아이디 중복 체크
   * @param {string} userid
   * @returns
   */
  User.checkUserid = async function (userid) {
    const cnt = await this.count({ where: { userid } });
    if (cnt > 0) {
      return true;
    } else {
      return false;
    }
  };

  return User;
};
