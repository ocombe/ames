import { Component, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { RefirebasePipe } from '../shared/refirebase.pipe';
import { Resource } from '../shared/models';

@Component({
    selector: 'resource-form',
    templateUrl: './resource-form.component.html',
    styleUrls: ['./resource-form.component.scss', '../developers/expert-form.component.scss']
})
export class ResourceFormComponent implements OnChanges {
    @Output() update = new EventEmitter<Resource>();
    @Output() delete = new EventEmitter<Resource>();
    @Input() resource: Resource;

    data: Observable<any[]>;
    categories: Observable<any[]>;
    subCategories: Observable<any[]>;


    constructor(private af: AngularFire) {
        console.log("In the form component");
        this.data = af.database.list('/resources/');
        this.categories = this.data.map((items) => {
            return items.map((item) => {
                return item.$key;
            })
        });
    }

    ngOnChanges(changes: any) {
        if (!this.resource) {
            console.log("no resource. making one up!");
            this.resource = new Resource();
        } else if (this.resource.category) {
            this.selectCategory(this.resource.category);
        } else {
            console.log("resource has no category")
            console.log(this.resource);
        }
    }

    selectCategory(categoryName) {
        console.log("Selecting ", categoryName);
        this.resource.category = categoryName;
        this.subCategories = this.af.database.list('/resources/' + categoryName)
            .map(items =>
                items.map(sub => {
                    if (!this.resource.subcategory) {
                        this.resource.subcategory = sub.$key;
                    }
                    return sub.$key
                })
            );

    }
    submit() {
        event.preventDefault();
        this.update.emit(this.resource);
    }
    deleteThis() {
        this.delete.emit(this.resource);
    }

}
