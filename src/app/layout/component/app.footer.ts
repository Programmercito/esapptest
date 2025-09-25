import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [TranslateModule],
    template: `<div class="layout-footer">
        {{ 'footer.sakai_by' | translate }}
        <a href="https://primeng.org" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">PrimeNG</a>
    </div>`
})
export class AppFooter {}
