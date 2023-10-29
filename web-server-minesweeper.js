var http = require('http');
var url = require('url');
var fs = require('fs');
const ip = require('ip');
const { timeStamp } = require('console');
 
var portnumber = 3001;

myServer = http.createServer(handleRequests);

function handleRequests(request, response) {
    var filename = "." + url.parse(request.url, true).pathname;
    var clientIP = request.headers['x-real-ip'] || request.connection.remoteAddress
    console.log(` [${new Date()}]  ${clientIP} requested :  ${filename}`);

    if (filename == "./minesweeper") {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(selectDifficulty());
        return response.end();
    }

    if (filename.startsWith("./minesweeper:")) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(init(filename));
        return response.end();
    }


    if (filename.startsWith("./minesweeper.css")) {
        response.writeHead(200, { 'Content-Type': 'text/css' });
        data = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
        response.write(data);
        return response.end();
    }



    return response.end("404 File " + filename + " not found");

}

myServer.listen(portnumber);
console.log("Now listening on port " + portnumber);


const easy = {name: "easy", height: 10, width: 10, mines: 10 };
const mid = {name: "mid", height: 16, width: 16, mines: 40 };
const hard = {name:"hard", height: 16, width: 30, mines: 99 };
const insane = {name:"insane", height: 20, width: 45, mines: 250 };

const difficulties = [easy,mid,hard,insane];


function createSeededRandomGenerator(seed) {
    // Constants for the linear congruential generator algorithm
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);

    // Initial seed value
    let currentSeed = seed;

    // Inner function to generate random numbers
    function random() {
        // Update the seed using the linear congruential generator formula
        currentSeed = (a * currentSeed + c) % m;

        // Return a pseudo-random number between 0 and 1
        return currentSeed / m;
    }

    // Return the random function, allowing access to the seeded generator
    return random;
}


function generateMap(difficulty, seed) {

    var seededRandom = createSeededRandomGenerator(seed);

    var height = difficulty.height;
    var width = difficulty.width;
    var mines = difficulty.mines;

    var map = new Array(width);

    for (var i = 0; i < width; i++) {

        help = new Array(height);
        for (var j = 0; j < height; j++) {

            help[j] = { isMine: false, nearbyMines: 0, isFlag: false, isVisible: false };

        }
        map[i] = help;

    }

    while (mines > 0) {

        var x = Math.ceil(width * seededRandom()) - 1;
        var y = Math.ceil(height * seededRandom()) - 1;
        if (!map[x][y].isMine && (x > 4 || y > 2)) {     // possible to set a new mine?
            map[x][y].isMine = true;


            for (var i = -1; i < 2; i++) {

                for (var j = -1; j < 2; j++) {
                    if (i + x < width && i + x >= 0 && j + y < height && j + y >= 0) {      // increment nearby mines
                        map[i + x][j + y].nearbyMines++;
                    }
                }
            }

            mines--;
        }

    }

    return map;
}



function mapToHtmlTable(map, settingsAndPath, tool) {

    var table = "<table class=\"table\">"
    //console.log(tool);
    var tool = tool.slice(1, 2);
    var width = map.length;
    var height = map[0].length;

    for (var i = 0; i < height; i++) {

        table += "<tr>"

        for (var j = 0; j < width; j++) {

            var el = map[j][i];
            var cssclass = "";
            var tile = "";
            //console.log(el);

            if (el.isVisible) {
                background = "lowered ";

                if (el.isMine) {
                    tile = "💣";
                } else if (el.nearbyMines > 0) {
                    cssclass = `color${el.nearbyMines}`;
                    tile = el.nearbyMines;
                }

            } else {
                background = "raised ";

                tile = "✕";
                cssclass = "hidden";

                if (el.isFlag) {
                    tile = "🚩";
                }
            }



            var href = settingsAndPath + `-${tool}.${j}.${i}`

            table += `<td class="${background} ${cssclass}">
                        <a href="${href}" class="${cssclass}">${tile}</td>`

        }




        table += "</tr>"



    }

    table += "</table>"
    return table;
}


function parse(settingsAndPath) {


    matches = settingsAndPath.matchAll(/\:[a-zA-Z]+|\:[0-9]+|\-[f|s]\.[0-9]+\.[0-9]+/g);
    result = results = Array.from(matches).map(([match]) => match);
    return result;
}


function executeSteps(map, steps) {
    //console.log(steps.length);
    //console.log(steps);

    for (var i = 0; i < steps.length; i++) {
        if (steps[i].startsWith("-f")) {

            var split = steps[i].split(".");
            var x = parseInt(split[1]);
            var y = parseInt(split[2]);

            //console.log(`flag at: ${x},${y}`);

            map = toggleFlag(map, x, y);

        } else if (steps[i].startsWith("-s")) {

            var split = steps[i].split(".");
            var x = parseInt(split[1]);
            var y = parseInt(split[2]);

            //console.log(`unveal at: ${x},${y}`);

            map = unveil(map, x, y);
        } else {
            //console.log(steps[i]);
        }
        //console.log(i);
    }
    return map;
}


function toggleFlag(map, x, y) {
    map[x][y].isFlag = !map[x][y].isFlag;
    //console.log(map[x][y]);
    return map;
}



function unveil(map, x, y) {


    var width = map.length;
    var height = map[0].length;

    if (x >= width || y >= height) {
        return map;
    }
    if (map[x][y].nearbyMines == 0 && !map[x][y].isVisible) {
        map[x][y].isVisible = true;
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (j + x < width && j + x >= 0 && i + y < height && i + y >= 0) {      // increment nearby mines
                    map = unveil(map, x + j, y + i);
                }
            }
        }

    } else if (!map[x][y].isVisible) {
        map[x][y].isVisible = true;

    }

    return map;
}





function toolToggler(filename, currenttool) {
    if (currenttool.startsWith(":flag")) {
        var str = filename.replace(":flag", ":search");
        return `<a href="${str}">Change Tool to Search</href>`;
    }

    if (currenttool.startsWith(":search")) {
        var str = filename.replace(":search", ":flag");
        return `<a href="${str}">Change Tool to Flag</href>`;
    }
}


function countFlags(map) {
    var count = 0;
    var width = map.length;
    var height = map[0].length;

    for (var x = 0; x < width; x++) {

        for (var y = 0; y < height; y++) {

            if (map[x][y].isFlag) {
                count++;
            }
        }


    }
    return count;
}


function difficultyInfoAndLink (seed, dif) {

    return `
    <div><a href="./minesweeper:${dif.name}:${seed}:search" class="dif-selector">${dif.name}
            <ul>
                <li>width: ${dif.width}</li>
                <li>height: ${dif.height}</li>
                <li>mines: ${dif.mines}</li>
            </ul>
            </a>
        </div>
    `
    
}





function selectDifficulty() {

    let seed = Math.floor(1000 * Math.random()) / 1;


    let str = "";

    for (var i = 0; i < difficulties.length;i++) {
        str += difficultyInfoAndLink(seed, difficulties[i]);
    }

    return `<html>
        <title>Multipage Minesweeper</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="minesweeper.css">
        <body>
        <h1>Multipage Minesweeper</h1>
        <h3>Please Select a difficulty</h3>
        ${str}
        </body>
        </html>`;

}





function init(filename) {

    // Initialize seed value (can be any non-negative integer)

    var args = parse(filename);

    var difficulty = args[0];
    
    for (var i = 0; i < difficulties.length;i++) {

        if (difficulty.includes(difficulties[i].name)){
            var dif = difficulties[i];
            break;
        }
    }



    var seed = args[1];
    var seed = parseInt(seed.slice(1, seed.length));

    var tool = args[2];

    //console.log(args);


    var map = generateMap(dif, seed);

    var steps = args.slice(3, args.length);


    var map = executeSteps(map, steps);


    var table = mapToHtmlTable(map, filename, tool);

    return `<html>
    <title>Diese Webseite wurde vom Server generiert</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="minesweeper.css">
        <body>
    
        ${table}
        <div>Number of mines: ${dif.mines}</div>
        <div>Flags remaining: ${dif.mines - countFlags(map)}</div>
        <div class="toggle">${toolToggler(filename, tool)}</div>
        <div class="homebutton"> <a href="./minesweeper">Back to Start</a></div>
        </body>
        </html>`;
}


