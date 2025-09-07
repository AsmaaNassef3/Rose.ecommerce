import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent, } from "./layouts/components/nav/nav.component";
import { FooterComponent } from "./layouts/components/footer/footer.component";
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import { TokenService } from './core/services/token/token.service';
import { NgxSpinnerComponent } from "ngx-spinner";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, FooterComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
styleUrls: []  

})
export class AppComponent  {
   constructor(private flowbiteService: FlowbiteService) {}
public tokenService = inject(TokenService)
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
    console.log(flowbite);


    
    });
  }
}
