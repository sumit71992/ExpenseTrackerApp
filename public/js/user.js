const signup = document.querySelector("#signup");
const names = document.getElementById("name");
const email = document.getElementById("email");
let message = document.querySelector(".message");
const password = document.getElementById("password");
signup.addEventListener("click", (e) => {
  e.preventDefault();
  const obj = {
    name: names.value,
    email: email.value,
    password: password.value,
  };
  axios
    .post("http://localhost:3000/signup", obj)
    .then((user) => {
      console.log(user);
      if (user.data.message) {
        message.appendChild(document.createTextNode(user.data.message));
      } else {
        window.location.replace("/login");
      }
    })
    .catch((err) => console.log(err));
});
