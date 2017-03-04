export function arrAsyncForEach() {
    (Array as any).prototype.AsyncForEach=function(fn,endFn){
        this.length?fn(this[0],()=>{this.slice(1).AsyncForEach(fn,endFn)}):endFn();
    };
};
export function limitStr(str,n=20){
    let size=0,
        newStr='';
    for (var i of str){
        size+=i.codePointAt(0).toString(16).length;
        newStr+=i;
        if(size>n)break;
    }
    return newStr.replace(/(\r|\n|\s)/g,'');
}