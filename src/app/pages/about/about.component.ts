import { Component, computed, inject } from '@angular/core';
import { LyersComponent } from "../../shared/ui/lyers/lyers.component";
import { CustomerComponent } from "../../shared/ui/customer/customer.component";
import { TranslationService } from '../../core/services/translate/traslation.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LyersComponent, CustomerComponent,TranslateModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  private readonly translationService = inject(TranslationService)
  isRTL = computed(() => this.translationService.isRTL());

}
