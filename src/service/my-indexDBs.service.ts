import {Injectable} from '@angular/core';
import {IndexedDBZTWService} from '../js/indexedDB';
@Injectable()
export class MyIndexDBs{
    cappedWriteDB:any;
    journalColle:any;
    indexDB:any=new IndexedDBZTWService();
    constructor(){
        let option = {
            db: 'ztwBlogWrite',
            version: 1,
            colle: 'write',
            keyPath: 'journal'
        };
        this.cappedWriteDB=this.indexDB.IndexedDBztw(option);
        let optionJournalDB={
            db:'ztwBlog',
            version:1,
            colle:'journalOne',
            keyPath:'position'
        }
        this.journalColle=this.indexDB.cappedDBztw(optionJournalDB,{size:15});
    };

}