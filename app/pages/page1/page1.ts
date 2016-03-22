import {Page, Modal, NavController, ViewController} from 'ionic-angular';
import {HTTP_PROVIDERS} from 'angular2/http';
import {OnInit} from "angular2/core";

import 'rxjs/Rx';

import {PokeService} from "../../services/pokeService/poke-service";
import {MyModal} from "./poke-modal.ts";


@Page({
    templateUrl: 'build/pages/page1/page1.html',
    providers: [HTTP_PROVIDERS, PokeService]
})
export class Page1 implements OnInit {

    ngOnInit() {
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

        /*setTimeout(() => {
            this.getThirdGen();
        },5000)*/
    }

    public getPoke() {
        let firstGen = this._pokeService.getPokemon()
        firstGen.subscribe(
            pokemon => {
                let firstGen = pokemon.pokemon_species;
                this.pokemon = firstGen;

                this._pokeService.saveArray(this.pokemon);

                this.loading = false;

            },
            error => alert(error)
        )


    }

    public getThirdGen() {
        this._pokeService.getThirdGenPokemon()
            .subscribe(
            thirdGen => {
                this.pokemon = this.pokemon.concat(thirdGen.pokemon_species);
            },
            error => alert(error)
            )
    }

    public fetchPoke(name: string) {
        this.loading = true;
        
        console.log(this._pokeService.getItem());

        if (this._pokeService.getItem() === null || this._pokeService.getItem().name !== name) {
            this._pokeService.getPokes(name)
                .subscribe(
                poke => {
                    console.log(poke);
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
            console.log(poke);

            let modal = Modal.create(MyModal, { pokemon: poke });
            this.nav.present(modal);

            setTimeout(() => {
                this.loading = false;
            }, 400)
        }

    }

    getItems(searchbar) {

        const q = searchbar.value;

        this._pokeService.getPokemon()
            .subscribe(
            pokemon => {
                this.pokemon = pokemon.pokemon_species;
                this.loading = false;

                if (q.trim() == '') {
                    return;
                }

                this.pokemon = this.pokemon.filter((v: any) => {
                    if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                        return true;
                    }
                    return false;
                })

            },
            error => alert(error)
            )

    }


}

