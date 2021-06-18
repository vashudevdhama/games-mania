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
        return data;
    } else{
        console.error("ERROR: ", result.status);
    }
}

function processFetchedData(data){
    data.shift(); // TO remove API limit array element.
    renderData(data);

    //Render filter attribute options.
    const platform_filter = document.getElementById('platform_filter');
    renderAttributeOptions(getAllPlatforms(data), platform_filter);
    
    const genre_filter = document.getElementById('genre_filter');
    renderAttributeOptions(getAllGenre(data), genre_filter);

    //Apply event listener to Filters.
    const filters = document.getElementById('filters');
    filters.addEventListener('change', (e) => {
        onSelectHandler(e, data);
    })

    const searchBar = document.getElementById('game_search');
    searchBar.addEventListener('keyup', (e) => {
        const searchString = e.target.value;
        if(searchString && searchString !== ''){
            renderData(searchGameByName(searchString, data));
        } else{
            renderData(data);
        }
    })
}

function renderData(data){
    gamesContainer.innerHTML = '';
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

function filterByAttribute(data, inputAttribute, attributeValue){
    if(attributeValue === 'all') return data;

    let filteredData;
    
    if(inputAttribute === 'score'){
        filteredData = data.filter(d => d[inputAttribute] >= attributeValue);
    } else{
        filteredData = data.filter(d => d[inputAttribute] === attributeValue);
    }
    return filteredData;
}

function getAllPlatforms(gameArr){
    const platforms = [...new Set(gameArr.map(game => game.platform))]
    return platforms;
}

function getAllGenre(gameArr){
    const genre = [...new Set(gameArr.map(game => {
        if(game.genre.indexOf(',') !== -1){
            return game.genre.substring(0, game.genre.indexOf(','));
        }
        else if(game.genre){
            return game.genre;
        } else{
            return 'No Genre';
        }
    }))]
    return genre;
}

function renderAttributeOptions(attributes, attribute_filter){
    attributes.map(attribute => {
        const option = document.createElement('option');
        option.setAttribute('value', `${attribute}`);
        option.innerText = `${attribute.charAt(0).toUpperCase() + attribute.slice(1)}`
        attribute_filter.appendChild(option);
    })
}

function onSelectHandler(e, data){
    const id = e.target.id;
    const filterAttribute = id.substring(0, id.indexOf('_'))
    const selectedValue = document.getElementById(id).value;
    renderData(filterByAttribute(data, filterAttribute, selectedValue))
}

function searchGameByName(name, gameData){
    name = name.toLowerCase();

    const filteredData = []
    gameData.map(game => {
        const gameTitle = game.title.toLowerCase()
        if(gameTitle.includes(name)) {
            filteredData.push(game)
        };
    })
    return filteredData;
}


//TODO pagination
//TODO combine filters

(async function(){
    const data = await fetchData(API_URL); 
    processFetchedData(data);
})();