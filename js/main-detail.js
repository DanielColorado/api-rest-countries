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


const contenedor = document.querySelector("#countries");
const input = document.querySelector("#country");

document.addEventListener("DOMContentLoaded", () => {

});