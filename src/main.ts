import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './eudr-app/eudr-app.config';
import { AppComponent } from './eudr-app/eudr-app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
