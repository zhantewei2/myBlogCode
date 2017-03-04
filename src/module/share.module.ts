import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PointerDirective}from '../general/pointer.directive';
import {LimitStrPipe}from '../general/limit-str-pipe';
import {StringToDatePipe} from '../general/string-to-date.pipe';
import {ModalComponent} from '../general/modal.component';
import {BreakBarComponent} from '../general/break-bar.component';
@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        PointerDirective,
        LimitStrPipe,
        StringToDatePipe,
        ModalComponent,
        BreakBarComponent
    ],
    exports:[
        CommonModule,FormsModule,PointerDirective,LimitStrPipe,StringToDatePipe,ModalComponent,BreakBarComponent
    ]
})
export class ShareModule{}