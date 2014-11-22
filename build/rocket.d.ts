interface Object {
    id?: string;
    type: string;
    link: string;
    title: string;
    HTMLElement?: Element;
}
interface Element {
    parentElement: Element;
}
interface Navigator {
    doNotTrack: string;
}
interface HTMLElement {
    autoplay: boolean;
}
interface Window {
    crypto: any;
}
declare module rocket.component {
    var storedComponents: Object;
    var dropdownToggler: Function;
    function Define(type: string, selector: string): Object;
    function Animate(component: Object, animation: string, postAnimationFunction?: Function): void;
    function CSS(componentObject: Object, property: string, newValue?: any): any;
    function Fetch(component: Object): any;
    function Update(componentId: string, componentElement: Element): void;
    function AddListeners(...args: any[]): boolean;
    function RemoveListeners(component: Object): boolean;
    function Add(append: boolean, parentComponent: Object, childComponent: any): boolean;
    function Remove(componentsToRemove: any): boolean;
}
declare module rocket.device {
    var DoNotTrack: boolean;
    var HasCryptography: boolean;
    var HasGeolocation: boolean;
    var HasIndexedDB: boolean;
    var HasLocalStorage: boolean;
    var IsOnline: boolean;
    var IsSubHD: boolean;
    var IsHD: boolean;
    var IsFullHDOrAbove: boolean;
    function Detect(): void;
}
declare module rocket.generator {
    var lastUniqueIds: Object;
    function IdGen(type: string): string;
    function ElementCreator(componentId: any, componentType: string, attributes?: Object): HTMLElement;
}
declare module rocket.header {
    function Generate(properties: Object): Object;
    function SetLogo(component: Object, image: string): void;
    function RemoveLogo(component: Object): void;
}
declare module rocket.footer {
    function Generate(properties: Object): Object;
    function SetLabel(component: Object, labelText: string): boolean;
    function AddLink(prepend: boolean, component: Object, linkProperties: Object): boolean;
    function RemoveLink(component: Object, linkProperties: Object): boolean;
}
declare module rocket.button {
    function Generate(properties: Object): Object;
    function SetLabel(component: Object, content: string): boolean;
}
declare module rocket.list {
    function Generate(properties: Object): Object;
    var AddItem: typeof component.Add;
    var RemoveItem: typeof component.Remove;
}
declare module rocket.listitem {
    function Generate(properties: Object): Object;
    function SetLabel(component: Object, content: string): boolean;
    function SetControl(component: Object, control: Object): boolean;
}
declare module rocket.dropdown {
    function Generate(properties: Object): Object;
    function InnerListComponentFetcher(dropdownComponent: any): Object;
    function SetText(component: Object, content: any): void;
    function SetImage(component: Object, content: any): void;
    function SetIcon(component: Object, content: string): void;
    function AddItem(component: Object, listItemComponent: Object): void;
    function RemoveItem(component: Object, listItemComponent: Object): void;
}
declare module rocket.player {
    function Init(component: Object): void;
    function GetInnerContentElement(component: Object): HTMLMediaElement;
    function GetPlayerLengthInfo(component: Object): Object;
    function TimeOrVolumeChanger(): void;
    function IsPlaying(component: Object): boolean;
    function IsDoingTimeChange(component: Object): boolean;
    function PlayOrPause(component: Object): string;
}
declare module rocket.playercontrol {
    function Generate(properties: Object): Object;
}
declare module rocket.audioplayer {
    function Generate(properties: Object): Object;
}
declare module rocket.videoplayer {
    function Generate(properties: Object): Object;
}
declare module rocket.searchbox {
    function Generate(properties: Object): Object;
    function SetText(component: Object, placeholderText: any): void;
}
declare module rocket {
    function Init(): void;
    var Define: typeof component.Define;
    var Fetch: typeof component.Fetch;
    var Add: typeof component.Add;
    var Remove: typeof component.Remove;
    var Animate: typeof component.Animate;
    var CSS: typeof component.CSS;
    var AddListeners: typeof component.AddListeners;
    var RemoveListeners: typeof component.RemoveListeners;
}