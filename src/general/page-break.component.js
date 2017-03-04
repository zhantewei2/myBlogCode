var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Optional, Input } from '@angular/core';
import { Parent, SimpleHttp } from '../service/simpleHttp.service';
import { ActivatedRoute } from '@angular/router';
import { PageBreakService } from '../service/page-break.service';
import { DataPersistance } from '../service/data-persistance.service';
var PageBreakComponent = (function () {
    function PageBreakComponent(parent, simpleHttp, route, pageService, 
        //pageService storage: [url ][router];
        db) {
        this.parent = parent;
        this.simpleHttp = simpleHttp;
        this.route = route;
        this.pageService = pageService;
        this.db = db;
        this.symbolMerge = '_ztw_';
        this.cancelLC = true;
        this.btns = [];
        this.limitPage = 5;
        this.options = this.parent.getOption;
        this.shareOpt = this.parent.shareOpt;
        this.addition = null;
        !this.db.db.allJournals ? this.db.db.allJournals = this.db.initCollection(20) : 0;
    }
    Object.defineProperty(PageBreakComponent.prototype, "getClassify", {
        set: function (v) {
            //v[0]-urlName;
            //v[1]-addonConditionStr;
            var v0 = v[0], v1 = v[1];
            this.v0 = v0;
            this.v1 = v1;
            if (!v0)
                return;
            this.sendUrl = this.parent.url[v0];
            this.addition = null;
            if (v1) {
                this.addition = v1;
                this.name = v0 + this.symbolMerge + v1;
            }
            else {
                this.name = v0;
            }
            !this.pageService.totalSize[this.name] ? this.pageService.totalSize[this.name] = -1 : 0;
            this.options.totalSize = -1;
            this.shareOpt.nowPage = 0;
            this.options.start = 0;
            this.start();
        },
        enumerable: true,
        configurable: true
    });
    PageBreakComponent.prototype.start = function () {
        var _this = this;
        var opt = this.options;
        if (this.pageService.totalSize[this.name] !== -1) {
            this.route.params.subscribe(function (d) {
                d.nowPage ? _this.shareOpt.nowPage = +d.nowPage : 0;
                d.index ? _this.shareOpt.pageIndex = +d.index : 0;
                opt.totalSize = _this.pageService.totalSize[_this.name];
                _this.init(opt);
                _this.updateParent(_this.sendUrl, opt);
            });
        }
        else {
            this.updateParent(this.sendUrl, opt).then(function (v) {
                _this.init(opt);
            });
        }
    };
    PageBreakComponent.prototype.init = function (opt) {
        this.totalPage = Math.ceil(opt.totalSize / opt.pageSize) - 1;
        this.convertStart(this.shareOpt.nowPage);
        this.rangePage = Math.floor(this.shareOpt.nowPage / this.limitPage);
        this.provideBtns(this.rangePage);
    };
    PageBreakComponent.prototype.pre = function () {
        var targetPage = this.shareOpt.nowPage - 1;
        if (targetPage >= 0) {
            this.gotoPage(targetPage);
        }
    };
    PageBreakComponent.prototype.next = function () {
        var targetPage = this.shareOpt.nowPage + 1;
        if (targetPage <= this.totalPage) {
            this.gotoPage(targetPage);
        }
    };
    PageBreakComponent.prototype.provideBtns = function (rangeNum) {
        this.btns = [];
        rangeNum++;
        var i = rangeNum * this.limitPage - this.limitPage;
        var oldI = i;
        var end = rangeNum * this.limitPage;
        end = end > this.totalPage ? this.totalPage : end;
        for (i; i <= end; i++) {
            this.btns.push(i);
        }
        ;
        rangeNum !== 1 ? this.btns.unshift(oldI - 1) : 0;
    };
    PageBreakComponent.prototype.gotoPage = function (page) {
        if (page === this.shareOpt.nowPage)
            return;
        if (this.parent.shareOpt.barrage)
            return;
        this.shareOpt.pageIndex = -1;
        var rangePageNow = Math.floor(page / this.limitPage);
        this.cancelLC = false;
        this.options.start = this.convertStart(page);
        this.shareOpt.nowPage = page;
        if (rangePageNow !== this.rangePage) {
            this.rangePage = rangePageNow;
            this.provideBtns(rangePageNow);
        }
        ;
        this.updateParent(this.sendUrl, this.options);
    };
    PageBreakComponent.prototype.updateParent = function (url, opt0) {
        var _this = this;
        var opt = {};
        for (var i in opt0) {
            opt[i] = opt0[i];
        }
        if (this.addition) {
            opt['addon'] = this.addition;
        }
        ;
        if (this.options.start < 0) {
            opt.pageSize = this.options.pageSize + this.options.start;
            opt.start = 0;
        }
        ;
        var item = this.name + this.symbolMerge + this.shareOpt.nowPage;
        return new Promise(function (resolve) {
            var storeData = _this.db.db.allJournals.get(item);
            if (storeData) {
                if (storeData == 'empty') {
                    _this.parent.emptyContent = true;
                    _this.parent.heroes = '';
                }
                else {
                    _this.parent.emptyContent = false;
                    _this.updateData(storeData);
                }
                resolve();
            }
            else {
                _this.simpleHttp.post(url, opt).then(function (d) {
                    if (!d) {
                        _this.parent.emptyContent = true;
                        _this.parent.heroes = '';
                        _this.db.db.allJournals.set(item, 'empty');
                        return;
                    }
                    _this.parent.emptyContent = false;
                    d = JSON.parse(d);
                    var len = d.data.length;
                    var dataInvert = [];
                    while (len) {
                        len--;
                        var per = d.data[len];
                        per.index = len;
                        dataInvert.push(per);
                    }
                    _this.db.db.allJournals.set(item, dataInvert);
                    _this.updateData(dataInvert, d.count, function () {
                        resolve();
                    });
                });
            }
        });
    };
    PageBreakComponent.prototype.convertStart = function (page) {
        ++page;
        return this.options.start = this.options.totalSize - page * this.options.pageSize;
    };
    PageBreakComponent.prototype.updateData = function (data, count, fn) {
        this.parent.heroes = data;
        if (count) {
            this.options.totalSize = count;
            this.pageService.totalSize[this.name] = count;
        }
        this.cancelLC === 'undefined' ? 0 : this.cancelLC = true;
        if (!fn)
            return;
        fn();
    };
    return PageBreakComponent;
}());
__decorate([
    Input('classify'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PageBreakComponent.prototype, "getClassify", null);
PageBreakComponent = __decorate([
    Component({
        selector: 'ztw-pageBreakBar',
        template: "\n\t\t<div class='btn-group'>\n\t\t\t<button class='btn btn-outline-secondary' (click)='pre()' [disabled]='shareOpt.nowPage-1<0'>&lt; </button>\n\t\t\t<button (click)='gotoPage(btn)' [class.active]='btn==shareOpt.nowPage' class='btn btn-outline-secondary' *ngFor='let btn of btns'>{{btn}}</button>\n\t\t\t<button class='btn btn-outline-secondary' (click)='next()' [disabled]='shareOpt.nowPage+1>totalPage'>&gt; </button>\n\t\t\t<div style='display:inline-block;height:50px;'> \n\t\t\t\t<ztw-loader [exist]='cancelLC'></ztw-loader>\n\t\t\t</div>\n\t\t</div>\n\t"
    }),
    __param(0, Optional()),
    __metadata("design:paramtypes", [Parent,
        SimpleHttp,
        ActivatedRoute,
        PageBreakService,
        DataPersistance])
], PageBreakComponent);
export { PageBreakComponent };
//# sourceMappingURL=page-break.component.js.map