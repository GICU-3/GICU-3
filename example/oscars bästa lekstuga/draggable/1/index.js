// GRID OPTIONS
var rowSize   = 100;
var colSize   = 100;
var gutter    = 7;     // Spacing between tiles
var numTiles  = 25;    // Number of tiles to initially populate the grid with
var fixedSize = false; // When true, each tile's colspan will be fixed to 1
var oneColumn = false; // When true, grid will only have 1 column and tiles have fixed colspan of 1
var threshold = "50%"; // This is amount of overlap between tiles needed to detect a collision

var $add  = $("#add");
var $list = $("#list");
var $mode = $("input[name='layout']");

// Live node list of tiles
var tiles  = $list[0].getElementsByClassName("tile");
var label  = 1;
var zIndex = 1000;

var startWidth  = "100%";
var startSize   = colSize;
var singleWidth = colSize * 3;

var colCount   = null;
var rowCount   = null;
var gutterStep = null;

var shadow1 = "0 1px 3px  0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.6)";
var shadow2 = "0 6px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 2px 0 rgba(0, 0, 0, 0.2)";

$(window).resize(resize);
$add.click(createTile);
$mode.change(init);

init();

// ========================================================================
//  INIT
// ========================================================================
function init() {

    var width = startWidth;

    // This value is defined when this function 
    // is fired by a radio button change event
    switch (this.value) {

        case "mixed":
            fixedSize = false;
            oneColumn = false;
            colSize   = startSize;
            break;

        case "fixed":
            fixedSize = true;
            oneColumn = false;
            colSize   = startSize;
            break;

        case "column":
            fixedSize = false;
            oneColumn = true;
            width     = singleWidth;
            colSize   = singleWidth;
            break;
    }

    // For images demo
    //window.stop();

    $(".tile").each(function() {
        Draggable.get(this).kill();
        $(this).remove();
    });

    TweenLite.to($list, 0.2, { width: width });
    TweenLite.delayedCall(0.25, populateBoard);

    function populateBoard() {

        label = 1;
        resize();

        for (var i = 0; i < numTiles; i++) {
            createTile();
        }
    }
}


// ========================================================================
//  RESIZE
// ========================================================================
function resize() {

    colCount   = oneColumn ? 1 : Math.floor($list.outerWidth() / (colSize + gutter));
    gutterStep = colCount == 1 ? gutter : (gutter * (colCount - 1) / colCount);
    rowCount   = 0;

    layoutInvalidated();
}


// ========================================================================
//  CHANGE POSITION
// ========================================================================
function changePosition(from, to, rowToUpdate) {

    var $tiles = $(".tile");
    var insert = from > to ? "insertBefore" : "insertAfter";

    // Change DOM positions
    $tiles.eq(from)[insert]($tiles.eq(to));

    layoutInvalidated(rowToUpdate);
}

// ========================================================================
//  CREATE TILE
// ========================================================================
function createTile() {

    var colspan = fixedSize || oneColumn ? 1 : Math.floor(Math.random() * 2) + 1;
    var element = $("<div></div>").addClass("tile").html(label++);
    var lastX   = 0;

    Draggable.create(element, {
        onDrag      : onDrag,
        onPress     : onPress,
        onRelease   : onRelease,
        zIndexBoost : false
    });

    // NOTE: Leave rowspan set to 1 because this demo 
    // doesn't calculate different row heights
    var tile = {
        col        : null,
        colspan    : colspan,
        height     : 0,
        inBounds   : true,
        index      : null,
        isDragging : false,
        lastIndex  : null,
        newTile    : true,
        positioned : false,
        row        : null,
        rowspan    : 1, 
        width      : 0,
        x          : 0,
        y          : 0
    };

    // Add tile properties to our element for quick lookup
    element[0].tile = tile;

    $list.append(element);
    layoutInvalidated();

    function onPress() {

        lastX = this.x;
        tile.isDragging = true;
        tile.lastIndex  = tile.index;

        TweenLite.to(element, 0.2, {
            autoAlpha : 0.75,
            boxShadow : shadow2,
            scale     : 0.95,
            zIndex    : "+=1000"
        });
    }

    function onDrag() {

        // Move to end of list if not in bounds
        if (!this.hitTest($list, 0)) {
            tile.inBounds = false;
            changePosition(tile.index, tiles.length - 1);
            return;
        }

        tile.inBounds = true;

        for (var i = 0; i < tiles.length; i++) {

            // Row to update is used for a partial layout update
            // Shift left/right checks if the tile is being dragged 
            // towards the the tile it is testing
            var testTile    = tiles[i].tile;
            var onSameRow   = (tile.row === testTile.row);
            var rowToUpdate = onSameRow ? tile.row : -1;
            var shiftLeft   = onSameRow ? (this.x < lastX && tile.index > i) : true;
            var shiftRight  = onSameRow ? (this.x > lastX && tile.index < i) : true;
            var validMove   = (testTile.positioned && (shiftLeft || shiftRight));

            if (this.hitTest(tiles[i], threshold) && validMove) {
                changePosition(tile.index, i, rowToUpdate);
                break;
            }
        }

        lastX = this.x;
    }

    function onRelease() {

        // Move tile back to last position if released out of bounds
        this.hitTest($list, 0)
            ? layoutInvalidated()
        : changePosition(tile.index, tile.lastIndex);

        TweenLite.to(element, 0.2, {
            autoAlpha : 1,
            boxShadow: shadow1,
            scale     : 1,
            x         : tile.x,
            y         : tile.y,
            zIndex    : ++zIndex
        });

        tile.isDragging = false;
    }
}

// ========================================================================
//  LAYOUT INVALIDATED
// ========================================================================
function layoutInvalidated(rowToUpdate) {

    var timeline = new TimelineMax();
    var partialLayout = (rowToUpdate > -1);

    var height = 0;
    var col    = 0;
    var row    = 0;
    var time   = 0.35;

    $(".tile").each(function(index, element) {

        var tile    = this.tile;
        var oldRow  = tile.row;
        var oldCol  = tile.col;
        var newTile = tile.newTile;

        // PARTIAL LAYOUT: This condition can only occur while a tile is being 
        // dragged. The purpose of this is to only swap positions within a row, 
        // which will prevent a tile from jumping to another row if a space
        // is available. Without this, a large tile in column 0 may appear 
        // to be stuck if hit by a smaller tile, and if there is space in the 
        // row above for the smaller tile. When the user stops dragging the 
        // tile, a full layout update will happen, allowing tiles to move to
        // available spaces in rows above them.
        if (partialLayout) {
            row = tile.row;
            if (tile.row !== rowToUpdate) return;
        }

        // Update trackers when colCount is exceeded 
        if (col + tile.colspan > colCount) {
            col = 0; row++;
        }

        $.extend(tile, {
            col    : col,
            row    : row,
            index  : index,
            x      : col * gutterStep + (col * colSize),
            y      : row * gutterStep + (row * rowSize),
            width  : tile.colspan * colSize + ((tile.colspan - 1) * gutterStep),
            height : tile.rowspan * rowSize
        });

        col += tile.colspan;

        // If the tile being dragged is in bounds, set a new
        // last index in case it goes out of bounds
        if (tile.isDragging && tile.inBounds) {
            tile.lastIndex = index;
        }

        if (newTile) {

            // Clear the new tile flag
            tile.newTile = false;

            var from = {
                autoAlpha : 0,
                boxShadow : shadow1,
                height    : tile.height,
                scale     : 0,
                width     : tile.width
            };

            var to = {
                autoAlpha : 1,
                scale     : 1,
                zIndex    : zIndex
            }

            timeline.fromTo(element, time, from, to, "reflow");
        }

        // Don't animate the tile that is being dragged and
        // only animate the tiles that have changes
        if (!tile.isDragging && (oldRow !== tile.row || oldCol !== tile.col)) {

            var duration = newTile ? 0 : time;

            // Boost the z-index for tiles that will travel over 
            // another tile due to a row change
            if (oldRow !== tile.row) {
                timeline.set(element, { zIndex: ++zIndex }, "reflow");
            }

            timeline.to(element, duration, {
                x : tile.x,
                y : tile.y,
                onComplete : function() { tile.positioned = true; },
                onStart    : function() { tile.positioned = false; }
            }, "reflow");
        }
    });

    if (!row) rowCount = 1;

    // If the row count has changed, change the height of the container
    if (row !== rowCount) {
        rowCount = row;
        height   = rowCount * gutterStep + (++row * rowSize);
        timeline.to($list, 0.2, { height: height }, "reflow");
    }
}