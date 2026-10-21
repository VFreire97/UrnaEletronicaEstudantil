let numero = "";
let votoBranco = false;
let votacaoAberta = false;

const telaBloqueada =
    document.getElementById("telaBloqueada");

const telaVotacao =
    document.getElementById("telaVotacao");

const telaFim =
    document.getElementById("telaFim");

const numeroDigitado =
    document.getElementById("numeroDigitado");

const dadosChapa =
    document.getElementById("dadosChapa");

const nomeChapa =
    document.getElementById("nomeChapa");

const instrucao =
    document.getElementById("instrucao");

const mensagemBranco =
    document.getElementById("mensagemBranco");


function atualizarEstadoUrna() {

    const liberada = DB.urnaLiberada();

    if (
        liberada &&
        !votacaoAberta
    ) {

        votacaoAberta = true;

        iniciarVotacao();
    }
}


function iniciarVotacao() {

    numero = "";
    votoBranco = false;

    telaBloqueada.classList.add("oculto");
    telaFim.classList.add("oculto");

    telaVotacao.classList.remove("oculto");

    atualizarDisplay();
}


function atualizarDisplay() {

    const caixas =
        numeroDigitado.querySelectorAll("span");

    caixas[0].textContent =
        numero[0] || "";

    caixas[1].textContent =
        numero[1] || "";

    mensagemBranco.classList.add("oculto");


    if (votoBranco) {

        numeroDigitado.classList.add("oculto");

        dadosChapa.classList.add("oculto");

        mensagemBranco.classList.remove("oculto");

        instrucao.textContent =
            "Pressione CONFIRMA para confirmar";

        return;
    }


    numeroDigitado.classList.remove("oculto");


    if (numero.length === 2) {

        const chapa =
            DB.encontrarChapa(numero);


        if (chapa) {

            nomeChapa.textContent =
                `${chapa.numero} - ${chapa.nome}`;

            dadosChapa.classList.remove("oculto");

            instrucao.textContent =
                "Pressione CONFIRMA para confirmar";

        } else {

            dadosChapa.classList.add("oculto");

            instrucao.textContent =
                "Número de chapa não cadastrado";
        }

    } else {

        dadosChapa.classList.add("oculto");

        instrucao.textContent =
            "Digite o número da chapa";
    }
}


function digitar(valor) {

    if (!votacaoAberta)
        return;

    if (votoBranco)
        return;

    if (numero.length >= 2)
        return;

    numero += valor;

    atualizarDisplay();

    beep(500, 45);
}


function corrigir() {

    if (!votacaoAberta)
        return;

    numero = "";
    votoBranco = false;

    atualizarDisplay();

    beep(350, 60);
}


function branco() {

    if (!votacaoAberta)
        return;

    numero = "";
    votoBranco = true;

    atualizarDisplay();

    beep(420, 70);
}


function confirmar() {

    if (!votacaoAberta)
        return;


    if (votoBranco) {

        finalizarVoto("BRANCO");

        return;
    }


    if (numero.length !== 2)
        return;


    const chapa =
        DB.encontrarChapa(numero);


    if (!chapa)
        return;


    finalizarVoto(numero);
}


function finalizarVoto(escolha) {

    DB.registrarVoto(escolha);

    DB.bloquearUrna();

    votacaoAberta = false;

    telaVotacao.classList.add("oculto");
    telaBloqueada.classList.add("oculto");

    telaFim.classList.remove("oculto");

    somConfirmacao();


    setTimeout(() => {

        telaFim.classList.add("oculto");

        telaBloqueada.classList.remove("oculto");

    }, 3000);
}


/* BOTÕES NUMÉRICOS */

document
    .querySelectorAll(".numerica")
    .forEach(botao => {

        botao.addEventListener(
            "click",
            () => digitar(botao.dataset.numero)
        );

    });


document
    .getElementById("btnCorrige")
    .addEventListener(
        "click",
        corrigir
    );


document
    .getElementById("btnBranco")
    .addEventListener(
        "click",
        branco
    );


document
    .getElementById("btnConfirma")
    .addEventListener(
        "click",
        confirmar
    );


/* TECLADO FÍSICO */

document.addEventListener(
    "keydown",
    event => {

        if (/^[0-9]$/.test(event.key)) {

            digitar(event.key);

        }

        else if (event.key === "Backspace") {

            corrigir();

        }

        else if (event.key === "Enter") {

            confirmar();
        }
    }
);


/* SONS */

function beep(frequencia, duracao) {

    const audio =
        new AudioContext();

    const oscillator =
        audio.createOscillator();

    const ganho =
        audio.createGain();

    oscillator.frequency.value =
        frequencia;

    oscillator.connect(ganho);

    ganho.connect(
        audio.destination
    );

    oscillator.start();

    ganho.gain.exponentialRampToValueAtTime(
        0.0001,
        audio.currentTime + duracao / 1000
    );

    oscillator.stop(
        audio.currentTime + duracao / 1000
    );
}


function somConfirmacao() {

    beep(620, 100);

    setTimeout(
        () => beep(760, 100),
        120
    );

    setTimeout(
        () => beep(920, 300),
        240
    );
}


/*
Verifica periodicamente se o terminal
do mesário liberou a urna.
*/

setInterval(
    atualizarEstadoUrna,
    500
);

atualizarEstadoUrna();
