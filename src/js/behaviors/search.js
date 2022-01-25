// make sure the page is loaded before firing any event
document.addEventListener('readystatechange', function(event) {
    if(event.target.readyState === 'complete') searchAnime();
});

// delays the execution of a function used as argument
const debounce = (fn, delay = 1500) => {
    let id;
    return function(...args) {

        if (id) clearTimeout(id);

        id = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

// build the url
const buildRequestURL = (url, keyword) => `${ url }/search/anime?q=${ keyword }&page=1`;

// renders the page base from the result got from the API
const renderResults = (animeList) => {
    const container = document.querySelector('[data-js-anime-section]');
    container.innerHTML = '';

    const animeTypes = animeList
        .reduce((accumulator, anime) => {
            const { type } = anime;
            if(accumulator[type] === undefined) accumulator[type] = [];

            accumulator[type].push(anime);
            return accumulator;
        }, {});

    Object.keys(animeTypes).map(key => {
        const animes = animeTypes[key]
        .sort(( a, b ) => a.episodes - b.episodes )
        .map(anime => {
            return `
            <div class="anime-card">
                <div class="imagebox">
                    <img src="${ anime.image_url }" alt="" class="image">
                </div>
            </div>
            `;
        
        }).join('');

        const typeSection = `
            <div class="category-section">
                <div class="headerbox">
                    <h3>${ key.toUpperCase() }</h3>
                    <div class="linebar"></div>
                </div>
                <div class="anime-list">${ animes }</div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', typeSection);
    }).join('');
};

// get the data from the fetch API
const getData = async (url) => {
    try {
        const response = await fetch(url);

        if(!response.ok) throw new Error(`Failed to fetch posts: ${ response.status }`);
        const data = await response.json();

        renderResults(data.results); // [4]
    }
    catch(error) {
        renderResults([]);
    }
};

const startSearch = async (url, keyword) => {
    const requestURL = buildRequestURL(url, keyword); // [2]
    await getData(requestURL); // [3]
};

const searchAnime = () => {
    const baseURL = 'https://api.jikan.moe/v3';
    const searchbar = document.querySelector('[data-js-search]');

    searchbar.addEventListener('keyup', debounce((event) => {
        if (event.target.value.trim().length === 0) return;
        startSearch(baseURL, event.target.value); // [1]
    }));
};