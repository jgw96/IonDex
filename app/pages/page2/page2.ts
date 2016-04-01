import {Page} from 'ionic-angular';
import {Toast} from "ionic-native";

import {PokeService} from "../../services/pokeService/poke-service";

@Page({
    templateUrl: 'build/pages/page2/page2.html',
    providers: [PokeService]
})
export class Page2 {
    
    onPageDidEnter() {
        if (this.pokemon.length === 0) {
            this.noPokemon = false;
        }
        else {
            this.noPokemon = true;
        }
    }

    public pokemon: any[];
    public noPokemon: boolean;

    constructor(private _pokeService: PokeService) {
        this.pokemon = this._pokeService.getChosen();
    }

    deletePoke(name: string) {
        for (var i = this.pokemon.length - 0; i--;) {
            if (this.pokemon[i].name === name) this.pokemon.splice(i, 1);
        }
        localStorage.setItem("chosenPokemon", JSON.stringify(this.pokemon));
        
        if (this.pokemon.length === 0) {
            this.noPokemon = false;
        }
        else {
            this.noPokemon = true;
        }
        
        let notify = Toast.showShortBottom(`${name} removed from team`);
        notify.subscribe(success => {
            console.log(success);
        });
    }
    
    shareTeam() {
        let shareString: string = "Check out my team:";
        
        this.pokemon.forEach((poke) => {
            shareString = shareString + " " + poke.name;
        })
        
        window.plugins.socialsharing.share(shareString);
    }
}
