// Drag & drop handlers
function handleDragStart(e){
  e.dataTransfer.setData("text", this.id);
  console.log("handle started");
}

function handleDragEnterLeave(e){
  if(e.type == "dragenter") {
      console.log('dragenter');
      this.classList.add('drag-enter');
  } else {
      console.log('dragleave');
      this.classList.remove('drag-enter');
      for(let i = 0 ; i< 4 ; i++){
        document.getElementById(("boton"+[i+1])).disabled = true; //desabilita todos los botones si se sale de una sala         
    }
  }
}

function handleOverDrop(e){
  e.preventDefault(); 
  if (e.type != "drop") {
      return; 
  }
  console.log('dropped');
  this.classList.remove('drag-enter');
  //Stores dragged elements ID in var draggedId
  var draggedId = e.dataTransfer.getData("text");
  //Stores referrence to element being dragged in var draggedEl
  var draggedEl = document.getElementById(draggedId);

  if (draggedEl.parentNode == this) {
     
      return;
  }
  draggedEl.parentNode.removeChild(draggedEl);
    this.appendChild(draggedEl); //Note: "this" references to the current target div that is firing the "drop" event.
    this.className = "room-card";
    console.log("soltar");
    let sala = draggedEl.parentNode;
    console.log(sala.id) //sala de juego
    sala.id = sala.id.replace(/[^0-9\.]+/g, ""); //elimna los caracteres
    console.log(sala.id)
    document.getElementById(("boton"+sala.id)).disabled = false;
};

// Set draggable
var draggable = document.querySelector('#avatarImage');
draggable.addEventListener("dragstart", handleDragStart);

const user = JSON.parse(localStorage.getItem('user'));
console.log(user);
const username = user.username;
document.getElementById("usuario").innerHTML = username;


function logout() {
    localStorage.clear();
    window.location.replace('/logout');
}

const avatar = user.avatar;
console.log(avatar);
document.getElementById("avatarImage").src = `./img/${avatar}.png`;

// Fetch rooms
fetch('/rooms',
      {
        headers:{
          'x-access-token': user.token
        }
      })
.then(response => response.json())
.then(data => {
  // Add rooms
  const roomContainer = document.getElementById('rooms');
  data.forEach(room => {
     let roomElement = `
      <div data-drop-target="true" class="room-card" id="room_${room.id}" style="background-image: url('../img/${room.artwork.thumbnail}')">
        <h2 id="titulo">${room.name}</h2>
        <button onclick="joinRoom(${room.id})" class="bubbly-button join-btn"  id="boton${room.id}" data-id="${room.id}" disabled>Unete!</button>
      </div>`;
      roomContainer.insertAdjacentHTML('beforeend', roomElement);
  });

  // Bind buttons classes
  const dropableElements = document.querySelectorAll('[data-drop-target]');
   
  for(var i = 0; i < dropableElements.length; i++) {
    dropableElements[i].addEventListener("dragover", handleOverDrop);
    dropableElements[i].addEventListener("drop", handleOverDrop);
    dropableElements[i].addEventListener("dragenter", handleDragEnterLeave);
    dropableElements[i].addEventListener("dragleave", handleDragEnterLeave);
  }
});

function joinRoom(roomId) {
    fetch('/rooms/join/'+roomId+'/'+user.id,
          {
            headers:{
              'x-access-token': user.token
            }
        })
    .then(res => res.json())
    .then(data => {
      if(data.error){
        // Access denied
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No puedes acceder a esta sala ahora',
        });
      }else{
        // Redirect to room
        window.location.href = `/rooms/${roomId}/play`;
      }
    });
}

