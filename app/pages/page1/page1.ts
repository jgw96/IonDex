import {Page, Modal, NavController, ViewController} from 'ionic-angular';
import {HTTP_PROVIDERS} from 'angular2/http';

import 'rxjs/Rx';

import {PokeService} from "../../services/pokeService/poke-service";
import {MyModal} from "./poke-modal.ts";


@Page({
    templateUrl: 'build/pages/page1/page1.html',
    providers: [HTTP_PROVIDERS, PokeService]
})
export class Page1 {

    onPageDidEnter() {
        if (this._pokeService.parseArray() === null) {
            this.getPoke();
        }
        else {
            this.pokemon = this._pokeService.parseArray();
            this.loading = false;
        }
    }

    pokemon: any;
    loading: boolean;
    public searchQuery: string;

    constructor(private _pokeService: PokeService, public nav: NavController) {
        this.nav = nav;
        this.loading = true;
        this.searchQuery = '';
        
        this.pokemon = [];
    }

    public getPoke() {
        let firstGen = this._pokeService.getPokemon()
        firstGen.subscribe(
            pokemon => {
                let firstGen = pokemon.pokemon_entries;
                this.pokemon = firstGen;

                this.loading = false;


                this._pokeService.saveArray(this.pokemon);


            },
            error => alert(error)
        )


    }

    public fetchPoke(name: string) {
        this.loading = true;
        if (this._pokeService.getItem() === null || this._pokeService.getItem().name !== name) {
            this._pokeService.getPokes(name)
                .subscribe(
                poke => {
                    this._pokeService.saveItem(poke);

                    let modal = Modal.create(MyModal, { pokemon: poke });
                    this.nav.present(modal);

                    setTimeout(() => {
                        this.loading = false;
                    }, 400)

                },
                error => alert(error)
                )
        }
        else {
            let poke = this._pokeService.getItem();

            let modal = Modal.create(MyModal, { pokemon: poke });
            this.nav.present(modal);

            setTimeout(() => {
                this.loading = false;
            }, 400)
        }

    }

    getItems(searchbar) {

        const q = searchbar.value;

        this.pokemon = this._pokeService.parseArray();

        if (q.trim() === '') {
            return;
        }

        this.pokemon = this.pokemon.filter((v: any) => {
            if (v.pokemon_species.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        })

    }


}

