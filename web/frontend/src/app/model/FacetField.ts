import { FacetQueryParameterNamesEnum } from './FacetQueryParameterNamesEnum';

// BAC - looks like not used
export class FacetField {

    name: string;
    count: string;
    label: string;
    value: string;


    constructor(type: string, name: string, count: string) {
        this.name = name;
        this.count = count;
        this.label = name;
        this.value = this.getQueryParameterName(type) + ':' + name;
    }

    getQueryParameterName(input: string): string {
        for (const item in FacetQueryParameterNamesEnum) {
            if (item.match(input) !== null) {
                return FacetQueryParameterNamesEnum[item];
            }
        }
    }
}
