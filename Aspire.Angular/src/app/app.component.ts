import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RouterOutlet } from '@angular/router';
import { TableVersionComponent } from "./table-version/table-version.component";
import { NodeService } from './table-version/node.service';

import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appNavigationGuard]'
})
export class NavigationGuardDirective implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  private lastNavigationUrl: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setupRouterListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent): void {
    console.log('Browser back/forward button pressed', event);
    // Handle back/forward navigation (e.g., show confirmation)
    // Store the current URL *before* handling the popstate
    const currentUrl = window.location.href;
    if (this.lastNavigationUrl && currentUrl !== this.lastNavigationUrl) {
      this.handleNavigationAway(currentUrl, 'back/forward');
    }
    this.lastNavigationUrl = currentUrl;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    console.log('Page refresh or tab/window close initiated', event);
    // Handle refresh/close (e.g., save data, show warning)
    const currentUrl = window.location.href;
     this.handleNavigationAway(currentUrl, 'refresh/close');
    event.preventDefault();
    event.returnValue = ''; // Required for some older browsers
  }

  private setupRouterListeners(): void {
    this.router.events
      .pipe(takeUntil(this.destroy$)) // Unsubscribe when directive is destroyed
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          alert();
          console.log('NavigationStart:', event.url);
          const previousUrl = this.lastNavigationUrl;
          this.lastNavigationUrl = event.url; // Store *before* handling
           if (previousUrl && event.url !== previousUrl) {
             this.handleNavigationAway(event.url, 'internal');
           }
          // Handle navigation start (e.g., check for unsaved changes)
        } else if (event instanceof NavigationEnd) {
          alert();
          console.log('NavigationEnd:', event.url);
          this.lastNavigationUrl = event.url;
          // Handle navigation end (e.g., update UI)
        } else if (event instanceof NavigationCancel) {
          alert();
          console.log('NavigationCancel:', event.url);
          this.lastNavigationUrl = event.url;
          // Handle navigation cancellation
        } else if (event instanceof NavigationError) {
          alert();
          console.error('NavigationError:', event.url, event.error);
          this.lastNavigationUrl = event.url;
          // Handle navigation error
        }
      });
  }

  private handleNavigationAway(url: string, type: string): void {
    // Centralized navigation handling logic
    console.log(`Navigating away from: ${url} (Type: ${type})`);
    //  Add your logic here:
    //  - Check for unsaved changes
    //  - Display a confirmation dialog (with limitations)
    //  - Save data
    //  - etc.
    // Example (with browser limitations in mind):
    if (confirm('Are you sure you want to leave this page? You may have unsaved changes.')) {
      //  If the user confirms, you don't need to do anything special here.
      //  The browser will continue the handleNavigationAwaynavigation.
    } else {
       //  If the user cancels, you *might* be able to prevent navigation in some cases,
       //  but this is increasingly unreliable, especially for internal Angular routes.
       //  For beforeunload, the event.preventDefault() in the handler will have some effect.
    }
  }
}


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TableVersionComponent, NavigationGuardDirective],
  providers: [NodeService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ng-aspire';

  
}




