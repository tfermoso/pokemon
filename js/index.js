import { Pokemon } from './pokemon.js';
const COLOR = `background: color_primario ;
background: -moz-linear-gradient(45deg, color_primario 0%, color_primario 41%, color_secundario 60%, color_secundario 100%);
background: -webkit-linear-gradient(45deg, color_primario 0%,color_primario 41%,color_secundario 60%,color_secundario 100%);
background: linear-gradient(45deg, color_primario 0%,color_primario 41%,color_secundario 60%,color_secundario 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=color_primario, endColorstr=color_secundario,GradientType=1 );
`;
const colores = {
    'grass': '#78C850',
    'flying': '#A890F0',
    'poison': '#A040A0',
    'normal': '#A8A878',
    'fighting': '#C03028',
    'ground': '#E0C068',
    'rock': '#B8A038',
    'bug': '#A8B820',
    'ghost': '#705898',
    'steel': '#B8B8D0',
    'fire': '#F08030',
    'water': '#F8D030',
    'electric': '#F8D030',
    'psychic': '#F85888',
    'ice': '#98D8D8',
    'dragon': '#7038F8',
    'dark': '#705848',
    'fairy': '#EE99AC',
    'unknown': '#68A090',
    'shadow': '#68A090'
}
String.prototype.capitalize = function() {
    return this.toLowerCase().replace(/(^|\s)([a-z])/g, function(m, p1, p2) { return p1 + p2.toUpperCase(); });
};

window.onload = function () {
    var listaPokemons = [];
    var section = document.getElementById("contenido");
    var xmlhttp = new XMLHttpRequest();
    var url = "https://pokeapi.co/api/v2/pokemon/";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var resultado = JSON.parse(this.response);
            cargarPokemon(resultado.results.slice(0, 151))
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
                    pokemon.name=pokemon.name.capitalize();
                    var pk = new Pokemon(pokemon.name, resultadoPokemon.sprites.front_default, resultadoPokemon.id, types, stats);

                    listaPokemons.push(pk);

                    if (listaPokemons.length == 151) {
                        listaPokemons.sort(ordenarPk)
                        mostrarPokemon();
                    }
                }
            }

        });

    }

    function ordenarPk(a, b) {
        if (a.id > b.id) return 1;
        if (a.id < b.id) return -1;
        return 0
    }


    function mostrarPokemon() {
        listaPokemons.forEach(pokemon => {
            var card = document.createElement("article");
            var estilo=bcolor(pokemon.types);
            card.style = estilo;
            card.className="tooltip";
            var a = document.createElement("a");
            a.innerText = pokemon.name;
            var img = document.createElement("img");
            img.src = pokemon.img;   
            var span=document.createElement("span");
            span.innerHTML=`<b>nombre:${pokemon.name}</b><br>tipo:${pokemon.getTypes()}<br>${pokemon.getStats()}`;
            span.className="tooltiptext";
            card.appendChild(img);
            card.appendChild(a);
            card.appendChild(span);
            section.appendChild(card);
        });

    }

    function bcolor(types) {
        var estilo = COLOR;
        var cp, cs;
        cp = cs = colores[types["1"]];
        if (types["2"] != undefined) {
            cs = colores[types["2"]]
        }
        estilo=estilo.split("color_primario").join(cp);
        estilo=estilo.split("color_secundario").join(cs);
        return estilo;
    }
}