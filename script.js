'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const renderCountry = function (data) {
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
      .then((data) => renderCountry(data[0]))
      .catch((err) => console.log(err));
};

btn.addEventListener('click', whereAmI);

// Task 2

const imgContainer = document.querySelector('.images');

const wait = function (seconds) {
   return new Promise(function (resolve) {
      setTimeout(resolve, seconds * 1000);
   });
};

const createImage = function (imgPath) {
   return new Promise(function (resolve, reject) {
      const img = document.createElement('img');
      img.src = imgPath;

      img.addEventListener('error', function () {
         reject(new Error('Image not found'));
      });

      img.addEventListener('load', function () {
         imgContainer.append(img);
         console.log(`${img} loaded`);

         resolve(img);
      });
   });
};

let currentImg;

// createImage('/img/img-1.jpg')
//    .then((img) => {
//       currentImg = img;
//       return wait(2);
//    })
//    .then(() => {
//       currentImg.style.display = 'none';
//       return createImage('/img/img-2.jpg');
//    })
//    .then((img) => {
//       currentImg = img;
//       return wait(2);
//    })
//    .then(() => (currentImg.style.display = 'none'))
//    .catch((err) => console.error(err));

// --------------------//

const loadNPause = async function () {
   try {
      let img = await createImage('/img/img-1.jpg');
      await wait(2);
      img.style.display = 'none';
      img = await createImage('/img/img-2.jpg');
      await wait(2);
      img.style.display = 'none';
   } catch (err) {
      console.log(err);
   }
};

// loadNPause();

const getPosition = function () {
   return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
   });
};

const whereAmI2 = async function () {
   try {
      const pos = await getPosition();
      const { latitude: lat, longitude: lng } = pos.coords;
      const resGeo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
      if (!resGeo.ok) throw new Error('Problem getting location data');
      const dataGeo = await resGeo.json();
      const resCountry = await fetch(`https://restcountries.com/v3.1/name/${dataGeo.countryName}`);
      if (!resCountry.ok) throw new Error('Problem getting country information');
      const dataCountry = await resCountry.json();
      renderCountry(dataCountry[0]);

      return `You are in ${dataGeo.countryName}`;
   } catch (err) {
      console.log(err.message);
      // rethrowing err
      throw err;
   }
};

// // 1 way of Returning Values from Async Functions
whereAmI2()
   .then(console.log)
   .catch((err) => console.log(`2: ${err.message}`));
// 2 way Returning Values from Async Functions
(async function () {
   try {
      const city = await whereAmI2();
      console.log(city);
   } catch (err) {
      console.log(`2: ${err.message}`);
   }
})();

const getJSON = function (url, errorMsg = 'Something went wrong') {
   return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

      return response.json();
   });
};

const get3Countries = async function (c1, c2, c3) {
   try {
      const data = await Promise.all([getJSON(`https://restcountries.com/v3.1/name/${c1}`), getJSON(`https://restcountries.com/v3.1/name/${c2}`), getJSON(`https://restcountries.com/v3.1/name/${c3}`)]);
      console.log(data);
   } catch (err) {
      console.log(err);
   }
};

// get3Countries('portugal', 'canada', 'belarus');

const loadAll = async function (imgArr) {
   try {
      const imgs = imgArr.map(async (img) => await createImage(img));
      const imgsEL = await Promise.all(imgs);
      imgsEL.forEach((img) => img.classList.add('parallel'));
   } catch (err) {
      console.log(err);
   }
};

// loadAll(['/img/img-1.jpg', '/img/img-2.jpg', '/img/img-3.jpg']);
