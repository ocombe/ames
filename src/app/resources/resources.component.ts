import { Component, Pipe, PipeTransform, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Observable } from 'rxjs/Rx';
import { RefirebasePipe } from '../shared/refirebase.pipe';
import { AuthService } from '../shared/auth.service';

import "../shared/shareResults";

declare var firebase: any;
declare var prompt;

@Component({
    selector: 'resources',
    templateUrl: './resources.component.html',
    styleUrls: [ '../developers/expert-form.component.scss', './resources.component.scss'],
})
export class ResourcesComponent implements OnInit{
    adjustJumpnav: boolean = false;

    data: Observable<any[]>;
    priority: number;
    subPriority: number;
    priorityMode: boolean;

    constructor(public af: AngularFire, public auth: AuthService) {
        this.data = af.database.list('/resources').shareResults();

    }

    ngOnInit() {
        window.addEventListener('scroll', this.changeScrollPos.bind(this), false);
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', this.changeScrollPos.bind(this), false);
    }

    setCategoryPriority(category, priority: number) {
        firebase.database().ref('/resources/' + category).setPriority(priority);
        this.priority = null;

    }

    setSubcategoryPriority(category, subcategory, priority: number) {
        firebase.database().ref('/resources/' + category + '/' + subcategory).setPriority(priority);
        this.priority = null;

    }

    changeScrollPos() {
        if (window.scrollY > 250) {
            this.adjustJumpnav = true;
        } else {
            this.adjustJumpnav = false;
        }
    }
}
