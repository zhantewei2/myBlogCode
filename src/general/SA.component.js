var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EntryAnimation } from '../animations/some-animate.fn';
var SAComponent = (function () {
    function SAComponent() {
        this.dataArr2 = [];
        this.n = 0;
        this.len = 0;
        this.selected = new EventEmitter();
    }
    Object.defineProperty(SAComponent.prototype, "outclickFn", {
        set: function (data) {
            if (!data)
                return;
            this.selectedName = '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SAComponent.prototype, "fn", {
        set: function (data) {
            if (!data)
                return;
            this.dataArr = data;
            this.len = this.dataArr.length;
            this.begin();
        },
        enumerable: true,
        configurable: true
    });
    ;
    SAComponent.prototype.begin = function () {
        this.n < this.len ? this.dataArr2.push(this.dataArr[this.n]) : 0;
        this.n++;
    };
    SAComponent.prototype.click = function (name, e) {
        var node = e.target;
        node.style.transform = 'translateX(10px)';
        node.style.background = 'transparent';
        this.selectedName = name;
        this.selected.emit(name);
    };
    return SAComponent;
}());
__decorate([
    Output('clickSelected'),
    __metadata("design:type", Object)
], SAComponent.prototype, "selected", void 0);
__decorate([
    Input('outClick'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], SAComponent.prototype, "outclickFn", null);
__decorate([
    Input('data'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], SAComponent.prototype, "fn", null);
SAComponent = __decorate([
    Component({
        selector: 'my-asyncAnim',
        template: "\n        <div  class='list-group' *ngIf=\"dataArr2[0]\">\n            <div [class.selected]=\"selectedName==tg.name\"  (click)=\"click(tg.name,$event)\"  [@entryAnimation] pointer [model]=\"1\" (@entryAnimation.done)=\"begin()\"  *ngFor=\"let tg of dataArr2\"  class=\" list-group-item my-pile justify-content-between\">\n                {{tg.name | limitStr}}\n                <span class=\"badge badge-info badge-pill\">{{tg.count}} </span>\n             </div>\n        </div>\n          \n    ",
        styles: [
            '.my-pile{ border:1px solid gainsboro;margin-bottom:-20px;height:3rem;font-size:0.9rem;}',
            '.selected{box-shadow: 3px 0px 3px skyblue;font-size:1rem;font-weight:bold}'
        ],
        animations: [
            EntryAnimation(200)
        ]
    })
], SAComponent);
export { SAComponent };
//# sourceMappingURL=SA.component.js.map