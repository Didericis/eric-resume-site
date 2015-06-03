require.config({
    baseUrl: 'js',
    paths: {
        jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min",
        'jquery-ui': "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min",
    }
});

require(["jquery", 'HexaMenu'], function ($, HexaMenu) {
    $(document).ready(function(){
        var contactButton = new HexaMenu.MenuItem("contact", "#339966", "/img/ContactIcon.png", 80, 80);
        var homeButton = new HexaMenu.MenuItem("code", "#720000", "/img/CodeIcon.png", 80, 80);
        var menu = HexaMenu.CreateMenu([homeButton, contactButton]);
        var headerObj = new HexaMenu.Header(menu, document.getElementById('Content'), "hey y'all");
        
        $( "#Header" ).append(headerObj.getDiv());
        $( ".menuItem" ).click(function(){
            headerObj.activateButton(this);
        });
    });
});