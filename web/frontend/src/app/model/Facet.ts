import { FacetField } from './FacetField';
import { FacetDisplayNamesEnum } from './FacetDisplayNamesEnum';

export class Facet {

    type: string;
    displayName: string;
    facetFields: FacetField[];

    constructor(type: string) {
        this.type = type;
        this.displayName = this.getDisplayName(type);
    }

    getDisplayName(input: string): string {
        for (const item in FacetDisplayNamesEnum) {
            if (item.match(input) !== null) {
                return FacetDisplayNamesEnum[item];
            }
        }
    }

}



