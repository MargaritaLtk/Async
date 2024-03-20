'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const render = function (data) {
   const {
      flags: { png: flag },
      name: { common: name },
      region,
      population,
      languages,
      currencies,
   } = data;

   const html = `<article class="country">
  <img class="country__img" src="${flag}" />
  <div class="country__data">
    <h3 class="country__name">${name}</h3>
    <h4 class="country__region">${region}</h4>
    <p class="country__row"><span>👫</span>${(+population / 1000000).toFixed(1)}</p>
    <p class="country__row"><span>🗣️</span>${String(Object.values(languages))}</p>
    <p class="country__row"><span>💰</span>${Object.keys(currencies)}</p>
  </div>
</article>`;
   countriesContainer.insertAdjacentHTML('beforeend', html);
   countriesContainer.style.opacity = 1;
};

// Promisifying the Geolocation API

const whereAmI = function () {
   new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(
         (pos) => resolve(pos),
         (err) => reject(err)
      );
   })
      .then((res) => {
         return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${res.coords.latitude}&longitude=${res.coords.longitude}&localityLanguage=en`);
      })
      .then((response) => {
         if (!response.ok) {
            throw new Error(`Data not found`);
         }
         return response.json();
      })
      .then((data) => {
         const { countryName } = data;
         return fetch(`https://restcountries.com/v3.1/name/${countryName}`);
      })
      .then((response) => {
         return response.json();
      })
      .then((data) => render(data[0]))
      .catch((err) => console.log(err));
};

btn.addEventListener('click', whereAmI);
