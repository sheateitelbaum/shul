(function() {
    var videoElem = $('#video'),
        caption = $('#caption');
    $(document).on('click', '.videoFigure', e => {
        const theTarget = $(e.target);
        videoElem.attr('src', theTarget.closest('.videoFigure').attr('id'));
        videoElem[0].play();
        videoElem.show();
        var text = theTarget.next('.figcaption').text()
        caption.text(text);
    });
}());