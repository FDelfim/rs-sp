export default async function fetchJson(url){
    const response = await fetch(url);
    if (response.status !== 200) {
        throw new Error(`Erro na requisição: ${response.status}`);
    }
    return response.json();
};