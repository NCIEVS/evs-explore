import { Pipe, PipeTransform } from '@angular/core';


/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize:precision
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
*/
@Pipe({name: 'transformDisplay'})
export class DisplayPipe implements PipeTransform {

  transform(value: any, field: string ): string {
    if ( field === 'Maps_To') {
      console.log('Maps TO ' + value);
      let mapstos: any[];
      mapstos = value.split('<br><br>');
      let html = '';
      
      html = html + '<button [pTooltip]="' + 'test' + '" type="button" class="btn btn-link">' + 'test' + '</button><br>';
      
      //html = html + 'test123';
      console.log(JSON.stringify(html));
      return html;

    } /*else if ( field === 'selectedFacet') {
      const facetType = value.toString().split(/:(.+)/)[0].replace('.', '_');
      const facetValue = value.toString().split(/:(.+)/)[1];
      return this.getDisplayName(facetType) + ': ' + facetValue;
    }*/
  }

  /*getDisplayName(input: string): string {
    for (const item in FacetDisplayNamesEnum) {
        if (item.match(input) !== null) {
            return FacetDisplayNamesEnum[item];
        }
    }
    }*/

}
