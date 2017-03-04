import {Pipe}from '@angular/core';
@Pipe({
    name:'toDate'
})
export class StringToDatePipe{
    transform(str){
        let date= new Date(str);
        return date.toLocaleString();
    }
}