import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Transaction } from '@/transaction/component/transaction';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Transaction },
        ]
    }
];
