

function b (x,y) {
    return 6 + 
            Math.floor(Math.log10(x+1) + 
            Math.floor(Math.log10(y+1)));
}



function bm (w,h,s) {

    var res = 0;
    for (var n = 0; n < s; n++) {

        for (var x = 0; x < w; x++) {

            for (var y = 0; y < h;y++) {

                res += b(x,y);

            }

        }

    }

    return res;
}

function bg (w,h) {
    var res = 0;
    for (var n = 0; n < w*h; n++) {
        res += bm(w,h,n);
    }
    return res;
}


console.log(bg(40,25));
