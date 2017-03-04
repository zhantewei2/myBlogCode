import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {WriteJournalComponent} from './write-journal.component';
import {WriteEditorComponent} from './write-editor.component';
import {ShareModule} from '../../module/share.module';
const routes:any=[
	{	path:'',
		component:WriteJournalComponent
	}
];
@NgModule({
	imports:[
		ShareModule,
		RouterModule.forChild(routes)
	],
	declarations:[
		WriteJournalComponent,
		WriteEditorComponent
	]

})
export class WriteJournalModule{}