import {Injectable} from '@angular/core';
export class ConveyData{
    nowPage:number;
    index:number;
    pageSize:number;
    // journal data:
    version:number;
    notesCount:number;
    visitCount:number;
    date:Date;
    lastModify:Date;
    tags:Array<any>;
    category:string;
    constructor(options:any){
        this.nowPage=options.nowPage||0;
        this.index=options.index||0;
        this.pageSize=options.pageSize||0;
        this.version=options.version||0;
        this.notesCount=options.notesCount||0;
        this.visitCount=options.visitCount||0;
        this.tags=options.tags||undefined;
        this.lastModify=options.lastModify||undefined;
        this.date=options.date||Date();
        this.category=options.category||undefined;
    }
}

@Injectable()
export class ConveyMessageService{
    constructor(){};
    conveyData:ConveyData;
    setData(options:any){
        this.conveyData=new ConveyData(options);
    };
    msnBoardBack=false;
}
@Injectable()
export class ConveyJournalService{
    conveyJournalData:any;
    constructor(){}
}