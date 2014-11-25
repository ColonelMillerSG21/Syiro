var rocket;
(function (rocket) {
    var component;
    (function (_component) {
        _component.listenerStrings = {
            "down": ["mousedown", "touchstart", "MSPointerDown"],
            "up": ["mouseup", "touchend", "MSPointerUp"]
        };
        _component.storedComponents = {};
        _component.dropdownToggler = function () {
            var component = arguments[0];
            var dropdownElement = rocket.component.Fetch(component);
            if (dropdownElement.hasAttribute("data-rocket-component-active")) {
                dropdownElement = rocket.component.Fetch(component);
                dropdownElement.removeAttribute("data-rocket-component-active");
            }
            else {
                dropdownElement = rocket.component.Fetch(component);
                dropdownElement.setAttribute("data-rocket-component-active", "");
            }
        };
        function Define(type, selector) {
            var component = {};
            component["type"] = type;
            var componentID = rocket.generator.IdGen(type);
            var selectedElement = document.querySelector(selector);
            selectedElement.setAttribute("data-rocket-component-id", componentID);
            component["id"] = componentID;
            if (type == "dropdown") {
                rocket.component.AddListeners(rocket.component.listenerStrings["up"], component, rocket.component.dropdownToggler);
            }
            return component;
        }
        _component.Define = Define;
        function Animate(component, animation, postAnimationFunction) {
            var componentElement = rocket.component.Fetch(component);
            if (componentElement !== null) {
                var elementTimeoutId = window.setTimeout(function () {
                    var component = arguments[0];
                    var componentElement = rocket.component.Fetch(component);
                    var postAnimationFunction = arguments[1];
                    var timeoutId = componentElement.getAttribute("data-rocket-animationTimeout-id");
                    componentElement.removeAttribute("data-rocket-animationTimeout-id");
                    window.clearTimeout(Number(timeoutId));
                    postAnimationFunction(component);
                }.bind(rocket, component, postAnimationFunction), 250);
                componentElement.setAttribute("data-rocket-animationTimeout-id", elementTimeoutId.toString());
                if (component["type"] == "dropdown") {
                    var tempElement = componentElement;
                    componentElement = tempElement.querySelector('div[data-rocket-component="list"]');
                }
                else if ((component["type"] == "button") && (componentElement.getAttribute("data-rocket-component-type") == "toggle")) {
                    var tempElement = componentElement;
                    componentElement = tempElement.querySelector('div[data-rocket-minor-component="buttonToggle"]');
                }
                componentElement.setAttribute("class", animation);
            }
        }
        _component.Animate = Animate;
        function CSS(componentObject, property, newValue) {
            var componentElement = rocket.component.Fetch(componentObject);
            if (componentElement !== null) {
                var currentValue;
                var currentComponentCSS = componentElement.getAttribute("style");
                if ((currentComponentCSS == null) || (currentComponentCSS == undefined)) {
                    currentComponentCSS = "";
                }
                var indexOfProperty = currentComponentCSS.indexOf(property);
                if (indexOfProperty !== -1) {
                    var endOfProperty = currentComponentCSS.indexOf(";", indexOfProperty);
                    currentValue = currentComponentCSS.substring((indexOfProperty + (property.length + 2)), endOfProperty);
                }
                else {
                    currentValue = "";
                }
                if (newValue == undefined) {
                    return currentValue;
                }
                else {
                    var updatedStyleValue = "";
                    if (currentValue !== "") {
                        updatedStyleValue = currentComponentCSS.replace(property + ": " + currentValue + ";", "");
                    }
                    if (typeof newValue == "string") {
                        updatedStyleValue = currentComponentCSS + property + ": " + newValue + ";";
                    }
                    componentElement.setAttribute("style", updatedStyleValue);
                    rocket.component.Update(componentObject["id"], componentElement);
                    return newValue;
                }
            }
            else {
                return false;
            }
        }
        _component.CSS = CSS;
        function Fetch(component) {
            var componentElement;
            if (rocket.component.storedComponents[component["id"]] !== undefined) {
                componentElement = rocket.component.storedComponents[component["id"]];
            }
            else {
                componentElement = document.querySelector('*[data-rocket-component-id="' + component["id"] + '"]');
            }
            return componentElement;
        }
        _component.Fetch = Fetch;
        function FetchComponentObject(componentElement) {
            if (componentElement.hasAttribute("data-rocket-component")) {
                return { "id": componentElement.getAttribute("data-rocket-component-id"), "type": componentElement.getAttribute("data-rocket-component") };
            }
            else {
                return false;
            }
        }
        _component.FetchComponentObject = FetchComponentObject;
        function Update(componentId, componentElement) {
            if (rocket.component.storedComponents[componentId] !== undefined) {
                rocket.component.storedComponents[componentId] = componentElement;
            }
        }
        _component.Update = Update;
        function AddListeners() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var allowListening = true;
            var listeners;
            var component;
            var listenerCallback;
            ;
            if ((args.length == 2) || (args.length == 3)) {
                if (args.length == 2) {
                    component = args[0];
                    listenerCallback = args[1];
                    if (component["type"] !== "searchbox") {
                        listeners = rocket.component.listenerStrings["up"];
                    }
                    else {
                        listeners = ["keyup"];
                    }
                }
                else {
                    listeners = args[0];
                    component = args[1];
                    listenerCallback = args[2];
                }
                var componentElement = rocket.component.Fetch(component);
                if (componentElement !== null) {
                    if (component["type"] == "dropdown") {
                        componentElement = componentElement.querySelector('div[data-rocket-minor-component="dropdown-label"]');
                    }
                    else if (component["type"] == "list-item") {
                        if (componentElement.querySelector("div") !== null) {
                            allowListening = false;
                        }
                    }
                    if (allowListening == true) {
                        var listenerArray;
                        if ((typeof listeners).toLowerCase() == "object") {
                            listenerArray = listeners;
                        }
                        else {
                            listeners.trim().split(" ");
                        }
                        listenerArray.forEach(function (individualListener) {
                            componentElement.addEventListener(individualListener, function () {
                                var component = arguments[0];
                                var listenerCallback = arguments[1];
                                var componentElement = rocket.component.Fetch(component);
                                if (componentElement !== null) {
                                    var passableValue = null;
                                    if ((component["type"] == "button") && (componentElement.getAttribute("data-rocket-component-type") == "toggle")) {
                                        var animationString;
                                        if (componentElement.getAttribute("data-rocket-component-status") !== "true") {
                                            animationString = "toggle-forward-animation";
                                            passableValue = true;
                                        }
                                        else {
                                            animationString = "toggle-backward-animation";
                                            passableValue = false;
                                        }
                                        rocket.component.Animate(component, animationString, function (component) {
                                            var buttonElement = rocket.component.Fetch(component);
                                            if (buttonElement.getAttribute("data-rocket-component-status") !== "true") {
                                                buttonElement.setAttribute("data-rocket-component-status", "true");
                                            }
                                            else {
                                                buttonElement.setAttribute("data-rocket-component-status", "false");
                                            }
                                        });
                                    }
                                    else if (component["type"] == "searchbox") {
                                        passableValue = componentElement.value;
                                    }
                                    else {
                                        passableValue = null;
                                    }
                                    listenerCallback.call(rocket, component, passableValue);
                                }
                            }.bind(rocket, component, listenerCallback));
                        });
                    }
                }
                else {
                    allowListening = false;
                }
            }
            else {
                allowListening = false;
            }
            return allowListening;
        }
        _component.AddListeners = AddListeners;
        function RemoveListeners(component) {
            var successfulRemoval = false;
            var componentElement = rocket.component.Fetch(component);
            if (componentElement !== null) {
                if (component["type"] == "dropdown") {
                    componentElement = componentElement.querySelector('div[data-rocket-minor-component="dropdown-label"]');
                }
                var newElement = componentElement.cloneNode(true);
                componentElement.outerHTML = newElement.outerHTML;
                successfulRemoval = true;
            }
            return successfulRemoval;
        }
        _component.RemoveListeners = RemoveListeners;
        function Add(append, parentComponent, childComponent) {
            var parentElement = rocket.component.Fetch(parentComponent);
            var childComponentId;
            var childComponentType = (typeof childComponent).toLowerCase();
            var childElement = rocket.component.Fetch(childComponent);
            var allowAdding = false;
            if (childComponentType == "object") {
                childComponentId = childComponent["id"];
                if (parentComponent["type"] == "header" && ((childComponent["type"] == "dropdown") || (childComponent["type"] == "searchbox"))) {
                    childElement = rocket.component.Fetch(childComponent);
                    allowAdding = true;
                }
                else if (childComponent["type"] == "list-item") {
                    if (parentComponent["type"] == "dropdown") {
                        parentElement = rocket.component.Fetch(rocket.dropdown.InnerListComponentFetcher(parentComponent));
                    }
                    if ((parentComponent["type"] == "dropdown") || (parentComponent["type"] == "list")) {
                        allowAdding = true;
                    }
                }
                else if (childComponent["link"] !== undefined) {
                    childElement = rocket.generator.ElementCreator(null, "a", {
                        "title": childComponent["title"],
                        "href": childComponent["link"],
                        "content": childComponent["title"]
                    });
                    allowAdding = true;
                }
                else {
                    childElement = rocket.component.Fetch(childComponent);
                    allowAdding = true;
                }
            }
            else if (childComponentType.indexOf("element") > -1) {
                childElement = childComponent;
                allowAdding = true;
            }
            if ((allowAdding == true) && (parentElement !== null) && (childElement !== null)) {
                if (append == false) {
                    parentElement.insertBefore(childElement, parentElement.firstChild);
                }
                else {
                    parentElement.appendChild(childElement);
                }
                if (childComponentId !== undefined) {
                    if (rocket.component.storedComponents[childComponentId] !== undefined) {
                        delete rocket.component.storedComponents[childComponentId];
                    }
                }
            }
            else {
                allowAdding = false;
            }
            rocket.component.Update(parentComponent["id"], parentElement);
            return allowAdding;
        }
        _component.Add = Add;
        function Remove(componentsToRemove) {
            var allowRemoval = false;
            var componentList;
            if (componentsToRemove["id"] !== undefined) {
                allowRemoval = true;
                componentList = Array(componentsToRemove);
            }
            else if (((typeof componentsToRemove).toLowerCase() == "object") && (componentsToRemove.length > 0)) {
                allowRemoval = true;
                componentList = componentsToRemove;
            }
            if (allowRemoval == true) {
                for (var individualComponentIndex in componentList) {
                    var individualComponent = componentList[individualComponentIndex];
                    var individualComponentElement = rocket.component.Fetch(individualComponent);
                    if (individualComponentElement !== null) {
                        if (rocket.component.storedComponents[individualComponent["id"]] == undefined) {
                            var parentElement = individualComponentElement.parentElement;
                            parentElement.removeChild(individualComponentElement);
                        }
                        else {
                            delete rocket.component.storedComponents[individualComponent["id"]];
                        }
                    }
                }
            }
            return allowRemoval;
        }
        _component.Remove = Remove;
    })(component = rocket.component || (rocket.component = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var device;
    (function (device) {
        device.DoNotTrack;
        device.HasCryptography = true;
        device.HasGeolocation = true;
        device.HasIndexedDB = true;
        device.HasLocalStorage = true;
        device.IsOnline = true;
        device.IsSubHD;
        device.IsHD;
        device.IsFullHDOrAbove;
        function Detect() {
            if (navigator.doNotTrack !== undefined) {
                rocket.device.DoNotTrack = Boolean(navigator.doNotTrack);
            }
            else {
                rocket.device.DoNotTrack = true;
            }
            if (window.crypto == undefined) {
                rocket.device.HasCryptography = false;
            }
            if (navigator.geolocation == undefined) {
                rocket.device.HasGeolocation = false;
            }
            if (window.indexedDB == undefined) {
                rocket.device.HasIndexedDB = false;
            }
            if (window.localStorage == undefined) {
                rocket.device.HasLocalStorage = false;
            }
            if (navigator.onLine !== undefined) {
                rocket.device.IsOnline = navigator.onLine;
                document.addEventListener("online", function () {
                    rocket.device.IsOnline = true;
                }, false);
                document.addEventListener("offline", function () {
                    rocket.device.IsOnline = false;
                }, false);
            }
            if (window.screen.height < 720) {
                rocket.device.IsSubHD = true;
                rocket.device.IsHD = false;
                rocket.device.IsFullHDOrAbove = false;
            }
            else {
                if (((window.screen.height >= 720) && (window.screen.height < 1080)) && (window.screen.width >= 1280)) {
                    rocket.device.IsSubHD = false;
                    rocket.device.IsHD = true;
                    rocket.device.IsFullHDOrAbove = false;
                }
                else if ((window.screen.height >= 1080) && (window.screen.width >= 1920)) {
                    rocket.device.IsSubHD = false;
                    rocket.device.IsHD = true;
                    rocket.device.IsFullHDOrAbove = true;
                }
            }
        }
        device.Detect = Detect;
    })(device = rocket.device || (rocket.device = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var generator;
    (function (generator) {
        generator.lastUniqueIds = {};
        function IdGen(type) {
            var lastUniqueIdOfType;
            if (rocket.generator.lastUniqueIds[type] == undefined) {
                lastUniqueIdOfType = 0;
            }
            else {
                lastUniqueIdOfType = rocket.generator.lastUniqueIds[type];
            }
            var newUniqueIdOfType = lastUniqueIdOfType + 1;
            rocket.generator.lastUniqueIds[type] = newUniqueIdOfType;
            return (type + newUniqueIdOfType.toString());
        }
        generator.IdGen = IdGen;
        function ElementCreator(componentId, componentType, attributes) {
            var componentElement;
            if (componentId !== null) {
                if ((componentType == "header") || (componentType == "footer")) {
                    componentElement = document.createElement(componentType);
                }
                else if (componentType == "searchbox") {
                    componentElement = document.createElement("input");
                    componentElement.setAttribute("type", "text");
                }
                else {
                    componentElement = document.createElement("div");
                }
                componentElement.setAttribute("data-rocket-component-id", componentId);
                componentElement.setAttribute("data-rocket-component", componentType);
            }
            else {
                componentElement = document.createElement(componentType);
            }
            if (attributes !== undefined) {
                for (var attributeKey in attributes) {
                    if (attributeKey !== "content") {
                        componentElement.setAttribute(attributeKey, attributes[attributeKey]);
                    }
                    else {
                        var innerComponentContent = attributes["content"];
                        innerComponentContent = innerComponentContent.replace("<", "");
                        innerComponentContent = innerComponentContent.replace(">", "");
                        innerComponentContent = innerComponentContent.replace("&lt;", "");
                        innerComponentContent = innerComponentContent.replace("&gt;", "");
                        componentElement.textContent = attributes[attributeKey];
                    }
                }
            }
            return componentElement;
        }
        generator.ElementCreator = ElementCreator;
    })(generator = rocket.generator || (rocket.generator = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var header;
    (function (header) {
        function Generate(properties) {
            var componentId = rocket.generator.IdGen("header");
            var componentElement = rocket.generator.ElementCreator(componentId, "header");
            for (var propertyKey in properties) {
                if (propertyKey == "items") {
                    for (var individualItem in properties["items"]) {
                        if (properties["items"][individualItem]["type"] == "dropdown") {
                            var dropdownComponent = properties["items"][individualItem]["component"];
                            componentElement.appendChild(rocket.component.Fetch(dropdownComponent));
                            delete rocket.component.storedComponents[dropdownComponent["id"]];
                        }
                        else if (properties["items"][individualItem]["type"] == "link") {
                            var generatedElement = rocket.generator.ElementCreator(null, "a", {
                                "href": properties["items"][individualItem]["link"],
                                "content": properties["items"][individualItem]["content"]
                            });
                            componentElement.appendChild(generatedElement);
                        }
                    }
                }
                else if (propertyKey == "logo") {
                    var generatedElement = rocket.generator.ElementCreator(null, "img", {
                        "data-rocket-minor-component": "logo",
                        "src": properties["logo"]
                    });
                    componentElement.appendChild(generatedElement);
                }
            }
            rocket.component.storedComponents[componentId] = componentElement;
            return { "id": componentId, "type": "header" };
        }
        header.Generate = Generate;
        function SetLogo(component, image) {
            var headerElement = rocket.component.Fetch(component);
            var imageElement = headerElement.querySelector('img[data-rocket-minor-component="logo"]');
            if (imageElement == null) {
                imageElement = rocket.generator.ElementCreator(null, "img", {
                    "data-rocket-minor-component": "logo",
                    "src": image
                });
                headerElement.insertBefore(imageElement, headerElement.firstChild);
            }
            else {
                imageElement.setAttribute("src", image);
            }
            rocket.component.Update(component["id"], headerElement);
        }
        header.SetLogo = SetLogo;
        function RemoveLogo(component) {
            var headerElement = rocket.component.Fetch(component);
            if (headerElement.querySelectorAll('img[data-rocket-minor-component="logo"]').length > 0) {
                headerElement.removeChild(headerElement.firstChild);
                rocket.component.Update(component["id"], headerElement);
            }
        }
        header.RemoveLogo = RemoveLogo;
    })(header = rocket.header || (rocket.header = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var footer;
    (function (footer) {
        function Generate(properties) {
            var componentId = rocket.generator.IdGen("footer");
            var componentElement = rocket.generator.ElementCreator(componentId, "footer");
            for (var propertyKey in properties) {
                if (propertyKey == "items") {
                    for (var individualItem in properties["items"]) {
                        if (properties["items"][individualItem]["type"] == "link") {
                            var generatedElement = rocket.generator.ElementCreator(null, "a", {
                                "href": properties["items"][individualItem]["link"],
                                "content": properties["items"][individualItem]["content"]
                            });
                            componentElement.appendChild(generatedElement);
                        }
                    }
                }
                else if (propertyKey == "content") {
                    var generatedElement = rocket.generator.ElementCreator(null, "label", {
                        "content": properties["content"]
                    });
                    componentElement.insertBefore(generatedElement, componentElement.firstChild);
                }
            }
            rocket.component.storedComponents[componentId] = componentElement;
            return { "id": componentId, "type": "footer" };
        }
        footer.Generate = Generate;
        function SetLabel(component, labelText) {
            if (component !== undefined) {
                if (labelText !== undefined) {
                    var parentElement = rocket.component.Fetch(component);
                    var labelComponent = document.querySelector("pre");
                    if (labelComponent == null) {
                        labelComponent = document.createElement("pre");
                        parentElement.insertBefore(labelComponent, parentElement.firstChild);
                    }
                    labelComponent.textContent = labelText;
                    rocket.component.Update(component["id"], parentElement);
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        footer.SetLabel = SetLabel;
        function AddLink(prepend, component, linkProperties) {
            var componentAddingSucceeded;
            if (typeof linkProperties == "Object") {
                if ((linkProperties["title"] !== undefined) && (linkProperties["link"] !== undefined)) {
                    componentAddingSucceeded = rocket.component.Add(prepend, component, linkProperties);
                }
                else {
                    componentAddingSucceeded = false;
                }
            }
            else {
                componentAddingSucceeded = false;
            }
            return componentAddingSucceeded;
        }
        footer.AddLink = AddLink;
        function RemoveLink(component, linkProperties) {
            var componentRemovingSucceed;
            var footerElement = rocket.component.Fetch(component);
            var potentialLinkElement = footerElement.querySelector('a[href="' + linkProperties["link"] + '"][title="' + linkProperties["title"] + '"]');
            if (potentialLinkElement !== null) {
                footerElement.removeChild(potentialLinkElement);
                rocket.component.Update(component["id"], footerElement);
                componentRemovingSucceed = true;
            }
            else {
                componentRemovingSucceed = false;
            }
            return componentRemovingSucceed;
        }
        footer.RemoveLink = RemoveLink;
    })(footer = rocket.footer || (rocket.footer = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var button;
    (function (button) {
        function Generate(properties) {
            if (properties["type"] == undefined) {
                properties["type"] = "basic";
            }
            var componentId = rocket.generator.IdGen("button");
            var componentElement = rocket.generator.ElementCreator(componentId, "button", {
                "data-rocket-component-type": properties["type"]
            });
            for (var propertyKey in properties) {
                if ((propertyKey == "icon") && (properties["type"] == "basic")) {
                    componentElement.style.backgroundImage = properties["icon"];
                }
                else if (propertyKey == "content") {
                    componentElement.textContent = properties["content"];
                }
                else if ((propertyKey == "type") && (properties["type"] == "toggle")) {
                    if (properties["default"] == undefined) {
                        properties["default"] = false;
                    }
                    var buttonToggle = rocket.generator.ElementCreator(null, "div", {
                        "data-rocket-minor-component": "buttonToggle",
                        "data-rocket-component-status": properties["default"].toString()
                    });
                    componentElement.appendChild(buttonToggle);
                }
                else {
                    componentElement.setAttribute(propertyKey, properties[propertyKey]);
                }
            }
            rocket.component.storedComponents[componentId] = componentElement;
            return { "id": componentId, "type": "button" };
        }
        button.Generate = Generate;
        function SetLabel(component, content) {
            var setSucceeded;
            var componentElement = rocket.component.Fetch(component);
            if ((componentElement !== null) && (componentElement.getAttribute("data-rocket-component-type") == "basic")) {
                componentElement.textContent = content;
                rocket.component.Update(component["id"], componentElement);
                setSucceeded = true;
            }
            else {
                setSucceeded = false;
            }
            return setSucceeded;
        }
        button.SetLabel = SetLabel;
    })(button = rocket.button || (rocket.button = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var list;
    (function (list) {
        function Generate(properties) {
            var componentId = rocket.generator.IdGen("list");
            var componentElement = rocket.generator.ElementCreator(componentId, "list");
            for (var propertyKey in properties) {
                if (propertyKey == "items") {
                    for (var individualItemIndex in properties["items"]) {
                        var individualItem = properties["items"][individualItemIndex];
                        if (individualItem["type"] !== "list-item") {
                            individualItem = rocket.listitem.Generate(individualItem);
                        }
                        componentElement.appendChild(rocket.component.Fetch(individualItem));
                        delete rocket.component.storedComponents[individualItem["id"]];
                    }
                }
            }
            rocket.component.storedComponents[componentId] = componentElement;
            return { "id": componentId, "type": "list" };
        }
        list.Generate = Generate;
        list.AddItem = rocket.component.Add;
        list.RemoveItem = rocket.component.Remove;
    })(list = rocket.list || (rocket.list = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var listitem;
    (function (listitem) {
        function Generate(properties) {
            var componentId = rocket.generator.IdGen("list-item");
            var componentElement = rocket.generator.ElementCreator(componentId, "list-item");
            for (var propertyKey in properties) {
                if (propertyKey == "control") {
                    var controlComponentObject = properties[propertyKey];
                    if (controlComponentObject["type"] == "button") {
                        var controlComponentElement = rocket.component.Fetch(controlComponentObject);
                        componentElement.appendChild(controlComponentElement);
                        delete rocket.component.storedComponents[controlComponentObject["id"]];
                    }
                }
                else if (propertyKey == "label") {
                    var labelComponent = rocket.generator.ElementCreator(null, "label", {
                        "content": properties["label"]
                    });
                    componentElement.insertBefore(labelComponent, componentElement.firstChild);
                }
            }
            rocket.component.storedComponents[componentId] = componentElement;
            return { "id": componentId, "type": "list-item" };
        }
        listitem.Generate = Generate;
        function SetLabel(component, content) {
            var setLabelSucceeded = false;
            if (component["type"] == "list-item") {
                var listItemElement = rocket.component.Fetch(component);
                if (typeof content == "string") {
                    var listItemLabelElement;
                    if (listItemElement.querySelector("label") !== null) {
                        listItemLabelElement = listItemElement.querySelector("label");
                    }
                    else {
                        listItemLabelElement = rocket.generator.ElementCreator(null, "label");
                        listItemElement.insertBefore(listItemLabelElement, listItemElement.firstChild);
                    }
                    listItemLabelElement.textContent = content;
                    setLabelSucceeded = true;
                }
            }
            return setLabelSucceeded;
        }
        listitem.SetLabel = SetLabel;
        function SetControl(component, control) {
            var setControlSucceeded = false;
            if (component["type"] == "list-item") {
                var listItemElement = rocket.component.Fetch(component);
                if (typeof control == "object") {
                    if (listItemElement.querySelector("div") !== null) {
                        listItemElement.removeChild(listItemElement.querySelector("div"));
                    }
                    if (control["type"] == "button") {
                        var innerControlElement = rocket.component.Fetch(control);
                        if (innerControlElement !== null) {
                            delete rocket.component.storedComponents[control["id"]];
                            listItemElement.appendChild(innerControlElement);
                            rocket.component.RemoveListeners(component);
                            rocket.component.Update(component["id"], listItemElement);
                            setControlSucceeded = true;
                        }
                    }
                }
            }
            return setControlSucceeded;
        }
        listitem.SetControl = SetControl;
    })(listitem = rocket.listitem || (rocket.listitem = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var dropdown;
    (function (dropdown) {
        function Generate(properties) {
            var componentId = rocket.generator.IdGen("dropdown");
            var componentElement = rocket.generator.ElementCreator(componentId, "dropdown");
            for (var propertyKey in properties) {
                if (propertyKey == "items") {
                    var newListComponent = rocket.list.Generate({ "items": properties["items"] });
                    var newListElement = rocket.component.Fetch(newListComponent);
                    componentElement.appendChild(newListElement);
                    delete rocket.component.storedComponents[newListComponent["id"]];
                }
                else if (propertyKey == "label") {
                    var labelProperties = properties["label"];
                    var dropdownLabel = rocket.generator.ElementCreator(null, "div", {
                        "data-rocket-minor-component": "dropdown-label"
                    });
                    if (labelProperties["icon"] !== undefined) {
                        dropdownLabel.style.backgroundImage = labelProperties["icon"];
                    }
                    if (labelProperties["image"] !== undefined) {
                        var dropdownLabelImage = rocket.generator.ElementCreator(null, "img", {
                            "src": labelProperties["image"]
                        });
                        dropdownLabel.appendChild(dropdownLabelImage);
                    }
                    if (labelProperties["content"] !== undefined) {
                        var dropdownLabelText = rocket.generator.ElementCreator(null, "label", {
                            "content": labelProperties["content"]
                        });
                        dropdownLabel.appendChild(dropdownLabelText);
                    }
                    componentElement.insertBefore(dropdownLabel, componentElement.firstChild);
                }
                else if (propertyKey == "list") {
                    var listComponent = rocket.component.Fetch(properties[propertyKey]);
                    componentElement.appendChild(listComponent);
                    delete rocket.component.storedComponents[properties[propertyKey]["id"]];
                }
            }
            rocket.component.storedComponents[componentId] = componentElement;
            return { "id": componentId, "type": "dropdown" };
        }
        dropdown.Generate = Generate;
        function InnerListComponentFetcher(dropdownComponent) {
            var dropdownElement = rocket.component.Fetch(dropdownComponent);
            return rocket.component.FetchComponentObject(dropdownElement.querySelector('div[data-rocket-component="list"]'));
        }
        dropdown.InnerListComponentFetcher = InnerListComponentFetcher;
        function SetText(component, content) {
            var dropdownElement = rocket.component.Fetch(component);
            var dropdownLabel = dropdownElement.querySelector('*[data-rocket-minor-component="dropdown-label"]');
            var dropdownLabelText = dropdownLabel.querySelector("label");
            if (content !== false) {
                dropdownLabelText.textContent = content;
            }
            else if (content == false) {
                dropdownLabel.removeChild(dropdownLabelText);
            }
            rocket.component.Update(component["id"], dropdownElement);
        }
        dropdown.SetText = SetText;
        function SetImage(component, content) {
            var dropdownElement = rocket.component.Fetch(component);
            var dropdownLabel = dropdownElement.querySelector('*[data-rocket-minor-component="dropdown-label"]');
            var dropdownLabelImage = dropdownLabel.querySelector("img");
            if (content !== false) {
                if (dropdownLabelImage == null) {
                    dropdownLabelImage = rocket.generator.ElementCreator(null, "img");
                    dropdownLabel.insertBefore(dropdownLabelImage, dropdownLabel.firstChild);
                }
                dropdownLabelImage.setAttribute("src", content);
            }
            else if (content == false) {
                dropdownLabel.removeChild(dropdownLabelImage);
            }
            rocket.component.Update(component["id"], dropdownElement);
        }
        dropdown.SetImage = SetImage;
        function SetIcon(component, content) {
            var dropdownElement = rocket.component.Fetch(component);
            var dropdownLabel = dropdownElement.querySelector('*[data-rocket-minor-component="dropdown-label"]');
            var currentDropdownLabelCSS = dropdownLabel.getAttribute("style");
            var newBackgroundCSS = "background-image: " + content + ";";
            var firstIndexOfBackgroundImage = currentDropdownLabelCSS.indexOf("background-image");
            if ((currentDropdownLabelCSS.length > 0) && (firstIndexOfBackgroundImage !== -1)) {
                var endingOfBackgroundImageCSS = currentDropdownLabelCSS.indexOf(";", firstIndexOfBackgroundImage);
                var fullBackgroundImageStyling = currentDropdownLabelCSS.substring(firstIndexOfBackgroundImage, (endingOfBackgroundImageCSS + 1));
                currentDropdownLabelCSS = currentDropdownLabelCSS.replace(fullBackgroundImageStyling, newBackgroundCSS);
            }
            else {
                currentDropdownLabelCSS += newBackgroundCSS;
            }
            dropdownLabel.setAttribute("style", currentDropdownLabelCSS);
            rocket.component.Update(component["id"], dropdownElement);
        }
        dropdown.SetIcon = SetIcon;
        function AddItem(component, listItemComponent) {
            var listComponentObject = rocket.dropdown.InnerListComponentFetcher(component);
            rocket.component.Add(true, listComponentObject, listItemComponent);
        }
        dropdown.AddItem = AddItem;
        function RemoveItem(component, listItemComponent) {
            rocket.list.RemoveItem(listItemComponent);
        }
        dropdown.RemoveItem = RemoveItem;
    })(dropdown = rocket.dropdown || (rocket.dropdown = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var player;
    (function (player) {
        function Init(component) {
            var componentElement = rocket.component.Fetch(component);
            var innerContentElement = rocket.player.GetInnerContentElement(component);
            var playerControlArea = componentElement.querySelector('div[data-rocket-component="player-control"]');
            var playerControlComponent = rocket.component.FetchComponentObject(playerControlArea);
            var playerRange = playerControlArea.querySelector('input[type="range"]');
            innerContentElement.addEventListener("timeupdate", function () {
                var playerComponent = arguments[0];
                var playerComponentElement = rocket.component.Fetch(playerComponent);
                var playerControlElement = playerComponentElement.querySelector('div[data-rocket-component="player-control"]');
                var playerControlComponent = rocket.component.FetchComponentObject(playerControlElement);
                var playerElement = rocket.player.GetInnerContentElement(playerComponent);
                var currentTime = playerElement.currentTime;
                if (playerComponentElement.hasAttribute("data-rocket-component-status") == false) {
                    playerComponentElement.querySelector('div[data-rocket-component="player-control"]').querySelector("input").value = currentTime;
                }
                rocket.playercontrol.TimeLabelUpdater(playerControlComponent, 0, currentTime);
                if (playerElement.ended == true) {
                    var playButtonElement = playerControlElement.querySelector('div[data-rocket-minor-component="player-button-play"]');
                    rocket.component.CSS(rocket.component.FetchComponentObject(playButtonElement), "background-image", false);
                    var playerRange = playerControlElement.querySelector('input[type="range"]');
                    playerRange.value = 0;
                }
            }.bind(this, component));
            if (component["type"] == "video-player") {
                var posterImageElement = componentElement.querySelector('img[data-rocket-minor-component="video-poster"]');
                if (posterImageElement !== null) {
                    rocket.component.CSS(playerControlComponent, "opacity", "0.8");
                    for (var listenerKey in rocket.component.listenerStrings["up"]) {
                        posterImageElement.addEventListener(rocket.component.listenerStrings["up"][listenerKey], function () {
                            var playerElementComponent = arguments[0];
                            var posterImageElement = arguments[1];
                            var e = arguments[2];
                            if (e.button == 0) {
                                posterImageElement.setAttribute("style", "display: none");
                                rocket.player.PlayOrPause(playerElementComponent);
                            }
                        }.bind(this, component, posterImageElement));
                    }
                }
                for (var listenerKey in rocket.component.listenerStrings["up"]) {
                    innerContentElement.addEventListener(rocket.component.listenerStrings["up"][listenerKey], function () {
                        var e = arguments[1];
                        if (e.button == 0) {
                            var playerElementComponent = arguments[0];
                            rocket.player.PlayOrPause(playerElementComponent);
                        }
                    }.bind(this, component));
                }
                componentElement.addEventListener("contextmenu", function (e) {
                    e.preventDefault();
                });
            }
            var playButtonComponent = rocket.component.FetchComponentObject(playerControlArea.querySelector('div[data-rocket-minor-component="player-button-play"]'));
            rocket.component.AddListeners(playButtonComponent, function () {
                var playButtonComponent = arguments[0];
                var playButton = rocket.component.Fetch(playButtonComponent);
                var playerElement = playButton.parentElement.parentElement;
                var playerElementComponent = rocket.component.FetchComponentObject(playerElement);
                rocket.player.PlayOrPause(playerElementComponent, playButtonComponent);
            });
            for (var listenerKey in rocket.component.listenerStrings["down"]) {
                playerRange.addEventListener(rocket.component.listenerStrings["down"][listenerKey], function () {
                    var playerControlComponent = arguments[0];
                    var playerControl = rocket.component.Fetch(playerControlComponent);
                    var playerRange = playerControl.querySelector("input");
                    playerRange.parentElement.parentElement.setAttribute("data-rocket-component-status", "true");
                }.bind(this, component));
            }
            for (var listenerKey in rocket.component.listenerStrings["up"]) {
                playerRange.addEventListener(rocket.component.listenerStrings["up"][listenerKey], rocket.player.TimeOrVolumeChanger.bind(this, playerControlComponent));
            }
            var volumeButtonComponent = rocket.component.FetchComponentObject(playerControlArea.querySelector('div[data-rocket-minor-component="player-button-volume"]'));
            rocket.component.AddListeners(volumeButtonComponent, function () {
                var volumeButtonComponent = arguments[0];
                var volumeButton = rocket.component.Fetch(volumeButtonComponent);
                var playerElement = volumeButton.parentElement.parentElement;
                var playerElementComponent = rocket.component.FetchComponentObject(playerElement);
                var playerRange = playerElement.querySelector("input");
                var playerRangeAttributes = {};
                var playerTimeElement = playerElement.querySelector("time");
                if (rocket.player.IsDoingTimeChange(playerElementComponent) == true) {
                    playerElement.setAttribute("data-rocket-component-status", "true");
                    playerElement.setAttribute("data-rocket-component-changevolume", "");
                    volumeButton.parentElement.querySelector('div[data-rocket-minor-component="player-button-play"]').setAttribute("data-rocket-component-disabled", "");
                    volumeButton.setAttribute("data-rocket-component-status", "true");
                    playerTimeElement.setAttribute("data-rocket-component-disabled", "");
                    playerRangeAttributes["max"] = "100";
                    playerRangeAttributes["step"] = "1";
                    playerRange.value = (rocket.player.GetInnerContentElement(playerElementComponent).volume * 100).toString();
                }
                else {
                    volumeButton.parentElement.querySelector('div[data-rocket-minor-component="player-button-play"]').removeAttribute("data-rocket-component-disabled");
                    volumeButton.removeAttribute("data-rocket-component-status");
                    playerTimeElement.removeAttribute("data-rocket-component-disabled");
                    playerRangeAttributes = rocket.player.GetPlayerLengthInfo(playerElementComponent);
                    playerElement.removeAttribute("data-rocket-component-status");
                    playerElement.removeAttribute("data-rocket-component-changevolume");
                }
                for (var playerRangeAttribute in playerRangeAttributes) {
                    playerRange.setAttribute(playerRangeAttribute, playerRangeAttributes[playerRangeAttribute]);
                }
            });
        }
        player.Init = Init;
        function GetInnerContentElement(component) {
            var componentElement = rocket.component.Fetch(component);
            return componentElement.querySelector(component["type"].replace("-player", ""));
        }
        player.GetInnerContentElement = GetInnerContentElement;
        function GetPlayerLengthInfo(component) {
            var playerLengthInfo = {};
            var contentDuration = Math.floor(Number(rocket.player.GetInnerContentElement(component).duration));
            playerLengthInfo["max"] = contentDuration;
            if (contentDuration < 60) {
                playerLengthInfo["step"] = 1;
            }
            else if ((contentDuration > 60) && (contentDuration <= 300)) {
                playerLengthInfo["step"] = 5;
            }
            else if ((contentDuration > 300) && (contentDuration < 900)) {
                playerLengthInfo["step"] = 10;
            }
            else {
                playerLengthInfo["step"] = 15;
            }
            return playerLengthInfo;
        }
        player.GetPlayerLengthInfo = GetPlayerLengthInfo;
        function TimeOrVolumeChanger() {
            var playerControlComponent = arguments[0];
            var playerControlElement = rocket.component.Fetch(playerControlComponent);
            var playerRange = playerControlElement.querySelector("input");
            var playerElement = playerControlElement.parentElement;
            var playerComponentObject = rocket.component.FetchComponentObject(playerElement);
            var contentElement = rocket.player.GetInnerContentElement(playerComponentObject);
            var valueNum = Number(playerRange.value);
            if (rocket.player.IsDoingTimeChange(playerComponentObject) == true) {
                valueNum = valueNum.toFixed();
                contentElement.currentTime = valueNum;
            }
            else {
                valueNum = (valueNum / 100);
                contentElement.volume = valueNum;
            }
            if (playerElement.hasAttribute("data-rocket-component-changevolume") !== true) {
                playerElement.removeAttribute("data-rocket-component-status");
            }
        }
        player.TimeOrVolumeChanger = TimeOrVolumeChanger;
        function IsPlaying(component) {
            var componentElement = rocket.component.Fetch(component);
            var isPaused = componentElement.querySelector(component["type"].replace("-player", "")).paused;
            if (isPaused == true) {
                return false;
            }
            else {
                return true;
            }
        }
        player.IsPlaying = IsPlaying;
        function IsDoingTimeChange(component) {
            var componentElement = rocket.component.Fetch(component);
            if (componentElement.hasAttribute("data-rocket-component-changevolume") !== true) {
                return true;
            }
            else {
                return false;
            }
        }
        player.IsDoingTimeChange = IsDoingTimeChange;
        function PlayOrPause(component, playButtonComponentObject) {
            var playerComponentElement = rocket.component.Fetch(component);
            var innerContentElement = rocket.player.GetInnerContentElement(component);
            if (playButtonComponentObject == undefined) {
                playButtonComponentObject = rocket.component.FetchComponentObject(playerComponentElement.querySelector('div[data-rocket-minor-component="player-button-play"]'));
            }
            var playButton = rocket.component.Fetch(playButtonComponentObject);
            if (playButton.hasAttribute("data-rocket-component-disabled") == false) {
                if (innerContentElement.played.length == 0) {
                    var playerControlComponent = rocket.component.FetchComponentObject(playButton.parentElement);
                    var playerRange = playerComponentElement.querySelector('input[type="range"]');
                    var playerMediaLengthInformation = rocket.player.GetPlayerLengthInfo(component);
                    var posterImageElement = playerComponentElement.querySelector('img[data-rocket-minor-component="video-poster"]');
                    if (posterImageElement !== null) {
                        posterImageElement.setAttribute("style", "display: none");
                        rocket.component.CSS(playerControlComponent, "opacity", false);
                    }
                    for (var playerRangeAttribute in playerMediaLengthInformation) {
                        playerRange.setAttribute(playerRangeAttribute, playerMediaLengthInformation[playerRangeAttribute]);
                        if (playerRangeAttribute == "max") {
                            rocket.playercontrol.TimeLabelUpdater(playerControlComponent, 1, playerMediaLengthInformation[playerRangeAttribute]);
                        }
                    }
                }
                if (innerContentElement.paused !== true) {
                    innerContentElement.pause();
                    rocket.component.CSS(playButtonComponentObject, "background-image", false);
                }
                else {
                    innerContentElement.play();
                    rocket.component.CSS(playButtonComponentObject, "background-image", "url(css/img/pause.png)");
                }
            }
        }
        player.PlayOrPause = PlayOrPause;
        function FetchSources(type, sources) {
            var arrayOfSourceElements = [];
            var sourcesList;
            if (typeof sources == "string") {
                sourcesList = [sources];
            }
            else {
                sourcesList = sources;
            }
            for (var sourceKey in sourcesList) {
                var source = sourcesList[sourceKey];
                var sourceExtension = source.substr(source.lastIndexOf(".")).replace(".", "");
                var sourceType;
                if (sourceExtension !== "mov") {
                    sourceType = sourceExtension;
                }
                else {
                    sourceType = "quicktime";
                }
                var sourceTag = rocket.generator.ElementCreator(null, "source", {
                    "src": source,
                    "type": (type + "/" + sourceType)
                });
                arrayOfSourceElements.push(sourceTag);
            }
            return arrayOfSourceElements;
        }
        player.FetchSources = FetchSources;
    })(player = rocket.player || (rocket.player = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var playercontrol;
    (function (playercontrol) {
        function Generate() {
            var componentId = rocket.generator.IdGen("player-control");
            var componentElement = rocket.generator.ElementCreator(componentId, "player-control");
            var playButton = rocket.button.Generate({
                "data-rocket-minor-component": "player-button-play"
            });
            var inputRange = rocket.generator.ElementCreator(null, "input", { "type": "range", "value": "0" });
            var timeStamp = rocket.generator.ElementCreator(null, "time", { "content": "00:00 / 00:00" });
            var volumeButton = rocket.button.Generate({
                "data-rocket-minor-component": "player-button-volume"
            });
            componentElement.appendChild(rocket.component.Fetch(playButton));
            componentElement.appendChild(inputRange);
            componentElement.appendChild(timeStamp);
            componentElement.appendChild(rocket.component.Fetch(volumeButton));
            rocket.component.storedComponents[componentId] = componentElement;
            return { "id": componentId, "type": "player-control" };
        }
        playercontrol.Generate = Generate;
        function SecondsToTimeFormat(seconds) {
            var timeObject = {};
            if (seconds >= 3600) {
                timeObject["hours"] = Number((seconds / 3600).toPrecision(1));
                timeObject["minutes"] = Number(((seconds - (3600 * timeObject["hours"])) / 60).toPrecision(1));
                timeObject["seconds"] = Number((seconds - (3600 * timeObject["hours"])) - (60 * timeObject["minutes"]));
            }
            else if ((seconds >= 60) && (seconds < 3600)) {
                timeObject["minutes"] = Number((seconds / 60).toPrecision(1));
                timeObject["seconds"] = Number((seconds - (timeObject["minutes"] * 60)));
            }
            else {
                timeObject["minutes"] = 0;
                timeObject["seconds"] = seconds;
            }
            timeObject["seconds"] = Math.floor(timeObject["seconds"]);
            for (var timeObjectKey in timeObject) {
                var timeObjectValue = timeObject[timeObjectKey];
                var timeObjectValueString = timeObjectValue.toString();
                if (timeObjectValue < 10) {
                    timeObjectValueString = "0" + timeObjectValueString;
                }
                timeObject[timeObjectKey] = timeObjectValueString;
            }
            return timeObject;
        }
        playercontrol.SecondsToTimeFormat = SecondsToTimeFormat;
        function TimeLabelUpdater(component, timePart, value) {
            var playerControlElement = rocket.component.Fetch(component);
            var playerTimeElement = playerControlElement.querySelector("time");
            var parsedSecondsToString = "";
            var timeFormatObject = rocket.playercontrol.SecondsToTimeFormat(value);
            for (var timeObjectKey in timeFormatObject) {
                var timeObjectValue = timeFormatObject[timeObjectKey];
                if (parsedSecondsToString.length !== 0) {
                    parsedSecondsToString = parsedSecondsToString + ":" + timeObjectValue;
                }
                else {
                    parsedSecondsToString = timeObjectValue;
                }
            }
            var playerTimeElementParts = playerTimeElement.textContent.split(" / ");
            playerTimeElementParts[timePart] = parsedSecondsToString;
            playerTimeElement.textContent = playerTimeElementParts[0] + " / " + playerTimeElementParts[1];
        }
        playercontrol.TimeLabelUpdater = TimeLabelUpdater;
    })(playercontrol = rocket.playercontrol || (rocket.playercontrol = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var audioplayer;
    (function (audioplayer) {
        function Generate(properties) {
            if (properties["sources"] !== undefined) {
                var componentId = rocket.generator.IdGen("audio-player");
                var componentElement = rocket.generator.ElementCreator(componentId, "audio-player");
                var audioPlayer = rocket.generator.ElementCreator(null, "audio", {
                    "preload": "metadata",
                    "volume": "0.5"
                });
                audioPlayer.autoplay = false;
                var arrayofSourceElements = rocket.player.FetchSources("audio", properties["sources"]);
                for (var sourceElementKey in arrayofSourceElements) {
                    audioPlayer.appendChild(arrayofSourceElements[sourceElementKey]);
                }
                componentElement.appendChild(audioPlayer);
                if ((properties["art"] !== undefined) && (properties["title"] !== undefined)) {
                    var playerInformation = rocket.generator.ElementCreator(null, "div", {
                        "data-rocket-minor-component": "player-information"
                    });
                    var playerTextualInformation = rocket.generator.ElementCreator(null, "section");
                    playerInformation.appendChild(rocket.generator.ElementCreator(null, "img", { "src": properties["art"] }));
                    var audioTitle = rocket.generator.ElementCreator(null, "b", { "content": properties["title"] });
                    playerTextualInformation.appendChild(audioTitle);
                    if (properties["artist"] !== undefined) {
                        var artistInfo = rocket.generator.ElementCreator(null, "label", { "content": properties["artist"] });
                        playerTextualInformation.appendChild(artistInfo);
                    }
                    if (properties["album"] !== undefined) {
                        var albumInfo = rocket.generator.ElementCreator(null, "label", { "content": properties["album"] });
                        playerTextualInformation.appendChild(albumInfo);
                    }
                    playerInformation.appendChild(playerTextualInformation);
                    componentElement.appendChild(playerInformation);
                }
                var playerControlComponent = rocket.playercontrol.Generate();
                var playerControlElement = rocket.component.Fetch(playerControlComponent);
                componentElement.appendChild(playerControlElement);
                rocket.component.storedComponents[componentId] = componentElement;
                return { "id": componentId, "type": "audio-player" };
            }
            else {
                return { "error": "no sources defined" };
            }
        }
        audioplayer.Generate = Generate;
    })(audioplayer = rocket.audioplayer || (rocket.audioplayer = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var videoplayer;
    (function (videoplayer) {
        function Generate(properties) {
            if (properties["sources"] !== undefined) {
                var componentId = rocket.generator.IdGen("video-player");
                var componentElement = rocket.generator.ElementCreator(componentId, "video-player");
                if (properties["art"] !== undefined) {
                    var posterImageElement = rocket.generator.ElementCreator(null, "img", {
                        "data-rocket-minor-component": "video-poster",
                        "src": properties["art"]
                    });
                    componentElement.appendChild(posterImageElement);
                }
                var videoPlayer = rocket.generator.ElementCreator(null, "video", {
                    "preload": "metadata",
                    "volume": "0.5"
                });
                videoPlayer.autoplay = false;
                var arrayofSourceElements = rocket.player.FetchSources("video", properties["sources"]);
                for (var sourceElementKey in arrayofSourceElements) {
                    videoPlayer.appendChild(arrayofSourceElements[sourceElementKey]);
                }
                componentElement.appendChild(videoPlayer);
                var playerControlComponent = rocket.playercontrol.Generate();
                var playerControlElement = rocket.component.Fetch(playerControlComponent);
                componentElement.appendChild(playerControlElement);
                rocket.component.storedComponents[componentId] = componentElement;
                return { "id": componentId, "type": "video-player" };
            }
            else {
                return { "error": "no video defined" };
            }
        }
        videoplayer.Generate = Generate;
    })(videoplayer = rocket.videoplayer || (rocket.videoplayer = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    var searchbox;
    (function (searchbox) {
        function Generate(properties) {
            var componentId = rocket.generator.IdGen("searchbox");
            var componentElement = rocket.generator.ElementCreator(componentId, "searchbox");
            for (var propertyKey in properties) {
                if (propertyKey == "icon") {
                    componentElement.style.backgroundImage = properties["icon"];
                }
                else if (propertyKey == "content") {
                    componentElement.setAttribute("placeholder", properties["content"]);
                }
            }
            rocket.component.storedComponents[componentId] = componentElement;
            return { "id": componentId, "type": "searchbox" };
        }
        searchbox.Generate = Generate;
        function SetText(component, placeholderText) {
            var searchboxElement = rocket.component.Fetch(component);
            if (searchboxElement !== null) {
                var searchboxInputElement = searchboxElement.getElementsByTagName("input")[0];
                if (placeholderText !== false) {
                    searchboxInputElement.setAttribute("placeholder", placeholderText);
                }
                else if (placeholderText == false) {
                    searchboxInputElement.removeAttribute("placeholder");
                }
                rocket.component.Update(component["id"], searchboxElement);
            }
        }
        searchbox.SetText = SetText;
    })(searchbox = rocket.searchbox || (rocket.searchbox = {}));
})(rocket || (rocket = {}));
var rocket;
(function (rocket) {
    function Init() {
        rocket.device.Detect();
        document.addEventListener("scroll", function () {
            var dropdowns = document.querySelectorAll('div[data-rocket-component="dropdown"][active]');
            for (var dropdownIndex = 0; dropdownIndex < dropdowns.length; dropdownIndex++) {
                var thisDropdown = dropdowns[dropdownIndex];
                thisDropdown.removeAttribute("active");
            }
        });
        var documentHeadSection = document.querySelector("head");
        if (documentHeadSection == null) {
            documentHeadSection = document.createElement("head");
            document.querySelector("html").insertBefore(documentHeadSection, document.querySelector("head").querySelector("body"));
        }
        var viewportMetaTag = documentHeadSection.querySelector('meta[name="viewport"]');
        if (viewportMetaTag == null) {
            viewportMetaTag = document.createElement("meta");
            viewportMetaTag.setAttribute("name", "viewport");
            viewportMetaTag.setAttribute("content", 'width=device-width, initial-scale=1,user-scalable=no');
            documentHeadSection.appendChild(viewportMetaTag);
        }
        if (MutationObserver !== undefined) {
            var mutationWatcher = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type == "childList") {
                        for (var i = 0; i < mutation.addedNodes.length; i++) {
                            var addedNode = mutation.addedNodes[i];
                            function NodeParser(passedNode) {
                                if (passedNode.localName !== null) {
                                    var componentObject = rocket.component.FetchComponentObject(passedNode);
                                    if (componentObject !== false) {
                                        if (componentObject["type"] == "dropdown") {
                                            rocket.component.AddListeners(rocket.component.listenerStrings["up"], componentObject, rocket.component.dropdownToggler);
                                        }
                                        else if ((componentObject["type"] == "audio-player") || (componentObject["type"] == "video-player")) {
                                            rocket.player.Init(componentObject);
                                        }
                                        if (passedNode.childNodes.length > 0) {
                                            for (var i = 0; i < passedNode.childNodes.length; i++) {
                                                var childNode = passedNode.childNodes[i];
                                                NodeParser(childNode);
                                            }
                                        }
                                        delete rocket.component.storedComponents[componentObject["id"]];
                                    }
                                }
                            }
                            NodeParser(addedNode);
                        }
                    }
                });
            });
            var mutationWatcherOptions = {
                childList: true,
                attributes: true,
                characterData: false,
                attributeFilter: ['data-rocket-component'],
                subtree: true
            };
            mutationWatcher.observe(document.querySelector("body"), mutationWatcherOptions);
        }
    }
    rocket.Init = Init;
    rocket.Define = rocket.component.Define;
    rocket.Fetch = rocket.component.Fetch;
    rocket.FetchComponentObject = rocket.component.FetchComponentObject;
    rocket.Add = rocket.component.Add;
    rocket.Remove = rocket.component.Remove;
    rocket.Animate = rocket.component.Animate;
    rocket.CSS = rocket.component.CSS;
    rocket.AddListeners = rocket.component.AddListeners;
    rocket.RemoveListeners = rocket.component.RemoveListeners;
})(rocket || (rocket = {}));