var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
var LimitStrPipe = (function () {
    function LimitStrPipe() {
    }
    LimitStrPipe.prototype.transform = function (str, n) {
        if (n === void 0) { n = 18; }
        var len = 0, str2 = '';
        for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
            var i = str_1[_i];
            len += i.codePointAt(0).toString(16).length;
            str2 += i;
            if (len > n) {
                str2 += '...';
                break;
            }
        }
        return str2;
    };
    return LimitStrPipe;
}());
LimitStrPipe = __decorate([
    Pipe({ name: 'limitStr' })
], LimitStrPipe);
export { LimitStrPipe };
//# sourceMappingURL=limit-str-pipe.js.map