var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
var ModalComponent = (function () {
    function ModalComponent() {
    }
    ModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.modal').on('hidden.bs.modal', function () {
            _this.cancel();
        });
    };
    ModalComponent.prototype.show = function (value, fn) {
        var _this = this;
        this.content = value;
        $('.modal').modal('show');
        if (!fn)
            return;
        this.subject = new Subject();
        return new Promise(function (resolve) {
            _this.subject.subscribe(function (v) { return resolve(fn(v)); });
        });
    };
    ModalComponent.prototype.hide = function (fn) {
        $('.modal').modal('hide');
        if (!fn)
            return;
        this.subject = new Subject();
        this.subject.subscribe(fn);
    };
    ModalComponent.prototype.confirm = function () {
        this.subject.next(true);
    };
    ;
    ModalComponent.prototype.cancel = function () {
        this.subject.next(false);
    };
    return ModalComponent;
}());
ModalComponent = __decorate([
    Component({
        selector: 'alert-modal',
        template: "\n        <div class=\"modal fade\" >\n            <div class=\"modal-dialog\">\n                <div class=\"modal-content\">\n                    <div class=\"modal-header\">\n                        <h5><i class=\"fa fa-warning mr-2\"></i>Warning</h5>\n                        <button class=\"close\" data-dismiss=\"modal\">&times;</button>\n                    </div>\n                    <div class=\"modal-body\">\n                        {{content}}\n                    </div>\n                    <div class=\"modal-footer\">\n                        <button (click)=\"confirm()\" class=\"btn btn-secondary\" data-dismiss=\"modal\">confirm</button>\n                        <button (click)=\"cancel()\" class=\"btn btn-secondary\" data-dismiss=\"modal\">cancel</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n    "
    }),
    __metadata("design:paramtypes", [])
], ModalComponent);
export { ModalComponent };
;
//# sourceMappingURL=modal.component.js.map