import { TableHeader } from './tableHeader';
import { TableData } from './tableData';
export class SearchResultTableFormat {

      constructor(
        public header?: TableHeader[],
        public data?: TableData[],
        public totalHits?: number,
        public timetaken?: string,
        public aggregations?: any

      ) {  }


    }