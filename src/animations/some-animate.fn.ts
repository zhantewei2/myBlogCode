import {trigger,transition,style,animate,state,keyframes} from '@angular/core';


export function EntryAnimation(t=300):any{
	return trigger('entryAnimation',[
			transition('void=>*',[style({opacity:0,transform:'translateX(-100px)'}),animate(t)])
		])
}
export function FadeIn(t=400):any{
	return trigger('fadeIn',[
		transition('void=>*',[style({opacity:0}),animate(t)])
	])
}
export function Fade(t=300):any{
	return trigger('fade',[
			transition('none=>block',[style({opacity:0}),animate(t)])
		])
}
export function Ficker(t=300,color='lightgray'):any{
	return trigger('ficker',[
			transition('*=>ficker',[style({background:color}),animate(t)])
		])
}
export function FickerIn(t=300):any{
	return trigger('fickerIn',[
			transition('*=>ficker',[style({transform:'translateX(-10px)',opacity:0.5}),animate(t)])		])
}
export function SlideToggle(t=300):any{
	return trigger('slideToggle',[
			state('false',style({display:'none'})),
			state('true',style({display:'inline-block'})),
			transition('false=>true',[style({height:'0px',opacity:0}),animate(t)]),
			transition('true=>false',[style({height:'*'}),animate(t,style({height:'0px',opacity:0}))])
		])
}
export function SlideRow(t=300):any{
	return trigger('slideRow',[
		state('false',style({display:'none'})),
		state('true',style({display:'block'})),
		transition('false=>true',[style({opacity:0,width:'0px'}),animate(t)]),
		transition('true=>false',[style({width:'*'}),animate(t,style({width:'0px',opacity:0}))])
	])
}
export function ShowToggle(t=500):any{
	return trigger('showToggle',[
		state('false',style({display:'none'})),
		state('true',style({display:'block'})),
		transition('false=>true',[style({opacity:0}),animate(t)]),
		transition('true=>false',[animate(t,style({opacity:0}))])
	])
}
export function ShowModal(t=0.5):any{
	return trigger('showModal',[
		state('hidden',style({display:'none',top:'0%'})),
		state('show',style({display:'block',top:'10%'})),
		transition('hidden=>show',[style({opacity:0}),animate(t+'s ease',style({opacity:1,top:'10%'}))]),
		transition('show=>hidden',[animate(t+'s ease',style({opacity:0,top:'0%'}))])
	])
}