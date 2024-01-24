import { dimensionsSumsUnique, getQuestionnaire } from "../../Controllers/ProfileController";

const dimensions = ['spirituality', 'sportExperiences', 'familySocialSupport', 'personalResources', 'sportSocialSupport'];

const formatData = async (data) => {  
    const {questionnaire, questionnaireName} = await getQuestionnaire('1');
    let formatted = [];

    data.forEach(data => {
        data.answers.forEach(answer => {
            const medias = dimensionsSumsUnique(dimensions, answer, questionnaire);
            formatted.push({
                user_id: data.user.userId,
                nome: data.user.name,
                termos: data.user.terms ? 'ACEITOU' : 'NAO ACEITOU',
                naturalidade: data.user.birthCity,
                data_de_nascimento: data.user.birthDate ? new Date(data.user.birthDate.seconds * 1000).toLocaleDateString() : '',
                atleta: data.user.isAthlete ? 'SIM' : 'NAO',
                tempo_de_pratica: data.user.timePratice ?? '-',
                nivel_do_atleta: data.user.athleteLevel ?? '-',
                nivel_competitivo: data.user.competitiveLevel ?? '-',
                data_da_resposta: answer.created_at ? new Date(answer.created_at.seconds * 1000).toLocaleDateString() : 'Não encontrada',
                pergunta_1: answer.question_1,
                pergunta_2: answer.question_2,
                pergunta_3: answer.question_3,
                pergunta_4: answer.question_4,
                pergunta_5: answer.question_5,
                pergunta_6: answer.question_6,
                pergunta_7: answer.question_7,
                pergunta_8: answer.question_8,
                pergunta_9: answer.question_9,
                pergunta_10: answer.question_10,
                pergunta_11: answer.question_11,
                pergunta_12: answer.question_12,
                pergunta_13: answer.question_13,
                pergunta_14: answer.question_14,
                pergunta_15: answer.question_15,
                media_esperiencias_esportivas: medias.sportExperiences,
                media_espirutualidade: medias.spirituality,
                media_apoio_social_familiar: medias.familySocialSupport,
                media_recursos_pessoais: medias.personalResources,
                media_apoio_social_esportivo: medias.sportSocialSupport,
                total: medias.total,
            });
        });
    });

    return {formatted, questionnaireName}
}

export const txt = async (data) => {
    const {formatted, questionnaireName} = await formatData(data);
    return {formatted, questionnaireName};
}

export const csv = async (data) => {
    const {formatted, questionnaireName} = await formatData(data);
    return {formatted, questionnaireName};
}


export const excel = async (data) => {

    const {formatted, questionnaireName} = await formatData(data);
        
    let sheet = [{
        sheet: 'Respostas',
        columns: [
            { label: 'ID do Usuário', value: 'user_id' },
            { label: 'Nome', value: 'nome' },
            { label: 'Termos', value: 'termos' },
            { label: 'Naturalidade', value: 'naturalidade' },
            { label: 'Data de nascimento', value: 'data_de_nascimento' },
            { label: 'Atleta', value: 'atleta' },
            { label: 'Tempo de prática', value: 'tempo_de_pratica' },
            { label: 'Nível do atleta', value: 'nivel_do_atleta' },
            { label: 'Nível competitivo', value: 'nivel_competitivo' },
            { label: 'Data da resposta', value: 'data_da_resposta' },
            { label: 'Pergunta 1', value: 'pergunta_1' },
            { label: 'Pergunta 2', value: 'pergunta_2' },
            { label: 'Pergunta 3', value: 'pergunta_3' },
            { label: 'Pergunta 4', value: 'pergunta_4' },
            { label: 'Pergunta 5', value: 'pergunta_5' },
            { label: 'Pergunta 6', value: 'pergunta_6' },
            { label: 'Pergunta 7', value: 'pergunta_7' },
            { label: 'Pergunta 8', value: 'pergunta_8' },
            { label: 'Pergunta 9', value: 'pergunta_9' },
            { label: 'Pergunta 10', value: 'pergunta_10' },
            { label: 'Pergunta 11', value: 'pergunta_11' },
            { label: 'Pergunta 12', value: 'pergunta_12' },
            { label: 'Pergunta 13', value: 'pergunta_13' },
            { label: 'Pergunta 14', value: 'pergunta_14' },
            { label: 'Pergunta 15', value: 'pergunta_15' },
            { label: 'Média experiências esportivas', value: 'media_esperiencias_esportivas' },
            { label: 'Média espirutualidade', value: 'media_espirutualidade' },
            { label: 'Média apoio social familiar', value: 'media_apoio_social_familiar' },
            { label: 'Média recursos pessoais', value: 'media_recursos_pessoais' },
            { label: 'Média apoio social esportivo', value: 'media_apoio_social_esportivo' },
            { label: 'Total', value: 'total' },
        ],
            content: formatted,
    }];
    
    const settings = {
        fileName: ('Relatório de respostas - ' + questionnaireName),
    }

    return {sheet, settings};
}