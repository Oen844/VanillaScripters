const path = window.location.pathname.split('/');
const roomId = path[2];
const currentUser = JSON.parse(localStorage.getItem('user'));

fetch('/rooms/'+roomId)
    .then(res => res.json())
    .then(data => {
        let room = data.name;
        let roomCover = data.artwork.cover;
        let players = data.currentPlayers;

        // Check user has joined
        const userJoined = players.filter(user => user.id === currentUser.id).length === 1;
        if(!userJoined) window.location.href = '/';

        document.querySelector('head title').innerHTML = room;
        document.querySelector('#room-name').innerHTML = room;
        if(players.length === 1) document.querySelector('#player_1_name').innerHTML = players[0].username;
        if(players.length === 2) {
            document.querySelector('#player_2_name').innerHTML = players[1].username;
            document.querySelector('#player_1_name').innerHTML = players[0].username;
        }
        document.body.style.backgroundImage = `url('/img/${roomCover}')`;
        });
        

        function logout() {
            localStorage.clear();
            window.location.replace('/logout');
        }
        