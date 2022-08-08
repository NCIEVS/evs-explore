import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from './../../../service/configuration.service';
import { Title } from '@angular/platform-browser';
import { LicenseTextComponent } from '../../license-text/license-text.component';

// Documentation properties component
@Component({
    selector: 'app-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {

    properties: any;
    terminology: string = null;

    constructor(
        private configService: ConfigurationService, private titleService: Title, private licenseTextComponent: LicenseTextComponent
    ) {
        this.terminology = configService.getTerminologyName();
    }

    // On initialization
    ngOnInit() {
        // if there's a valid terminology
        var pathLength = window.location.pathname.split("/").length;
        if (pathLength > 2) {
            this.terminology = window.location.pathname.split("/")[pathLength - 1];
            this.configService.setTerminology(this.configService.getTerminologyByName(this.terminology));
        }

        // default to ncit
        else this.configService.setTerminology(this.configService.getTerminologyByName(this.configService.getDefaultTerminologyName));

        this.configService.getProperties(this.terminology)
            .subscribe(response => {
                this.properties = response;
                this.properties.sort((a, b) => {
                    // use code because value doesn't always exist
                    let value1 = a.name || "";
                    let value2 = b.name || "";
                    // case-inensitive sort
                    return value1.localeCompare(value2, undefined, { sensitivity: 'base' });
                }
                );
            });
        this.titleService.setTitle("EVS Explore - Properties");
    }

    ngAfterViewInit(): void {
        var terminology = this.configService.getTerminology();
        if (terminology.metadata.licenseText) {
            this.licenseTextComponent.checkLicenseText(terminology.terminology, terminology.metadata.licenseText);
        }
    }

    customSort(event: SortEvent) {
        event.data.sort((data1, data2) => {
            let value1 = data1[event.field];
            let value2 = data2[event.field];
            if (value1 == undefined)
                return 0;
            return event.order * value1.localeCompare(value2, 'en', { numeric: true });
        });
    }

}
