"use strict"

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

    }).then((result) => {
        if( result.isConfirmed) {
            window.location.href = "index.html";
        }
    });
}

function desenharAlertaA(mensagem) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: mensagem
    });
}

async function chamadaApiSaudação(){
    try {
        const res = await fetch("https://api-webbot-1.onrender.com/saudacao", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        const mensagem = document.createElement("p");
        mensagem.style.color = "black";
        mensagem.textContent = data;
        mensagem.style.fontSize = "1.1rem";

        desenharChat(mensagem, "50vw", "10vh");
        desenharInteracao("Olá!", "200px", "50px", "0px", "0px", "nao");
        
    } catch(error) {
        console.log(error);
    }
}

async function chamadaApiMenu() {
    try {
        const res = await fetch("https://api-webbot-1.onrender.com/menu", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        const mensagem = document.createElement("p");
        mensagem.style.color = "black";
        mensagem.textContent = data;
        mensagem.style.fontSize = "1.1rem";

        desenharChat(mensagem, "85vw", "35vh");

        const divChat = document.getElementById("div-chat");
        const containerLargura = divChat.offsetWidth; 

        const numBotoes = 6;

        const tamanho = containerLargura * 0.12;

        const gap = containerLargura * 0.04;

        const y = window.innerHeight * 0.6;

        for (let i = 0; i < numBotoes; i++) {
        const x = gap + i * (tamanho + gap);
        desenharInteracao(
            i + 1,
            `${tamanho}px`,
            `${window.innerHeight * 0.07}px`, 
            `${x}px`,
            `${y}px`,
            "sim"
        );
        }

    } catch(error) {
        console.log(error);
    }
}

async function chamadaApiResposta(op, x, y) {
    try {
        const res = await fetch("https://api-webbot-1.onrender.com/resultado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op, x, y }),
        });

        const data = await res.json();

        const mensagem = document.createElement("p");
        mensagem.style.color = "black";
        mensagem.textContent = "Muito bem! O resultado é : " + data;
        mensagem.style.fontSize = "1.1rem";

        desenharChat(mensagem, "75vw", "10vh");

    } catch(error) {
        console.log(error);
    }
}

let firebaseError;
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "erro-mensagem") {
      e.preventDefault();
      Swal.update({
        footer: `<span style="color:#b2341d; font-weight:bold;">Código de erro: ${firebaseError}</span>`
      });
    }
});

async function deletar() {
    const uid = localStorage.getItem("uid");
    try {
        const res = await fetch("https://api-webbot-1.onrender.com/deletar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
        });

        const data = await res.json();
        if(data.success){
            desenharAlertaV("Sua conta foi deletada!");
        } else {
            firebaseError = data.error;
            desenharAlertaX("Por segurança, não foi possivel deletar sua conta no momento.");
        }
        
    } catch(error) {
        console.log(error);
    }
}
 
async function pegarUsuario() {
    const uid = localStorage.getItem("uid");

    try {
        const res = await fetch("https://api-webbot-1.onrender.com/getUser", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ uid }),
        });

        const data = await res.json();

        if(data.success) {
            document.querySelector('.username-custom').textContent = data.displayName;
        } else if(!data.success) {
            document.querySelector('.username-custom').textContent = "Usuario";
        }
    } catch(error) {
        console.log(error);
    }
}

function desenharChat(mensagem, w, h){
    const div = document.createElement("div");
    div.style.backgroundColor = "white";
    div.style.height = h;
    div.style.width = w;
    div.style.borderRadius = "15px";
    div.style.padding = "20px";          
    div.style.boxSizing = "border-box";  
    div.style.wordWrap = "break-word";   
    div.style.whiteSpace = "pre-wrap";   
    div.style.textAlign = "left"; 

    div.appendChild(mensagem);
    const divChat = document.getElementById("div-chat");
    divChat.appendChild(div);
}

let op = 0;

function desenharInteracao(mensagem, w, h, x, y, responsivo){
    const btn = document.createElement("button");
    btn.textContent = mensagem;
    btn.classList.add("btn-interacao");
    btn.style.background = "white";
    btn.style.backdropFilter = "blur(10px)";
    btn.style.borderRadius = "15px";
    btn.style.fontSize = "1rem";
    btn.style.fontWeight = "500";
    btn.style.cursor = "pointer";
    btn.style.padding = "12px 16px";
    btn.style.fontFamily = "'Inter', sans-serif";
    btn.style.height = h;
    btn.style.width = w;
    btn.style.color = "black";
    btn.style.position = "absolute";
    btn.style.display = "flex";
    btn.style.justifyContent = "center";
    btn.style.alignItems = "center";
    btn.style.opacity = "0";
    btn.style.transition = "all 0.5s ease";

    if(responsivo === "sim"){
        btn.style.top = y;
        btn.style.left = x;
        btn.style.transform = "none";
    } else {
        btn.style.bottom = "20px";
        btn.style.left = "50%";
        btn.style.transform = "translate(-50%, 20px)";
    }

    const divChat = document.getElementById("div-chat");
    divChat.appendChild(btn);

    btn.addEventListener("mouseenter", () => {
        btn.style.background = "#b9b9ff";
        btn.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
    });
    btn.addEventListener("mouseleave", () => {
        btn.style.background = "white";
        btn.style.boxShadow = "none";
    });

    setTimeout(() => {
        if(responsivo !== "sim"){
            btn.style.opacity = "1";
            btn.style.transform = "translate(-50%, 0)";
        } else {
            btn.style.opacity = "1";
        }
    }, 1500);

    btn.addEventListener("click", function(event){
        event.preventDefault(); 
    if(btn.textContent === "Olá!") {
        btn.remove();
        chamadaApiMenu();
    } else if(btn.textContent === "1" || btn.textContent === "2" || btn.textContent === "3" || btn.textContent === "4" || btn.textContent === "5" || btn.textContent === "6") {
        op = btn.textContent;
        const botao = document.querySelectorAll(".btn-interacao");
        botao.forEach(btn => {
            btn.remove();
        });
        verifica(op);
        
    }
    });
}

async function verifica(op, btn){
    const res = await fetch("https://api-webbot-1.onrender.com/verifica" , {
        method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify ({ op }),
    });

    const data = await res.json();

    const mensagem = document.createElement("p");
    mensagem.style.color = "black";
    mensagem.textContent = data;
    mensagem.style.fontSize = "1.1rem";
    
    const divChat = document.getElementById("div-chat");
    const filhos = divChat.children;

    const anterior = document.createElement("p");
    anterior.style.color = "white";
    anterior.style.fontSize = "25px";
    anterior.textContent = "...";
    anterior.style.display = "flex";
    anterior.style.textAlign = "left";
    anterior.style.alignItems = "center";
    anterior.style.paddingLeft = "0px";
    anterior.style.fontWeight = "bold";
    anterior.style.height = "25px";


    if (filhos[0]) {
        filhos[0].classList.add("fade-out");
        setTimeout(() => {
            divChat.replaceChild(anterior, filhos[0]);
        }, 200);
    } else {
        divChat.appendChild(anterior);
    }

  if (filhos[1]) {
    filhos[1].classList.add("fade-out");
    setTimeout(() => filhos[1].remove(), 200);
  }

  setTimeout(() => {
    if (op == 1) {
      desenharChat(mensagem, "55vw", "10vh");
    } else {
      desenharChat(mensagem, "85vw", "12vh");
    }
    receberValor(op);
  }, 250); 
}

let count = 0;

async function receberValor(op){
    const input = document.createElement("input");
    input.classList.add('input-valor');
    input.type = "text";
    input.style.width = "70vw";
    input.style.height = "50px";
    input.style.position = "absolute";
    input.style.bottom = "40px";
    input.style.left = "45%";
    input.style.transform = "translate(-50%, 20px)";
    input.placeholder = "Digite aqui....";
    input.style.padding = "15px";
    input.style.border = "none";
    input.style.outline = "none";
    input.style.boxShadow = "none";
    input.style.borderRadius = "12px";

    input.focus();
    
    const divChat = document.getElementById("div-chat");
    divChat.appendChild(input);

    const i = document.createElement("i");
    i.classList.add("fa-solid", "fa-arrow-up");

    const btn = document.createElement("button");
    btn.classList.add('btn-enviar');
    btn.style.borderRadius = "15px";
    btn.style.width = "35px";
    btn.style.height = "35px";
    btn.style.position = "absolute";
    btn.style.bottom = "25px";
    btn.style.left = "85%";
    btn.style.border = "none";

    btn.appendChild(i);
    divChat.appendChild(btn);

    document.querySelector('.btn-enviar').addEventListener("click", function(event) {
    event.preventDefault();
    count++;
    const valor = input.value.trim();

    if(op == 1 && count == 1){
        let x = parseFloat(valor);
        let y = 0;
        if(!isNaN(x)) {
            chamadaApiResposta(op, x, y);
            setTimeout(() => {
                verificaFim(input, btn);
            }, 2000);
            return;
        } else {
            desenharAlertaA("Digite apenas um valor válido. Ex: 2.");
            count--;
        } 
    } else if(op != 1 && count == 1) {
        const partes = valor.split(",").map(p => p.trim());

        if(partes.length !== 2) {
            desenharAlertaA("Digite dois valores separados por vírgula. Ex: 3, 5.");
            count--;
            return;
        }

        let x = parseFloat(partes[0]);
        let y = parseFloat(partes[1]);

        if(isNaN(x) || isNaN(y)) {
            desenharAlertaA("Digite dois números válidos separados por vírgula. Ex: 4, 5.");
            count--;
            return;
        }
        chamadaApiResposta(op, x, y);
        setTimeout(() => {
            verificaFim(input, btn);
        }, 2000);
    }
    });
}

function verificaFim(input, btn){

    const mensagem = document.createElement("p");
    mensagem.style.color = "black";
    mensagem.textContent = "Digite 's' para continuar ou 'n' para sair.";
    mensagem.style.fontSize = "1.1rem";

    desenharChat(mensagem, "75vw", "12vh");

    document.querySelector('.btn-enviar').addEventListener("click", function(event) {
    event.preventDefault();

    const valor = input.value;

    if(valor === "s"){
        loop();
        count = 0;
    } else if (valor === "n") {
        window.location.href = "fim.html";
        count = 0;
    } else {
        desenharAlertaA("Digite apenas 's' para continuar ou 'n' para sair.");
    }

    });
}

function loop() {
  const input = document.querySelector('.input-valor');
  if (input) {
    input.classList.add('fade-out');
    setTimeout(() => input.remove(), 400);
  }

  const divChat = document.getElementById("div-chat");
  const filhos = Array.from(divChat.children);

  filhos.forEach(f => {
    f.classList.add('fade-out');
    setTimeout(() => f.remove(), 400);
  });

  setTimeout(() => {
    const anterior = document.createElement("p");
    anterior.style.color = "white";
    anterior.style.fontSize = "25px";
    anterior.textContent = "...";
    anterior.style.display = "flex";
    anterior.style.textAlign = "left";
    anterior.style.alignItems = "center";
    anterior.style.paddingLeft = "0px";
    anterior.style.fontWeight = "bold";
    anterior.style.height = "25px";

    divChat.appendChild(anterior);

    chamadaApiMenu();
  }, 400); 
}


document.getElementById("deletar").addEventListener("click", function(event) {
event.preventDefault();
deletar();
});

document.getElementById("sair").addEventListener("click", function(event) {
event.preventDefault();
localStorage.clear();
window.location.href = "index.html";
});

chamadaApiSaudação();
pegarUsuario();