  'use strict'

  let firebaseError;

  function desenharAlertaX(mensagem) {
    Swal.fire({
      icon: "error",
      title: "Tivemos um problema por aqui...",
      text: mensagem,
      footer: '<a href="#" id="erro-mensagem">Por que tenho esse problema? </a>' 
    });
  }

  function desenharAlertaV(mensagem) {
    Swal.fire({
      title: "Sucesso!",
      text: mensagem,
      icon: "success",
    });
  }

  function desenharAlertaA(mensagem) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: mensagem
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "erro-mensagem") {
      e.preventDefault();
      Swal.update({
        footer: `<span style="color:#b2341d; font-weight:bold;">Código de erro: ${firebaseError}</span>`
      });
    }
  });

  async function criarEmailSenha(email, password, username) {
    const res = await fetch("https://api-webbot-1.onrender.com/createUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
    });

    const data = await res.json();

    if (data.success) { 
      localStorage.setItem("token", data.token);
      localStorage.setItem("uid", data.uid);
      localStorage.setItem("situacao", "sucess");
      window.location.href = "main.html";
    } else {
      firebaseError = data.error;
      desenharAlertaX("Não foi possivel criar sua conta nesse momento.");
    }
  }

  async function loginEmailSenha(email, password) {
     const res = await fetch("https://api-webbot-1.onrender.com/loginUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) { 
      localStorage.setItem("token", data.token);
      localStorage.setItem("uid", data.uid);
      window.location.href = "main.html";
    } else {
      firebaseError = data.error;
      desenharAlertaX("Não foi possivel fazer login nesse momento.");
    }
  }

  async function recuperar(email){
     const res = await fetch("https://api-webbot-1.onrender.com/recuperar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) { 
      desenharAlertaV("Email de recuperação enviado!")
    } else {
      firebaseError = data.error;
      desenharAlertaX("O email informado está incorreto. Verifique e tente novamente.");
    }
  }

  function googleID(){
    google.accounts.id.initialize({
      client_id: "745056716252-jrk7r35ql5tm7ru6rceggr70t569ari1.apps.googleusercontent.com",
      callback: loginGoogle
    });

    google.accounts.id.prompt(); 
  }

  async function loginGoogle(response){
    const id_token = response.credential;
    const res = await fetch("https://api-webbot-1.onrender.com/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token }),
    });

    const data = await res.json();

    if(data.token || data.idToken){
      localStorage.setItem("token", data.token);
      localStorage.setItem("uid", data.uid);
      window.location.href = "main.html";
    } else {
      firebaseError = data.error;
      desenharAlertaX("Não foi possivel entrar com o Google nesse momento.");
    }
  }

  document.querySelector('.google').addEventListener("click", function(event) {
  event.preventDefault();
  googleID();
  });

  function githubAcess(){
    const clientId = "Ov23liXhmDgslupfpfow"; 
    const redirectUri = "https://luizagsoaress.github.io/MathBot/callback.html"; 
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    window.open(authUrl, "_blank", "width=500,height=600"); 

    window.addEventListener("message", (event) => {
      if (event.origin !== "https://luizagsoaress.github.io") return; 
      const data = event.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("uid", data.uid);
        window.location.href = "main.html"; 
      }
    });
  }

  document.querySelector(".github").addEventListener("click", function(event) {
  event.preventDefault();
  githubAcess();
  });

  document.addEventListener('DOMContentLoaded', function (){

    const formCadastro = document.getElementById("cadastroForm");
    const formLogin = document.getElementById("loginForm");
    const formRecuperar = document.getElementById("recuperarForm");


    if(formCadastro){
      formCadastro.addEventListener("submit", function (event) {
        event.preventDefault(); 
      
        const email = document.getElementById("email").value.trim(); 
        const senha = document.getElementById("password").value.trim();
        const username = document.getElementById("username").value.trim();  
      
        criarEmailSenha(email, senha, username);
      });
    }
      
    if(formLogin){
      formLogin.addEventListener("submit", function (event) {
        event.preventDefault(); 
        
        const email = document.getElementById("email").value.trim(); 
        const senha = document.getElementById("password").value.trim();  
        
        if (!email || !senha) {
          firebaseError = "Os campos precisam estar preenchidos."
          desenharAlertaX("Preencha todos os campos!");
          return;
        }
        loginEmailSenha(email, senha);
      });
    }
      
    if(formRecuperar){
      formRecuperar.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();

        if(!email){
        desenharAlertaX("Preencha o campo e-mail.");
        return;
        }
        recuperar(email);
      });
    }
      
});


window.googleID = googleID;
window.githubAcess = githubAcess;
window.loginGoogle = loginGoogle;