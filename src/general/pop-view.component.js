var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, EventEmitter } from '@angular/core';
import { ShowModal } from '../animations/some-animate.fn';
var PopViewComponent = (function () {
    function PopViewComponent() {
        this.hiddenPop = true;
        this.contentPop = 'hidden';
        this.hiddenEvent = new EventEmitter();
    }
    PopViewComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        $('#div1').click(function (e) {
            e.stopPropagation();
        });
        $('.popMain').click(function (e) {
            _this.hidden();
        });
    };
    PopViewComponent.prototype.show = function () {
        this.hiddenPop = false;
        this.contentPop = 'show';
        document.querySelector('body').style.overflow = 'hidden';
    };
    PopViewComponent.prototype.hidden = function () {
        this.contentPop = 'hidden';
    };
    PopViewComponent.prototype.hiddenAll = function () {
        if (this.contentPop == 'show')
            return;
        this.hiddenPop = true;
        document.querySelector('body').style.overflow = 'auto';
        this.hiddenEvent.emit(true);
    };
    PopViewComponent.prototype.toggle = function () {
        this.hiddenPop = !this.hiddenPop;
    };
    return PopViewComponent;
}());
__decorate([
    Output('hidden'),
    __metadata("design:type", Object)
], PopViewComponent.prototype, "hiddenEvent", void 0);
PopViewComponent = __decorate([
    Component({
        selector: 'pop-view',
        template: "\n        <div  class=\"popMain bg justify-content-center\" [hidden]='hiddenPop' [class.d-flex]=\"!hiddenPop\">                    \n            <div  class=\"col-xl-6 col-md-8 col-10 \" style=\"height:101%\">\n                <div class=\"bg2\" id=\"div1\" [@showModal]=\"contentPop\" (@showModal.done)=\"hiddenAll()\">\n                    <span><i class=\"fa-bookmark-o fa fa-2x text-success\"></i></span>\n                    <span class=\"close text-right mb-2\" (click)='hidden()'><i class=\"text-muted fa fa-window-close-o\"></i> </span>\n                    <div class=\"card-block\">\n                        <ng-content></ng-content>\n                    </div>\n                 </div>\n           </div>\n        </div>\n    ",
        styles: [
            '.popMain{width:100%;height:100%;position:fixed;top:0px;left:0px;z-index:1;overflow:auto;z-index:20}',
            '.bg{background:rgba(255,255,255,0.5)}',
            '.bg2{background:rgba(255,255,255,0.9);position:absolute;width:100%;border:1px solid gainsboro;border-radius:0.5rem;}'
        ],
        animations: [ShowModal()]
    })
], PopViewComponent);
export { PopViewComponent };
//# sourceMappingURL=pop-view.component.js.map