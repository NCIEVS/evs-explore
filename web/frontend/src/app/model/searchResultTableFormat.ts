import { TableHeader } from './tableHeader';
import { TableData } from './tableData';

// Search results table definition
export class SearchResultTableFormat {

  constructor(
    public header?: TableHeader[],
    public data?: TableData[],
    public total?: number,
    public timeTaken?: string,
    public aggregations?: any

  ) { }

}