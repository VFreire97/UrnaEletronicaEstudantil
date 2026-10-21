const DB = {

    inicializar() {

        if (!localStorage.getItem("chapas")) {

            const chapas = [
                {
                    numero: "12",
                    nome: "Chapa Renovação"
                },

                {
                    numero: "23",
                    nome: "Chapa União"
                },

                {
                    numero: "45",
                    nome: "Chapa Futuro"
                }
            ];

            localStorage.setItem(
                "chapas",
                JSON.stringify(chapas)
            );
        }

        if (!localStorage.getItem("eleitores")) {

            localStorage.setItem(
                "eleitores",
                JSON.stringify([])
            );
        }

        if (!localStorage.getItem("votos")) {

            localStorage.setItem(
                "votos",
                JSON.stringify([])
            );
        }

        if (!localStorage.getItem("urnaLiberada")) {

            localStorage.setItem(
                "urnaLiberada",
                "false"
            );
        }
    },


    obterChapas() {

        return JSON.parse(
            localStorage.getItem("chapas") || "[]"
        );
    },


    encontrarChapa(numero) {

        return this.obterChapas().find(
            chapa => chapa.numero === numero
        );
    },


    urnaLiberada() {

        return localStorage.getItem(
            "urnaLiberada"
        ) === "true";
    },


    liberarUrna(ra) {

        localStorage.setItem(
            "urnaLiberada",
            "true"
        );

        localStorage.setItem(
            "eleitorAtual",
            ra
        );
    },


    bloquearUrna() {

        localStorage.setItem(
            "urnaLiberada",
            "false"
        );

        localStorage.removeItem(
            "eleitorAtual"
        );
    },


    registrarVoto(voto) {

        const votos =
            JSON.parse(
                localStorage.getItem("votos") || "[]"
            );

        /*
        IMPORTANTE:
        voto contém APENAS a escolha.

        Não armazenamos RA junto ao voto.
        */

        votos.push({
            id: crypto.randomUUID(),
            escolha: voto,
            registradoEm: new Date().toISOString()
        });

        localStorage.setItem(
            "votos",
            JSON.stringify(votos)
        );
    }

};

DB.inicializar();
