export class Pokemon{
    constructor(name,img,id,types,stats){
        this.name=name;
        this.id=id;
        this.img=img;
        this.types=types;
        this.stats=stats;
    }

    getTypes(){
        var types="";
        for (const key in this.types) {
            if (this.types.hasOwnProperty(key)) {
                const element = this.types[key];
                types+=element+", ";
            }
        }
        return types;
    }
    getStats(){
        var stats="";
        for (const iterator in this.stats) {
           stats+= iterator+" : "+ this.stats[iterator]+"<br>"
        }
        return stats;
    }
    
    setDescription(des){
        this.description=des;
    }
    setEvolution(evol){
        this.evolution=evol;
    }

    

}