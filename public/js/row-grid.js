var initGrid = function() {
    var options = {minMargin: 5, maxMargin: 35, itemSelector: ".thumbnail"};
    $("#mygallery").rowGrid(options);
    setTimeout(function() {
        window.scrollTo(0,document.body.scrollHeight);
    }, 1000);
}
initGrid();