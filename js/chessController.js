/**
 * Created by oshan on 02-Sep-17.
 */

var possibleMoves=[];       //Store the whole movement path(cell Ids with '#') for selected piece
var moves=[];               //Stores the cell ids(with '#') for only the possible movements for the piece
var isWhiteMovement=true;

var selectedPiece=null;     //Stores the last selected piece's cell id (with '#')
var columns=["A","B","C","D","E","F","G","H"];      //Column id of the board
var pawn_rem=[];            //Maximum of two movements; if a pawn can remove another piece(s)
var allWhitePieces=["wRook1","wKnight1","wBishop1","wQueen","wKing","wBishop2","wKnight2","wRook2","wPawn1","wPawn2","wPawn3","wPawn4","wPawn5","wPawn6","wPawn7","wPawn8"];      //Stores all the white pieces on board(null if removed)
var allBlackPieces=["bRook1","bKnight1","bBishop1","bQueen","bKing","bBishop2","bKnight2","bRook2","bPawn1","bPawn2","bPawn3","bPawn4","bPawn5","bPawn6","bPawn7","bPawn8"];      //Stores all the black pieces on board(null if removed)

var allMovesBlack=[[null],["A3","C3"],[null],[null],[null],[null],["F3","H3"],[null],["B3"],["A3","C3"],["B3","D3"],["C3","E3"],["D3","F3"],["E3","G3"],["F3","H3"],["G3"]];       //Stores all the possibles moves for the white pieces on the board
var allMovesWhite=[[null],["A6","C6"],[null],[null],[null],[null],["F6","H6"],[null],["B6"],["A6","C6"],["B6","D6"],["C6","E6"],["D6","F6"],["E6","G6"],["F6","H6"],["G6"]];       //Stores all the possible moves for the black pieces on the board

var isCheck=false;

///////////////////////////////
main();     //Runs main method

///////////////////////////////

function main() {
    $(".row").on("click",cellClicked);          //Clicked event for cells
    $(".row_light").on("click",cellClicked);    //Clicked event for cells
}

function cellClicked() {

    var name=$($(this)).children("img").attr("name");  //Gets the name of the piece on the cell (return undefined if no piece on cell)

    //console.log("Name : "+name);

    var cell=$(this).attr("id");
    var isPossibleMove=moves.indexOf(("#"+cell));

    var c=$($(this)).children("img").attr("class");
    console.log(c);

    if(isWhiteMovement && (c!="white"&&c!=undefined && (!isSelected))){
        alert("Not Your Turn");
        return;
    }else if((!isWhiteMovement) && (c!="black"&&c!=undefined) && (!isSelected)){
        alert("Not Your Turn");
        return;
    }

    // console.log(isPossibleMove);

    //console.log("Possible : "+isPossibleMove);

    if(name!=undefined && isPossibleMove==-1){     //Sets the possible movements for the clicked piece

        clearPossibleMoves();

        //console.log(name);
        switch (name){
            case "bPawn":{
                var check="#"+cell.substr(0,1);

                if(check=="#A"){
                    check="#";
                    check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))+1];
                    check+=(parseInt(cell.charAt(1))+1);
                    pawn_rem.push(check);   //If pawn can remove a piece
                }else if(check=="#H"){
                    check="#";
                    check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))-1];
                    check+=(parseInt(cell.charAt(1))+1);
                    pawn_rem.push(check);
                }else{
                    check="#";
                    check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))+1];
                    check+=(parseInt(cell.charAt(1))+1);
                    pawn_rem.push(check);

                    check=check.substr(0,1);
                    check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))-1];
                    check+=(parseInt(cell.charAt(1))+1);
                    pawn_rem.push(check);
                }

                pawnMovement("black",cell,"pawn")
            }break;
            case "wPawn":{
                var check="#"+cell.substr(0,1);

                if(check=="#A"){
                    check="#";
                    check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))+1];
                    check+=(parseInt(cell.charAt(1))-1);
                    pawn_rem.push(check);
                }else if(check=="#H"){
                    check="#";
                    check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))-1];
                    check+=(parseInt(cell.charAt(1))-1);
                    pawn_rem.push(check);
                }else{
                    check="#";
                    check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))+1];
                    check+=(parseInt(cell.charAt(1))-1);
                    pawn_rem.push(check);

                    check=check.substr(0,1);
                    check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))-1];
                    check+=(parseInt(cell.charAt(1))-1);
                    pawn_rem.push(check);
                }
                pawnMovement("white",cell,"pawn")
            }break;
            case "bRook": rookMovement("black",cell,name);break;
            case "wRook" : rookMovement("white",cell,name);break;
            case "bBishop": bishopMovement("black",cell,name);break;
            case "wBishop": bishopMovement("white",cell,name);break;
            case "wKnight": knightMovement("white",cell,name);break;
            case "bKnight": knightMovement("black",cell,name);break;
            case "bQueen": queenMovement("black",cell,name);break;
            case "wQueen": queenMovement("white",cell,name);break;
            case "bKing": kingMovement("black",cell,name);break;
            case "wKing": kingMovement("white",cell,name);break;

        }
        selectedPiece="#"+cell;         //Sets the selected cell id of a piece (with '#')
        isSelected=true;
    }else if(isPossibleMove>-1){        //Moves the piece
        // console.log(moves);

        clearPossibleMoves();
        if(!(name!=="bKing" ^ name!=="wKing")) {  // Checks whether the piece is a king (can't remove)
            //console.log("Here : "+name);
            var setImg = $($(selectedPiece)).children("img").clone();
            var selectedPieceColor=$($(selectedPiece)).children("img").attr('class');
            var selectedPieceName=$($(selectedPiece)).children("img").attr('name');
            $($(selectedPiece)).children("img").remove();       //Removes the piece from old cell

            ////////////Get the details of the piece which is going to be removed/////
            var altId=$(this).children('img').attr('id');
            var color=$(this).children('img').attr('class');
            switch (color){
                case "white":{
                    if(altId!=undefined){
                        allWhitePieces[allWhitePieces.indexOf(altId)]=null;
                    }

                }break;
                case "black":{
                    if(altId!=undefined){
                        allBlackPieces[allBlackPieces.indexOf(altId)]=null;
                    }
                }break;
            }
            //////////////////////////////////////////////////////////////////////////

            $($(this)).children("img").remove();            // Removes the piece on the current cell
            $($(this)).append(setImg);                  // Adds the moved piece into new cell

            checkMate(selectedPieceColor,cell,selectedPieceName); //Checks whether the king is checked

            isWhiteMovement=!isWhiteMovement;
            isSelected=false;

        }
    }else{
        clearPossibleMoves();      // Irrelavant cell is clicked can't move
        isSelected=false;
    }
    //isSelected=true;
}

function clearPossibleMoves() {     //Clears the possible moves array when a piece is not selected
    //Removing added coloring for possible moves cells
    for(var a in possibleMoves){
        $(possibleMoves[a]).removeClass("possible_cells");
        $(possibleMoves[a]).removeClass("possible_cells_remove");
    }
    possibleMoves.splice(0,possibleMoves.length);
    moves.splice(0,moves.length);
}

/*
    Possible Movements for pawns
 */
function pawnMovement(color,cell,name) {  // Sets the possible movements for pawns
    //console.log(color+" "+cell);
    var row=parseInt(cell.charAt(1));
    //console.log(row);
    switch (color){
        case "black":{
            var c="#"+cell.charAt(0)+(row+++1);
            possibleMoves.push(c); //Cell code is given with '#' for jQuery
            if(cell.charAt(1)=="2"){
                c="#"+cell.charAt(0)+(row+++1);
                possibleMoves.push(c);
            }
            colorCells("black",name); //colors the cells the piece can move to
        }break;
        case "white":{
            var c="#"+cell.charAt(0)+(row---1);
            possibleMoves.push(c); //Cell code is given with '#' for jQuery
            if(cell.charAt(1)=="7"){
                c="#"+cell.charAt(0)+(row---1);
                possibleMoves.push(c);
            }
            colorCells("white",name); //colors the cells the piece can move to
        }break;
    }
}

/*
    Colors the movement possible cells (Cells which have pieces won't be colored)
 */
function colorCells(color,name) {
    for(a in possibleMoves){
        var check=$($(possibleMoves[a])).children("img").attr("class");

        if(a==0 && name=="pawn"){
            pawnRem(a,color);   //If the piece is a pawn colors the removal cells as well
        }
        pawn_rem=[];
        if(check==undefined) {
            $(possibleMoves[a]).addClass("possible_cells");
            moves.push(possibleMoves[a]);
        }else if(check!=color && name!="pawn"){
            //console.log(name);
            $(possibleMoves[a]).addClass("possible_cells_remove");
            moves.push(possibleMoves[a]);
            //return;
        }
    }
}

function pawnRem(a,color) {     //If a pawn can remove a piece that movement is also added for possible moves
    for(;a<pawn_rem.length;a++) {
        var p = $($(pawn_rem[a])).children("img").attr("class");

        if (p != color & p != undefined){
            possibleMoves.push(pawn_rem[a]);
            $(pawn_rem[a]).addClass("possible_cells_remove");
            moves.push(pawn_rem[a]);
        }
    }
}

function rookMovement(color,cell,name) {
    var letterIndex=columns.indexOf(cell.substr(0,1));
    var numberIndex=parseInt(cell.substr(1,1));
    var cellPieceColor="";
    var checkCell="#"+cell.substr(0,1);
    var count=0;
    //Add possible movement back from the position (Letter is the same number changes (--))
    while(numberIndex>1){
        numberIndex--;
        cellPieceColor=$($(checkCell+numberIndex)).children("img").attr("class");

        if(cellPieceColor==color){
            break;
        }

        if(cellPieceColor!=color && count==0 && cellPieceColor!=undefined){
            count++;
        }else if(cellPieceColor!=color && count==1 && cellPieceColor!=undefined){
            break;
        }

        possibleMoves.push((checkCell+numberIndex));
    }

    numberIndex=parseInt(cell.substr(1,1));
    count=0;
    //Add possible movement front from the position (Letter is the same number changes (++)
    while(numberIndex<8){
        // checkCell+=(letterIndex-1);
        numberIndex++;
        cellPieceColor=$($(checkCell+numberIndex)).children("img").attr("class");
        if(cellPieceColor==color){
            break;
        }
        if(cellPieceColor!=color && count==0 && cellPieceColor!=undefined){
            count++;
        }else if(cellPieceColor!=color && count==1 && cellPieceColor!=undefined){
            break;
        }

        possibleMoves.push((checkCell+numberIndex));
    }

    count=0;
    checkCell="#";
    //Add possible movement left from the position (No. is the same letter changes (--)
    while(letterIndex>0){
        letterIndex--;
        var char=columns[letterIndex];
        cellPieceColor=$($(checkCell+char+cell.substr(1,1))).children("img").attr("class");
        console.log(cellPieceColor);
        if(cellPieceColor==color){
            break;
        }
        if(cellPieceColor!=color && count==0 && cellPieceColor!=undefined){
            count++;
        }else if(cellPieceColor!=color && count==1 && cellPieceColor!=undefined){
            break;
        }

        possibleMoves.push((checkCell+char+cell.substr(1,1)));
    }

    count=0;
    letterIndex=columns.indexOf(cell.substr(0,1));
    while(letterIndex<7){
        letterIndex++;
        var char=columns[letterIndex];
        cellPieceColor=$($(checkCell+char+cell.substr(1,1))).children("img").attr("class");
        if(cellPieceColor==color){
            break;
        }
        if(cellPieceColor!=color && count==0 && cellPieceColor!=undefined){
            count++;
        }else if(cellPieceColor!=color && count==1 && cellPieceColor!=undefined){
            break;
        }

        possibleMoves.push((checkCell+char+cell.substr(1,1)));
    }

    //Add possible movement right from the position (No. is the same letter changes (++)

    colorCells(color,name);

    // console.log("Array : "+possibleMoves);
    // console.log(color);
}

function bishopMovement(color,cell,name){
    var letterIndex=columns.indexOf(cell.substr(0,1));
    var numberIndex=parseInt(cell.substr(1,1));
    var cellPieceColor="";
    var count=0;

    //Moves to the front-right (letterIndex++ , numberIndex++)
    while(numberIndex<8 | letterIndex<8){
        letterIndex++,numberIndex++;
        var vrCell="#"+columns[letterIndex]+numberIndex;
        cellPieceColor=$($(vrCell)).children("img").attr("class");

        if(cellPieceColor==color){
            break;
        }

        if(cellPieceColor!=color && count==0 && cellPieceColor!=undefined){
            count++;
        }else if(cellPieceColor!=color && count==1 && cellPieceColor!=undefined){
            break;
        }
        possibleMoves.push((vrCell));
    }

    letterIndex=columns.indexOf(cell.substr(0,1));
    numberIndex=parseInt(cell.substr(1,1));
    count=0;
    //Moves to the back-right (letterIndex++ , numberIndex--)
    while(numberIndex>1 | letterIndex<8){
        letterIndex++,numberIndex--;
        var varCell="#"+columns[letterIndex]+numberIndex;
        cellPieceColor=$($(varCell)).children("img").attr("class");

        if(cellPieceColor==color){
            break;
        }

        if(cellPieceColor!=color && count==0 && cellPieceColor!=undefined){
            count++;
        }else if(cellPieceColor!=color && count==1 && cellPieceColor!=undefined){
            break;
        }
        possibleMoves.push((varCell));
    }

    letterIndex=columns.indexOf(cell.substr(0,1));
    numberIndex=parseInt(cell.substr(1,1));
    count=0;
    //Moves to the back-left (letterIndex-- , numberIndex--)
    while(numberIndex>1 | letterIndex>0){
        letterIndex--,numberIndex--;
        var varCell="#"+columns[letterIndex]+numberIndex;
        cellPieceColor=$($(varCell)).children("img").attr("class");

        if(cellPieceColor==color){
            break;
        }

        if(cellPieceColor!=color && count==0 && cellPieceColor!=undefined){
            count++;
        }else if(cellPieceColor!=color && count==1 && cellPieceColor!=undefined){
            break;
        }
        possibleMoves.push((varCell));
    }

    letterIndex=columns.indexOf(cell.substr(0,1));
    numberIndex=parseInt(cell.substr(1,1));
    count=0;
    //Moves to the front-left (letterIndex-- , numberIndex++)
    while(numberIndex<8 | letterIndex>0){
        letterIndex--,numberIndex++;
        var varCell="#"+columns[letterIndex]+numberIndex;
        cellPieceColor=$($(varCell)).children("img").attr("class");

        if(cellPieceColor==color){
            break;
        }

        if(cellPieceColor!=color && count==0 && cellPieceColor!=undefined){
            count++;
        }else if(cellPieceColor!=color && count==1 && cellPieceColor!=undefined){
            break;
        }
        possibleMoves.push((varCell));
    }

    colorCells(color,name);

    // console.log("Array : "+possibleMoves);
    // console.log(color);
}

function knightMovement(color,cell,name){
    var letterIndex=columns.indexOf(cell.substr(0,1));
    var numberIndex=parseInt(cell.substr(1,1));
    var cellPieceColor="";
    var cellPiece="#";
    var count=0;

    for(var i=numberIndex+1;i<numberIndex+3;i++){
        cellPiece="#";
        if(i==numberIndex+1){
            cellPiece+=columns[letterIndex+2]+i;
            cellPieceColor=$(cellPiece).children('img').attr('class');
            if(cellPieceColor==undefined||cellPieceColor!=color){
                possibleMoves.push(cellPiece);
            }
        }else{
            cellPiece+=columns[letterIndex+1]+i;
            cellPieceColor=$(cellPiece).children('img').attr('class');
            if(cellPieceColor==undefined||cellPieceColor!=color){
                possibleMoves.push(cellPiece);
            }
        }
    }

    for(var i=numberIndex+1;i<numberIndex+3;i++){
        cellPiece="#";
        if(i==numberIndex+1){
            cellPiece+=columns[letterIndex-2]+i;
            cellPieceColor=$(cellPiece).children('img').attr('class');
            if(cellPieceColor==undefined||cellPieceColor!=color){
                possibleMoves.push(cellPiece);
            }
        }else{
            cellPiece+=columns[letterIndex-1]+i;
            cellPieceColor=$(cellPiece).children('img').attr('class');
            if(cellPieceColor==undefined||cellPieceColor!=color){
                possibleMoves.push(cellPiece);
            }
        }
    }

    for(var i=numberIndex-1;i>numberIndex-3;i--){
        cellPiece="#";
        if(i==numberIndex-1){
            cellPiece+=columns[letterIndex-2]+i;
            cellPieceColor=$(cellPiece).children('img').attr('class');
            if(cellPieceColor==undefined||cellPieceColor!=color){
                possibleMoves.push(cellPiece);
            }
        }else{
            cellPiece+=columns[letterIndex-1]+i;
            cellPieceColor=$(cellPiece).children('img').attr('class');
            if(cellPieceColor==undefined||cellPieceColor!=color){
                possibleMoves.push(cellPiece);
            }
        }
    }

    ///////
    for(var i=numberIndex-1;i>numberIndex-3;i--){
        cellPiece="#";
        if(i==numberIndex-1){
            cellPiece+=columns[letterIndex+2]+i;
            cellPieceColor=$(cellPiece).children('img').attr('class');
            if(cellPieceColor==undefined||cellPieceColor!=color){
                possibleMoves.push(cellPiece);
            }
        }else{
            cellPiece+=columns[letterIndex+1]+i;
            cellPieceColor=$(cellPiece).children('img').attr('class');
            if(cellPieceColor==undefined||cellPieceColor!=color){
                possibleMoves.push(cellPiece);
            }
        }
    }
    colorCells(color,name);
}

function queenMovement(color,cell,name) {
    rookMovement(color,cell,name);
    bishopMovement(color,cell,name);
    colorCells(color,name);
}

function kingMovement(color,cell,name) {
    var cellPiece="#";
    var letterIndex=columns.indexOf(cell.substr(0,1));
    var numberIndex=parseInt(cell.substr(1,1));
    var cellPieceColor="";

    for(var i=numberIndex-1;i<numberIndex+2;i++){
        for(var n=letterIndex-1;n<letterIndex+2;n++){
            cellPiece="#";
            cellPiece+=columns[n]+i;
            if(cellPiece==("#"+cell)){
                continue;
            }
            cellPieceColor=$(cellPiece).children('img').attr('class');
            if(cellPieceColor==undefined||cellPieceColor!=color){
                possibleMoves.push(cellPiece);
            }
        }
    }
    colorCells(color,name);
}

//Sets the "allMoves(Color)" arrays after each move from both players
function setAllPossibleMoves() {

    //Set all possible moves for white pieces
    for(var a in allWhitePieces){
        if(allWhitePieces[a]==null){
            continue;
        }

       var cellId=$($("img[alt="+allWhitePieces[a]+"]")).parent().attr('id'); //Gets the cell id of the piece
       var color= $($("img[alt="+allWhitePieces[a]+"]")).attr('class');
       var name=$($("img[alt="+allWhitePieces[a]+"]")).attr('name');

       setAllMovements(cellId,color,name,a,allMovesWhite);
    }

    for(var a in allBlackPieces){
        if(allBlackPieces[a]==null){
            continue;
        }
        var cellId=$($("img[alt="+allBlackPieces[a]+"]")).parent().attr('id'); //Gets the cell id of the piece
        var color= $($("img[alt="+allBlackPieces[a]+"]")).attr('class');
        var name=$($("img[alt="+allBlackPieces[a]+"]")).attr('name');

        setAllMovements(cellId,color,name,a,allMovesBlack);
    }
}

//Sets all the movements for the allMoves arrays(pawn,knight,bishop,queen)
function setAllMovements(cell,color,name,index,array) {
    switch(name){
        case "wRook":
        case "bRook":{
            var arMoves=[];
            var letterIndex=columns.indexOf(cell.substr(0,1));
            var numberIndex=parseInt(cell.substr(1,1));
            var cellPieceColor="";
            var checkCell="#"+cell.substr(0,1);
            var id='';

            //Add possible movement back from the position (Letter is the same number changes (--))
            while(numberIndex>1){
                numberIndex--;
                cellPieceColor=$($(checkCell+numberIndex)).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$($(checkCell+numberIndex)).children("img").attr("name").substr(1);
                }else{
                    id='';
                }
                if(cellPieceColor==undefined){
                    arMoves.push((checkCell+numberIndex));
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push((checkCell+numberIndex));
                    break;
                }else{
                    break;
                }

            }

            numberIndex=parseInt(cell.substr(1,1));

            //Add possible movement front from the position (Letter is the same number changes (++)
            while(numberIndex<8){
                // checkCell+=(letterIndex-1);
                numberIndex++;
                cellPieceColor=$($(checkCell+numberIndex)).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$($(checkCell+numberIndex)).children("img").attr("name").substr(1);
                }else{
                    id='';
                }

                if(cellPieceColor==undefined){
                    arMoves.push((checkCell+numberIndex));
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push((checkCell+numberIndex));
                    break;
                }else{
                    break;
                }
            }

            checkCell="#";
            //Add possible movement left from the position (No. is the same letter changes (--)
            while(letterIndex>0){
                letterIndex--;
                var char=columns[letterIndex];
                cellPieceColor=$($(checkCell+char+cell.substr(1,1))).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$($((checkCell+char+cell.substr(1,1)))).children("img").attr("name").substr(1);
                }else{
                    id='';
                }
                // console.log(cellPieceColor);
                if(cellPieceColor==undefined){
                    arMoves.push((checkCell+char+cell.substr(1,1)));
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push((checkCell+char+cell.substr(1,1)));
                    break;
                }else{
                    break;
                }
            }

            letterIndex=columns.indexOf(cell.substr(0,1));
            while(letterIndex<7){
                letterIndex++;
                var char=columns[letterIndex];
                cellPieceColor=$($(checkCell+char+cell.substr(1,1))).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$($((checkCell+char+cell.substr(1,1)))).children("img").attr("name").substr(1);
                }else{
                    id='';
                }

                // console.log(cellPieceColor);
                if(cellPieceColor==undefined){
                    arMoves.push((checkCell+char+cell.substr(1,1)));
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push((checkCell+char+cell.substr(1,1)));
                    break;
                }else{
                    break;
                }
            }

            array[index]=arMoves;

        }break;
        case "wBishop":
        case "bBishop":{
            var arMoves=[];
            var letterIndex=columns.indexOf(cell.substr(0,1));
            var numberIndex=parseInt(cell.substr(1,1));
            var cellPieceColor="";
            var id='';

            //Moves to the front-right (letterIndex++ , numberIndex++)
            while(numberIndex<8 | letterIndex<8){
                letterIndex++,numberIndex++;
                var vrCell="#"+columns[letterIndex]+numberIndex;
                cellPieceColor=$($(vrCell)).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$(vrCell).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(cellPieceColor==undefined){
                    arMoves.push(vrCell);
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push(vrCell);
                    break;
                }else{
                    break;
                }
            }

            letterIndex=columns.indexOf(cell.substr(0,1));
            numberIndex=parseInt(cell.substr(1,1));

            //Moves to the back-right (letterIndex++ , numberIndex--)
            while(numberIndex>1 | letterIndex<8){
                letterIndex++,numberIndex--;
                var varCell="#"+columns[letterIndex]+numberIndex;
                cellPieceColor=$($(varCell)).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$(varCell).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(cellPieceColor==undefined){
                    arMoves.push(varCell);
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push(varCell);
                    break;
                }else{
                    break;
                }
            }

            letterIndex=columns.indexOf(cell.substr(0,1));
            numberIndex=parseInt(cell.substr(1,1));

            //Moves to the back-left (letterIndex-- , numberIndex--)
            while(numberIndex>1 | letterIndex>0){
                letterIndex--,numberIndex--;
                var varCell="#"+columns[letterIndex]+numberIndex;
                cellPieceColor=$($(varCell)).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$(varCell).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(cellPieceColor==undefined){
                    arMoves.push(varCell);
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push(varCell);
                    break;
                }else{
                    break;
                }
            }

            letterIndex=columns.indexOf(cell.substr(0,1));
            numberIndex=parseInt(cell.substr(1,1));

            //Moves to the front-left (letterIndex-- , numberIndex++)
            while(numberIndex<8 | letterIndex>0){
                letterIndex--,numberIndex++;
                var varCell="#"+columns[letterIndex]+numberIndex;
                cellPieceColor=$($(varCell)).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$(varCell).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(cellPieceColor==undefined){
                    arMoves.push(varCell);
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push(varCell);
                    break;
                }else{
                    break;
                }
            }
            array[index]=arMoves;

        }break;

        case "wKnight":
        case "bKnight":{
            var arMoves=[];
            var letterIndex=columns.indexOf(cell.substr(0,1));
            var numberIndex=parseInt(cell.substr(1,1));
            var cellPieceColor="";
            var cellPiece="#";
            var id='';

            for(var i=numberIndex+1;i<numberIndex+3;i++){
                cellPiece="#";
                if(i==numberIndex+1){
                    cellPiece+=columns[letterIndex+2]+i;
                    cellPieceColor=$(cellPiece).children('img').attr('class');
                    if(cellPieceColor!=undefined){
                        id=$(cellPiece).children('img').attr('name').substr(1);
                    }else{
                        id='';
                    }
                    if(cellPieceColor==undefined){
                        arMoves.push(cellPiece);
                    }else if(cellPieceColor!=color && id=='King') {
                        arMoves.push(cellPiece);
                    }
                }else{
                    cellPiece+=columns[letterIndex+1]+i;
                    cellPieceColor=$(cellPiece).children('img').attr('class');
                    if(cellPieceColor!=undefined){
                        id=$(cellPiece).children('img').attr('name').substr(1);
                    }else{
                        id='';
                    }
                    if(cellPieceColor==undefined){
                        arMoves.push(cellPiece);
                    }else if(cellPieceColor!=color && id=='King') {
                        arMoves.push(cellPiece);
                    }
                }
            }

            for(var i=numberIndex+1;i<numberIndex+3;i++){
                cellPiece="#";
                if(i==numberIndex+1){
                    cellPiece+=columns[letterIndex-2]+i;
                    cellPieceColor=$(cellPiece).children('img').attr('class');
                    if(cellPieceColor!=undefined){
                        id=$(cellPiece).children('img').attr('name').substr(1);
                    }else{
                        id='';
                    }
                    if(cellPieceColor==undefined){
                        arMoves.push(cellPiece);
                    }else if(cellPieceColor!=color && id=='King') {
                        arMoves.push(cellPiece);
                    }
                }else{
                    cellPiece+=columns[letterIndex-1]+i;
                    cellPieceColor=$(cellPiece).children('img').attr('class');
                    if(cellPieceColor!=undefined){
                        id=$(cellPiece).children('img').attr('name').substr(1);
                    }else{
                        id='';
                    }
                    if(cellPieceColor==undefined){
                        arMoves.push(cellPiece);
                    }else if(cellPieceColor!=color && id=='King') {
                        arMoves.push(cellPiece);
                    }
                }
            }

            for(var i=numberIndex-1;i>numberIndex-3;i--){
                cellPiece="#";
                if(i==numberIndex-1){
                    cellPiece+=columns[letterIndex-2]+i;
                    cellPieceColor=$(cellPiece).children('img').attr('class');
                    if(cellPieceColor!=undefined){
                        id=$(cellPiece).children('img').attr('name').substr(1);
                    }else{
                        id='';
                    }
                    if(cellPieceColor==undefined){
                        arMoves.push(cellPiece);
                    }else if(cellPieceColor!=color && id=='King') {
                        arMoves.push(cellPiece);
                    }
                }else{
                    cellPiece+=columns[letterIndex-1]+i;
                    cellPieceColor=$(cellPiece).children('img').attr('class');
                    if(cellPieceColor!=undefined){
                        id=$(cellPiece).children('img').attr('name').substr(1);
                    }else{
                        id='';
                    }
                    if(cellPieceColor==undefined){
                        arMoves.push(cellPiece);
                    }else if(cellPieceColor!=color && id=='King') {
                        arMoves.push(cellPiece);
                    }
                }
            }

            ///////
            for(var i=numberIndex-1;i>numberIndex-3;i--){
                cellPiece="#";
                if(i==numberIndex-1){
                    cellPiece+=columns[letterIndex+2]+i;
                    cellPieceColor=$(cellPiece).children('img').attr('class');
                    if(cellPieceColor!=undefined){
                        id=$(cellPiece).children('img').attr('name').substr(1);
                    }else{
                        id='';
                    }
                    if(cellPieceColor==undefined){
                        arMoves.push(cellPiece);
                    }else if(cellPieceColor!=color && id=='King') {
                        arMoves.push(cellPiece);
                    }
                }else{
                    cellPiece+=columns[letterIndex+1]+i;
                    cellPieceColor=$(cellPiece).children('img').attr('class');
                    if(cellPieceColor!=undefined){
                        id=$(cellPiece).children('img').attr('name').substr(1);
                    }else{
                        id='';
                    }
                    if(cellPieceColor==undefined){
                        arMoves.push(cellPiece);
                    }else if(cellPieceColor!=color && id=='King') {
                        arMoves.push(cellPiece);
                    }
                }
            }
            array[index]=arMoves;
        }break;

        case "wQueen":
        case "bQueen":{
            var arMoves=[];
            var letterIndex=columns.indexOf(cell.substr(0,1));
            var numberIndex=parseInt(cell.substr(1,1));
            var cellPieceColor="";
            var checkCell="#"+cell.substr(0,1);
            var id='';

            var arMoves=[];
            var letterIndex=columns.indexOf(cell.substr(0,1));
            var numberIndex=parseInt(cell.substr(1,1));
            var cellPieceColor="";
            var checkCell="#"+cell.substr(0,1);
            var id='';

            //Add possible movement back from the position (Letter is the same number changes (--))
            while(numberIndex>1){
                numberIndex--;
                cellPieceColor=$($(checkCell+numberIndex)).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$($(checkCell+numberIndex)).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(cellPieceColor==undefined){
                    arMoves.push((checkCell+numberIndex));
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push((checkCell+numberIndex));
                    break;
                }else{
                    break;
                }

            }

            numberIndex=parseInt(cell.substr(1,1));

            //Add possible movement front from the position (Letter is the same number changes (++)
            while(numberIndex<8){
                // checkCell+=(letterIndex-1);
                numberIndex++;
                cellPieceColor=$($(checkCell+numberIndex)).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$($(checkCell+numberIndex)).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(cellPieceColor==undefined){
                    arMoves.push((checkCell+numberIndex));
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push((checkCell+numberIndex));
                    break;
                }else{
                    break;
                }
            }

            checkCell="#";
            //Add possible movement left from the position (No. is the same letter changes (--)
            while(letterIndex>0){
                letterIndex--;
                var char=columns[letterIndex];
                cellPieceColor=$($(checkCell+char+cell.substr(1,1))).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$($(checkCell+char+cell.substr(1,1))).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                // console.log(cellPieceColor);
                if(cellPieceColor==undefined){
                    arMoves.push((checkCell+char+cell.substr(1,1)));
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push((checkCell+char+cell.substr(1,1)));
                    break;
                }else{
                    break;
                }
            }

            letterIndex=columns.indexOf(cell.substr(0,1));
            while(letterIndex<7){
                letterIndex++;
                var char=columns[letterIndex];
                cellPieceColor=$($(checkCell+char+cell.substr(1,1))).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$($(checkCell+char+cell.substr(1,1))).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                // console.log(cellPieceColor);
                if(cellPieceColor==undefined){
                    arMoves.push((checkCell+char+cell.substr(1,1)));
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push((checkCell+char+cell.substr(1,1)));
                    break;
                }else{
                    break;
                }
            }

            letterIndex=columns.indexOf(cell.substr(0,1));
            numberIndex=parseInt(cell.substr(1,1));
            cellPieceColor="";

            while(numberIndex<8 | letterIndex<8){
                letterIndex++,numberIndex++;
                var vrCell="#"+columns[letterIndex]+numberIndex;
                cellPieceColor=$($(vrCell)).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$(vrCell).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(cellPieceColor==undefined){
                    arMoves.push(vrCell);
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push(vrCell);
                    break;
                }else{
                    break;
                }
            }

            letterIndex=columns.indexOf(cell.substr(0,1));
            numberIndex=parseInt(cell.substr(1,1));

            //Moves to the back-right (letterIndex++ , numberIndex--)
            while(numberIndex>1 | letterIndex<8){
                letterIndex++,numberIndex--;
                var varCell="#"+columns[letterIndex]+numberIndex;
                cellPieceColor=$($(varCell)).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$(varCell).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(cellPieceColor==undefined){
                    arMoves.push(varCell);
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push(varCell);
                    break;
                }else{
                    break;
                }
            }

            letterIndex=columns.indexOf(cell.substr(0,1));
            numberIndex=parseInt(cell.substr(1,1));

            //Moves to the back-left (letterIndex-- , numberIndex--)
            while(numberIndex>1 | letterIndex>0){
                letterIndex--,numberIndex--;
                var varCell="#"+columns[letterIndex]+numberIndex;
                cellPieceColor=$($(varCell)).children("img").attr("class");

                if(cellPieceColor!=undefined){
                    id=$(varCell).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(cellPieceColor==undefined){
                    arMoves.push(varCell);
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push(varCell);
                    break;
                }else{
                    break;
                }
            }

            letterIndex=columns.indexOf(cell.substr(0,1));
            numberIndex=parseInt(cell.substr(1,1));

            //Moves to the front-left (letterIndex-- , numberIndex++)
            while(numberIndex<8 | letterIndex>0){
                letterIndex--,numberIndex++;
                var varCell="#"+columns[letterIndex]+numberIndex;
                cellPieceColor=$($(varCell)).children("img").attr("class");
                if(cellPieceColor!=undefined){
                    id=$(varCell).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(cellPieceColor==undefined){
                    arMoves.push(varCell);
                }else if(cellPieceColor!=color && id=='King'){
                    arMoves.push(varCell);
                    break;
                }else{
                    break;
                }
            }
            array[index]=arMoves;
        }break;

        case "wPawn":{
            var check="#"+cell.substr(0,1);
            var arMoves=[];
            var otherColor="";

            if(check=="#A"){
                check="#";
                check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))+1];
                check+=(parseInt(cell.charAt(1))-1);
                otherColor=$(check).children('img').attr('class');
                if(otherColor!=undefined){
                    id=$(check).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(otherColor==undefined || (otherColor!=color && id=='King')){
                    arMoves.push(check);
                }

            }else if(check=="#H"){
                check="#";
                check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))-1];
                check+=(parseInt(cell.charAt(1))-1);
                otherColor=$(check).children('img').attr('class');
                if(otherColor!=undefined){
                    id=$(check).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(otherColor==undefined || (otherColor!=color && id=='King')){
                    arMoves.push(check);
                }
            }else{
                check="#";
                check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))+1];
                check+=(parseInt(cell.charAt(1))-1);
                otherColor=$(check).children('img').attr('class');
                if(otherColor!=undefined){
                    id=$(check).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(otherColor==undefined || (otherColor!=color && id=='King')){
                    arMoves.push(check);
                }

                check=check.substr(0,1);
                check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))-1];
                check+=(parseInt(cell.charAt(1))-1);
                otherColor=$(check).children('img').attr('class');
                if(otherColor!=undefined){
                    id=$(check).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(otherColor==undefined || (otherColor!=color && id=='King')){
                    arMoves.push(check);
                }
            }

            array[index]=arMoves;
        }break;

        case "bPawn":{
            var check="#"+cell.substr(0,1);
            var arMoves=[];
            var otherColor="";
            var id='';

            if(check=="#A"){
                check="#";
                check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))+1];
                check+=(parseInt(cell.charAt(1))+1);
                otherColor=$(check).children('img').attr('class');
                if(otherColor!=undefined){
                    id=$(check).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(otherColor==undefined || (otherColor!=color && id=='King')){
                    arMoves.push(check);
                }
            }else if(check=="#H"){
                check="#";
                check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))-1];
                check+=(parseInt(cell.charAt(1))+1);
                otherColor=$(check).children('img').attr('class');
                if(otherColor!=undefined){
                    id=$(check).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(otherColor==undefined || (otherColor!=color && id=='King')){
                    arMoves.push(check);
                }
            }else{
                check="#";
                check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))+1];
                check+=(parseInt(cell.charAt(1))+1);
                otherColor=$(check).children('img').attr('class');
                if(otherColor!=undefined){
                    id=$(check).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(otherColor==undefined || (otherColor!=color && id=='King')){
                    arMoves.push(check);
                }


                check=check.substr(0,1);
                check+=columns[parseInt(columns.indexOf(cell.substr(0,1)))-1];
                check+=(parseInt(cell.charAt(1))+1);
                otherColor=$(check).children('img').attr('class');
                if(otherColor!=undefined){
                    id=$(check).children('img').attr('name').substr(1);
                }else{
                    id='';
                }
                if(otherColor==undefined || (otherColor!=color && id=='King')){
                    arMoves.push(check);
                }
            }
            array[index]=arMoves;
        }break;
    }
}

//Checks whether king is checked or check-Mate (After each move is done from both players)
function checkMate(color,cell,name){
    setAllPossibleMoves();
    isCheck=false;
    switch(color){
        case "black":{
            var wKingId=$($("img[alt=wKing]")).parent().attr('id');
            // console.log("wKing : "+wKingId)
            // console.log(allMovesBlack);
            L1:for(var i in allBlackPieces){
                if(allBlackPieces[i]==null){
                    continue;
                }
                // console.log(allMovesBlack[i][j]=="#"+wKingId);
                for(var j in allMovesBlack){
                    if(allMovesBlack[i][j]=="#"+wKingId){
                        // console.log("Hello");
                        isCheck=true;
                        alert("Check");
                        break L1;
                    }
                }
            }
        }break;
        case "white":{
            var bKingId=$($("img[alt=bKing]")).parent().attr('id');
            // console.log("wKing : "+wKingId)
            // console.log(allMovesBlack);
            L1:for(var i in allWhitePieces){
                if(allWhitePieces[i]==null){
                    continue;
                }
                console.log(allMovesWhite[i][j]=="#"+bKingId);
                for(var j in allMovesBlack){
                    if(allMovesWhite[i][j]=="#"+bKingId){
                        // console.log("Hello");
                        isCheck=true;
                        alert("Check");
                        break L1;
                    }
                }
            }

        }break;
    }
}


