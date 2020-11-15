(() => {
    const dropdown_trigger = document.querySelector(".c-dropdown__trigger");
    const arrow = document.querySelector(".c-dropdown__arrow");
    const options = document.querySelector(".c-dropdown__options");
    const array_options = document.querySelectorAll(".c-dropdown__option");
    const texto_dropdown = document.querySelector(".c-dropdown__text");
    const dropdown_visible = document.querySelector(".c-dropdown__visible");
    const buscador = document.querySelector(".c-dropdown__search");

    let actual = 0;
    let seleccionado = -1;
    let contador_opciones = array_options.length;

    const contenedor = document.querySelector("#countries");

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

    let search_by_region = (region) => {
        return new Promise((resolve, reject) => {
            fetch(`https://restcountries.eu/rest/v2/region/${region}`, requestOptions)
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

    let filtrar_dropdown = (busqueda) => {
        console.log(busqueda);
        if (busqueda === "") {
            array_options.forEach((el) => {
                el.classList.remove("c-dropdown__option--hide");
                el.classList.remove("c-dropdown__option--show");
            });
        } else {
            array_options.forEach((el) => {
                el.classList.add("c-dropdown__option--hide");
                if (el.textContent.toLowerCase().includes(busqueda.toLowerCase())) {
                    el.classList.add("c-dropdown__option--show");
                    el.classList.remove("c-dropdown__option--hide");
                }
            });
        }
    };

    let abrir_cerrar_dropdown = () => {
        if (arrow.classList.contains("c-dropdown__arrow--open")) {
            arrow.classList.remove("c-dropdown__arrow--open");
            options.classList.remove("c-dropdown__options--open");
            Array.from(dropdown_visible.children).map((el) => {
                el.classList.remove("c-dropdown__visible--active");
            });
            texto_dropdown.classList.add("c-dropdown__visible--active");
            buscador.children[0].value = "";
        } else {
            arrow.classList.add("c-dropdown__arrow--open");
            options.classList.add("c-dropdown__options--open");
            Array.from(dropdown_visible.children).map((el) => {
                el.classList.remove("c-dropdown__visible--active");
            });
            buscador.classList.add("c-dropdown__visible--active");
            array_options[actual].focus();
            array_options[actual].classList.add("c-dropdown__option--hover");
            filtrar_dropdown(buscador.children[0].value);
        }
    };

    let autofocus = (e) => {
        console.log(e);

        //Enter
        if (e.keyCode === 13) {
            seleccionar_option();
        }

        //Flecha Abajo
        if (e.keyCode === 40) {
            if (actual !== parseFloat(contador_opciones - 1)) {
                actual++;
            }
        }
        //Flecha Arriba
        if (e.keyCode === 38) {
            if (actual > 0) {
                actual--;
            }
        }

        array_options.forEach((el) => {
            el.classList.remove("c-dropdown__option--hover");
        });
        array_options[actual].classList.add("c-dropdown__option--hover");
        array_options[actual].focus();
    };

    let key_input = (e) => {
        let input = buscador.children[0];
        // a - z
        if (e.keyCode >= 65 && e.keyCode <= 90) {
            input.focus();
            input.value = input.value + e.key;
            filtrar_dropdown(input.value);
        }
        //Backspace
        if (e.keyCode === 8) {
            input.focus();
            input.value = input.value.substring(0, input.value.length - 1);
            filtrar_dropdown(input.value);
        }
    };
    let limpiar_hover = (e) => {
        array_options.forEach((el) => {
            el.classList.remove("c-dropdown__option--hover");
        });
    };

    let seleccionar_option = () => {
        let opcion_seleccionada = array_options[actual];
        array_options.forEach((el) => {
            el.classList.remove("c-dropdown__option--selected");
        });
        opcion_seleccionada.classList.add("c-dropdown__option--selected");
        abrir_cerrar_dropdown();
        actual = 0;
        texto_dropdown.textContent = opcion_seleccionada.textContent;
        if (opcion_seleccionada.dataset.value === "-1") {
            all_countries().then((response) => {
                let paises = "";
                response.forEach((country) => {
                    paises += render_country(country);
                });
                contenedor.innerHTML = paises;
            });
            return;
        }
        search_by_region(opcion_seleccionada.dataset.value).then((response) => {
            let paises = "";
            response.forEach((country) => {
                paises += render_country(country);
            });
            contenedor.innerHTML = paises;
        });
    };

    array_options.forEach((el, i) => {
        el.addEventListener("click", (e) => {
            actual = i;
            seleccionar_option();
        });
    });

    dropdown_trigger.addEventListener("click", abrir_cerrar_dropdown);

    options.addEventListener("keyup", autofocus);
    buscador.children[0].addEventListener("keyup", key_input);

    options.addEventListener("mouseenter", limpiar_hover);
    options.addEventListener("mousemove", limpiar_hover);
})();