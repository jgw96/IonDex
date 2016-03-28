import {Page} from 'ionic-angular';

import {PokeService} from "../../services/pokeService/poke-service";

@Page({
    templateUrl: 'build/pages/page3/page3.html',
    providers: [PokeService]
})
export class Page3 {

    constructor(private _pokeService: PokeService) {
        
    }

    
}
