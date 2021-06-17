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
        data.shift(); //To remove api limit array element
        renderData(data);
    } else{
        console.error("ERROR: ", result.status);
    }
}

function renderData(data){
    data.map(game => {
        const gameCard = createGameCard(game);
        gamesContainer.appendChild(gameCard);
    })
}

function createGameCard(gameObj){
    const {title, score, platform, genre, editors_choice} = gameObj;
    const gameCard = document.createElement('div');
    gameCard.className = 'game_card';
    gameCard.innerHTML = `
        <div class="game_card_head">
            <h2>${title}</h2>
            <div class="rating">${score}</div>
        </div>
        <div class="game_card_details">
            <div><span class="head_key">Platform:</span> ${platform}</div>
            <div><span class="head_key">Genre:</span> ${genre}</div>
            ${editors_choice === 'Y'? 
                `<div class="ribbon">
                    <img src="./assets/editors_choice.png" alt="editor choice">
                </div>` : 
                ''
            }
        </div>
    `

    return gameCard;
}

fetchData(API_URL);