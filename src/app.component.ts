import {Component,ViewChild} from '@angular/core';
import {LoginService} from './service/login.service';
import {Router} from '@angular/router';
declare var $:any;
@Component({
	selector:'my-app',
	template:`
		<nav class='navbar navbar-inverse navbar-toggleable-md bg-inverse' style="position:fixed;top:0px;left:0px;z-index:10;width:100%;">
			<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#topNavCollapse">
				<span class='navbar-toggler-icon'></span>
			</button>
			<div class='navbar-brand ' >
				<span>ZTW</span>
			</div>
			<div class='collapse navbar-collapse' id='topNavCollapse'>
				<nav class='navbar-nav mr-auto'>
					<a class='nav-item nav-link' [class.bottomBar]='ensureActive(home.className)'  #home [routerLink]='"homePage"' routerLinkActive='active'>首页</a>
					<a class='nav-item nav-link' [class.bottomBar]='ensureActive(journal.className)' #journal [routerLink]='"journal"' routerLinkActive='active'>日志</a>
					<a class="nav-item nav-link" [class.bottomBar]="ensureActive(photos.className)" #photos [routerLink]="'photos'" routerLinkActive="active">相册</a>
				</nav>
			
				<div class='navbar-text dropdown' [class.ww]="!container" style='color:gainsboro;'>
				 &nbsp;
				<div *ngIf='!loginService.logined' >
					<button  class='btn btn-sm btn-outline-secondary'  data-toggle='dropdown'>Login</button>
					<div class='dropdown-menu' style='left:-100px;padding:10px'>
						<form #loginForm='ngForm'>
						<div class='form-group has-success'>
							<input name='name' [(ngModel)]='loginName' class='form-control form-control-sm' placeholder='name' required minlength='4' maxlength='12'/>
						</div>
						<div class='form-group has-success'>
							<input name='pswd' [(ngModel)]='loginPswd' class='form-control form-control-sm' placeholder='password' required minlength='4' maxlength='12'/>
						</div>
						<button [disabled]="!loginForm.valid" class='btn btn-block btn-success' (click)=login()>login</button>
						</form>
					</div>
				</div>
				<div *ngIf='loginService.logined'>
					<button class='btn btn-outline-secondary dropdown-toggle btn-sm' data-toggle='dropdown'>Admin </button>
					<div class='dropdown-menu' style='left:-160px;padding:15px;width:250px;'>
						<div class=' media'>
							<img class='rounded d-flex mr-2' style='width:64px;height:64px;' src='./img/admin.jpg'>
							<div class='media-body'>
								<p>Hello</p>
								<p>Admin</p>
							</div>
						</div>
						<div class='dropdown-divider'> </div>
						<div>
							<a class='btn btn-secondary btn-sm' routerLink='write'>Write Journal</a>
						</div>
						<div class='dropdown-divider'> </div>
						<div>
							<button (click)='logout()' class='btn btn-secondary btn-sm'>logout</button>
						</div>
					</div>
				</div>
			</div>
			</div>
		</nav>
		<div style="width: 100%;height:50px"></div>
		<br>
		<div [class.container]='container'>
		<router-outlet></router-outlet>
		</div>
		<journals-nav></journals-nav>
	`,
	styles: [
		'.bottomBar{background:gray;border-radius:5px}',
		'.left-box{height:200px;border:1px solid red;}',
		'.ww{width:100%;}',
		'.navbar-text>div{position:absolute;top:0.5rem;right:10px;}'

	],
	animations:[]

})
export class AppComponent{
	constructor(
		public loginService:LoginService,
		private router:Router
	){}
	@ViewChild('loginForm')loginForm;
	loginName;
	loginPswd;
	logined:boolean=this.loginService.logined;
	container:boolean=true;
	ngOnInit(){
		this.setContainer();
        $(window).resize(()=>{
			this.setContainer()
        })
	}
	login(){
		this.loginService.login({a:this.loginName,p:this.loginPswd})
	}
	logout(){
		this.loginService.logout().then(v=>{
			this.router.navigate(['/homePage']);
		});
	}
	ensureActive(v){
		return /active/.test(v);
	};
	setContainer(){
		let width=$('body').innerWidth();
		if(width<980){
			this.container=false;
		}else{
			this.container=true;
		}
	}
};

