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
var BreakBarComponent = (function () {
    function BreakBarComponent() {
        this.selected = new EventEmitter();
        this.selectedNum = 1;
    }
    Object.defineProperty(BreakBarComponent.prototype, "fn", {
        set: function (barArr) {
            if (!barArr)
                return;
            this.maxSize = barArr.length;
            this.barArr = barArr;
        },
        enumerable: true,
        configurable: true
    });
    ;
    BreakBarComponent.prototype.ngOnInit = function () {
    };
    BreakBarComponent.prototype.selectedFn = function (v) {
        this.goPage(v);
    };
    BreakBarComponent.prototype.pre = function () {
        this.goPage(this.selectedNum - 1);
    };
    BreakBarComponent.prototype.next = function () {
        this.goPage(this.selectedNum + 1);
    };
    ;
    BreakBarComponent.prototype.goPage = function (v) {
        if (v >= 1 && v <= this.maxSize) {
            this.selectedNum = v;
            this.selected.emit(v);
        }
    };
    return BreakBarComponent;
}());
__decorate([
    Input('barArr'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], BreakBarComponent.prototype, "fn", null);
__decorate([
    Output('selected'),
    __metadata("design:type", Object)
], BreakBarComponent.prototype, "selected", void 0);
BreakBarComponent = __decorate([
    Component({
        selector: 'my-breakBar',
        template: "\n        <div >\n            <button [disabled]=\"selectedNum<=1\" class=\"btn dotBtn\" (click)=\"pre()\">&lt; </button>\n            <button class=\"btn dotBtn noneBtn\" [class.active2]=\"v==selectedNum\"  *ngFor=\"let v of barArr\" (click)=\"selectedFn(v)\">{{v}} </button>\n            <button [disabled]=\"selectedNum>=maxSize\" class=\"btn dotBtn\" (click)=\"next()\">&gt; </button>\n        </div>\n    ",
        styles: [
            '.dotBtn{border-radius:0.5rem;background:white;border:1px solid gainsboro}',
            '.active2{font-weight:bold;color:white;background:gray}'
        ]
    })
], BreakBarComponent);
export { BreakBarComponent };
//# sourceMappingURL=break-bar.component.js.map