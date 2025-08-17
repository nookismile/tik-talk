import { Component, inject } from '@angular/core';
import {ProfileCardComponent} from '../../ui';
import {ProfileFiltersComponent} from '../profile-filters/profile-filters.component';
import { ProfileService } from '@tt/data-access';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  profileService = inject(ProfileService);
  profiles = this.profileService.filteredProfiles;

  constructor() {}
}
