function initializeHexaMenu(menuContent){
    var centerMenuItemName = $(".header-middle").find(".menu-item").toArray()[0].id;
    var menuItems = getMenuItems();
    var centerMenuItem = menuItems[centerMenuItemName];
    var doneMoving = true;

    // $("#Content").load(centerMenuItem.content, {menu: true}, function(){
    //     window.history.pushState(
    //         centerMenuItem.name, 
    //         centerMenuItem.name, 
    //         centerMenuItem.content
    //     );
    // });

    $(".menu-item").click(function(){
        if (doneMoving){ activateButton(getMenuItem(this)); }
    });

    function getMenuItems(){
        var menuItemDivs = $(".menu-item").toArray();
        var menuItems = {};
        var menuItemName;
        var menuItemDiv;

        for (var i in menuItemDivs){
            menuItemDiv = menuItemDivs[i];
            menuItemName = menuItemDiv.id;
            if (menuContent[menuItemName]){
                menuItems[menuItemName] = {
                    div: menuItemDiv,
                    content: menuContent[menuItemName],
                    color: $(menuItemDiv).find(".menu-item-middle").css("background-color")
                }
            }
        } 

        return menuItems;      
    }

    function getMenuItem(div){
        var menuItem;

        for (var i in menuItems){
            menuItem = menuItems[i];
            if (menuItem.div === div){
                return menuItem;
            }
        }
    }

    function activateButton(activatedMenuItem){
        var headerBottom = ".header-bottom";
        var headerMiddle = ".header-middle";
        var headerTop = ".header-top";
        var menuDiv = $("#HexaMenu");
        var contentDiv = $("#Content");
        var activatedButton = activatedMenuItem.div;
        var rightmostMenuItem = $(activatedButton).prev();
        var xOfMid = $(centerMenuItem.div).offset().left;
        var xOfThis = $(activatedButton).offset().left;
        var xDestination = xOfMid - xOfThis;
        var doneMovingCenterItem = true;
        var doneMovingActivatedItem = true;
        var temp = document.createElement("div");
        
        temp.className = "temp-div";
        contentDiv.append(temp);
        $(temp).load(activatedMenuItem.content + " #Content");
        swap();

        function swap(){
            doneMoving = false;
            doneMovingCenterItem = false;
            doneMovingActivatedItem = false;
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
                            $(centerMenuItem.div).prependTo(menuDiv);
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
                        $(activatedButton).animate({bottom: "-=40"});
                        $(activatedButton).promise().done(function() {
                            $(headerBottom).effect("highlight", {color: activatedMenuItem.color}, 1000);
                            $(activatedButton).removeAttr("style");
                            $(headerMiddle).append(activatedButton);
                            centerMenuItem = activatedMenuItem;
                            contentDiv.html($(temp).html());
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
