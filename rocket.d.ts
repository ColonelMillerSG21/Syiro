/// <reference path="jquery.d.ts" />
declare module Rocket {
    function init(): void;
    class RocketComponentFunctions {
        constructor();
        public componentExistsCheck(parentElement: HTMLElement, component: any): boolean;
        public addComponent(prependOrAppend: string, parentElement: Element, component: Element): void;
        public removeComponent(parentElement: Element, component: any): void;
    }
    class Header extends RocketComponentFunctions {
        public rocketComponent: HTMLElement;
        constructor(rocketComponentSelector: string);
        public setLogo(src: string): void;
        public removeLogo: void;
        public add(type: string, component: HTMLElement): void;
        public remove(type: string, component: HTMLElement): void;
    }
    class Footer extends RocketComponentFunctions {
        public rocketComponent: HTMLElement;
        constructor(rocketComponentSelector: string);
        public add(type: string, text: string, link?: string, target?: string): void;
        public remove(type: string, link?: string): void;
    }
    class Button extends RocketComponentFunctions {
        public rocketComponent: HTMLElement;
        constructor(rocketComponentSelector: string);
        public listen(primaryCallback: Function, secondaryCallback?: Function): void;
    }
    class List extends RocketComponentFunctions {
        constructor();
        public listen(rocketComponent: HTMLElement): void;
    }
}
