
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';


@NgModule({
  imports: [AppModule, ServerModule],
  providers: [
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
