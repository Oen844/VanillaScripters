


let registerForm = document.querySelector("#register");
let loginForm = document.querySelector("#login");
const actionTypes = Object.freeze({
    LOGIN: "login",
    REGISTER: "register"
});

const avatarsList = ["chico", "chino", "gafas", "sploton"];

var datos = {
    action: "",
    username: "",
    email: "",
    password: "",
    avatar: null
};

// Evento de logeo
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    datos.action = actionTypes.LOGIN;
    datos.email = document.getElementById('txtEmail').value;
    datos.password = document.getElementById('txtPassword').value;

    fetch("/login", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body:  JSON.stringify(datos)
})
.then(response => response.json())
.then(datos => { 
   
    if(datos.error){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Credenciales incorrectas!',
        });
    }else{
        
        localStorage.setItem("user", JSON.stringify(datos));
       
        Swal.fire({
            icon: 'success',
            title: 'Registro Correcto',
            showConfirmButton: false,
            timer: 2500
          })
          .then(() => window.location.href = '/');
    }
   
});

    // localStorage.setItem("email", JSON.stringify(datos.email));
    // let info = localStorage.getItem('authorization'); No se usa
    
});

// Funcion de registrarse
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    datos.action = actionTypes.REGISTER;
    datos.username = document.getElementById('regtxtUsername').value;
    datos.email = document.getElementById('regtxtEmail').value;
    datos.password = document.getElementById('regtxtPassword').value; 
    
    fetch("/login", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body:  JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(datos => { 
        if(datos.error){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo ha salido mal!',
            });
        } else {
            localStorage.setItem('user', JSON.stringify(datos))
            
            Swal.fire({
                icon: 'success',
                title: 'Usuario Registrado',
                showConfirmButton: false,
                timer: 1500
              }).then(() => window.location.href = '/');
        }
    });
});
  
    //Avatars
    var avatarElements = [];
    const avatarsContainer = document.querySelector('.user_forms-login .forms_buttons .form-group');
    avatarsList.forEach((avatar, i) => {
        let avatarBtn = `
        <label class="avatars">
            <button
                type="button"
                class="avatar avatars"
                id="avatar${i + 1}">
                <img
                    src="img/${avatar}.png"
                    alt=""
                    data-id="${avatar}"
                    width="60" 
                    height="70"
                />
            </button>
        </label>`;
        avatarsContainer.insertAdjacentHTML('beforeend', avatarBtn);
        avatarElements.push(document.getElementsByClassName('avatar')[i]);
    });

    avatarElements.forEach(element => {
        element.onclick = (e) => {
            let avatarId = e.target.dataset.id;
            datos.avatar = avatarId;
            console.log(avatarId);
            
        };
    });
      


