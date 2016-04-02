import {Page, Modal, NavController, ViewController, NavParams, Alert} from 'ionic-angular';
import {Toast} from "ionic-native";
import {HTTP_PROVIDERS} from 'angular2/http';

import {PokeService} from "../../services/pokeService/poke-service";


@Page({
    templateUrl: "build/pages/page1/modal.html",
    styles: [
        `
        #sprite {
            position: absolute;
            right: 5px;
            top: 5px;
            height: 25%;
        }
        
        #movesTitle {
            margin-top: 2em;
            margin-left: 3%;
        }
        
        #description {
            width: 65%;
        }
        
      `
    ],
    providers: [PokeService]
})
export class MyModal {

    pokemon: any;
    public name: string;
    public types: string[];
    public abilities: any[];
    public sprite: string;
    public exp: string;
    public stats: any[];
    public moves: any[];
    public colorUrl: string;
    public color: string;
    public height: string;
    public weight: string;
    public locations: any[];
    public noLocations: boolean;
    public description: string;
    public evolvedFrom: string;
    public evolvedFromSprite: string;
    public noEvolution: boolean;

    constructor(public viewCtrl: ViewController, private params: NavParams, private _pokeService: PokeService, public nav: NavController) {
        this.viewCtrl = viewCtrl;
        this.nav = nav;
        this.pokemon = params.get("pokemon");

        console.log(this.pokemon);

        this.sprite = this.pokemon.sprites.front_default;

        this.colorUrl = this.pokemon.species.url;

        this._pokeService.getColor(this.colorUrl)
            .subscribe(
            color => {
                console.log(color);
                this.color = color.color.name;
                this.description = color.flavor_text_entries[1].flavor_text;
                if (color.evolves_from_species !== null) {
                    this.evolvedFrom = color.evolves_from_species.name;
                    this.noEvolution = false;

                    fetch(`https://pokeapi.co/api/v2/pokemon/${this.evolvedFrom}`).then((response) => {
                        return response.json();
                    }).then((pokemon) => {
                        console.log(pokemon);
                        this.evolvedFromSprite = pokemon.sprites.front_default;
                    }).catch(() => {
                        console.log("error");
                    })
                }
                else {
                    this.noEvolution = true;
                }

            },
            error => alert(error)
            )

        this.types = [];
        this.abilities = [];
        this.stats = this.pokemon.stats;
        this.moves = this.pokemon.moves;
        this.height = this.pokemon.height;
        this.weight = this.pokemon.weight;
        this.locations = this.pokemon.location_area_encounters;

        if (this.locations.length === 0) {
            this.noLocations = true;
        }
        else {
            this.noLocations = false;
        }

        this.exp = this.pokemon.base_experience;

        this.name = this.pokemon.name;
        this.pokemon.types.forEach((type) => {
            this.types.push(type.type.name);
        })
        this.pokemon.abilities.forEach((ability) => {
            let hidden;
            if (ability.is_hidden === true) {
                hidden = 1;
            }
            else {
                hidden = 0;
            }
            this.abilities.push({ name: ability.ability.name, hidden: hidden });
        })

    }

    public addPoke(name: string, sprite: string) {
        let pokemon: any = { name: name, sprite: sprite };
        this._pokeService.addPokemon(pokemon);

        let notify = Toast.showShortBottom(`${name} added to team!`);
        notify.subscribe(success => {
            console.log(success);
        });
    }

    public getMoveInfo(url: string) {

        let alert = Alert.create({
            title: "Loading...",
            buttons: ['Done']
        });
        this.nav.present(alert);


        this._pokeService.getColor(url)
            .subscribe(
            moveInfo => {
                console.log(moveInfo);

                if (moveInfo.accuracy === null) {
                    moveInfo.accuracy = "Not available";
                }

                if (moveInfo.power === null) {
                    moveInfo.power = "Not available";
                }
                
                alert.setTitle(`${moveInfo.name}`);
                
                alert.setMessage(
                    `
                        <p>Type: ${moveInfo.type.name}</p>
                        <p>Accuracy: ${moveInfo.accuracy}</p>
                        <p>Power: ${moveInfo.power}</p>
                        <p>pp: ${moveInfo.pp}</p>
                        <p>Critical Hit Rate: ${moveInfo.meta.crit_rate}</p>
                    `
                );

            },
            error => {
                console.log(alert);
            }
            )
    }

    close() {
        this.viewCtrl.dismiss();
    }
}