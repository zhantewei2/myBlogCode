import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './router.module';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {SimpleHttp} from './service/simpleHttp.service';
import {ShareModule} from './module/share.module';
import {DataPersistance} from './service/data-persistance.service'
import {JournalComponent} from './router/journal/journal.component';
import {LoaderComponent} from './general/loader.component';
import {PageBreakComponent} from './general/page-break.component';
import {JournalOneComponent} from './router/journal/journal-one.component';
import {HomePageComponent} from './router/home-page.component';
import {LoginService} from './service/login.service';
import {PageBreakService} from './service/page-break.service';
import {MyIndexDBs} from './service/my-indexDBs.service';
import {LeftMidFixComponent} from './general/left-mid-fix-component';
import {JournalsNavComponent} from './router/journals-nav-component';
import {SAComponent} from './general/SA.component';
import {ClassifyService} from './service/classify.service';
import {ConveyMessageService,ConveyJournalService} from './service/convey-message.service';
import {CategorysService}from './service/categorys.service';

@NgModule({
 imports:[
 	BrowserModule,
 	AppRoutingModule,
 	ReactiveFormsModule,
 	HttpModule,
	 ShareModule
 	],
 declarations:[
 	AppComponent,
 	JournalComponent,
 	LoaderComponent,
 	PageBreakComponent,
 	JournalOneComponent,
 	HomePageComponent,
	 LeftMidFixComponent,
	 JournalsNavComponent,
	 SAComponent
 	],
 bootstrap:[AppComponent],
 providers:[	
 	SimpleHttp,
 	DataPersistance,
 	LoginService,
 	PageBreakService,
	 MyIndexDBs,
	 ClassifyService,
	 ConveyMessageService,
	 ConveyJournalService,
	 CategorysService
 ]
})
export class AppModule{}
