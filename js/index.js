import { Pokemon } from './pokemon.js';
import { COLOR, colores } from './constantes.js';
import { ordenarPk, bcolor } from './funciones.js';


String.prototype.capitalize = function () {
    return this.toLowerCase().replace(/(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); });
};

window.onload = function () {
    var listaPokemons = [];
    var section = document.getElementById("contenido");
    var xmlhttp = new XMLHttpRequest();
    var url = "https://pokeapi.co/api/v2/pokemon/";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var resultado = JSON.parse(this.response);
            // cargarPokemon(resultado.results.slice(0, 151))
            cargarPokemon(resultado.results)
        }

    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);


    function cargarPokemon(pokemons) {
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

                    listaPokemons.push(pk);
                    mostrarPokemon(listaPokemons);
                    // if (listaPokemons.length == 151) {
                    //     listaPokemons.sort(ordenarPk)
                    //     mostrarPokemon(listaPokemons);
                    // }
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
            section.appendChild(card);
        });

    }



    var selectTipo = document.getElementsByName("tipo");
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

            if ((tipo1 != "todos" && tipo2 == "todos") || (tipo1 == "todos" && tipo2 != "todos")) {

                listaPokemons.forEach(pokemon => {
                    if (pokemon.types[1] == tipo1 || pokemon.types[2] == tipo2)
                        lista.push(pokemon);
                });
                mostrarPokemon(lista);
            } else if ((tipo1 != "todos" && tipo2 != "todos")) {
                listaPokemons.forEach(pokemon => {
                    if (pokemon.types[1] == tipo1 && pokemon.types[2] == tipo2)
                        lista.push(pokemon);
                });
                mostrarPokemon(lista);
            }
            else {
                mostrarPokemon(listaPokemons);
            }
        })

    });

    var inputSearch = document.getElementById("inputBuscar");
    inputSearch.addEventListener("keyup", () => {
        // var lista=[];
        // listaPokemons.forEach(pokemon => {
        //     if(pokemon.name.toLowerCase().search(inputSearch.value.toLowerCase())>=0){
        //         lista.push(pokemon);
        //     }
        // });

        mostrarPokemon(listaPokemons.filter(pokemon => {
            if (pokemon.name.toLowerCase().search(inputSearch.value.toLowerCase()) >= 0) {
                return true;
            }
        }))
        // mostrarPokemon(lista);
    })
    var stat = "";
    var dir = 0;
    var ordenar = document.getElementById("ordenar");
    ordenar.addEventListener("change", () => {
        var campo = ordenar.value;
        stat = campo;
        if (stat == "") {
            mostrarPokemon(listaPokemons.sort(ordenarPk));
        } else
            mostrarPokemon(listaPokemons.sort(ordenarStat));


    })

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


}