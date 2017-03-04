var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
var LoaderComponent = (function () {
    function LoaderComponent() {
        this.exist = true;
    }
    Object.defineProperty(LoaderComponent.prototype, "fn", {
        set: function (exist) {
            this.exist = exist ? false : true;
        },
        enumerable: true,
        configurable: true
    });
    ;
    return LoaderComponent;
}());
__decorate([
    Input('exist'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LoaderComponent.prototype, "fn", null);
LoaderComponent = __decorate([
    Component({
        selector: 'ztw-loader',
        template: "\n\t<div *ngIf='exist' class=\"spinner-loader\"></div>\n\t"
    })
], LoaderComponent);
export { LoaderComponent };
;
//# sourceMappingURL=loader.component.js.map