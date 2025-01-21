import http from "./ApiService";

const mockAllConvenios = [
    {
        "id": 1,
        "detailUrl": "https://portaldatransparencia.gov.br/convenios/952450",
        "ifesCode": "26269",
        "number": "952450",
        "description": "O objeto deste Plano de trabalho e a estruturacao de uma metodologia ativa, baseada em principios de participacao cidada emancipadora, como modelo experimental no compartilhamento de saberes academicos, tecnicos e tradicionais para elaboracao do plano museologico. Por sua vez, o objetivo geral caracteriza-se como desenvolver, em conjunto com o museu e as instancias de representacao indigena, uma proposta de diretrize",
        "origin": "Universidade Federal do Estado do Rio de Janeiro",
        "totalValueReleased": 175991.68,
        "destination": "fundacao coordenacao de projetos,pesquisas e estudos tecnologicos coppetec",
        "destinationType": "entidades sem fins lucrativos",
        "destinationDetailUrl": "https://portaldatransparencia.gov.br/convenios/952450/pessoa-juridica/72060999000175-fundacao-coordenacao-de-projetos-pesquisas-e-estudos-tecnologicos-coppetec",
        "startEffectiveDate": "2023-12-18",
        "endEffectiveDate": "2024-10-14",
        "lastReleaseDate": "2024-02-01",
        "valueLastRelease": 175991.68,
        "totalValue": 175991.68
    },
    {
        "id": 2,
        "detailUrl": "https://portaldatransparencia.gov.br/convenios/953783",
        "ifesCode": "26269",
        "number": "953783",
        "description": "Desenvolver acoes para o fortalecimento da PNAE",
        "origin": "Universidade Federal do Estado do Rio de Janeiro",
        "totalValueReleased": 498801.48,
        "destination": "centro de estudos, pesquisa e desenvolvimento tecnologico em saude coletiva",
        "destinationType": "entidades sem fins lucrativos",
        "destinationDetailUrl": "https://portaldatransparencia.gov.br/convenios/953783/pessoa-juridica/31104896000182-centro-de-estudos-pesquisa-e-desenvolvimento-tecnologico-em-saude-coletiva",
        "startEffectiveDate": "2024-02-01",
        "endEffectiveDate": "2026-02-01",
        "lastReleaseDate": "2024-04-28",
        "valueLastRelease": 498801.48,
        "totalValue": 1049232.88
    },
    {
        "id": 3,
        "detailUrl": "https://portaldatransparencia.gov.br/convenios/952452",
        "ifesCode": "26269",
        "number": "952452",
        "description": "Documentacao de bens culturais populares e compartilhamento de saberes: uma proposta articulada para acervos)",
        "origin": "Universidade Federal do Estado do Rio de Janeiro",
        "totalValueReleased": 1840690.34,
        "destination": "fundacao coordenacao de projetos,pesquisas e estudos tecnologicos coppetec",
        "destinationType": "entidades sem fins lucrativos",
        "destinationDetailUrl": "https://portaldatransparencia.gov.br/convenios/952452/pessoa-juridica/72060999000175-fundacao-coordenacao-de-projetos-pesquisas-e-estudos-tecnologicos-coppetec",
        "startEffectiveDate": "2023-12-18",
        "endEffectiveDate": "2025-12-18",
        "lastReleaseDate": "2024-01-01",
        "valueLastRelease": 1840690.34,
        "totalValue": 1840690.34
    },
    {
        "id": 4,
        "detailUrl": "https://portaldatransparencia.gov.br/convenios/941762",
        "ifesCode": "26269",
        "number": "941762",
        "description": "Implementacao do projeto EXITO RJ, no Estado do Rio de Janeiro, com 04 polos de capacitacao, inclusao, aperfeicoamento e qualificacao de profissionais para atuacao em projetos, empreendedorismo e geracao de renda nas areas de atuacao vinculadas a legislacao federal, com implantacao de banco de dados por area especifica.",
        "origin": "Universidade Federal do Estado do Rio de Janeiro",
        "totalValueReleased": 2652448,
        "destination": "instituto realizando o futuro",
        "destinationType": "entidades sem fins lucrativos",
        "destinationDetailUrl": "https://portaldatransparencia.gov.br/convenios/941762/pessoa-juridica/13164086000130-instituto-realizando-o-futuro",
        "startEffectiveDate": "2023-11-20",
        "endEffectiveDate": "2025-02-20",
        "lastReleaseDate": "2024-03-19",
        "valueLastRelease": 2652448,
        "totalValue": 2652448
    },
    {
        "id": 5,
        "detailUrl": "https://portaldatransparencia.gov.br/convenios/952451",
        "ifesCode": "26269",
        "number": "952451",
        "description": "Respeito meu terreiro: Racismoreligioso contra os povos tradicionais de religioesde matriz africana no Brasil",
        "origin": "Universidade Federal do Estado do Rio de Janeiro",
        "totalValueReleased": 133100,
        "destination": "fundacao coordenacao de projetos,pesquisas e estudos tecnologicos coppetec",
        "destinationType": "entidades sem fins lucrativos",
        "destinationDetailUrl": "https://portaldatransparencia.gov.br/convenios/952451/pessoa-juridica/72060999000175-fundacao-coordenacao-de-projetos-pesquisas-e-estudos-tecnologicos-coppetec",
        "startEffectiveDate": "2023-12-28",
        "endEffectiveDate": "2025-03-28",
        "lastReleaseDate": "2024-04-14",
        "valueLastRelease": 133100,
        "totalValue": 133100
    },
    {
        "id": 6,
        "detailUrl": "https://portaldatransparencia.gov.br/convenios/952389",
        "ifesCode": "26269",
        "number": "952389",
        "description": "Realizacao de Conferencias Tematicas no ambito da 4a Conferencia Nacional de Cultura/CNC.",
        "origin": "Universidade Federal do Estado do Rio de Janeiro",
        "totalValueReleased": 1500000,
        "destination": "promacom-projeto mais comunidade",
        "destinationType": "entidades sem fins lucrativos",
        "destinationDetailUrl": "https://portaldatransparencia.gov.br/convenios/952389/pessoa-juridica/23040307000111-promacom-projeto-mais-comunidade",
        "startEffectiveDate": "2023-12-18",
        "endEffectiveDate": "2024-12-18",
        "lastReleaseDate": "2024-08-27",
        "valueLastRelease": 100000,
        "totalValue": 1500000
    },
    {
        "id": 7,
        "detailUrl": "https://portaldatransparencia.gov.br/convenios/941752",
        "ifesCode": "26269",
        "number": "941752",
        "description": "Nova Iguacu esta localizada na Regiao Metropolitana do Rio de Janeiro, e esta no centro da Baixada Fluminense,  cortada pela Rodovia Presidente Dutra que liga os Centros Urbanos do Rio e Sao Paulo. Esta localizada proxima aos principais portos, aeroportos, ferrovias de cargas e rodovias nacionais. Sua posicao geografica permite que muitos de seus trabalhadores exercam suas funcoes em cidades vizinhas, e vice e versa,",
        "origin": "Universidade Federal do Estado do Rio de Janeiro",
        "totalValueReleased": 4465149,
        "destination": "promacom-projeto mais comunidade",
        "destinationType": "entidades sem fins lucrativos",
        "destinationDetailUrl": "https://portaldatransparencia.gov.br/convenios/941752/pessoa-juridica/23040307000111-promacom-projeto-mais-comunidade",
        "startEffectiveDate": "2023-09-05",
        "endEffectiveDate": "2024-12-30",
        "lastReleaseDate": "2023-10-25",
        "valueLastRelease": 4465149,
        "totalValue": 4465149
    },
    {
        "id": 8,
        "detailUrl": "https://portaldatransparencia.gov.br/convenios/945175",
        "ifesCode": "26269",
        "number": "945175",
        "description": "Implementacao do PROJETO ATUA+ACAO RIO, com enfase na Regiao Noroeste Fluminense no Estado do Rio de Janeiro, sendo 23 polos de capacitacao, inclusao, aperfeicoamento e qualificacao de profissionais para atuacao em inciativas sociais no ambito do empreendedorismo e geracao de renda. Estas areas de atuacao estao vinculadas a legislacao federal, com implantacao de banco de dados por area especifica de atuacao.",
        "origin": "Universidade Federal do Estado do Rio de Janeiro",
        "totalValueReleased": 5800000,
        "destination": "instituto carioca de atividades - ica",
        "destinationType": "entidades sem fins lucrativos",
        "destinationDetailUrl": "https://portaldatransparencia.gov.br/convenios/945175/pessoa-juridica/01953247000195-instituto-carioca-de-atividades-ica",
        "startEffectiveDate": "2023-11-15",
        "endEffectiveDate": "2024-11-15",
        "lastReleaseDate": "2023-12-17",
        "valueLastRelease": 5800000,
        "totalValue": 5800000
    },
    {
        "id": 9,
        "detailUrl": "https://portaldatransparencia.gov.br/convenios/945199",
        "ifesCode": "26269",
        "number": "945199",
        "description": "Implementacao do PROJETO HABILITA RJ no Estado do Rio de Janeiro, com enfase nas Regioes Metropolitana, Centro Sul-Fluminense e Baixadas Litoraneas, com 10 polos de capacitacao, inclusao, aperfeicoamento e qualificacao de profissionais para atuacao em projetos, empreendedorismo e geracao de renda nas areas de atuacao vinculadas a legislacao federal, com implantacao de banco de dados por area especifica.",
        "origin": "Universidade Federal do Estado do Rio de Janeiro",
        "totalValueReleased": 4300000,
        "destination": "ong con-tato centro de pesquisas e de acoes sociais e culturais",
        "destinationType": "entidades sem fins lucrativos",
        "destinationDetailUrl": "https://portaldatransparencia.gov.br/convenios/945199/pessoa-juridica/03686998000118-ong-con-tato-centro-de-pesquisas-e-de-acoes-sociais-e-culturais",
        "startEffectiveDate": "2023-11-09",
        "endEffectiveDate": "2024-11-09",
        "lastReleaseDate": "2023-12-17",
        "valueLastRelease": 4300000,
        "totalValue": 4300000
    },
    {
        "id": 10,
        "detailUrl": "https://portaldatransparencia.gov.br/convenios/941761",
        "ifesCode": "26269",
        "number": "941761",
        "description": "Fomentar e democratizar o acesso a pratica esportiva e de lazer, com carater formativo educacional, atraves de polos dirigidos a criancas, adolescentes, adultos e idosos em situacao de risco social, com vistas a garantir o direito constitucional previsto no artigo 217 da Constituicao Federal de 1988.",
        "origin": "Universidade Federal do Estado do Rio de Janeiro",
        "totalValueReleased": 8960651,
        "destination": "ong con-tato centro de pesquisas e de acoes sociais e culturais",
        "destinationType": "entidades sem fins lucrativos",
        "destinationDetailUrl": "https://portaldatransparencia.gov.br/convenios/941761/pessoa-juridica/03686998000118-ong-con-tato-centro-de-pesquisas-e-de-acoes-sociais-e-culturais",
        "startEffectiveDate": "2023-09-05",
        "endEffectiveDate": "2024-12-05",
        "lastReleaseDate": "2023-10-25",
        "valueLastRelease": 8960651,
        "totalValue": 8960651
    },
    {
        "id": 11,
        "detailUrl": "https://portaldatransparencia.gov.br/convenios/941757",
        "ifesCode": "26269",
        "number": "941757",
        "description": "Desenvolvimento e otimizacao dos processos economico e cientifico, baseado no aprimoramento das tecnicas e investimento de controle e prevencao sanitario-ambientais na protecao de animais e suas vertentes, capacitacao e estabelecimento das condicoes de bem-estar do trabalhador e respectivo atendimento a legislacao e recomendacoes nacionais e internacionais no Rio de Janeiro.",
        "origin": "Universidade Federal do Estado do Rio de Janeiro",
        "totalValueReleased": 1629209,
        "destination": "instituto carioca de atividades - ica",
        "destinationType": "entidades sem fins lucrativos",
        "destinationDetailUrl": "https://portaldatransparencia.gov.br/convenios/941757/pessoa-juridica/01953247000195-instituto-carioca-de-atividades-ica",
        "startEffectiveDate": "2023-09-20",
        "endEffectiveDate": "2024-10-30",
        "lastReleaseDate": "2023-10-25",
        "valueLastRelease": 1629209,
        "totalValue": 1629209
    }
];

export default class ConvenioService {
    async getAllConvenios(): Promise<any> {
        try {
            const response = await http.get("/api/convenios");
            return response.data;
        } catch (error: any) {
            console.log(error.name, error.message);
            // throw new Error(`${error.name} - ${error.message}`);
            throw new Error(`Ocorreu um erro ao consultarmos o Servidor. Tente novamente mais tarde!`);
        }
    }
}