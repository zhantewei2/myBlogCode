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
import { SimpleHttp } from '../service/simpleHttp.service';
import { Subject } from 'rxjs/Subject';
import { EntryAnimation } from '../animations/some-animate.fn';
import 'rxjs/add/operator/debounceTime';
var colorArr = ['red', 'maroon', 'royalblue', 'peru', 'skyblue', 'blue', 'gray', 'purple'];
var VerifyCanvasComponent = (function () {
    function VerifyCanvasComponent(simpleHttp) {
        var _this = this;
        this.simpleHttp = simpleHttp;
        this.showCanvas = false;
        this.w = 100;
        this.h = 50;
        this.canvasHadLoad = true;
        this.subject = new Subject();
        this.verifyStr = undefined;
        this.content = '';
        this.subject.debounceTime(1000).subscribe(function (v) {
            _this.simpleHttp.post('/router/journals.json/one/notes/verify').then(function (v) {
                var value = _this.decrypt(v, 'ztwk'), canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), dots = 5, grd;
                _this.verifyStr = value.toLowerCase();
                ctx.clearRect(0, 0, _this.w, _this.h);
                ctx.textBaseline = 'top';
                ctx.font = '1.5rem Verdana';
                _this.draw(value, ctx, grd);
                while (dots--) {
                    _this.addDot(ctx);
                    _this.addDot2(ctx);
                    _this.addImpurity(ctx);
                }
                ;
                _this.canvasHadLoad = true;
            });
        });
    }
    VerifyCanvasComponent.prototype.clearVerify = function () {
        this.content = '';
        this.verifyStr = undefined;
        var canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, this.w, this.h);
    };
    VerifyCanvasComponent.prototype.getVerify = function () {
        this.verifyStr = null;
        this.canvasHadLoad = false;
        this.subject.next(true);
    };
    VerifyCanvasComponent.prototype.draw = function (str, ctx, grd) {
        console.log(str);
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'gray';
        for (var i = 0, len = str.length; i < len; i++) {
            var rotate = (10 - Math.floor(Math.random() * 20)) / 10 * Math.PI / 15;
            ctx.fillStyle = this.rdmColor();
            ctx.rotate(rotate);
            ctx.fillText(str[i], (this.w / 5) * i + this.w / 10, Math.round(Math.random() * (this.h / 5)));
            ctx.rotate(-rotate);
        }
    };
    VerifyCanvasComponent.prototype.rdmColor = function () {
        return colorArr[Math.floor(Math.random() * colorArr.length)];
    };
    VerifyCanvasComponent.prototype.addImpurity = function (ctx) {
        var halfX = this.w / 2, halfY = this.h / 2, beginX = Math.random() * this.w / 4, beginY = Math.random() * this.h, endX = halfX + Math.random() * halfX, temp = beginY + halfY, endY = temp > this.h ? Math.random() * halfY : temp;
        ctx.beginPath();
        ctx.moveTo(beginX, beginY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    };
    VerifyCanvasComponent.prototype.addDot = function (ctx) {
        ctx.strokeStyle = this.rdmColor();
        ctx.beginPath();
        ctx.arc(Math.random() * this.w, Math.random() * this.h, Math.ceil(Math.random() * 4), 0, 2 * Math.PI);
        ctx.stroke();
    };
    ;
    VerifyCanvasComponent.prototype.addDot2 = function (ctx) {
        ctx.strokeStyle = this.rdmColor();
        ctx.beginPath();
        ctx.arc(Math.random() * this.w, Math.random() * this.h, Math.ceil(Math.random() * 3), 0, 2 * Math.PI);
        ctx.stroke();
    };
    VerifyCanvasComponent.prototype.decrypt = function (str, key) {
        var ring = (str.charCodeAt(4) - 65).toString(2), len = 4, i, i2, temp, str2 = '';
        while (len--) {
            i = key.charCodeAt(3 - len);
            i2 = str.charCodeAt(len) - 48;
            temp = ring[len + 1] === '1' ? i - i2 : i + i2;
            str2 += String.fromCharCode(temp);
        }
        return str2;
    };
    return VerifyCanvasComponent;
}());
VerifyCanvasComponent = __decorate([
    Component({
        selector: 'verify-canvas',
        template: "\n        <div *ngIf=\"showCanvas\" [@entryAnimation] class=\"d-flex form-group row has-suceess\">\n            <div class=\"col-6 input-group\">\n                <input class=\"form-control\"  [(ngModel)]=\"content\" />\n                <span class=\"input-group-addon\" ><i class=\"fa \" [class.fa-check-circle]=\"content.toLowerCase()==verifyStr\"></i></span>\n            </div>\n            <label class=\"col-6\">\n                 <canvas (click)=\"getVerify()\" class=\"btn btn-secondary\" id=\"canvas\" width=\"100px\" height=\"50px\" ></canvas>\n                 <i [style.display]=\"canvasHadLoad?'none':'inline-block'\" class=\"fa fa-spinner fa-spin fa-2x\"> </i>\n             </label>\n        </div>\n    ",
        styles: ['.success{background:green}'],
        animations: [EntryAnimation()]
    }),
    __metadata("design:paramtypes", [SimpleHttp])
], VerifyCanvasComponent);
export { VerifyCanvasComponent };
//# sourceMappingURL=verify-canvas.component.js.map