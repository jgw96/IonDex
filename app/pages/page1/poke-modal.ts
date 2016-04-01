import {Page, Modal, NavController, ViewController, NavParams} from 'ionic-angular';
import {Toast} from "ionic-native";
import {HTTP_PROVIDERS} from 'angular2/http';

import 'rxjs/Rx';

import {PokeService} from "../../services/pokeService/poke-service";


@Page({
    template: `
  <ion-navbar primary *navbar>
    <ion-title>{{name}}</ion-title>
    <ion-buttons start>
    <button (click)="close()">
      <ion-icon name='close'></ion-icon>
    </button>
  </ion-buttons>
  </ion-navbar>
  <ion-content padding>
        <h4 style="color: {{color}};">{{name}}</h4>
        <img id="sprite" [src]="sprite">
        Type: <span *ngFor="#type of types"> {{type}} </span>
        <p>Base Exp: {{exp}}</p>
        <p>Height: {{height}} inches</p>
        <p>Weight: {{weight}} pounds</p>
        <ion-card padding>
        <ion-list>
          <ion-list-header style="color: {{color}};">
            Stats
          </ion-list-header>
          <ion-item *ngFor="#stat of stats">
            <div>{{stat.stat.name}}: {{stat.base_stat}}</div>
          </ion-item>
          <ion-list-header style="color: {{color}};">
            Abilities
          </ion-list-header>
          <ion-item *ngFor="#ability of abilities">
            {{ability.name}}
            <p *ngIf="ability.hidden > 0">Hidden</p>
          </ion-item>
        </ion-list>
        </ion-card>
        
        <h4 style="color: {{color}};" id="movesTitle">Where to catch</h4>
        <ion-card [hidden]="noLocations" padding>
        <ion-list>
          <ion-item *ngFor="#location of locations">
            <h2>{{location.location_area.name}}</h2>
            <p>Game version: {{location.version_details[0].version.name}}</p>
            <p>Max chance: {{location.version_details[0].max_chance}}</p>
          </ion-item>
        </ion-list>
        </ion-card>
        
        <ion-card [hidden]="!noLocations">
          <ion-card-header>
            Cant be caught
          </ion-card-header>
          <ion-card-content>
            Sorry this pokemon can not be caught in the wild.
          </ion-card-content>
        </ion-card>
        
        <h4 style="color: {{color}};" id="movesTitle">Moves</h4>
        <ion-card>
        <ion-list>
          <ion-item *ngFor="#move of moves">
            <h2>{{move.move.name}}</h2> 
            <p>{{move.version_group_details[0].move_learn_method.name}}</p>
            <p *ngIf="move.version_group_details[0].level_learned_at > 0">Learned at level {{move.version_group_details[0].level_learned_at}}</p>
          </ion-item>
        </ion-list>
        </ion-card>
        
  </ion-content>
  
  <button (click)="addPoke(name, sprite)" style="postion: absolute; z-index:9999;" id="addButton" fab fab-bottom fab-right>
    <ion-icon name="add"></ion-icon>
  </button>
  
  
  `,
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

    constructor(public viewCtrl: ViewController, private params: NavParams, private _pokeService: PokeService) {
        this.viewCtrl = viewCtrl;
        this.pokemon = params.get("pokemon");
        
        console.log(this.pokemon);

        this.sprite = this.pokemon.sprites.front_default;

        this.colorUrl = this.pokemon.species.url;

        this._pokeService.getColor(this.colorUrl)
            .subscribe(
            color => {
                this.color = color.color.name;
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

        console.log(this.locations)
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

    close() {
        this.viewCtrl.dismiss();
    }
}