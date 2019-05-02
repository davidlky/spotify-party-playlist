import User from './User';
var Sequelize = require('sequelize');
var db = require('../controllers/DBController');

const Playlist = db.define(
  'Playlist',
  {
    id: {
      type: Sequelize.TEXT,
      primaryKey: true,
    },
    owner_id: {
      type: Sequelize.UUID,
      allowNull: false,

      references: {
        model: User,
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_DEFERRED,
      },
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

Playlist.sync().then(async () => {
  // Table created
  console.log('Created Playlist');
});

User.hasMany(Playlist, {
  foreignKey: 'owner_id',
  sourceKey: 'id',
  as: 'playlists',
});

User.belongsToMany(Playlist, { as: 'inPlaylists', through: 'PlaylistUsers' });
Playlist.belongsToMany(User, { as: 'attendees', through: 'PlaylistUsers' });

db.sync();
export default Playlist;
