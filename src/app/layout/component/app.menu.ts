import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, TranslateModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(private translate: TranslateService) {}

    ngOnInit() {
        this.translate.onLangChange.subscribe(() => {
            this.updateMenu();
        });
        this.updateMenu();
    }

    updateMenu() {
        this.model = [
            {
                label: this.translate.instant('MENU.HOME'),
                items: [{ label: this.translate.instant('MENU.DASHBOARD'), icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: this.translate.instant('MENU.TRANSACTIONS'),
                items: [
                    { label: this.translate.instant('MENU.TRANSACTION'), icon: 'pi pi-fw pi-dollar', routerLink: ['/transaction'] },
                    { label: this.translate.instant('MENU.HISTORY'), icon: 'pi pi-fw pi-history', routerLink: ['/history'] }
                ]
            }
        ];
    }
}
