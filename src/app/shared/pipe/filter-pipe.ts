import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform{

  transform(table: any[], val: string, attr: any, attr2?: string): any {

    if (!table) {
      return [];
    }

    if (!val) {
      return table;
    }
    else {
      var oneitem : {} = table[0];
      if(typeof oneitem[attr] == 'object'){
        console.log("l'attribut de recherche est un object");
        var obj;
        return table.filter(elt => {
          obj = elt[attr];
          return obj[attr2].toString().toLowerCase().includes(val);
        });
      }
      else{
        console.log("l'attribut de recherche est une chaine de caractère");
        return table.filter(elt => {
          return elt[attr].toString().toLowerCase().includes(val);
        });
      }
    }
  }

}

