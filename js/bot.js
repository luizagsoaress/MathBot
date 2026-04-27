"use strict"

let darkMode = false;

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
        mensagem.classList.add("mensagem");
        mensagem.style.color = darkMode ? "white" : "black";
        mensagem.textContent = data;
        mensagem.style.fontSize = "1.1rem";
        mensagem.style.margin = "0";
        mensagem.style.padding = "0";

        desenharChat(mensagem);
        desenharInteracao("Olá!", "nao", "0");
        
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

        console.log(data);

        const mensagem = document.createElement("p");
        mensagem.classList.add("mensagem");
        mensagem.style.color = darkMode ? "white" : "black";
        mensagem.textContent = data;
        mensagem.style.fontSize = "1.1rem";
        mensagem.style.margin = "0";
        mensagem.style.padding = "0";

        desenharChat(mensagem);

        const gridOpcoes = document.createElement("div");
        gridOpcoes.classList.add("grid-opcoes");
        gridOpcoes.style.display = "grid";
        gridOpcoes.style.gridTemplateColumns = "repeat(3, 1fr)";
        gridOpcoes.style.gap = "10px";
        gridOpcoes.style.position = "absolute";
        gridOpcoes.style.bottom = "0px";
        gridOpcoes.style.left = "50%";
        gridOpcoes.style.transform = "translateX(-50%)";
        gridOpcoes.style.width = "min(340px, 90vw)";
        gridOpcoes.style.opacity = "0";
        gridOpcoes.style.transition = "opacity 0.5s ease";

        const divChat = document.querySelector(".div-chat");
        divChat.appendChild(gridOpcoes);

        const numBotoes = 6;
        for (let i = 0; i < numBotoes; i++) {
            desenharInteracao(i + 1, "sim", 0);
        }

        setTimeout(() => {
            gridOpcoes.style.opacity = "1";
        }, 1500);

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
        mensagem.classList.add("mensagem");
        mensagem.style.color = darkMode ? "white" : "black";
        mensagem.textContent = "Muito bem! O resultado é : " + data;
        mensagem.style.fontSize = "1.1rem";
        mensagem.style.margin = "0";
        mensagem.style.padding = "0";

        desenharChat(mensagem);

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

function desenharChat(mensagem){
    const div = document.createElement("div");
    div.classList.add("chatDiv");
    div.style.height = "auto";
    div.style.width = "auto";
    div.style.maxWidth = "800px";
    div.style.borderRadius = "15px";
    div.style.padding = "20px 20px";          
    div.style.wordWrap = "break-word";   
    div.style.whiteSpace = "pre-wrap";   
    div.style.textAlign = "left"; 
    div.style.display = "flex";
    div.style.justifyContent = "flex-start";
    div.style.alignItems = "center";
    div.style.margin = "0";

    if(darkMode) {
        div.style.backgroundColor = "#1E1E1E";
        div.style.border= "2px solid #2a2a2a";
    } else if(!darkMode) {
        div.style.backgroundColor = "#F5F5F5";
        div.style.border = "2px solid #dddddd";
    }

    div.appendChild(mensagem);
    const divChat = document.querySelector(".div-chat");
    divChat.appendChild(div);
}

let op = 0;

function desenharInteracao(mensagem, responsivo, gap){
    const btn = document.createElement("button");
    btn.textContent = mensagem;
    btn.classList.add("btn-interacao");
    btn.style.background = "#d12e2e";
    btn.style.border = "2px solid #d12e2e";
    btn.style.borderRadius = "15px";
    btn.style.fontSize = "1rem";
    btn.style.fontWeight = "600";
    btn.style.cursor = "pointer";
    btn.style.padding = "12px 16px";
    btn.style.color = "white";
    btn.style.position = "absolute";
    btn.style.display = "flex";
    btn.style.justifyContent = "center";
    btn.style.alignItems = "center";
    btn.style.opacity = "0";
    btn.style.transition = "all 0.5s ease";

    if(responsivo === "sim"){
        btn.style.position = "static";
        btn.style.height = "50px";
        btn.style.width = "100%";
        btn.style.opacity = "1";
        btn.style.transform = "none";
    } else {
        btn.style.bottom = "20px";
        btn.style.left = "50%";
        btn.style.transform = "translate(-50%, 20px)";
        btn.style.height = "50px";
        btn.style.width = "225px";
    }

    if(responsivo === "sim") {
        const grid = document.querySelector(".grid-opcoes");
        grid.appendChild(btn);
    } else {
        const divChat = document.querySelector(".div-chat");
        divChat.appendChild(btn);
    }

    btn.addEventListener("mouseenter", () => {
        btn.style.background = "rgb(196, 6, 6)";
        btn.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
    });
    btn.addEventListener("mouseleave", () => {
        btn.style.background = "#d12e2e";
        btn.style.boxShadow = "none";
    });

    setTimeout(() => {
        if(responsivo !== "sim"){
            btn.style.opacity = "1";
            btn.style.transform = "translate(-50%, 0)";
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
            const grid = document.querySelector("grid-opcoes");
            if(grid) grid.remove();
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
    mensagem.classList.add("mensagem");
    mensagem.style.color = darkMode ? "white" : "black";
    mensagem.textContent = data;
    mensagem.style.fontSize = "1.1rem";
    mensagem.style.margin = "0";
    mensagem.style.padding = "0";
    
    const divChat = document.querySelector(".div-chat");
    const filhos = divChat.children;

    const anterior = document.createElement("p");
    anterior.style.color = darkMode ? "white" : "black";
    anterior.classList.add("anterior");
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
      desenharChat(mensagem);
    } else {
      desenharChat(mensagem);
    }
    receberValor(op);
  }, 250); 
}

let count = 0;

async function receberValor(op){
    const input = document.createElement("input");
    input.classList.add('input-valor');
    input.type = "text";
    input.style.width = "80vw";
    input.style.height = "50px";
    input.style.position = "absolute";
    input.style.bottom = "40px";
    input.style.left = "40.5vw";
    input.style.margin = 0;
    input.style.transform = "translate(-50%, 20px)";
    input.placeholder = "Digite aqui....";
    input.style.padding = "15px";
    input.style.outline = "none";
    input.style.boxShadow = "none";
    input.style.borderRadius = "12px";

    if(darkMode) {
        input.style.backgroundColor = "#1E1E1E";
        input.style.border = "2px solid #2a2a2a";
        input.style.color = "white";
    } else if(!darkMode) {
        input.style.backgroundColor = "white";
        input.style.border = "2px solid #2a2a2a9a";
        input.style.color = "black";
    }

    input.focus();
    
    const divChat = document.querySelector(".div-chat");
    divChat.appendChild(input);

    const i = document.createElement("i");
    i.classList.add("fa-solid", "fa-arrow-up");

    const btn = document.createElement("button");
    btn.classList.add('btn-enviar');
    btn.style.borderRadius = "15px";
    btn.style.width = "45px";
    btn.style.height = "45px";
    btn.style.position = "absolute";
    btn.style.bottom = "25px";
    btn.style.left = "82vw";
    btn.style.fontSize = "15px";

    if(darkMode){
        btn.style.background = "#1a1a1a";
        btn.style.color = "white";
        btn.style.border = "1px solid #2a2a2a";
    } else if(!darkMode) {
        btn.style.background = "#1a1a1a";
        btn.style.color = "white";
        btn.style.border = "2px solid black";
    }

    btn.appendChild(i);
    divChat.appendChild(btn);

    document.querySelector('.btn-enviar').addEventListener("click", async function(event) {
        event.preventDefault();
        count++;
        const valor = input.value.trim();

        if(op == 1 && count == 1){
            let x = parseFloat(valor);
            let y = 0;
            if(!isNaN(x)) {
                await chamadaApiResposta(op, x, y);
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
            await chamadaApiResposta(op, x, y);
            setTimeout(() => {
                verificaFim(input, btn);
            }, 2000);
        }
    });
    input.value = '';
}

function verificaFim(input, btn){
    const mensagem = document.createElement("p");
    mensagem.classList.add("mensagem");
    mensagem.style.color = darkMode ? "white" : "black";
    mensagem.textContent = "Digite 's' para continuar ou 'n' para sair.";
    mensagem.style.fontSize = "1.1rem";
    mensagem.style.margin = "0";
    mensagem.style.padding = "0";

    desenharChat(mensagem);

    document.querySelector('.btn-enviar').addEventListener("click", function(event) {
        event.preventDefault();

        const valor = input.value.trim();
        let valorValido = false;

        const valoresAceitaveisContinuacao = [
            "s",
            "sim",
            "Sim",
            "SIM",
        ];

        const valoresAceitaveisSaida = [
            "n",
            "nao",
            "NAO",
            "não",
            "Não",
        ];

        valoresAceitaveisContinuacao.forEach(element => {
            if(valor === element) {
                valorValido = true;
                loop();
                count = 0;
                return;
            }
        });

        valoresAceitaveisSaida.forEach(element => {
            if(valor === element) {
                valorValido = true;
                window.location.href = "fim.html";
                count = 0;
                return;
            }
        });

        if(valorValido === false) {
            desenharAlertaA("Digite apenas 's' para continuar ou 'n' para sair.");
            return;
        }

    });
}

function loop() {
  const input = document.querySelector('.input-valor');
  if (input) {
    input.classList.add('fade-out');
    setTimeout(() => input.remove(), 400);
  }

  const divChat = document.querySelector(".div-chat");
  const filhos = Array.from(divChat.children);

  filhos.forEach(f => {
    f.classList.add('fade-out');
    setTimeout(() => f.remove(), 400);
  });

  setTimeout(() => {
    const anterior = document.createElement("p");
    anterior.style.color = darkMode ? "white" : "black";
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

const switchBtn = document.querySelector('.switch');
const imgSwitch = document.querySelector('.switch_img');

function switchCor() {
    const formX = document.querySelector('.form-x');
    const anterior = document.querySelector('.anterior');
    const btnEnviar = document.querySelector('.btn-enviar');
    const inputValor = document.querySelector('.input-valor');
    const chatDiv = document.querySelectorAll('.chatDiv');
    const mensagem = document.querySelectorAll('.mensagem');

    if(darkMode) {
        imgSwitch.src = "imagens/switch_preto.png";
        formX.style.backgroundColor = "#141414";
        chatDiv.forEach(element => {
            element.style.backgroundColor = "#1E1E1E";
            element.style.border = "2px solid #2a2a2a";
            element.style.color = "white";
        });
        mensagem.forEach(element => {
            element.style.color = "white";
        });
        if(anterior) anterior.style.color = "white";
        if(btnEnviar) {
            btnEnviar.style.background = "#1a1a1a";
            btnEnviar.style.color = "white";
            btnEnviar.style.border = "2px solid #2a2a2a";
        }
        if(inputValor) {
            inputValor.style.backgroundColor = "#1E1E1E";
            inputValor.style.border = "2px solid #2a2a2a";
            inputValor.style.color = "white";
        }
    } else {
        imgSwitch.src = "imagens/switch_branco.png";
        formX.style.backgroundColor = "white";
        chatDiv.forEach(element => {
            element.style.backgroundColor = "#F5F5F5";
            element.style.border = "2px solid #dddddd";
            element.style.color = "black";
        });
        mensagem.forEach(element => {
            element.style.color = "black";
        });
        if(anterior) anterior.style.color = "black";
        if(btnEnviar) {
            btnEnviar.style.background = "#1a1a1a";
            btnEnviar.style.color = "white";
            btnEnviar.style.border = "2px solid black";
        }
        if(inputValor) {
            inputValor.style.backgroundColor = "white";
            inputValor.style.border = "2px solid #2a2a2a9a";
            inputValor.style.color = "black";
        }
    }
}

switchBtn.addEventListener("click", () => {
    darkMode = !darkMode;
    switchCor();
});

chamadaApiSaudação();