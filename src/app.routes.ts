import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Transaction } from '@/transaction/component/transaction';
import { Dashboard } from '@/dashboard/component/dashboard';
import { History } from '@/history/component/history';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'transaction', component: Transaction },
            { path: 'history', component: History },
            { path: '', component: Dashboard },
        ]
    }
];
