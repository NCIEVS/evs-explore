import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';

// Header component
@Component({
    selector: 'app-evs-header',
    templateUrl: './evs-header.component.html',
    styleUrls: ['./evs-header.component.css']
})
export class EvsHeaderComponent implements OnInit {
    versionInfo = '';
    terminology = null;
    private subscription = null;

    constructor(private configService: ConfigurationService) { }

    ngOnInit() {
        console.log(this.versionInfo)
        this.terminology = this.configService.getTerminology();
        console.log(this.terminology)
        if (this.terminology) {
            this.versionInfo = '(' + this.getTerminologyTitle() + ' - Version: ' + this.terminology.version
                + '; Release Date: ' + this.terminology.date + ')';
            console.log(this.versionInfo)
        }
        this.subscription = this.configService.getSubject().subscribe(terminology => {
            this.terminology = terminology;
            if (this.terminology) {
                this.versionInfo = '(' + this.getTerminologyTitle() + ' - Version: ' + this.terminology.version
                    + '; Release Date: ' + this.terminology.date + ')';
                console.log(this.versionInfo)
            }
        });
    }

    getTerminologyTitle() {
        if (this.terminology.terminology == 'ncit') {
            return 'NCI Thesaurus';
        }
        else if (this.terminology.terminology == 'ncim') {
            return 'NCI Metathesaurus';
        }
        else return null;
    }


    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

}
