import {NgModule} from '@angular/core';
import {ShareModule} from '../../module/share.module';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {RootComponent} from './root.component';
import {UploadImgComponent} from './upload-img.component';
import {PopViewComponent} from '../../general/pop-view.component';
import {PhotoComponent} from './photo.component';
import {HomeComponent} from './home.component';
import {PhotoOneComponent} from './photo-one.component';
import {ShareService} from './share.service';
import {PopOverComponent} from '../../general/popOver.component';
let routerConfig=[
    {
        path:'',
        component:HomeComponent,
        children:[
            {
                path:'',
                component:RootComponent
            },
            {
                path:'photo',
                component:PhotoComponent
            }
        ]
    }
];
@NgModule({
    imports:[
        ReactiveFormsModule,
        ShareModule,
        RouterModule.forChild(routerConfig)
    ],
    declarations:[
        HomeComponent,
        RootComponent,
        UploadImgComponent,
        PopViewComponent,
        PhotoComponent,
        PhotoOneComponent,
        PopOverComponent
    ],
    providers:[
        ShareService
    ]
})
export class PhotosModule{}