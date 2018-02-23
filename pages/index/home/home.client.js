$(function() {
    var $lines = $('#hLine1, #hLine2');
    var linesTxt = $lines.map(function() {
        return $(this).text();
    }).toArray();
    var lineP = 0; // Line Pointer
    var charP = 0; // Character Pointer
    var writeD = 1;
    var iterC = 0; // Iteration count
    var iterT = 5; // Iteration delay
    var iterD = iterT; // Iteration delay
    $lines.empty();
    setInterval(function() {
        iterC--;
        if(iterC > 0) {
            return;
        }
        iterC = iterD;
        if(! lineP && !charP) {
            $lines
            //.empty()
            .removeClass('carret').eq(lineP).addClass('carret');
            iterD = iterT;
        }
        var $cLine = $lines.eq(lineP)
        .text(linesTxt[lineP].slice(0, charP));
        charP += writeD;
        if(charP < 0 || charP > linesTxt[lineP].length) {
            charP -= writeD;
            lineP += writeD; // Line field
            if(lineP < 0 || lineP >= linesTxt.length) {
                lineP -= writeD; // Line field
                if(writeD > 0) {
                    iterC = 200; // Wait after show
                } else {
                    iterC = 50; // Wait after erase
                }
                iterD = 0;
                writeD = -writeD;
                return;
            }
            if(writeD > 0) {
                charP = 0;
            } else {
                charP = linesTxt[lineP].length - 1;
            }

            $cLine.removeClass('carret');
            $lines.eq(lineP).addClass('carret');
        }
    }, 20);
});

