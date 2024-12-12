import { bootstrapApplication } from '@angular/platform-browser';
import { HttpRequest, provideHttpClient, withInterceptors, HttpHandlerFn } from '@angular/common/http';

import { AppComponent } from './app/app.component';

function loggingIntercaptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    console.log('[Outgoing request]');
    console.log(request);
    return next(request);
}

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(
        withInterceptors([loggingIntercaptor])
    )],
}).catch((err) => console.error(err));
