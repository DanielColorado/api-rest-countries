const myHeaders = new Headers();
myHeaders.append(
    "Cookie",
    "__cfduid=d2c68ea49d528aae99328c3ea19b81acc1605416641"
);

const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
};

let search_by_country = (country) => {
    return new Promise((resolve, reject) => {
        fetch(`https://restcountries.eu/rest/v2/name/${country}`, requestOptions)
            .then((response) => response.json())
            .then((result) => resolve(result))
            .catch((error) => reject("error", error));
    });
};

let search_borders = borders => {
    return new Promise((resolve, reject) => {
        fetch(`https://restcountries.eu/rest/v2/alpha?codes=${borders.join(';')}`, requestOptions)
            .then((response) => response.json())
            .then((result) => resolve(result))
            .catch((error) => reject("error", error));
    });
};

let urlParam = name => {
    let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results == null ? undefined : results[1] || 0;
};

let render_country = (country, borders) => {
    return `
    <img src="${country.flag}" alt="${country.name}">
    <div>
        <h2 class="titulo">${country.name}</h2>
        <div class="l-columns-2">
            <div class="container-info">
                <span><b>Native Name:</b> ${country.nativeName}</span>
                <span><b>Population:</b> ${country.population}</span>
                <span><b>Region:</b> ${country.region}</span>
                <span><b>Sub Region:</b> ${country.subregion}</span>
                <span><b>Capital:</b> ${country.capital}</span>
            </div>
            <div class="container-info">
                <span><b>Top Level Domain:</b> ${country.topLevelDomain.join(',')}</span>
                <span><b>Currencies:</b> ${country.currencies.map(el => el.name).join(',')}</span>
                <span><b>Languages:</b> ${country.languages.map(el => el.name).join(',')}</span>
            </div>
        </div>
        <div class="container-borders ">
            <h3 class="titulo-border">Border Countries</h3>
            <div class="container-buttons">
                ${render_borders(borders)}
            </div>
        </div>
    </div>`;
}

let render_borders = borders => {
    let buttons = '';
    borders.forEach(border => {
        buttons += `<button class="btn-border">${border.name}</button>`;
    })
    return buttons;
}


const contenedor = document.querySelector(".container-details");
const btnBack = document.querySelector("#btnBack");
const name_country = urlParam('query');
let btn_borders;

document.addEventListener("DOMContentLoaded", () => {
    if (name_country === void 0) {
        console.log(name_country);
        window.location.href = '/';
        return;
    }
    search_by_country(name_country).then((response) => {
        response.forEach((country) => {
            console.log(country);
            if (country.borders.length > 0) {
                search_borders(country.borders).then((response) => {
                    console.log(response);
                    contenedor.innerHTML = render_country(country, response);
                    btn_borders = document.querySelectorAll(".btn-border");
                    btn_borders.forEach(btn => {
                        btn.addEventListener('click', () => {
                            window.location.href = `detail.html?query=${btn.textContent}`;
                        });
                    })
                });
                return;
            }
            contenedor.innerHTML = render_country(country, []);
        });

    });
});

btnBack.addEventListener('click', () => { window.location.href = '/'; })