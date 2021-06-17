const API_URL = 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/gamesarena274f2bf.json';

const gamesContainer = document.getElementById('games_container');

const nest = async(promise) => {
    try{
        const result = await promise;
        return [result, null]
    } catch(err){
        return [null, err]
    }
}

async function fetchData(url){
    const [result, err] = await nest(fetch(url));
    
    if(err){
        console.error("ERROR: ", err);
    } else if(result.ok){
        const data = await result.json();
        renderData(data);
    } else{
        console.error("ERROR: ", result.status);
    }
}

function renderData(data){
    console.log(data);
}

fetchData(API_URL);