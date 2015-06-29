function initializeHexaMenu(){
    var menuContent = {
        "Home": {
            url: "index.html",
            icon: "<i class='fa fa-home'></i>"
        },
        "Toolbox": {
            url: "toolbox.html",
            icon: "<i class='fa fa-wrench'></i>"
        },
        "Blog": {
            url: "blog.html",
            icon: "<i class='fa fa-pencil-square-o'></i>"
        },
        "Contact": {
            url: "contact.html",
            icon: "<i class='fa fa-phone'></i>"
        },
        "Resume": {
            url: "resume.html",
            icon: "<i class='fa fa-user'></i>"
        }
    }

    var headerBottomClass = ".header-bottom";
    var headerMiddleClass = ".header-middle";
    var menuClass = ".menu";
    var menuItemClass = ".menu-item";
    var menuItemMiddleClass = ".menu-item-middle";
    var contentClass = ".content";

    var menuItemID = "#menu-item";
    var contentID = "#Content";
    var headerID = "#Header";

    var headerURL = "header.html";
    var menuItemURL = "menuItem.html";

    var menuItems = {};
    var centerMenuItem;
    var doneMoving = true;

    getHeader(createMenuItems);

    function swapMenuOrder(name1, name2){
        var order1 = getLocalOrder(name1);
        var order2 = getLocalOrder(name2);

        if (menuItems[name1]){
            menuItems[name1].order = order2;
        }
        else if (menuItems[name2]){
            menuItems[name2].order = order1;
        }

        setLocalOrder(name1, order2);
        setLocalOrder(name2, order1);
    }

    function setLocalOrder(name, order){
        try{
            localStorage.setItem(name, order);
            return true;
        }
        catch(e){
            console.log("Cannot set local storage.");
            return false;
        }
    }

    function getLocalCenter(){
        for (var name in menuContent){
            if (getLocalOrder(name) == -1){
                return name;
            }
        }
        return false;
    }

    function getLocalOrder(name, orderNum){
        var order;
        var toOrder;
        var hasLocalOrder = true;

        try{
            order = localStorage.getItem(name);
        }
        catch(e){
            console.log("Cannot get local storage.");
            hasLocalOrder = false;
        } 

        if (!order){
            if (hasLocalOrder){
                setLocalOrder(name, orderNum);
            }
            return orderNum;
        }
        else{
            return order;
        }
    }

    function createMenuItem(div, content, order, name){
        return {
            div: div,
            content: content,
            order: order,
            name: name
        }        
    }

    function createMenuItems(){
        var centerMenuName = getCenterMenuName();
        var menuItemFramework = document.createElement("div");
        var orderNum = 0;

        $(menuItemFramework).load(menuItemURL + " " + menuItemID, function(){
            for (var name in menuContent){
                var menuItemDiv = $(menuItemFramework).find(menuItemID).clone().prop("id", name);
                menuItemDiv.find(menuItemMiddleClass).append(menuContent[name].icon);
                if (name != centerMenuName){
                    menuItems[name] = createMenuItem($(menuItemDiv), menuContent[name].url, getLocalOrder(name, orderNum), name);
                    orderNum += 1;
                }
                else{
                    menuItems[name] = createMenuItem($(menuItemDiv), menuContent[name].url, -1, name);   
                    if ((getLocalOrder(name) >= 0) && getLocalCenter()){
                        swapMenuOrder(name, getLocalCenter());        
                    }
                    else{
                        setLocalOrder(name, -1);
                    }   
                }
            }
            drawMenuItems();
        });
    }

    function setUpClickFunc(){
        var isMiddle;

        $(menuItemClass).click(function(){
            isMiddle = $(this).parent().hasClass(headerMiddleClass.substring(1));
            if (doneMoving && !isMiddle){ activateButton(getMenuItem(this)); }
        });
    }

    function drawMenuItems(){
        var centerMenuName = getCenterMenuName();
        var menuItemsOrdered = [null, null, null, null];
        var menuItem;

        for (var name in menuItems){
            menuItem = menuItems[name];
            if (menuItem.order == -1){
                $(headerMiddleClass).append(menuItem.div);
                setCenterItem(name);
            }
            else{
                menuItemsOrdered[menuItem.order] = menuItem;
            }
        }
        for (var index in menuItemsOrdered){
            $(menuClass).append(menuItemsOrdered[index].div);
        }

        colorMenuItems();
        setUpClickFunc();
    }

    function colorMenuItems(){
        for (var name in menuItems){
            menuItems[name].color = $(menuItems[name].div).find(menuItemMiddleClass).css("background-color");
        }
    }

    function getCenterMenuName(){
        var curURL = window.location.href;

        for(var itemName in menuContent) {
            if(menuContent[itemName].url === curURL.substring(curURL.lastIndexOf('/')+1)) {
                return itemName;
            }
        }
        //Home should be the only 
        return "Home";       
    }

    function getHeader(callback){
        $(headerID).load(headerURL + " " + headerID + " > *", callback);
    }

    function setCenterItem(itemName){
        var centerItemEl = $(headerMiddleClass + " " + menuItemClass);
        var centerItemName = centerItemEl[0].id;
        var newCenterItem;
        var rightmostMenuItem;

        if (centerItemName != itemName){
            newCenterItem = $("#"+itemName);
            rightmostMenuItem = newCenterItem.prev();

            if(rightmostMenuItem.length == 0){
                $(centerItemEl).prependTo($(menuClass));
            }
            else{
                $(centerItemEl).insertAfter(rightmostMenuItem);
            } 

            $(headerMiddleClass).append(newCenterItem);           
        }

        centerMenuItem = menuItems[itemName];
    }

    function getMenuItem(div){
        for (var name in menuItems){
            if (name === div.id){
                return menuItems[name];
            }
        }
    }

    function activateButton(activatedMenuItem){        
        var activatedButton = activatedMenuItem.div;
        var rightmostMenuItem = $(activatedButton).prev();
        var xOfMid = $(centerMenuItem.div).offset().left;
        var xOfThis = $(activatedMenuItem.div).offset().left;
        var xDestination = xOfMid - xOfThis;
        var doneMovingCenterItem = true;
        var doneMovingActivatedItem = true;
        var temp = document.createElement("div");
        
        temp.className = "temp-div";
        $(contentClass).append(temp);
        $(temp).load(activatedMenuItem.content + " " + contentID);
        swap();

        function swap(){
            doneMoving = false;
            doneMovingCenterItem = false;
            doneMovingActivatedItem = false;
            swapMenuOrder(activatedMenuItem.name, centerMenuItem.name);
            moveCenterMenuItem();
            moveActivatedMenuItem();
        }

        function moveCenterMenuItem(){    
            $(centerMenuItem.div).animate({bottom: "+=40px"});
            $(centerMenuItem.div).promise().done(function() {
                $(centerMenuItem.div).animate({right: xDestination});
                $(centerMenuItem.div).promise().done(function() {
                    $(centerMenuItem.div).removeAttr("style");
                    $(centerMenuItem.div).promise().done(function() {
                        if(rightmostMenuItem.length == 0){
                            $(centerMenuItem.div).prependTo($(menuClass));
                        }
                        else{
                            $(centerMenuItem.div).insertAfter(rightmostMenuItem);
                        }
                        doneMovingActivatedItem = true;
                        doneMoving = doneMovingCenterItem && doneMovingActivatedItem;
                    });
                });
            });
        };

        function moveActivatedMenuItem(){
            if (centerMenuItem.div !== activatedButton){
                $(activatedButton).promise().done(function() {
                    $(activatedButton).animate({left: xDestination});
                    $(activatedButton).promise().done(function() {
                        $(activatedButton).animate({bottom: "-=40px"});
                        $(activatedButton).promise().done(function() {
                            $(headerBottomClass).effect("highlight", {color: activatedMenuItem.color}, 1000);
                            $(activatedButton).removeAttr("style");
                            $(headerMiddleClass).append(activatedButton);
                            centerMenuItem = activatedMenuItem;
                            $(contentClass).html($(temp).find(contentClass).html());
                            doneMovingCenterItem = true;
                            doneMoving = doneMovingCenterItem && doneMovingActivatedItem;
                            window.history.pushState(activatedMenuItem.name, activatedMenuItem.name, activatedMenuItem.content);
                        });
                    });
                }); 
            } 
        }
    }
}
