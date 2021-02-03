import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(date: any, args?: any): any {
    let d = new Date(date);
    return moment(d).format('YYYY-MM-DD HH:mm');
  }

  one(date: any, args?: any): any {
    let d = new Date(date);
    return moment(d).format('YYYY-MM-DD HH:mm:ss');
  }

  two(date: any, args?: any): any {
    let d = new Date(date);
    return moment(d).format('YYYY-MM-DD HH:mm:ss A');
  }

  three(date: any, args?: any): any {
    let d = new Date(date);
    return moment(d).format('YYYY-MM-DD');
  }

  four(date: any, args?: any): any {
    let d = new Date(date);
    return moment(d).format('DD-MM-YYYY');
  }

  five(date: any, args?: any): any {
    let d = new Date(date);
    return moment(d).format('DD/MM/YYYY HH:mm');
  }

  six(date: any, args?: any): any {
    let d = new Date(date);
    return moment(d).format('DD/MM/YYYY HH:mm:ss');
  }

  seven(date: any, args?: any): any {
    let d = new Date(date);
    return moment(d).format('DD/MM/YYYY HH:mm:ss A');
  }

  eight(date: any, args?: any): any {
    let d = new Date(date);
    return moment(d).format('DD/MM/YYYY');
  }


}
