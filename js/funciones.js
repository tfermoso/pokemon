import {COLOR,colores} from './constantes.js';



export function bcolor(types) {
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