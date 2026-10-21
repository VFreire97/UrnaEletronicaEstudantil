const inputRA =
    document.getElementById("ra");

const resultado =
    document.getElementById("resultadoEleitor");

const nomeEleitor =
    document.getElementById("nomeEleitor");

const raEleitor =
    document.getElementById("raEleitor");

const situacao =
    document.getElementById("situacaoEleitor");

const liberar =
    document.getElementById("liberar");


let eleitorSelecionado = null;


document
    .getElementById("consultar")
    .addEventListener(
        "click",
        consultarEleitor
    );


function consultarEleitor() {

    const ra =
        inputRA.value.trim();

    const eleitores =
        JSON.parse(
            localStorage.getItem("eleitores") || "[]"
        );

    const eleitor =
        eleitores.find(
            item => String(item.ra) === ra
        );


    resultado.classList.remove("oculto");


    if (!eleitor) {

        eleitorSelecionado = null;

        nomeEleitor.textContent =
            "Eleitor não encontrado";

        raEleitor.textContent = ra;

        situacao.textContent =
            "RA não cadastrado.";

        liberar.classList.add("oculto");

        return;
    }


    eleitorSelecionado = eleitor;

    nomeEleitor.textContent =
        eleitor.nome;

    raEleitor.textContent =
        eleitor.ra;


    if (eleitor.votou) {

        situacao.textContent =
            "VOTO JÁ REGISTRADO";

        situacao.className =
            "status-erro";

        liberar.classList.add("oculto");

    } else {

        situacao.textContent =
            "ELEITOR APTO A VOTAR";

        situacao.className =
            "status-ok";

        liberar.classList.remove("oculto");
    }
}


liberar.addEventListener(
    "click",
    () => {

        if (!eleitorSelecionado)
            return;

        DB.liberarUrna(
            eleitorSelecionado.ra
        );


        /*
        Na versão definitiva esta alteração
        ocorrerá somente depois que o voto
        tiver sido efetivamente registrado.
        */

        const eleitores =
            JSON.parse(
                localStorage.getItem("eleitores") || "[]"
            );

        const eleitor =
            eleitores.find(
                item =>
                    String(item.ra) ===
                    String(eleitorSelecionado.ra)
            );

        eleitor.votou = true;

        localStorage.setItem(
            "eleitores",
            JSON.stringify(eleitores)
        );


        situacao.textContent =
            "URNA LIBERADA";

        situacao.className =
            "status-ok";

        liberar.classList.add("oculto");

    }
);
