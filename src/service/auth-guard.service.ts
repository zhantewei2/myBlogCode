import {Injectable} from '@angular/core';
import {LoginService} from './login.service';
import {Router} from '@angular/router';
@Injectable()
export class AuthGuard{
    constructor(
        private loginService:LoginService,
        private router:Router
    ){}
    canLoad(){
        if(this.loginService.logined)return true;
        this.router.navigate(['/homePage']);
        return false;
    }
}