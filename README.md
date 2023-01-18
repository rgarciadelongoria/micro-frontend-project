# MicroFrontendProject

Angular library that allows easy communication between iframes. Designed for the development of micro frontends.

## Run example project

Run `npm i` to install dependencies.

Run `npm run build micro-frontend` to build de library.

Run `ng serve --port 4200` to serve father project

Run `ng serve --port 4201` to serve child project

Run `ng serve --port 4202` to serve father2-child2 project

Run `ng serve --port 4203` to serve child3 project

Navigate to `http://localhost:4200/`

## Example project explanation

In this example we have 4 angular projects running on different URLs.

The project is configured to act as parent (4200), parent's child (4201), parent child with it's own child (parent 2) (4202) and parent 2's child.

In this example we use library through MicroFrontendComponent to see some capabilities.

Micro frontends load in their respective iframes.

![](https://github.com/rgarciadelongoria/micro-frontend-project/blob/main/src/assets/loading-micro-frontends.gif)

The parent can send a message to his children.

It is also possible to send a message to a specific child.

![](https://github.com/rgarciadelongoria/micro-frontend-project/blob/main/src/assets/sms-dad-to-children.gif)

Children can send a message to their parents.

It is also possible to send a message to a specific parent.

![](https://github.com/rgarciadelongoria/micro-frontend-project/blob/main/src/assets/sms-children-to-dad.gif)

In this case we have a child that is also a parent of its own child and they can communicate in the same way with each other.

![](https://github.com/rgarciadelongoria/micro-frontend-project/blob/main/src/assets/sms-dad2-and-child2.gif)

Finally we have the option of sharing global information with the whole family at different levels of relationship (grandparents, children, grandchildren...)

![](https://github.com/rgarciadelongoria/micro-frontend-project/blob/main/src/assets/set-data.gif)



## Install dependency

`npm i @rgarciadelongoria/micro-frontend`

## Setting up parent.

```html
<iframe #child src="http://localhost:4201" name="child"></iframe>
```

```typescript
@ViewChild('child') iframeChild!: ElementRef;

constructor(private microFrontendSrv: MicroFrontendService) { }

ngOnInit(): void {
    this.microFrontendSrv.init();
    this.microFrontendSrv.getOnMessageObservable().subscribe((message: any) => {
        // Do something with the received message
    });
}

ngAfterViewInit(): void {
    this.microFrontendLibComponent.addMicroFrontend({elementRef: this.iframeChild});
}
```

## Setting up child.

```typescript
constructor(private microFrontendSrv: MicroFrontendService) { }

ngOnInit(): void {
    this.microFrontendSrv.init(['http://localhost:4200']);
    this.microFrontendSrv.getOnMessageObservable().subscribe((message: any) => {
        // Do something with the received message
    });
}
```

## Methods.

Coming soon
