import {Component} from '@angular/core';
import {Subject}from 'rxjs/Subject';
declare var $:any;
@Component({
    selector:'alert-modal',
    template:`
        <div class="modal fade" >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5><i class="fa fa-warning mr-2"></i>Warning</h5>
                        <button class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        {{content}}
                    </div>
                    <div class="modal-footer">
                        <button (click)="confirm()" class="btn btn-secondary" data-dismiss="modal">confirm</button>
                        <button (click)="cancel()" class="btn btn-secondary" data-dismiss="modal">cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ModalComponent{
    content:string;
    subject:Subject<any>;
    constructor(){

    }
    ngOnInit(){
        $('.modal').on('hidden.bs.modal',()=>{
            this.cancel();
        })
    }
    show(value,fn){
        this.content=value;
        $('.modal').modal('show');
        if(!fn)return;
        this.subject= new Subject();
        return new Promise(resolve=> {
            this.subject.subscribe(v=>resolve(fn(v)));
        })
    }
    hide(fn){
        $('.modal').modal('hide');
        if(!fn)return;
        this.subject=new Subject();
        this.subject.subscribe(fn);
    }
    confirm(){
        this.subject.next(true);
    };
    cancel(){
        this.subject.next(false);
    }
};
