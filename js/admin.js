const listaChapas =
    document.getElementById("listaChapas");

const totalVotos =
    document.getElementById("totalVotos");

const resultadoImportacao =
    document.getElementById("resultadoImportacao");

const resultadoApuracao =
    document.getElementById("resultadoApuracao");


function carregarPainel() {

    const chapas =
        DB.obterChapas();

    listaChapas.innerHTML = "";


    chapas.forEach(chapa => {

        const elemento =
            document.createElement("div");

        elemento.className =
            "linha-chapa";

        elemento.textContent =
            `${chapa.numero} - ${chapa.nome}`;

        listaChapas.appendChild(
            elemento
        );
    });


    const votos =
        JSON.parse(
            localStorage.getItem("votos") || "[]"
        );

    totalVotos.textContent =
        votos.length;
}


document
    .getElementById("importarXML")
    .addEventListener(
        "click",
        importarXML
    );


async function importarXML() {

    const input =
        document.getElementById("arquivoXML");

    const arquivo =
        input.files[0];


    if (!arquivo) {

        resultadoImportacao.textContent =
            "Selecione um arquivo XML.";

        return;
    }


    const texto =
        await arquivo.text();

    const parser =
        new DOMParser();

    const xml =
        parser.parseFromString(
            texto,
            "application/xml"
        );


    if (
        xml.querySelector("parsererror")
    ) {

        resultadoImportacao.textContent =
            "O XML selecionado é inválido.";

        return;
    }


    const registros =
        [...xml.querySelectorAll("eleitor")];

    const eleitores = [];


    registros.forEach(registro => {

        const nome =
            registro.querySelector("nome")
                ?.textContent
                ?.trim();

        const ra =
            registro.querySelector("ra")
                ?.textContent
                ?.trim();


        if (!nome || !ra)
            return;


        const duplicado =
            eleitores.some(
                eleitor =>
                    eleitor.ra === ra
            );


        if (duplicado)
            return;


        eleitores.push({
            nome,
            ra,
            votou: false
        });

    });


    localStorage.setItem(
        "eleitores",
        JSON.stringify(eleitores)
    );


    resultadoImportacao.innerHTML =
        `<strong>${eleitores.length}</strong>
         eleitores importados com sucesso.`;
}


document
    .getElementById("apuracao")
    .addEventListener(
        "click",
        () => {

            const votos =
                JSON.parse(
                    localStorage.getItem("votos") || "[]"
                );

            const chapas =
                DB.obterChapas();

            const contagem = {};


            votos.forEach(voto => {

                contagem[voto.escolha] =
                    (contagem[voto.escolha] || 0) + 1;

            });


            resultadoApuracao.innerHTML = "";


            chapas.forEach(chapa => {

                const linha =
                    document.createElement("p");

                linha.innerHTML =
                    `<strong>${chapa.numero} - ${chapa.nome}</strong>:
                     ${contagem[chapa.numero] || 0}`;

                resultadoApuracao.appendChild(
                    linha
                );
            });


            const branco =
                document.createElement("p");

            branco.innerHTML =
                `<strong>Brancos:</strong>
                 ${contagem.BRANCO || 0}`;

            resultadoApuracao.appendChild(
                branco
            );

        }
    );


carregarPainel();
