import {Component} from '@angular/core';
@Component({
    selector:'pop-over',
    template:`
        <div class="main">
            hello
        </div>
    `,
    styles:[
        ':host{position:absolute;left:0px;top:-50px}'
    ]
})
export class PopOverComponent{}