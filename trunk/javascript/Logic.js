/**
 * TODO Doku
 */
$(document).ready(function() {
	// Hier wird das Image f�r die Flaggen geladen
	imageFlag = new Image();
	imageFlag.src = "images/flag.png";

	// Hier wird das Image f�r die Minen geladen
	imageMine = new Image();
	imageMine.src = "images/mine.png";

	// Hier wird der CSS Style f�r das canvas angepasst
	$('#canvas').css('width', canvasWidth + 'px');
	$('#canvas').css('height', canvasHeight + 'px');

	// Hier wird der Backgroundbuffer des canvas angepasst
	$('#canvas').attr('height', canvasHeight);
	$('#canvas').attr('width', canvasWidth);

	// Hier wird der New Game Button konfiguriert
	$('#newGame').click(function(e){
		newGame();
	});

	// linksklick am canvas registrieren
	$('#canvas').click(function(e){
		
		// Nur wenn man noch lebt
		if(alive) {
			// Hier werden die Koordinaten des Klick in f�r das Spiel verwertbare Koordinaten umgewandelt
			clickVector = new Vector(e.pageX  - this.offsetLeft, e.pageY - this.offsetTop).sub(offsetVector);

			// Hier wird die geklickte Zelle ermittelt und letztenendes wirklich geklickt
			for(var i = 0; i < arrayDimensionLine; i++) {
				for(var j = 0; j < arrayDimensionColumn; j++) {
					if(hexatileOnMap(i,j))
						if(gameField[i][j].collides(clickVector)) {
							gameField[i][j].clicked();
						}
				}
			}

			$('#position').html(clickVector.x +', '+ clickVector.y);

			// Das Spielfeld neu zeichnen
			repaint();

			// pr�fen, ob man gewonnen hat. An dieser Stelle kann man nur gewinnen, wenn alle leeren Zellen aufgedeckt wurden
			if(checkVictoryClick()) {
				alive = false;
				alert("Sie haben gewonnen!");
			}
		}

	});

	// rechtsklick am canvas registrieren
	$('#canvas').bind("contextmenu", function(e) {
		
		// Nur wenn man noch lebt
		if(alive) {
			// Hier werden die Koordinaten des Klick in f�r das Spiel verwertbare Koordinaten umgewandelt
			clickVector = new Vector(e.pageX  - this.offsetLeft, e.pageY - this.offsetTop).sub(offsetVector);

			// Hier wird die gerechtsklickte Zelle ermittelt und markiert
			for(var i = 0; i < arrayDimensionLine; i++) {
				for(var j = 0; j < arrayDimensionColumn; j++) {
					if(hexatileOnMap(i,j))
						if(gameField[i][j].collides(clickVector)) {
							gameField[i][j].toggleMarked();
						}
				}
			}

			$('#position').html(clickVector.x +', '+ clickVector.y);
			
			// das Spielfeld neu zeichnen
			repaint();
			
			// Ermitteln ob man gewonnen hat. An dieser Stelle kann man nur gewinnen, wenn alle Minen markiert wurden
			if(checkVictoryMark()) {
				alive = false;
				alert("Sie haben gewonnen!");
			}
		}

		return false;
	});

	// Den context des canvas laden und in der globalen Variablen ctx ablegen
	var canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	// Ein neues Spiel starten
	newGame();
});






/**
 * Diese Funktion startet ein neues Spiel
 */
function newGame() {
	// Das Spielfeld leeren
	ctx.fillStyle = fsBackground;
	ctx.fillRect(0,0,canvasWidth, canvasHeight);

	alive = true;
	arrayBuild();
	repaint();
}






/* ************************************************
 * Globale Variablen
 * ************************************************/
/**
 * Hier wird das image f�r die Flagge gespeichert
 */
var imageFlag;

/**
 * Hier wird das Image f�r die Mine gespeichert
 */
var imageMine;

/**
 * Dieser Vector dient der Verschiebung der Zellen innerhalb des Canvas. Initial
 * und in erster Spieleversion ist das Spielfeld nicht verschoben.
 */
var offsetVector = new Vector(0,0);
/**
 * Die Breite des Rechtecks in das die Zelle gezeichnet werden soll
 */
var cellWidth = 50;
/**
 * Die H�he des Rechtecks in das die Zelle gezeichnet werden soll
 */
var cellHeight = 50;

/**
 * Der lineVector beschreibt die absolute Entfernung zwischen den Mittelpunkten zweier benachbarter
 * Hexatiles innerhalb derselben Zeile der Matrix
 */
var lineVector = new Vector(-(cellWidth/2), (cellHeight * 3) / 4);
/**
 * Der columnVector beschreibt die absolute Entfernung zwischen den Mittelpunkten zweier benachbarter
 * Hexatiles innerhalb derselben Spalte der Matrix
 */
var columnVector = new Vector(cellWidth/2, (cellHeight * 3) / 4);

/**
 * canvasWidth gibt die Breite des canvas vor
 */
var canvasWidth = 800;
/**
 * canvasHeight gibt die H�he des canvas vor
 */
var canvasHeight = 425;

/**
 * Die Anzahl der Hexatiles in einer visuellen Zeile des Spielfeldes
 */
var cellsInLine;
/**
 * Die Anzahl der Hexatiles in einer visuellen Spalte des Spielfeldes
 */
var cellsInColumn;

/** 
 * Die Ausdehnung der Matrix (solange diese noch quadratisch ist)
 */
var arrayDimensionLine;
var arrayDimensionColumn;

/**
 * Die Spielfeldmatrix
 */
var gameField;

/**
 * Der Schwierigkeitsgrad
 */
var difficulty = 10;

/**
 * Der canvas kontext
 */
var ctx;

/**
 * true wenn man noch am leben ist, false wenn die Bombe explodiert ist
 */
var alive = true;

/**
 * Es folgen alle ctx fillStyle(fs) und strokeStyle(ss) definitionen
 */
var fsText = "rgb(0,0,0)";
var ssBorder = "rgb(0, 0, 0)";
var fs0Mines = "rgb(255, 255, 255)";
var fs1Mines = "rgb(255, 255, 85)";
var fs2Mines = "rgb(255, 170, 170)";
var fs3Mines = "rgb(255, 170, 0)";
var fs4Mines = "rgb(255, 85, 85)";
var fs5Mines = "rgb(255, 0, 85)";
var fs6Mines = "rgb(255, 0, 0)";
var fsClosed = "rgb(50, 50, 255)";
var fsExplode = "rgb(255,0,0)";
var fsBackground = "rgb(255,255,255)";






/**
 * Diese Funktion berechnet die Dimensionen des Spielfeldes, initialisiert das Array entsprechend und
 * erzeugt die Hexatiles.
 */
function arrayBuild(){
	var cellNumber = 0;
	/*
	 * evtl moechte man in einer spaeteren Version manuell ein Array definieren, welches eine groessere Map
	 * beherbergen kann als das canvas, deswegen gibt es diese beiden Variablen, welche in erster Version
	 * lediglich mit der Dimension des Standard Arrays belegt werden.
	 */
	var arrayColumns;
	var arrayRows;


	// In diesem Block finden die Berechnungen statt, welche die Dimension des Spielfeldes berechnen sollen.
	// In der ersten Version des SPiels soll sich das Spielfeld aus der Gr��e des Canvas ableiten.
	// In sp�teren Versionen soll das Spielfeld auch gr��er gew�hlt werden k�nnen.
	{
		// Hier wird berechnet, wieviele Hexatiles in die erste Zeile des canvas passen
		cellsInLine = canvasWidth  / cellWidth;

		// Hier wird berechnet, wieviele Hexatiles vertikal auf das canvas passen
		var allCellHeight = 0;

		// Dazu wird jeweils abwechselnd der Durchmesser und die Seitenkantenl�nge auf eine Variable
		// (allCellHeight) addiert, bis die H�he des Canvas erreicht wurde.
		while(canvasHeight > allCellHeight){
			if(cellNumber%2 == 1){
				allCellHeight = allCellHeight + (cellHeight / 2);
			}
			else{
				allCellHeight = allCellHeight + cellHeight;	
			}
			cellNumber++;
		}

		// Bei dieser Berechnungsart ist die Anzahl der Hexatiles in einer Spalte an dieser Stelle bereits berechnet
		cellsInColumn = cellNumber;
		// Die Dimension des Arrays leitet sich aus der Anzahl der Hexatiles in einer Zeile und der Anzahl der Hexatiles in
		// einer Spalte ab.
		arrayDimensionLine = cellsInLine + (Math.round(cellsInColumn / 2) - 1);
		arrayDimensionColumn = arrayDimensionLine;
		// Bei dieser Berechnungsart ist die Matrix quadratisch und deswegen gibt es genausoviele Spalten wie Zeilen
		arrayRows = arrayDimensionLine;
		arrayColumns = arrayDimensionColumn;
	}

	// An dieser Stelle wird das Spielfeld als ein Array mit der berechneten Gr��e definiert
	gameField = new Array(arrayRows);
	// Dann wird jedes Feld des Arrays durchlaufen
	for(var i = 0; i < arrayRows; i++ ){
		// und ebenfalls als Array der berechneten Gr��e definiert
		gameField[i] = new Array(arrayColumns);
		// Anschlie�end werden also alle Spalten der eben erzeugten Zeile durchlaufen 
		for(var j = 0; j < arrayColumns; j++){
			// Und gepr�ft, ob die entsprechenden Zelle mit einem Hexatile versehen werden muss.
			if(hexatileOnMap(i,j)) {
				// Wenn ja, dann wird ein Hexatile an der entsprechenden Zelle erzeugt und mit 
				// Koordinaten versehen, welche sich von den Original Koordinaten unterscheiden,
				// jedoch notwendig sind, damit dich die hexatiles resourcenschonend selbst 
				// zeichnen und verwalten k�nnen.
				gameField[i][j] = new Hexatile(i - (cellsInLine - 1),j);
				// In diesem Schritt wird anhand der vorher definierten Schwierigkeit zuf�llig ermittelt,
				// ob es sich bei diesem Hexatile um eine Mine handeln soll, oder nicht.
				gameField[i][j].isMine = ((Math.random() * 101) < difficulty);
			}
		}
	}

}






/**
 * Diese Funktion durchl�uft das gesamte Array und st��t das Neuzeichnen jeder einuzelnen Zelle an,
 * wenn sie vorhanden ist.
 */
function repaint(){
	for(var i = 0; i < arrayDimensionLine; i++) {
		for(var j = 0; j < arrayDimensionColumn; j++) {
			if(hexatileOnMap(i,j)) {
				gameField[i][j].draw(ctx);
			}
		}
	}
}






/**
 * Diese Funktion �berpr�ft, ob ein Sieg besteht
 */
function checkVictoryClick() {
	for(var i = 0; i < arrayDimensionLine; i++) {
		for(var j = 0; j < arrayDimensionColumn; j++) {
			if(hexatileOnMap(i,j))
				if(!gameField[i][j].isOpen && !gameField[i][j].isMine)
						return false;
		}
	}

	return true;
}






/**
 * Diese Funktion �berpr�ft, ob alle Minen markiert wurden
 */
function checkVictoryMark() {
	for(var i = 0; i < arrayDimensionLine; i++) {
		for(var j = 0; j < arrayDimensionColumn; j++) {
			if(hexatileOnMap(i,j))
				if(gameField[i][j].isMine && !gameField[i][j].isMarked)
					return false;
		}
	}
	
	return true;
}






/**
 * Diese Funktion f�hrt den Klick auf allen Zellen in der unmitelbaren Umgebung der �bergebenen Koordinaten
 * aus. Dabei handelt es sich um die Hexatileeigenen Koordinaten, welche innerhalb dieser Funktion auf
 * die Matrixkoordinaten zur�ckgerechnet werden m�ssen.
 */
function clickSurroundingMines(line, column){
	// Da sich die Hexatile-Koordinaten und die Matrix-Koordinaten nur in der Zeile unterscheiden, muss nur diese
	// umgerechnet werden.
	var matLine = line + (cellsInLine - 1);
	// rechts
	if(hexatileOnMap(matLine + 1, column - 1))
		gameField[matLine + 1][column - 1].clicked();
	// oben links
	if(hexatileOnMap(matLine, column - 1))
		gameField[matLine][column - 1].clicked();
	// oben rechts
	if(hexatileOnMap(matLine - 1, column))
		gameField[matLine - 1][column].clicked();
	// rechts
	if(hexatileOnMap(matLine - 1, column + 1))
		gameField[matLine - 1][column + 1].clicked();
	// unten rechts
	if(hexatileOnMap(matLine, column + 1))
		gameField[matLine][column + 1].clicked();
	// unten links
	if(hexatileOnMap(matLine + 1, column))
		gameField[matLine + 1][column].clicked();
}






/**
 * In dieser Funktion werden alle Minen im direkten Umfeld gez�hlt relativ zu den �bergebenen Hexatile-Koordinaten.
 * Da sich die Hexatile-Koordinaten von den Matrix-Koordinaten unterscheiden, m�ssen dann erst die Hexatile-Koordinaten
 * in die Matrix-Koordinaten zur�ckgerechnet werden.
 */
function countSurroundingMines(line, column) {
	// Hier wird gez�hlt, wieviele Minen es im direkten Umfeld gibt
	var mineCounter = 0;

	// Da sich die Hexatile-Koordinaten und die Matrix-Koordinaten nur in der Zeile unterscheiden, muss nur diese
	// umgerechnet werden.
	var matLine = line + (cellsInLine - 1);
	// links
	if(hexatileOnMap(matLine + 1, column - 1) && gameField[matLine + 1][column - 1].isMine)
		mineCounter++;
	// oben links
	if(hexatileOnMap(matLine, column - 1) && gameField[matLine][column - 1].isMine)
		mineCounter++;
	// oben rechts
	if(hexatileOnMap(matLine - 1, column) && gameField[matLine - 1][column].isMine)
		mineCounter++;
	// rechts
	if(hexatileOnMap(matLine - 1, column + 1) && gameField[matLine - 1][column + 1].isMine)
		mineCounter++;
	// unten rechts
	if(hexatileOnMap(matLine, column + 1) && gameField[matLine][column + 1].isMine)
		mineCounter++;
	// unten links
	if(hexatileOnMap(matLine + 1, column) && gameField[matLine + 1][column].isMine)
		mineCounter++;

	// Hier wird die Anzahl der gez�hlten Minen zur�ck gegeben
	return mineCounter;
}






/**
 * Diese Methode berechnet, ob ein Hexatile �berhaupt auf der Map ist.
 * 
 * In der ersten Version bedeutet dies, ob ein Hexatile vollst�ndig auf dem Canvas ist.
 */
function hexatileOnMap(line, column) {
	// Wenn die Koordinaten nichtmal in dem Array liegen, dann liegt das Hexatile eh nicht auf der Map
	if(!coordinatesInArrayRange(line, column))
		return false;

	// oben
	if(line + column < (cellsInLine - 1))
		return false;

	//links
	if(line > column && line - column > (cellsInLine - 1))
		return false;

	//rechts
	if(line < column && line - column < -(cellsInLine - 1))
		return false;

	//unten
	if(line + column > ((cellsInLine - 1) + (cellsInColumn - 1)))
		return false;

	// An dieser Stelle ist klar, dass das Hexatile auf der Map liegt
	return true;
}






/**
 * �berpr�ft, ob die Koordinaten im Array Range sind.
 */
function coordinatesInArrayRange(line, column) {
	if(line >=0 && line < arrayDimensionLine && column >= 0 && column < arrayDimensionColumn)
		return true;

	// An dieser Stelle ist klar, dass die Koordinaten nicht im Array Range liegen.
	return false;
}






/**
 * In dieser Funktion wird �berpr�ft, ob der Punkt vp in dem durch vt1, vt2 und vt3 beschriebenen Dreieck befindet
 */
function pointCollidesWithTriangle(vp, vt1, vt2, vt3) {
	//  calculate vector vt1->vt2 (AB)
	var vecAB = vt2.sub(vt1);
	// calculate vector vt1->vt3 (AC)
	var vecAC = vt3.sub(vt1);
	// calculate vector vt1->vp (AP)
	var vecAP = vp.sub(vt1);

	// vecAP = s * vecAB + r * vecAC
	var s = (vecAP.x - ((vecAB.x * vecAP.y) / vecAB.y)) / (vecAC.x - ((vecAB.x * vecAC.y) / vecAB.y));
	var r = (vecAP.y - (s * vecAC.y)) / vecAB.y;

	// conditions for true 0 <= u, 0 <= v, u+v <=1
	if((0 <= r) && (0 <= s) && (r + s <= 1))
		return true;

	// an dieser Stelle ist klar, dass sich der Punkt nicht im Dreieck befindet
	return false;
}