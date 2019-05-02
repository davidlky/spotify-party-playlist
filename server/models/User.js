const Sequelize = require('sequelize');
const db = require('../controllers/DBController');

const User = db.define(
  'User',
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    s_refresh_token: {
      type: Sequelize.TEXT,
    },
    s_access_token: {
      type: Sequelize.TEXT,
    },
    name: {
      type: Sequelize.TEXT,
    },
    s_id: {
      type: Sequelize.TEXT,
    },
  },
  {
    indexes: [
      {
        fields: ['id'],
      },
    ],
  }
);

User.sync().then(async () => {
  // Table created
  console.log('Created User');
});

export default User;
