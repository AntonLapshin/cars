(function(){

    requirejs.config({
        paths: {
            jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
            spin: '//cdnjs.cloudflare.com/ajax/libs/spin.js/2.0.1/spin',
            xslt: 'lib/jquery.xslt',
            drom: 'conversion/drom/convert'
        }
    });

    function getCars() {
        return $.Deferred(function (defer) {
            $.ajax({
                type: "GET",
                url: 'http://94.251.114.123:8081/cars',
                dataType: "xml",
                complete: function (res) {
                    defer.resolve(res.responseText);
                }
            });
        });
    }

    function execute(name, conversion){
        $('#message').html(name + ': processing...');

        getCars()
            .then(function(){
                return conversion();
            })
            .then(function(){
                $('#message')
                    .html(name + ': completed')
                    .after(
                        $('<a>bulls.xml</a>')
                            .attr('href', 'http://94.251.114.123:8081/conversion/' + name + '/bulls.xml')
                    );

                $('#spin').hide();
            });
    }

    var url = document.URL;

    ['drom', 'avito', 'ngs'].forEach(function(name){
        if (url.indexOf(name) === -1) return;

        require(['jquery', name, 'spin'],
            function ($, convertion, spin) {

                var opts = {
                    lines: 13, // The number of lines to draw
                    length: 20, // The length of each line
                    width: 10, // The line thickness
                    radius: 30, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    direction: 1, // 1: clockwise, -1: counterclockwise
                    color: '#000', // #rgb or #rrggbb or array of colors
                    speed: 1, // Rounds per second
                    trail: 60, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: '50%', // Top position relative to parent
                    left: '50%' // Left position relative to parent
                };
                var target = document.getElementById('spin');
                var spinner = new spin(opts).spin(target);

                execute(name, convertion);
            });
    });
}());