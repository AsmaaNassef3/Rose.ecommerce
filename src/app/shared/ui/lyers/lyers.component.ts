import { Component, computed, inject } from '@angular/core';
import { TranslationService } from '../../../core/services/translate/traslation.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-lyers',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './lyers.component.html',
  styleUrl: './lyers.component.scss'
})
export class LyersComponent {
    private readonly translationService = inject(TranslationService)
  isRTL = computed(() => this.translationService.isRTL())
}
