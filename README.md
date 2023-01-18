# MicroFrontendProject

Library that allows easy communication between iframes. Designed for the development of micro frontends.

## Run example project

Run `npm run build micro-frontend` to build de library.

Run `ng serve --port 4200` to serve father project

Run `ng serve --port 4201` to serve child project

Run `ng serve --port 4202` to serve father2-child2 project

Run `ng serve --port 4203` to serve child3 project

Navigate to `http://localhost:4200/`

## Example project explanation

In this example we have 4 angular projects running on different URLs.

The project is configured to act as father (4200), father's child (4201), father´s child with it's own child (father 2) (4202) and father 2's child.

In this example we use library through MicroFrontendComponent to see some capabilities.

## Getting started

Setting up library like father

```javascript
constructor(public microFrontendSrv: MicroFrontendService) { }

ngOnInit(): void {
    this.microFrontendSrv.init(this.parentURIs);
    this.microFrontendSrv.getOnMessageObservable().subscribe((message: any) => this.onMessage(message));
}
```






## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Start from zero

Run `npm i` to install dependencies.

Run `npm run build micro-frontend` to build library.

Rub `ng serve --port 4200` to run the project.
