var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, HostListener, ElementRef, Input } from '@angular/core';
var PointerDirective = (function () {
    function PointerDirective(el) {
        this.el = el;
        this.el.nativeElement.style.transition = 'background 1s, transform 1s';
        this.endColor = this.endColor || 'transparent';
    }
    PointerDirective.prototype.mouseEnter = function () {
        this.el.nativeElement.style.cursor = 'pointer';
        this.el.nativeElement.style.backgroundColor = 'skyblue';
        this.append(this.model);
    };
    PointerDirective.prototype.mouseLeave = function () {
        this.el.nativeElement.style.backgroundColor = this.endColor;
        this.remove(this.model);
    };
    PointerDirective.prototype.append = function (model) {
        if (!model)
            return;
        if (model == 1) {
            return this.el.nativeElement.style.transform = 'translateY(-0.8rem)';
        }
        else {
            return;
        }
    };
    PointerDirective.prototype.remove = function (model) {
        if (!model)
            return;
        if (model == 1) {
            this.el.nativeElement.style.backgroundColor = 'white';
            this.el.nativeElement.style.transform = 'translateY(0rem)';
        }
        else {
            return;
        }
    };
    return PointerDirective;
}());
__decorate([
    Input('model'),
    __metadata("design:type", Object)
], PointerDirective.prototype, "model", void 0);
__decorate([
    Input('pointer'),
    __metadata("design:type", Object)
], PointerDirective.prototype, "endColor", void 0);
__decorate([
    HostListener('mouseenter'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PointerDirective.prototype, "mouseEnter", null);
__decorate([
    HostListener('mouseleave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PointerDirective.prototype, "mouseLeave", null);
PointerDirective = __decorate([
    Directive({
        selector: '[pointer]'
    }),
    __metadata("design:paramtypes", [ElementRef])
], PointerDirective);
export { PointerDirective };
//# sourceMappingURL=pointer.directive.js.map