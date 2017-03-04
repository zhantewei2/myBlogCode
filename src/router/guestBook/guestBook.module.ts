import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MessageBoardComponent} from './messageBoard.component';
import {ShareModule} from '../../module/share.module';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from './auth-guard.service';
import {VerifyCanvasComponent} from '../../general/verify-canvas.component';


const routes:any=[
	{	path:':id',
		canDeactivate:[AuthGuard],
		component:MessageBoardComponent
	}
];
@NgModule({
	imports:[
		ShareModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes)
	],
	declarations:[
		MessageBoardComponent,
		VerifyCanvasComponent
	],
	exports:[
		MessageBoardComponent
	],
	providers:[AuthGuard]

})
export class GuestBookModule{}