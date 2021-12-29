/**
  * Variables
  */
 const signupButton = document.getElementById('signup-button'),
     loginButton = document.getElementById('login-button'),
     userForms = document.getElementById('user_options-forms')
 
 /**
  * Add event listener to the "Sign Up" button
  */
  signupButton.addEventListener('click', () => {
    console.log('signup');
   userForms.classList.remove('bounceRight')
   userForms.classList.add('bounceLeft')
 });
 
 /**
  * Add event listener to the "Login" button
  */
 loginButton.addEventListener('click', () => {
   userForms.classList.remove('bounceLeft')
   userForms.classList.add('bounceRight')
 }, false)