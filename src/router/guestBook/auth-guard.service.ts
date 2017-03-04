import {Injectable} from '@angular/core';
import {MessageBoardComponent} from './messageBoard.component';
@Injectable()
export class AuthGuard{
    constructor(){}
    canDeactivate(com:MessageBoardComponent){
        let value=com.formGroup.value;
        if(!value.name&&!value.content)return true;
        return com.alert();


    }
}