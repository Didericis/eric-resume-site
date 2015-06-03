var GLOBAL_NAME = 'HexaMenu';

if ( typeof define === 'function' && define.amd ) {
    define( GLOBAL_NAME, ['jquery', 'jquery-ui'], factory);
}
else{
    window[GLOBAL_NAME] = factory($);
}

function factory($) {

    return {
        pixelNumToString: pixelNumToString,
        MenuItem: MenuItem,
        CreateMenu: CreateMenu,
        Header: Header
    }

    function pixelNumToString(num){
        if(isNaN(num)) throw "not a number";
        
        return (String(num) + "px");
    }

    function MenuItem(name, color, icon, height, width, content){
        var returnObj = {
            name : name,
            color : color,
            icon : icon,
            height : height,
            width : width,
            content : content,
            div : createHexagon()
        }

        return initialize();

        function initialize(){
            return returnObj;
        }
        
        function createHexagon(){

            function createHexagonContainer(){
                var hexagonContainer = document.createElement("div");
                hexagonContainer.id = name;
                hexagonContainer.className = "menuItem";
            
                return hexagonContainer;
            }
        
            function createTopOfHexagon(){
                var topOfHexagon = document.createElement("div");
                var style = topOfHexagon.style;
                topOfHexagon.className = "menuItemTop";
                style.borderBottom = pixelNumToString(height/4) + " solid " + color;
            
                return topOfHexagon;
            }
        
            function createMiddleOfHexagon(){
                var middleOfHexagon = document.createElement("div");
                var style = middleOfHexagon.style;
            
                style.width = pixelNumToString(width);
                style.height = pixelNumToString(height/2);
                style.backgroundColor = color;
                style.display = "table-cell";
                style.textAlign = "center";
                style.verticalAlign = "middle";
                style.position = "relative";
                
                var iconObj = document.createElement("IMG");
                iconObj.src = icon;
                iconObj.verticalAlign = "middle";
                middleOfHexagon.appendChild(iconObj);
                
                return middleOfHexagon;
            }
        
            function createBottomOfHexagon(){
                var bottomOfHexagon = document.createElement("div");
                var style = bottomOfHexagon.style;
            
                style.width = 0;
                style.borderTop = pixelNumToString(height/4) + " solid " + color;
                style.borderLeft = pixelNumToString(height/2) + " solid transparent";
                style.borderRight = pixelNumToString(height/2) + " solid transparent";
                style.position = "relative";
            
                return bottomOfHexagon;
            }
        
            var hexagonContainer = createHexagonContainer();
            var topOfHexagon = createTopOfHexagon();
            var middleOfHexagon = createMiddleOfHexagon();
            var bottomOfHexagon = createBottomOfHexagon();
            hexagonContainer.appendChild(topOfHexagon);
            hexagonContainer.appendChild(middleOfHexagon);
            hexagonContainer.appendChild(bottomOfHexagon);
            
            return hexagonContainer;
        }
        
    }

    function CreateMenu(menuItemArray){
        var returnObj = {
            items : menuItemArray,
            div : createDiv()
        }

        return returnObj;

        function createDiv(){
            var div = document.createElement("div");
            var style = div.style;

            div.id = "HexaMenu";
            style.position = "relative";
            style.bottom = "0";
            style.right = "0";
            style.background = "transparent";
            style.textAlign = "center";
            style.overflow = "auto";
            
            for(var i = 0; i < menuItemArray.length; i++){
                div.appendChild(menuItemArray[i].div);
            }

            return div;
        }
    }

    function Header(menu, contentDiv){
        var menu = menu;
        var header = document.createElement("div");
        var headerTop = document.createElement("div");
        var headerMiddle = document.createElement("div");
        var headerBottom = document.createElement("div");
        var centerMenuItem = menu.items[0];
        var style = header.style;
        var returnObj = {
            activateButton : activateButton,
            getDiv : getDiv
        }

        function initialize(){
            style.height = pixelNumToString(106);
            style.width = '80%';
            // style.position = 'relative';
            // style['padding-top'] = '20px';
            style['margin-top'] = '40px';
            style['margin-right'] = "auto";
            style['margin-left'] = "auto";
            header.appendChild(menu.div);
            
            headerMiddle = document.createElement("div");
            headerMiddle.style.position = "absolute";
            headerMiddle.style.bottom = "0";
            headerMiddle.style.paddingBottom = pixelNumToString(45);
            headerMiddle.style.width = "80%";
            headerMiddle.style.height = pixelNumToString(20);
            headerMiddle.style.zIndex = "5";
            header.appendChild(headerMiddle);
            
            headerBottom = document.createElement("div");
            headerBottom.style.backgroundColor = "#DDD";
            headerBottom.style.height = pixelNumToString(20);
            headerBottom.style.position = "absolute";
            headerBottom.style.bottom = "0";
            headerBottom.style.width = "80%";
            headerBottom.style.textAlign = "center";
            header.appendChild(headerBottom);
            
            centerMenuItem.div.style.left = "auto";
            centerMenuItem.div.style.bottom = "auto";
            centerMenuItem.div.style.styleFloat = "none";
            centerMenuItem.div.style.cssFloat = "none";
            centerMenuItem.div.style.width = pixelNumToString(80);
            centerMenuItem.div.style.margin = "0 auto";

            headerMiddle.appendChild(menu.items[0].div);

            $(contentDiv).load(centerMenuItem.content);

            return returnObj;
        }

        return initialize();

        function getMenuItem(div){
            for (var i in menu.items){
                var menuItem = menu.items[i];
                if (menuItem.div === div){
                    return menuItem;
                }
            }
        }

        function activateButton(activatedButton){

            function moveCenterMenuItem(centerMenuItemDiv, rightmostMenuItem, xDestination){    
                $(centerMenuItemDiv).animate({bottom: "+=41px"});
                $(centerMenuItemDiv).promise().done(function() {
                    $(centerMenuItemDiv).animate({right: xDestination});
                    $(centerMenuItemDiv).promise().done(function() {
                        $(centerMenuItemDiv).css("left", "auto");
                        $(centerMenuItemDiv).css("bottom", "auto");
                        $(centerMenuItemDiv).css("right", "auto");
                        $(centerMenuItemDiv).css("float", "right");
                        $(centerMenuItemDiv).css("margin-right", "3px");
                        $(centerMenuItemDiv).promise().done(function() {
                            if(rightmostMenuItem.length == 0){
                                $(centerMenuItemDiv).prependTo(menu.div);
                            }
                            else{
                                $(centerMenuItemDiv).insertAfter(rightmostMenuItem);
                            }
                        });
                    });
                });
            };

            var activatedMenuItem = getMenuItem(activatedButton);
            var rightmostMenuItem = $(activatedButton).prev();
            var xOfMid = $(centerMenuItem.div).offset().left;
            var xOfThis = $(activatedButton).offset().left;
            var xDestination = xOfMid - xOfThis;
            
            if (centerMenuItem.div !== activatedButton){

                $.get(activatedMenuItem.content, function(pageContent) {
                    moveCenterMenuItem(centerMenuItem.div, rightmostMenuItem, xDestination);
                    $(activatedButton).promise().done(function() {
                        $(activatedButton).animate({left: xDestination});
            
                        $(activatedButton).promise().done(function() {
                            $(activatedButton).animate({bottom: "-=41"});
                            $(activatedButton).promise().done(function() {
                                $(headerBottom).effect("highlight", {color: activatedMenuItem.color}, 1000);
                                $(activatedButton).css("left", "auto");
                                $(activatedButton).css("right", "auto");
                                $(activatedButton).css("bottom", "auto");
                                $(activatedButton).css("float", "none");
                                $(activatedButton).css("margin", "0 auto");
                    
                                headerMiddle.appendChild(activatedButton);
                                centerMenuItem = activatedMenuItem;

                                // $(contentDiv).html(pageContent);
                            });
                        });
                    });  
                });
            };
            
            return header;
        }
        
        function getDiv(){
            return header;
        }

    }
};
