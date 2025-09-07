import { Product } from './../../shared/interfaces/home/popularitems';
import { BestSeller } from './../../shared/interfaces/bestseller/bestseller';
import { Component, OnInit, inject, signal, WritableSignal, computed } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Category } from '../../shared/interfaces/categories/categories';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { PestsellerService } from '../../core/services/pestseller/pestseller.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { LyersComponent } from "../../shared/ui/lyers/lyers.component";
import { ChartService } from '../../core/services/chart/chart.service';
import { Router, RouterLink } from '@angular/router';
import { CustomerComponent } from "../../shared/ui/customer/customer.component";
import { ToastrService } from 'ngx-toastr';
import { SearchService } from '../../core/services/search/search.service';
import { TokenService } from '../../core/services/token/token.service';
import { NavComponent } from '../../layouts/components/nav/nav.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translate/traslation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, LyersComponent, RouterLink, CustomerComponent, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly pestsellerService = inject(PestsellerService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly chartService = inject(ChartService);
  private readonly searchService = inject(SearchService);
  private readonly tokenService = inject(TokenService);
  private readonly translationService = inject(TranslationService);
  private readonly router = inject(Router);

  // RTL Support
  isRTL = computed(() => this.translationService.isRTL());

  // Carousel options with RTL support
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    smartSpeed: 400,
    nav: true,
    navText: this.isRTL() ? ['›', '‹'] : ['‹', '›'],
    dots: false,
    rtl: this.isRTL(), // RTL support
    responsive: {
      0: {
        items: 1
      },
      640: {
        items: 2
      },
      1024: {
        items: 3
      }
    }
  };

  categoryData: WritableSignal<Category[]> = signal([]);
  pestSeller: WritableSignal<BestSeller[]> = signal([]);
  popularItems: WritableSignal<Product[]> = signal([]);

  get reversedCategories(): Category[] {
    return this.categoryData().slice().reverse().slice(0, 5);
  }
  
  filteredProducts = computed(() => {
    const term = this.searchService.searchTerm().toLowerCase();
    return this.popularItems().filter(p =>
      p.title.toLowerCase().includes(term)
    );
  });

  constructor() {
    // Update carousel options when language changes
    this.translationService.languageChange$.subscribe(() => {
      this.updateCarouselOptions();
    });
  }

  private updateCarouselOptions(): void {
    this.customOptions = {
      ...this.customOptions,
      rtl: this.isRTL(),
      navText: this.isRTL() ? ['›', '‹'] : ['‹', '›']
    };
  }

  getAllCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryData.set(res.categories);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  getAllPestsellerData() {
    this.pestsellerService.getPestsellerData().subscribe({
      next: (res) => {    
        this.pestSeller.set(res.bestSeller);
        console.log(this.pestSeller);
      },
      error: (error) => {
        console.error('Error fetching pestseller data:', error);
      }
    });
  }

  getPopularItems() {
    this.pestsellerService.getAllProducts().subscribe({
      next: (res) => {
        console.log("products", res.products);
        this.popularItems.set(res.products);
      },
      error: (error) => {
        console.error('Error fetching pestseller data:', error);
      }
    });
  }

  AddToCart(productId: string, quantity: number) {
    // Check authentication first
    if (!this.tokenService.isAuthenticated()) {
      NavComponent.triggerGlobalLoginModal();
      return;
    }

    const data = {
      product: productId,
      quantity: quantity
    };

    this.chartService.addProductToChart(data).subscribe({
      next: (res) => {
        console.log('producttCart', res);
        this.chartService.cartNum.set(res.numOfCartItems);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllPestsellerData();
    this.getPopularItems();
  }
}
