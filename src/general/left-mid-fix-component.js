var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { SlideRow, ShowToggle } from '../animations/some-animate.fn';
var LeftMidFixComponent = (function () {
    function LeftMidFixComponent() {
        this.hidden = new EventEmitter();
        this.show = false;
        this.dWidth = 1430;
        this.outShow = false;
    }
    Object.defineProperty(LeftMidFixComponent.prototype, "fn", {
        set: function (v) {
            (v && !this.lgScreen) ? this.show = !this.show : 0;
        },
        enumerable: true,
        configurable: true
    });
    LeftMidFixComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.setContent();
        $(window).resize(function () {
            _this.setContent();
        });
        $('.main').scroll(function (e) {
            e.stopPropagation();
        });
    };
    ;
    LeftMidFixComponent.prototype.send = function () {
        this.hidden.emit();
    };
    LeftMidFixComponent.prototype.setContent = function () {
        var w = $('body').innerWidth();
        if (w > this.dWidth) {
            this.show = true;
            this.outShow = false;
            this.lgScreen = true;
        }
        else {
            this.show = false;
            this.outShow = true;
            this.lgScreen = false;
        }
    };
    return LeftMidFixComponent;
}());
__decorate([
    Output(),
    __metadata("design:type", Object)
], LeftMidFixComponent.prototype, "hidden", void 0);
__decorate([
    Input('toggle'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LeftMidFixComponent.prototype, "fn", null);
LeftMidFixComponent = __decorate([
    Component({
        selector: 'left-mid-fix',
        template: "\n    <div class=\"main d-flex flex-row-reverse\">       \n        <button *ngIf=\"!show\" class=\"btn btn-secondary btn-block \" (click)=\"show=!show\">\n            <i class=\"fa fa-th-list\"></i>\n        </button>\n        <div *ngIf=\"show\"  class=\"align-self-center fa-2x\" >\n            <i class=\"tohidden fa fa-chevron-circle-left\" (click)=\"show=!show;send()\"> </i>\n        </div>\n        <div  [@slideRow]=\"show?'true':'false'\" class=\"content\">\n            <ng-content></ng-content>\n        </div>\n    </div>  \n    <div *ngIf=\"outShow\" [@showToggle]=\"show?'true':'false'\" class=\"outShow\" (click)=\"show=!show;send()\">\n        \n    </div>\n    ",
        styles: [
            '.content{width:10rem;word-wrap:break-word;background:rgba(255,255,255,0.7);border:1px solid gainsboro;border-bottom-right-radius:1rem;border-top-right-radius:1rem}',
            '.main{z-index:3;position:fixed;left:0px;top:200px;border-bottom-right-radius:1rem;border-top-right-radius:1rem;}',
            '.tohidden{color:gray}',
            '.tohidden:hover{color:gainsboro}',
            '.outShow{position:fixed;left:0px;top:0px;width:100%;height:100%;background:rgba(255,255,255,0.7);z-index:2}',
            '.main::-webkit-scrollbar{width:1px;background:gainsboro}'
        ],
        animations: [
            SlideRow(),
            ShowToggle(),
        ]
    })
], LeftMidFixComponent);
export { LeftMidFixComponent };
//# sourceMappingURL=left-mid-fix-component.js.map