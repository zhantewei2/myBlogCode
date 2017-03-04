import {Component,Input} from '@angular/core';
@Component({
	selector:'ztw-loader',
	template:`
	<div *ngIf='exist' class="spinner-loader"></div>
	`
})
export class LoaderComponent{
	exist:boolean=true;
	@Input('exist') set fn(exist){
		this.exist=exist?false:true;
	} ;
};