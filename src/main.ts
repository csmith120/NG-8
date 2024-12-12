import { bootstrapApplication } from '@angular/platform-browser';
import { HttpRequest, provideHttpClient, withInterceptors, HttpHandlerFn, HttpEventType } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { tap } from 'rxjs';

function loggingIntercaptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    //const req = request.clone({
    //    headers: request.headers.set('X-DEBUG', 'TESTING')
    //});
    console.log('[Outgoing request]');
    console.log(request);
    return next(request).pipe(
        tap({
            next: event => {
                if(event.type === HttpEventType.Response) {
                    console.log('[Incoming Response]');
                    console.log(event.status);
                    console.log(event.body);
                }
            }
        })
    );
}

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(
        withInterceptors([loggingIntercaptor])
    )],
}).catch((err) => console.error(err));
