import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectLength'
})
export class ObjectLengthPipe implements PipeTransform {

  transform(value: any,arg1?:any): any {
   console.log(arg1)
    if(arg1){
      return false;
    }
    return  (Object.keys(value).length==0);
  }

}
