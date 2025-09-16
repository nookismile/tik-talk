import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from "../sidebar/sidebar.component";
import { GlobalStoreService } from "@tt/data-access";


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  standalone: true,
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  globalStore = inject(GlobalStoreService);
}
