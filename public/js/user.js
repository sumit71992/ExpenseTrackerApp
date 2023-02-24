const signup = document.querySelector('#signup');
const names = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
signup.addEventListener('click',(e)=>{
e.preventDefault();
const obj ={
    name:names.value,
    email: email.value,
    password: password.value
}
axios.post('http://localhost:3000/signup',obj)
.then(user=>{
    window.location.replace("/login");
})
.catch(err=>console.log(err));
})