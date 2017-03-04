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
import { Router, ActivatedRoute } from '@angular/router';
import { SimpleHttp } from '../../service/simpleHttp.service';
import { MyIndexDBs } from '../../service/my-indexDBs.service';
import { ConveyMessageService, ConveyJournalService } from '../../service/convey-message.service';
import { SlideRow } from '../../animations/some-animate.fn';
import { LoginService } from '../../service/login.service';
import { DataPersistance } from '../../service/data-persistance.service';
import { CategorysService } from '../../service/categorys.service';
var JournalOneComponent = (function () {
    function JournalOneComponent(route, router, db, simpleHttp, _cms, _cjs, loginService, _dp, _cs) {
        this.route = route;
        this.router = router;
        this.db = db;
        this.simpleHttp = simpleHttp;
        this._cms = _cms;
        this._cjs = _cjs;
        this.loginService = loginService;
        this._dp = _dp;
        this._cs = _cs;
        this.goBackObj = {};
        this.obj = {};
        this.fixButton = false;
        this.journalData = {};
        this.edit = false;
        this.showTags = false;
    }
    JournalOneComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.addEventListener('scroll', (function () {
            var pre = 0;
            return function () {
                var top = document.documentElement.scrollTop || document.querySelector('body').scrollTop;
                if (top > 16) {
                    if (pre && top <= pre) {
                        !_this.fixButton ? _this.fixButton = true : 0;
                    }
                    else {
                        _this.fixButton ? _this.fixButton = false : 0;
                    }
                    pre = top;
                }
                else if (top < 16) {
                    _this.fixButton = false;
                }
            };
        })());
        var params = this.route.snapshot.params;
        this.obj.__proto__ = this._cms.conveyData;
        this.title = encodeURIComponent(params.n);
        this.db.journalColle.then(function (model) {
            model.find(_this.title).then(function (data) {
                if (params.f === 'edit') {
                    _this.postOne(model);
                    return;
                }
                if (_this._cms.conveyData) {
                    window.history.replaceState({}, '', 'journal;nowPage=' + _this.obj.nowPage + ';index=' + _this.obj.index);
                    _this.goBackObj = { nowPage: _this.obj.nowPage, index: _this.obj.index };
                    if (data && data.version == _this.obj.version && data.date == _this.obj.date) {
                        _this.obj.content = data.content;
                        data.notesCount > _this.obj.notesCount ? _this.obj.notesCount = data.notesCount : 0;
                        _this.initPage(_this.obj);
                    }
                    else {
                        _this.postOne(model);
                    }
                }
                else {
                    if (data) {
                        _this.postTwo(model, data);
                    }
                    else {
                        _this.postOne(model);
                    }
                }
            });
        });
    };
    ;
    JournalOneComponent.prototype.postOne = function (model) {
        var _this = this;
        this.simpleHttp.post('router/journals.json/one', { id: this.title }).then(function (json) {
            var data = JSON.parse(json);
            _this.initPage(data);
            model.update({
                position: data.title,
                content: data.content,
                date: data.date,
                version: data.version,
                notesCount: data.notesCount,
                lastModify: data.lastModify,
                category: data.category,
                tags: data.tags
            });
        });
    };
    JournalOneComponent.prototype.postTwo = function (model, DBdata) {
        var _this = this;
        this.simpleHttp.post('router/journals.json/one/part', { id: this.title }).then(function (json) {
            var data = JSON.parse(json);
            if (DBdata.version !== data.version || DBdata.date !== data.date) {
                _this.postOne(model);
            }
            else {
                data.__proto__ = DBdata;
                _this.initPage(data);
            }
        });
    };
    JournalOneComponent.prototype.initPage = function (data) {
        this.journalData = data;
        this.journalData.title = this.title;
        this.router.navigate([data.notesCount], { relativeTo: this.route });
    };
    JournalOneComponent.prototype.goBack = function () {
        this.router.navigate(['../', this.goBackObj], { relativeTo: this.route });
    };
    ;
    JournalOneComponent.prototype.modifyJournal = function () {
        this._cjs.conveyJournalData = this.journalData;
        this.router.navigate(['./write', { modify: 1 }]);
    };
    ;
    JournalOneComponent.prototype.delJournal = function () {
        var _this = this;
        var post = function (obj) {
            _this.simpleHttp.post('router/admin/journals.json/del', obj).then(function (v) {
                _this.db.journalColle.then(function (model) {
                    model.remove(_this.title).then(function (v) {
                        _this._dp.db = {};
                        _this.router.navigate(['../'], { relativeTo: _this.route });
                    });
                });
            });
        };
        new Promise(function (r) {
            if (confirm('delete ' + _this.title + '?')) {
                if (!_this._cs.tgArr) {
                    _this._cs.getTags().then(function (v) {
                        if (!v)
                            return;
                        r(true);
                    });
                }
                else {
                    r(true);
                }
            }
            else {
                r(false);
            }
        }).then(function (v) {
            if (!v)
                return;
            var sendObj = { t: _this.title }, tags = _this.journalData.tags, option;
            if (tags && tags[0]) {
                _this._cs.tgArr.forEach(function (item) {
                    tags.forEach(function (tagName) {
                        if (item.name == tagName) {
                            if (item.count <= 1) {
                                _this._cs.tgArr.splice(_this._cs.tgArr.indexOf(item), 1);
                            }
                            else {
                                item.count--;
                            }
                        }
                    });
                });
                sendObj.d = _this._cs.tgArr;
            }
            ;
            post(sendObj);
        });
    };
    return JournalOneComponent;
}());
JournalOneComponent = __decorate([
    Component({
        template: "\n\t\t<div >\n\t\t\t<button class=\"btn btn-secondary btn-lg\" (click)=\"goBack()\"><i class=\"fa-chevron-left fa\"> </i> Back</button>\n\t\t\t<span  [@slideRow]=\"fixButton?'true':'false'\" class=\"badge badge-pill fixButton\"  (click)='goBack()' pointer >\n\t\t\t\t<i class=\"fa-arrow-circle-o-left fa fa-3x\"></i>\n\t\t\t</span>\n\t\t\t<div class=\"col-xl-10 col\">\n\t\t\t\t<div class=\"card\" class=\"main\">\n\t\t\t\t\t<h1 class=\"text-center\">{{title}}</h1>\n\t\t\t\t\t<ztw-loader [exist]=\"journalData.content\"> </ztw-loader>\n\t\t\t\t\t<div [innerHTML]=\"journalData.content\"> </div>\n\t\t\t\t\t<div class=\"mt-5 d-flex flex-column align-items-end text-muted\">\n\t\t\t\t\t\t<div *ngIf=\"loginService.logined\" class=\"mr-3\">\n\t\t\t\t\t\t\t<span (click)=\"edit=!edit\" >\n\t\t\t\t\t\t\t\t<span [hidden]=\"!edit\">\n\t\t\t\t\t\t\t\t\t<a class=\"btn btn-secondary noneB\" pointer (click)=\"delJournal()\">Del </a>\n\t\t\t\t\t\t\t\t\t<a class=\"btn btn-secondary noneB\" pointer (click)=\"modifyJournal()\">Modify</a>\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t<span class=\"btn btn-secondary noneB\" pointer>\n\t\t\t\t\t\t\t\t<i class=\"fa-edit fa\"></i>Edit\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"mr-3\">\t\t\t\t\n\t\t\t\t\t\t\t\t<i class=\"fa fa-calendar \"></i>{{journalData.date | date}} <i class=\"fa fa-eye\"> </i>{{journalData.visitCount}}\n\t\t\t\t\t\t\t\t<i class=\"fa-comments fa \"> </i>{{journalData.notesCount}}\t\t\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div *ngIf=\"journalData.lastModify\" style=\"font-size:0.9rem \" class=\"mr-3\">\n\t\t\t\t\t\t\tlastModify:&nbsp;\n\t\t\t\t\t\t\t<i class=\"fa-calendar-plus-o fa\"></i>\n\t\t\t\t\t\t\t<span>{{journalData.lastModify | toDate}} </span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"d-flex flex-wrap mr-3\" *ngIf=\"journalData.tags\">\n\t\t\t\t\t\t\t<span [hidden]=\"!showTags\">\n\t\t\t\t\t\t\t\t<span class=\"badge badge-default mr-2 myBadge\" *ngFor=\"let tag of journalData.tags\">{{tag}} </span>\n\t\t\t\t\t\t\t</span>&nbsp;\n\t\t\t\t\t\t\t<i class=\"fa-tags fa\" (mouseover)=\"showTags=true\" (mouseleave)=\"showTags=false\"> </i>{{journalData.tags.length}}\n\t\t\t\t\t \t</div>\n\t\t\t\t\t </div>\n\t\t\t\t\t \n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<router-outlet></router-outlet>\n\t\t</div>\n\t",
        styles: [
            '.main{margin:1rem}',
            '.fixButton{color:black;position:fixed;left:10%;top:10%;z-index:40;overflow:hidden;box-shadow:3px 3px 3px gray;opacity:0.5}',
            '.d-flex i{margin-right:0.5rem;margin-left:1.5rem;}',
            '.noneB{border-width:0px;}',
            '.myBadge{background:gray}',
            '.fa-tags:hover{color:green;cursor:pointer}'
        ],
        animations: [SlideRow()]
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        Router,
        MyIndexDBs,
        SimpleHttp,
        ConveyMessageService,
        ConveyJournalService,
        LoginService,
        DataPersistance,
        CategorysService])
], JournalOneComponent);
export { JournalOneComponent };
;
//# sourceMappingURL=journal-one.component.js.map