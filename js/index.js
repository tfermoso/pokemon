import { Pokemon } from './pokemon.js';
import { COLOR, colores } from './constantes.js';
import { bcolor } from './funciones.js';

// if ('serviceWorker' in navigator) {
//     console.log("Registrando service worker");
//     navigator.serviceWorker.register('sw.js');
//   }

String.prototype.capitalize = function () {
    return this.toLowerCase().replace(/(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); });
};

window.onload = function () {
    var miStorage = window.localStorage;
    var listaPokemons = [];
    var fullList = {};
    var stat = "";//filtrar por stat
    var dir = 0; //dirección de ordenación
    var ordenar = document.getElementById("ordenar");
    var section = document.getElementById("contenido");
    var inputSearch = document.getElementById("inputBuscar");
    var selectTipo = document.getElementsByName("tipo");
    var direction = document.getElementById("direction");
    // Get the modal
    var modal = document.getElementById('myModal');
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    var generations = document.getElementsByClassName("generation");

    //Si ya tengo los datos, creo la lista de pokemon desde localstorage   
    if (miStorage.getItem("pokemons2") != null) {
        //Genero la lista de pokemons
        var pokemons = JSON.parse(miStorage.getItem("pokemons"));
        pokemons.forEach(pokemon => {
            var pk = new Pokemon(pokemon.name, pokemon.img, pokemon.id, pokemon.types, pokemon.stats);
            if (pokemon["description"] != undefined) pk.setDescription(pokemon.description);
            if (pokemon["evolution"] != undefined) pk.setEvolution(pokemon.evolution);
            listaPokemons.push(pk);
            // console.log(listaPokemons);
        })
        mostrarPokemon(listaPokemons);
    } else {
        var xmlhttp = new XMLHttpRequest();
        var url = "https://pokeapi.co/api/v2/pokemon/";

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var resultado = JSON.parse(this.response);
                cargarPokemon(resultado.results.slice(0, 151), "g1")
                //cargarPokemon(resultado.results)
            }

        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    }






    function cargarPokemon(pokemons, g) {
        var lpokemon = [];
        pokemons.forEach(pokemon => {
            var xmlhttp2 = new XMLHttpRequest();
            var url2 = pokemon.url;
            xmlhttp2.open("GET", url2, true);
            xmlhttp2.send();
            xmlhttp2.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var resultadoPokemon = JSON.parse(this.response);
                    var types = {};
                    resultadoPokemon.types.forEach(element => {
                        types[element.slot] = element.type.name;
                    });
                    var stats = {};
                    resultadoPokemon.stats.forEach(element => {
                        stats[element.stat.name] = element.base_stat;
                    });
                    pokemon.name = pokemon.name.capitalize();
                    var pk = new Pokemon(pokemon.name, resultadoPokemon.sprites.front_default, resultadoPokemon.id, types, stats);

                    lpokemon.push(pk);
                    mostrarPokemon(lpokemon.sort(ordenarPk));
                    if (lpokemon.length == pokemons.length) {
                        fullList[g] = lpokemon;
                        miStorage.setItem('pokemons', JSON.stringify(fullList));
                        //     mostrarPokemon(listaPokemons);
                    }
                }
            }
        });
    }

    function mostrarPokemon(listaPokemons) {
        //Ocultamos loader
        section.innerHTML = "";
        document.getElementsByClassName("loader")[0].setAttribute("style", "display:none");
        listaPokemons.forEach(pokemon => {
            var card = document.createElement("article");
            var estilo = bcolor(pokemon.types);
            card.style = estilo;
            card.className = "tooltip";
            var a = document.createElement("a");
            a.innerText = pokemon.name;
            var img = document.createElement("img");
            img.src = pokemon.img;
            var span = document.createElement("span");
            span.innerHTML = `<b>nombre:${pokemon.name}</b><br>tipo:${pokemon.getTypes()}<br>${pokemon.getStats()}`;
            span.className = "tooltiptext";
            card.appendChild(img);
            card.appendChild(a);
            card.appendChild(span);
            card.id = "idpk" + pokemon.id;
            card.addEventListener("click", eventCard)
            section.appendChild(card);
        });



    }

    selectTipo.forEach(select => {
        var opt = document.createElement("option");
        opt.innerText = "Mostrar todos";
        opt.value = "todos";
        opt.selected = true;
        select.appendChild(opt);
        for (const key in colores) {
            opt = document.createElement("option");
            opt.value = key;
            opt.innerText = key;
            select.appendChild(opt);
        }
        select.addEventListener("change", () => {
            var tipo1 = document.getElementById("selectorTipo1").value;
            var tipo2 = document.getElementById("selectorTipo2").value;
            var lista = [];
            filtrar();
            // if ((tipo1 != "todos" && tipo2 == "todos") || (tipo1 == "todos" && tipo2 != "todos")) {

            //     listaPokemons.forEach(pokemon => {
            //         if (pokemon.types[1] == tipo1 || pokemon.types[2] == tipo2)
            //             lista.push(pokemon);
            //     });
            //     mostrarPokemon(lista);
            // } else if ((tipo1 != "todos" && tipo2 != "todos")) {
            //     listaPokemons.forEach(pokemon => {
            //         if (pokemon.types[1] == tipo1 && pokemon.types[2] == tipo2)
            //             lista.push(pokemon);
            //     });
            //     mostrarPokemon(lista);
            // }
            // else {
            //     mostrarPokemon(listaPokemons);
            // }
        })

    });

    inputSearch.addEventListener("keyup", () => {
        // var lista=[];
        // listaPokemons.forEach(pokemon => {
        //     if(pokemon.name.toLowerCase().search(inputSearch.value.toLowerCase())>=0){
        //         lista.push(pokemon);
        //     }
        // });

        // mostrarPokemon(listaPokemons.filter(pokemon => {
        //     if (pokemon.name.toLowerCase().search(inputSearch.value.toLowerCase()) >= 0) {
        //         return true;
        //     }
        // }))
        filtrar()
        // mostrarPokemon(lista);
    })

    ordenar.addEventListener("change", () => {
        var campo = ordenar.value;
        stat = campo;
        filtrar()
        // if (stat == "") {
        //     mostrarPokemon(listaPokemons.sort(ordenarPk));
        // } else
        //     mostrarPokemon(listaPokemons.sort(ordenarStat));


    })

    direction.addEventListener("click", (ev) => {
        if (dir == 0) {
            dir = 1;
            ev.currentTarget.innerHTML = "&darr;";

        } else {
            dir = 0;
            ev.currentTarget.innerHTML = "&uarr;";
        }
        // if (stat == "") {
        //     mostrarPokemon(listaPokemons.sort(ordenarPk));
        // } else
        //     mostrarPokemon(listaPokemons.sort(ordenarStat));
        filtrar()
    })

    span.onclick = function () {
        modal.style.display = "none";
    }

    function ordenarPokemons(a, b) {


        if (stat != "") {
            if (dir == 0) {
                if (a.stats[stat] > b.stats[stat]) return -1
                if (a.stats[stat] < b.stats[stat]) return 1
            } else {
                if (a.stats[stat] > b.stats[stat]) return 1
                if (a.stats[stat] < b.stats[stat]) return -1
            }
        }
        if (dir == 0) {
            if (a.id > b.id) return 1;
            if (a.id < b.id) return -1;
        } else {
            if (a.id > b.id) return -1;
            if (a.id < b.id) return 1;
        }
        return 0
    }

    function ordenarStat(a, b) {
        if (dir == 0) {
            if (a.stats[stat] > b.stats[stat]) return -1
            if (a.stats[stat] < b.stats[stat]) return 1
            return 0
        } else {
            if (a.stats[stat] > b.stats[stat]) return 1
            if (a.stats[stat] < b.stats[stat]) return -1
            return 0
        }
    }
    function ordenarPk(a, b) {
        if (dir == 0) {
            if (a.id > b.id) return 1;
            if (a.id < b.id) return -1;
        } else {
            if (a.id > b.id) return -1;
            if (a.id < b.id) return 1;
        }
        return 0
    }


    function filtrar() {
        var tipo1 = document.getElementById("selectorTipo1").value;
        var tipo2 = document.getElementById("selectorTipo2").value;
        var texto = inputSearch.value;
        var listaFiltrada;
        if (texto != "") {
            listaFiltrada = listaPokemons.filter(pokemon => {
                if (pokemon.name.toLowerCase().search(inputSearch.value.toLowerCase()) >= 0) {
                    return true;
                }
            })
        }
        else {
            listaFiltrada = listaPokemons
        }
        mostrarPokemon(listaFiltrada.filter(pokemon => {
            if ((tipo1 != "todos" && tipo2 == "todos") || (tipo1 == "todos" && tipo2 != "todos")) {
                if (pokemon.types[1] == tipo1 || pokemon.types[2] == tipo2)
                    return true
            } else if ((tipo1 != "todos" && tipo2 != "todos")) {
                if (pokemon.types[1] == tipo1 && pokemon.types[2] == tipo2)
                    return true;
            } else {
                return true;
            }
        }).sort(ordenarPokemons));

    }

    function mostrarModal(pokemon) {
        modal.style.display = "block";
        document.getElementById("detailCard").innerHTML = "";
        document.getElementById("detailCard").appendChild(htmlCard(pokemon));


    }

    function eventCard(ev) {
        var id = ev.currentTarget.id.slice(4);
        var pokemon = listaPokemons.filter(pk => {
            if (pk.id == id) return true;
        }
        )[0];
        if (pokemon["description"] != undefined) {
            mostrarModal(pokemon)

        } else {
            var xmlhttp = new XMLHttpRequest();
            url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
            xmlhttp.open("GET", url, true);
            xmlhttp.send(null);
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == "200") {
                    console.log(this.response);
                    var infoDetail = JSON.parse(this.response);
                    // var pokemon = listaPokemons.find(pk => {
                    //     if (pk.id == id) return true;
                    // })
                    // var ind=listaPokemons.indexOf(pokemon);
                    // pokemon=listaPokemons[ind];
                    var info = infoDetail.flavor_text_entries.filter(d => {
                        if (d.language.name == "es") return true
                    })
                    pokemon.setDescription(info);
                    //Pido datos de evolución
                    var xmlhttp2 = new XMLHttpRequest();
                    var url2 = infoDetail.evolution_chain.url;
                    xmlhttp2.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == "200") {
                            var datosEvolucion = JSON.parse(this.response)["chain"];

                            if (datosEvolucion != undefined) {

                                var res = evolucion(datosEvolucion);
                                pokemon.setEvolution(res);
                                mostrarModal(pokemon);
                                miStorage.setItem("pokemons", JSON.stringify(listaPokemons));
                            }
                        }
                    }
                    xmlhttp2.open("GET", url2, true);
                    xmlhttp2.send(null);
                }
            }
        }




    }
    function getInfoEvolucion(obj) {
        if (Object.keys(obj.ev).length === 0) {
            return `<span>${obj.name}</span>`;
        } else if (obj.ev["0"] == undefined) {
            return `<span>${obj.name}</span>&rarr;${getInfoEvolucion(obj.ev)}`;
        } else {
            var d = [];
            var i = 0;
            for (const k in obj.ev) {
                if (obj.ev.hasOwnProperty(k)) {
                    const element = obj.ev[k];
                    d[i] = `<span>${obj.name}</span>&rarr;${getInfoEvolucion(element)}`;
                }
                i++;
            }
            var re = "";
            d.forEach(e => {
                re += `<p>${e}</p>`;
            });
            return re;
        }
    }

    function evolucion(datos) {

        if (datos["evolves_to"].length == 0) {
            return {
                "name": datos["species"]["name"],
                "ev": {}
            };
        } else if (datos["evolves_to"].length == 1) {

            return {
                "name": datos["species"]["name"],
                "ev": evolucion(datos["evolves_to"][0])
            };
        } else {
            var d = {};
            var i = 0;
            datos["evolves_to"].forEach(element => {
                d[i] = evolucion(element);
                i++;
            });
            return {
                "name": datos["species"]["name"],
                "ev": d
            };
        }

    }

    function htmlCard(pokemon) {
        var content = document.createElement("div");
        var col1 = document.createElement("div");
        var col2 = document.createElement("div");
        var col3 = document.createElement("div");

        var card = document.createElement("article");
        var estilo = bcolor(pokemon.types);
        card.style = estilo;
        var a = document.createElement("a");
        a.innerText = pokemon.name;
        var img = document.createElement("img");
        img.src = pokemon.img;
        var p = document.createElement("p");
        p.innerHTML = `<b>nombre:${pokemon.name}</b><br>tipo:${pokemon.getTypes()}<br>${pokemon.getStats()}`;
        var titd = document.createElement("h3");
        titd.innerHTML = "Descripción";
        col2.appendChild(titd);
        pokemon.description.forEach(element => {
            var p = document.createElement("p"); p.innerText = element.flavor_text
            col2.appendChild(p);
        });
        var tite = document.createElement("h3");
        tite.innerHTML = "Evolución";
        col3.appendChild(tite);
        var p3 = document.createElement("p")
        p3.innerHTML = getInfoEvolucion(pokemon.evolution);
        col3.appendChild(p3)
        card.appendChild(img);
        card.appendChild(a);
        col1.appendChild(card)
        col1.appendChild(p);
        content.appendChild(col1);
        content.appendChild(col2);
        content.appendChild(col3);
        return content;
    }

    for (const e of generations) {
        e.addEventListener("change", (e) => {
            var rango = e.currentTarget.value.split("-");
            var generacion = e.currentTarget.id;
            if (fullList[generacion] == undefined && e.currentTarget.checked) {
                var xmlhttp = new XMLHttpRequest();
                var url = "https://pokeapi.co/api/v2/pokemon/";

                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var resultado = JSON.parse(this.response);
                        if (rango[1] != undefined) {
                            cargarPokemon(resultado.results.slice(parseInt(rango[0]), parseInt(rango[1])), generacion)
                        } else{
                            cargarPokemon(resultado.results.slice(parseInt(rango[0])), generacion)
                        }

                        //cargarPokemon(resultado.results)
                    }

                }
                xmlhttp.open("GET", url, true);
                xmlhttp.send(null);
            } else if (e.currentTarget.checked) {
                listaPokemons.concat(fullList[generacion]);
                mostrarPokemon(listaPokemons.sort(ordenarPk));
            } else {
                mostrarPokemon([])
            }
        })
    }


}
