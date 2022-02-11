const socket = io();
socket.on("connection");
const paths = window.location.pathname.split('/');
const roomIds = paths[2];

const user = JSON.parse(localStorage.getItem('user'));

console.log('usuario conectado '+ user.username);

document.getElementById("usuario").innerHTML = user.username;

var data= {};

const miModulo = (() => {
    'use strict';

    let deck         = [];
    const tipos      = ['C','D','H','S'],
          especiales = ['A','J','Q','K'];

    let puntosJugadores = [];

    // Referencias del HTML
    const btnPedir   = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo   = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small');


    // Esta función inicializa el juego 
    const inicializarJuego = ( numJugadores = 2 ) => {
        data.turno = 'Turno player1 '+ user.username;
        deck = crearDeck();

        puntosJugadores = [];
        for( let i = 0; i< numJugadores; i++ ) {
            puntosJugadores.push(0);
        }
        
        puntosHTML.forEach( elem => elem.innerText = 0 );
        divCartasJugadores.forEach( elem => elem.innerHTML = '' );

        btnPedir.disabled   = false;
        btnDetener.disabled = false;

    }

    // Esta función crea un nuevo deck
    const crearDeck = () => {

        deck = [];
        for( let i = 2; i <= 10; i++ ) {
            for( let tipo of tipos ) {
                deck.push( i + tipo);
            }
        }

        for( let tipo of tipos ) {
            for( let esp of especiales ) {
                deck.push( esp + tipo);
            }
        }
        return _.shuffle( deck );;
    }

    // Esta función me permite tomar una carta
    const pedirCarta = () => {
        
        if ( deck.length === 0 ) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }

    const valorCarta = ( carta ) => {
        const valor = carta.substring(0, carta.length - 1);
        return ( isNaN( valor ) ) ? 
                ( valor === 'A' ) ? 11 : 10
                : valor * 1;

    }

    // Turno: 0 = primer jugador y el último será la computadora
    const acumularPuntos = ( carta, turno ) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];
        data.sala = roomIds;

        data.valor = valorCarta( carta );
        data.carta = carta;
        data.turnoJugador = turno;
        data.puntos = puntosJugadores[turno] ;
        puntosJugadores[turno] + valorCarta( carta );
        // console.log(data.valor);
        // console.log(data.carta);

         socket.emit('game:carta',data);

        
        return puntosJugadores[turno];
        
    }
    //socket.emit('meconecto:conecto', "conectado");

    const crearCarta = ( carta, turno ) => {
       // data.carta = carta;
        const imgCarta = document.createElement('img');
        imgCarta.src = `/img/cartas/${ carta }.png`; //3H, JD
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append( imgCarta );

       
        

    }

    const determinarGanador = () => {

        const [ puntosMinimos, puntosComputadora ] = puntosJugadores;
        data = {};
        data.sala = roomIds;
        setTimeout(() => {
            if( puntosComputadora === puntosMinimos ) {
                //alert('Nadie gana :(');
                Swal.fire({
                    icon: 'error',
                    title: 'Nadie gana...',
                    text: 'No gana nadie!',
                    footer: '<a href="">Sigue probando?</a>'
                  })
                  
                  data.quienGana = "empate" 
                  console.log(data.quienGana);
                  socket.emit('game:carta',data);
                
            } else if ( puntosMinimos > 21 ) {
                //alert('Computadora gana');
                // Swal.fire({
                //     title: 'Gana el jugador 2',
                //     text: 'El jugador 2 ha ganado ',
                //     imageUrl: 'https://estaticos.muyinteresante.es/uploads/images/article/5acb1ea65cafe88c1beaaae5/perder-dinero_0.jpg',
                //     imageWidth: 400,
                //     imageHeight: 300,
                //     imageAlt: 'Custom image',
                //   })
                Swal.fire({
                    title: 'Estas perdiendo tu dinero.',
                    width: 600,
                    padding: '3em',
                    
                    backdrop: `
                      rgba(0,0,123,0.4)
                      url("https://acegif.com/wp-content/uploads/funny-money-45.gif")
                      left top
                      no-repeat
                    `
                  })
                  
                  data.quienGana = "ganas" 
                  console.log(data.quienGana);
                  socket.emit('game:carta',data);

            } else if( puntosComputadora > 21 ) {
               // alert('Jugador Gana');
               Swal.fire({
                title: 'Gana el jugador 1',
                text: 'El jugador 1 ha ganado ',
                imageUrl: 'https://images.unsplash.com/photo-1554768804-50c1e2b50a6e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80',
                imageWidth: 400,
                imageHeight: 300,
                imageAlt: 'Custom image',
              })
              
              data.quienGana = "pierdes" ;
              console.log(data.quienGana);
                  socket.emit('game:carta',data);
            } else {
               // alert('Computadora Gana')
               Swal.fire({
                title: 'Gana el jugador 2',
                text: 'El jugador 2 ha ganado ',
                imageUrl: 'https://estaticos.muyinteresante.es/uploads/images/article/5acb1ea65cafe88c1beaaae5/perder-dinero_0.jpg',
                imageWidth: 400,
                imageHeight: 300,
                imageAlt: 'Custom image',
              })
            }
        }, 100 );
        
        // data.quienGana = "ganas" ;
        // console.log(data.quienGana);
        //           socket.emit('game:carta',data);

    }

    // turno de la computadora
    const turnoComputadora = ( puntosMinimos ) => {
        data.turno = "turno jugador 2";
        let puntosComputadora = 0;

        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1 );
            crearCarta(carta, puntosJugadores.length - 1 );

        } while(  (puntosComputadora < puntosMinimos)  && (puntosMinimos <= 21 ) );

        determinarGanador();
    }



    // Eventos
    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos( carta, 0 );
        
        crearCarta( carta, 0 );


        if ( puntosJugador > 21 ) {
            console.warn('Lo siento mucho, perdiste');
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );

        } else if ( puntosJugador === 21 ) {
            console.warn('21, genial!');
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }

    });


    btnDetener.addEventListener('click', () => {
        btnPedir.disabled   = true;
        btnDetener.disabled = true;
        let data = {}
        socket.emit('game:carta', data = { sala : roomIds, turno : "cambio"});
        
        
        turnoComputadora( puntosJugadores[0] );
    });

    // btnNuevo.addEventListener('click', () => {
        
    //     inicializarJuego();

    // });


    return {
        nuevoJuego: inicializarJuego
    };

})();

const divCartasJugadoress = document.querySelectorAll('.divCartas'),
          puntosHTMLs = document.querySelectorAll('small');

socket.on('game:carta', function(data){
    if(data.sala == roomIds){

    console.log(data);
    if(data.carta){
        
        // //miModulo.nuevoJuego();
        // //acumularPuntos(data.carta, data.turnoJugador);
         const imgCarta = document.createElement('img');
         imgCarta.src = `/img/cartas/${ data.carta }.png`; //3H, JD
         imgCarta.classList.add('carta');
         divCartasJugadoress[data.turnoJugador].append( imgCarta );
         //puntosHTML[data.puntosJugadores].innerText = puntosJugadores[data.turnoJugador];
         

    }

    if(!data.carta & !data.turno & !data.quienGana){
        console.log("Se ha conectado un usuario a la sala");
        activarBoton();
        Swal.fire({
            icon: 'success',
            title: 'Nuevo jugador conectado ...',
            text: 'Se ha conectado '+ data.user,

        });
        document.getElementById("player_2_name").innerHTML = data.user;
    }
    if(data.turno){
        activarBoton();
    }
    if(data.quienGana){
        quienGana(data.quienGana);
    }
}
})



// var namePlayer =  document.getElementById('player_1_name');
// console.log(namePlayer);




fetch('/rooms/'+roomIds)
    .then(res => res.json())
    .then(data => {
        let room = data.name;
        console.log(data);
        
        const players = data.currentPlayers;
        console.log(players[0].username);
        console.log(room);

        
        if(players[1]){
        console.log(players[1].username);
        //activarBoton();
        
         
        socket.emit('game:carta', datos = { sala : roomIds, user : players[1].username });
        
    }else{
        console.log("No hay player 2");
        Swal.fire(
            'Gracias por unirte a la sala '+ data.name,
            'Cuando se conecte alguien empezaremos a jugar!',
            'success'
          )

    }
        
        });

    const activarBoton = ()=>{
        btnNuevo.disabled = false;
    }

    quienGana=(num)=>{
        console.log("Que ha pasado en la partida: "+ num);


        if(num == "pierdes"){
            console.log("Notificacion de pierdes");
            

              Swal.fire({
                title: 'Estas perdiendo tu dinero.',
                width: 600,
                padding: '3em',
                
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("https://acegif.com/wp-content/uploads/funny-money-45.gif")
                  left top
                  no-repeat
                `
              })

        }
        if(num == "ganas"){
            console.log("Notificacion de ganas");
            Swal.fire({
                title: 'Gana el Jugador 1',
                text: 'El jugador 1 ha ganado ',
                imageUrl: 'https://images.unsplash.com/photo-1554768804-50c1e2b50a6e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80',
                imageWidth: 400,
                imageHeight: 300,
                imageAlt: 'Custom image',
              })


        }
        if(num == "empate"){
            console.log("Notificación de empate");
            Swal.fire({
                icon: 'error',
                title: 'Nadie gana...',
                text: 'No gana nadie!',
                footer: '<a href="">Sigue probando?</a>'
              })

        }
    }