import {Injectable}     from 'angular2/core';
import {Http, Response} from 'angular2/http';

import {Observable}     from 'rxjs/Observable';


let chosenPokemon;

if (localStorage.getItem("chosenPokemon") === null) {
    chosenPokemon = [];
}
else {
    chosenPokemon = JSON.parse(localStorage.getItem("chosenPokemon"));
}

@Injectable()
export class PokeService {

    constructor(private http: Http) {
        
    }
    
    public saveItem(item: any) {
        localStorage.setItem("lastRequest", JSON.stringify(item));
    }
    
    public getItem() {
        return JSON.parse(localStorage.getItem("lastRequest"));
    }
    
    public saveArray(pokemonArray: any[]) {
        localStorage.setItem("pokemonArray", JSON.stringify(pokemonArray));
    }
    
    public parseArray() {
        return JSON.parse(localStorage.getItem("pokemonArray"));
    }

    public getPokemon() {
        return this.http.get("https://pokeapi.co/api/v2/pokedex/1/")
            .map(res => res.json())
            .catch(this.handleError)
    }

    public getSecondGenPokemon() {
        return this.http.get("https://pokeapi.co/api/v2/generation/2/")
            .map(res => res.json())
            .catch(this.handleError)
    }

    public getThirdGenPokemon() {
        return this.http.get("https://pokeapi.co/api/v2/generation/3/")
            .map(res => res.json())
            .catch(this.handleError)
    }

    public getPokes(name: string) {
        return this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    public getColor(url: string) {
        console.log(url);
        return this.http.get(url)
            .map(res => res.json())
            .catch(this.handleError)
    }

    public addPokemon(pokemon) {
        chosenPokemon.push(pokemon);
        localStorage.setItem("chosenPokemon", JSON.stringify(chosenPokemon));
    }

    public getChosen() {
        return chosenPokemon;
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error);
    }

}
