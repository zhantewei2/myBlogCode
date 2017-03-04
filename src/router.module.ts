import {Routes,RouterModule} from "@angular/router";
import {NgModule} from '@angular/core';
import {JournalComponent} from './router/journal/journal.component';
import {JournalOneComponent} from './router/journal/journal-one.component';
import {HomePageComponent} from './router/home-page.component';
import {AuthGuard}from './service/auth-guard.service';
const routes:Routes=[
	{path:'',redirectTo:'homePage',pathMatch:'full'},
	{path:'homePage',component:HomePageComponent},
 	{path:'journal',component:JournalComponent,},
 	{	path:'journal/one',
		component:JournalOneComponent,

		children:[
			{path:'',loadChildren:'./router/guestBook/guestBook.module#GuestBookModule'}
		]
	},
 	{	path:'write',
		loadChildren:'./router/writeJournal/writeJournal.module#WriteJournalModule',
 		canLoad:[AuthGuard]
 	},
	{
		path:'photos',
		loadChildren:'./router/photos/photos.module#PhotosModule'
	}
];


@NgModule({
	imports:[
		RouterModule.forRoot(routes)
	],
	declarations:[],
	exports:[
		RouterModule
	],
	providers:[AuthGuard]

})
export class AppRoutingModule{

}
