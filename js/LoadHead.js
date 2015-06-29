function loadHead(jsonURL){
    $.get(jsonURL, function(data){
        appendHead(data);
        $(document).ready(function(){
            initializeHexaMenu();
            $('body').show();
        });
    });
}

function appendHead(data){
    var css = data['css'];
    var js = data['js'];

    $('head').append(createIconElement(data['icon']));
    $('head').append(createMetaElement());
    for (var i in css){
        $('head').append(createCSSElement(css[i]));
    }
    for (var i in js){
        $('head').append(createJSElement(js[i]));
    }
}

function createCSSElement(href){
    return "<link rel='stylesheet' type='text/css' href='" + href + "'/>";
}

function createJSElement(src){
    return "<script src='" + src + "'/>";
}

function createIconElement(href){
    return "<link href='" + href + "' rel='shortcut icon' type='image/x-icon'>";
}

function createMetaElement(){
    return "<meta name='viewport' content='width=device-width, initial-scale=1'>";
}