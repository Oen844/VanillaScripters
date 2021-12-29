const UsersCollection = [
  {
    id: 'db94b18ce7',
    username: 'admin',
    email: 'admin@uoc.edu',
    password: '1234',
    token: '',
    avatar: 'chico'
  },
  {
    id: 'db94b18ce8',
    username: 'paco',
    email: 'paco@uoc.edu',
    password: '1234',
    token: '',
    avatar: 'chino'

  }
];

const RoomsCollection = [
  {
    id: 1,
    name: 'shanghai',
    artwork: {thumbnail: 'shanghai_thumbnail.jpeg', cover: 'shanghai_cover.jpeg'},
    maxPlayers: 2,
    currentPlayers: [],
    updatedAt: 1635885264324
  },
  {
    id: 2,
    name: 'paris',
    artwork: {thumbnail: 'paris_thumbnail.jpeg', cover: 'paris_cover.jpeg'},
    maxPlayers: 2,
    currentPlayers: [],
    updatedAt: 1635885264324
  },
  {
    id: 3,
    name: 'las vegas',
    artwork: {thumbnail: 'lasvegas_thumbnail.jpeg', cover: 'lasvegas_cover.jpeg'},
    maxPlayers: 2,
    currentPlayers: [],
    updatedAt: 1635885264324
  },
  {
    id: 4,
    name: 'berlin',
    artwork: {thumbnail: 'berlin_thumbnail.jpeg', cover: 'berlin_cover.jpeg'},
    maxPlayers: 2,
    currentPlayers: [],
    updatedAt: 1635885264324
  }
];

module.exports = {UsersCollection, RoomsCollection};