const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const btnLogin = document.getElementById('btnLogin');

signUpButton.addEventListener('click', () => {
	console.log('entrei')
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	console.log('entre aqui 2')
	container.classList.remove("right-panel-active");
});

btnLogin.addEventListener('click',()=> {
	sessionStorage.setItem('email', document.getElementById("emailLogin").value)
})
