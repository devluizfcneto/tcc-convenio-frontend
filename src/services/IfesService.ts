import http from "./ApiService";

let ifesComparadosMock = [
    {
        nome: "Universidade Federal de Lavras",
        qtdConvenios: 7,
        valorTotalLiberado: 11694907.5,
        listaConvenios: [
            {
                convenente: "fundacao de desenvolvimento cientifico e cultural",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 6725064.00,
                valorTotalContratado: 10214710.00
            },
            {
                convenente: "fundacao de desenvolvimento cientifico e cultural",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 1767192.80,
                valorTotalContratado: 3558847.06
            },
            {
                convenente: "fundacao de desenvolvimento cientifico e cultural",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 1530000.00,
                valorTotalContratado: 2760000.00
            },
            {
                convenente: "fundacao de desenvolvimento cientifico e cultural",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 1140000.00,
                valorTotalContratado: 1390000.00
            },
            {
                convenente: "fundacao de desenvolvimento cientifico e cultural",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 357500.00,
                valorTotalContratado: 357500.00
            },
            {
                convenente: "fundacao de desenvolvimento cientifico e cultural",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 90000.00,
                valorTotalContratado: 90000.00
            },
            {
                convenente: "fundacao de desenvolvimento cientifico e cultural",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 85150.70,
                valorTotalContratado: 143552.88
            },
        ]
    },
    {
        nome: "Fundação Universidade do Amazonas",
        qtdConvenios: 18,
        valorTotalLiberado: 21712224.27,
        listaConvenios: [
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 4999120.00,
                valorTotalContratado: 4999120.00
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 3947025.00,
                valorTotalContratado: 5262700.00
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 3216213.72,
                valorTotalContratado: 6700445.26
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 2345437.00,
                valorTotalContratado: 8268017.00
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 1250268.13,
                valorTotalContratado: 1250268.13
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 1022869.72,
                valorTotalContratado: 1022869.72
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 1000000.00,
                valorTotalContratado: 1000000.00
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 688362.41,
                valorTotalContratado: 688362.41
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 582454.03,
                valorTotalContratado: 1240043.14
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 500000.00,
                valorTotalContratado: 500000.00
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 499740.80,
                valorTotalContratado: 499740.80
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 485357.50,
                valorTotalContratado: 813050.00
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 318607.71,
                valorTotalContratado: 318607.71
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 284728.25,
                valorTotalContratado: 1134659.91
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 262200.00,
                valorTotalContratado: 1230500.00
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 170000.00,
                valorTotalContratado: 243000.00
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 160000.00,
                valorTotalContratado: 160000.00
            },
            {
                convenente: "fundacao de apoio ao ensino, pesquisa, extensao e interiorizacao do ifam",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 149840.00,
                valorTotalContratado: 149840.00
            }
        ]
    },
    {
        nome: "Universidade Federal de Ouro Preto",
        qtdConvenios: 5,
        valorTotalLiberado: 4969468.86,
        listaConvenios: [
            {
                convenente: "fundacao de educacao, artes e cultura - fundac",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 3584332.39,
                valorTotalContratado: 12000000.00
            },
            {
                convenente: "fundacao de educacao, artes e cultura - fundac",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 814236.47,
                valorTotalContratado: 814236.47
            },
            {
                convenente: "irmandade da santa casa da misericordia de ouro preto",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 337500.00,
                valorTotalContratado: 4200000.00
            },
            {
                convenente: "sociedade beneficente sao camilo",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 120000.00,
                valorTotalContratado: 1620000.00
            },
            {
                convenente: "associacao sao vicente de paulo de joao monlevade - mg",
                tipoConvenente: "entidades sem fins lucrativos",
                valorLiberado: 113400.00,
                valorTotalContratado: 342000.00
            },
        ]
    }
]

export default class IfesService {
    async getAllIfes(): Promise<any> {
        try {
            const response = await http.get("/api/ifes");
            return response.data.allIfes;
        } catch (error: any) {
            console.log(error.name, error.message);
            // throw new Error(`${error.name} - ${error.message}`);
            throw new Error(`Ocorreu um erro ao consultarmos o Servidor. Tente novamente mais tarde!`);
        }
    }

    async compareIfesConvenios(request: any): Promise<any> {
        console.log(request);
        try {
            const response = await http.post(`/api/ifes/compare/convenios?dataInicio=${request.queryParam.startYear}&dataFim=${request.queryParam.endYear}`,
                {
                    ifesSelected: request.body.ifesSelected
                }
            );
            return response.data.comparacaoIfesConveniosResponse;
        } catch (error: any) {
            console.log(error.name, error.message);
            throw new Error(error.message);
        }
    }
}