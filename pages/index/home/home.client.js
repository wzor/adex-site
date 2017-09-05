Date.prototype.isValid = function () {
    return this.getTime() === this.getTime();
}; 



$(function() {
    var timelineItem = $('#timeline [data-timestamp]');
    setTimelinTasks();

    function setTimelinTasks(){
        var dateNow = Date.now();

        timelineItem
            .removeClass('complete')
            .each(function(){
                var $this = $(this)
                // console.log('hoi')
                var itemDate = new Date($this.data('timestamp'));
                console.log(itemDate)
                if(itemDate <= dateNow){
                    $this.addClass('complete')
                }
            })
    }
});

$(function() {
    var progressBar = $('#token-sale-progress .progress-inner');
    var raised = $('#token-sale-progress .info .raised');
    var cap = $('#token-sale-progress .info .cap');
    var ratio = $('#token-sale-progress .ratio');

    var interval = null;

    function updateSalesStats(stats){
        var percentSold = (stats.raised / stats.cap) * 100;
        if(percentSold >= 100) {
            percentSold = 100;

            clearInterval(interval)
        }
        progressBar.css('width', percentSold + '%')
        raised.html(stats.raised.toFixed(4))
        cap.html(stats.cap)
        ratio.html(stats.ratio)
    }

    function getStats(){
        var ts = Date.now() + '';
        
        $.getJSON( "/api/stats?time=" + ts, function( stats ) {
            console.log(stats)
            if(stats){
                updateSalesStats(stats);
            }
        })
    }

    setTimeout(getStats, 300);    

    var REFRESH_STATS_INTERVAL = 30000; // 30 000 (30 sec)

    // interval = setInterval(getStats, REFRESH_STATS_INTERVAL); 
})
