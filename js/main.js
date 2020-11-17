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

let all_countries = () => {
    return new Promise((resolve, reject) => {
        fetch("https://restcountries.eu/rest/v2/all", requestOptions)
            .then((response) => response.json())
            .then((result) => resolve(result))
            .catch((error) => reject("error", error));
    });
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

let render_country = (country) => {
    return `
    <div class="card">
        <div class="card-container">
            <img src="${country.flag}" alt="${country.name}" />
            <div class="card-body">
                <div class="card-title">${country.name}</div>
                <span><b>Population:</b> ${country.population}</span>
                <span><b>Region:</b> ${country.region} </span>
                <span><b>Capital:</b> ${country.capital} </span>
            </div>
        </div>
    </div>
    `;
};

const contenedor = document.querySelector("#countries");
const input = document.querySelector("#country");

document.addEventListener("DOMContentLoaded", () => {
    all_countries().then((response) => {
        let paises = "";
        response.forEach((country) => {
            paises += render_country(country);
        });
        contenedor.innerHTML = paises;
    });
});

input.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        console.log(e.target.value);
        if (e.target.value === "") {
            alert("No realizo ninguna busqueda");
            return;
        }
        search_by_country(e.target.value).then((response) => {
            let paises = "";
            response.forEach((country) => {
                paises += render_country(country);
            });
            contenedor.innerHTML = paises;
        });
    }
});