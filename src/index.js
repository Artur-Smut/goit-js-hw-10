import './css/styles.css';
import debounce from 'lodash.debounce'
import {fetchCountries} from "./fetchcountries";
import Notiflix from "notiflix";

const DEBOUNCE_DELAY = 300;
let getEl = selector=> document.querySelector(selector)

getEl('#search-box').addEventListener('input',debounce(onInputChange,DEBOUNCE_DELAY));

const list = getEl('.country-list')
const card = getEl('.country-info')


function onInputChange(event){
    const country = event.target.value.trim();

    if(!country.length){
        pageClear();
        return;
    }

    fetchCountries(country).then(response=>{
        if(!response.ok){
            throw new Error(response.status)
        }
        return response.json();
    })
        .then(renderList)
        .catch(fetchError);
}

function renderList(countries) {
    // console.log('🚀 ~ countries', countries);
    let markup = '';
    if (countries.length >= 10) {
        pageClear();
        Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
        );

    } else if (countries.length === 1) {
        markup = countries
            .map(
                ({
                     name: { official },
                     flags: { svg },
                     capital,
                     population,
                     languages,
                 }) => {
                    const lang = Object.values(languages);
                    return `<p class="counry-title"><img width="40" height="20" alt="country" src=${svg}> ${official}</p>
        <p class="text">capital: <span class="capital">${capital}</span></p>
        <p class="text">population: <span class="population">${population}</span></p>
        <p class="text">languages: <span class="language">${lang}</span></p>`;
                }
            )
            .join('');
        pageClear();
        card.innerHTML = markup;
    } else {
        markup = countries
            .map(({ name: { official }, flags: { svg } }) => {
                // console.log(el);
                return `<li><img src=${svg} width="40" alt="country" height="20"> ${official}</li>`;
            })
            .join('');
        pageClear();
        list.innerHTML = markup;

    }
}

function fetchError(){
    pageClear();
    Notiflix.Notify.failure('Oops,there is no country with that name')
}

function pageClear(){
    card.innerHTML='';
    list.innerHTML = '';
}