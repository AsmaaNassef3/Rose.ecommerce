import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "../components/nav/nav.component";
import { FooterComponent } from "../components/footer/footer.component";
import { SidebarComponent } from "../../pages/sidebar/sidebar.component";
import { SidenavComponent } from "../components/sidenav/sidenav.component";

@Component({
  selector: 'app-blank',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, SidebarComponent, SidenavComponent],
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss']
})
export class BlankComponent {

}
