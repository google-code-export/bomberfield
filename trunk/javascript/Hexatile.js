/**
 * Die Klasse Hexatile
 * 
 * TODO Doku
 */
function Hexatile(line, column) {

	/**
	 * Gibt die Zeile in einer logischen Matrix wieder
	 */
	this.line = line;

	/**
	 * Gibt die Spalte in einer logischen Matrix wieder
	 */
	this.column = column;

	/**
	 * Sobald das Hexatile geklickt wurde wird in dieser Variablen gespeichert, wieviele umgebende Minen es gibt
	 */
	this.surroundingMines = 0;

	/**
	 * Wenn true, dann ist diese Zelle eine Mine, sonst false
	 */
	this.isMine = false;

	/**
	 * Wenn true, dann wurde dieses Feld bereits aufgedeckt, sonst false
	 */
	this.isOpen = false;

	/**
	 * Wenn die Zelle markiert wurde, dann ist diese Flag gesetzt
	 */
	this.isMarked = false;

	/**
	 * Diese Funktion switched das isMarked Flag
	 */
	this.toggleMarked = function() {
		if(this.isOpen)
			return;

		this.isMarked = !this.isMarked;
		this.draw(ctx);
	};

	/**
	 * Zeichnet die Zelle
	 */
	this.draw = function(ctx) {
		var topMargin = cellHeight / 4;

		// In diesen Zeilen wird die Position der Zelle berechnet
		var currentLine = lineVector.mult(this.line);
		var currentColumn = columnVector.mult(this.column);
		var relativeCellVector = currentLine.add(currentColumn);
		var cellVector = offsetVector.add(relativeCellVector);

		if(this.isOpen == false) {
			// Hier wird die Hintergrundfare eines unaufgedeckten Hexagon gesetzt
			ctx.fillStyle = fsClosed;

		} else if(this.isOpen == true && this.isMine == false) {

			// In diesen Zeilen wird abh�ngig von der Anzahl der Nachbarminen die Hintergrundfarbe des Hexagon gesetzt
			if(this.surroundingMines == 0)
				ctx.fillStyle = fs0Mines;
			if(this.surroundingMines == 1)
				ctx.fillStyle = fs1Mines;
			if(this.surroundingMines == 2)
				ctx.fillStyle = fs2Mines;
			if(this.surroundingMines == 3)
				ctx.fillStyle = fs3Mines;
			if(this.surroundingMines == 4)
				ctx.fillStyle = fs4Mines;
			if(this.surroundingMines == 5)
				ctx.fillStyle = fs5Mines;
			if(this.surroundingMines == 6)
				ctx.fillStyle = fs6Mines;

		} else if(this.isOpen && this.isMine) {
			// Wenn dies eine Mine ist und sie angeklickt wurde, soll sichtbar sein, durch welche Mine man gestorben ist
			ctx.fillStyle = fsExplode;
		}

		// Hier wird die Bordr Farbe und die Border dicke gesetzt.
		ctx.strokeStyle = ssBorder;
		ctx.lineWidth = 1;

		// In den folgenden Zeilen wird das Hexagon gezeichnet
		ctx.beginPath();
		ctx.moveTo(cellVector.x + cellWidth/2, cellVector.y);
		ctx.lineTo(cellVector.x + cellWidth, cellVector.y + topMargin);
		ctx.lineTo(cellVector.x + cellWidth, cellVector.y + (cellHeight - topMargin));
		ctx.lineTo(cellVector.x + cellWidth/2, cellVector.y + cellHeight);
		ctx.lineTo(cellVector.x + 0, cellVector.y + (cellHeight - topMargin));
		ctx.lineTo(cellVector.x + 0, cellVector.y + topMargin);
		ctx.lineTo(cellVector.x + cellWidth/2, cellVector.y);
		ctx.fill();
		ctx.stroke();

		if(!alive && this.isMine) {
			// Wenn man tot ist, dann sollen alle Minen gezeichnet werden
			ctx.drawImage(imageMine, cellVector.x, cellVector.y);
		}

		// Hier wird die Zelle markiert, wenn dies der Fall ist
		if(this.isMarked) {
			// Wenn ein Hexatile markiert ist, soll es eine Flagge bekommen
			ctx.drawImage(imageFlag, cellVector.x, cellVector.y - (cellHeight / 10));
		}
		// Hier wird das Hexatile mit einer Zahl versehen, sollte es aufgedeckt sein, keine 
		// Mine enthalten und mindestens eine Mine als Nachbarn habn.
		else if(this.isOpen && (!this.isMine) && this.surroundingMines > 0) {
			// TODO sch�ner machen
			ctx.fillStyle = fsText;
			ctx.fillText(this.surroundingMines, cellVector.x + (cellWidth/2), cellVector.y+(cellHeight/2));
		}

	};

	/**
	 * Wird ausgef�hrt, wenn auf die Zelle geklickt wurde
	 */
	this.clicked = function() {
		// Wenn die Zelle bereits angeklickt wurde, dann muss nichts gemacht werden
		if (this.isOpen)
			return;

		// Wenn die Zelle markiert ist, dann soll sie nicht reagieren
		if (this.isMarked)
			return;

		// Da die Zelle geklickt wurde, ist sie jetzt aufgedeckt
		this.isOpen = true;

		// Wenn die Zelle eine Mine ist, dann ...
		if(this.isMine) {
			// ... wird diese jetzt explodieren
			// TODO explodierende Mine? verlust sihchtbar darstellen 

			alive = false;
			repaint();
			
			alert('Sie haben verloren!');
			return;
		} 

		// Wenn die Zelle keine Mine ist, dann ...
		this.surroundingMines = countSurroundingMines(this.line, this.column);

		// Wenn es keine Nachbarminen gibt, m�ssen ale Nachbarzellen geklickt werden
		if (this.surroundingMines == 0) {
			clickSurroundingMines(this.line, this.column);
		}

	};

	/**
	 * Gibt einen String zur�ck, welcher die Daten der Zelle textuell wiedergibt
	 */
	this.toString = function() {
		//TODO generate and return nice string
	};

	/**
	 * Diese Funktion berechnet, ob ein vorhergegangener Klick auf der Zelle stattgefunden hat.
	 */
	this.collides = function(vector) {
		var cellVector = offsetVector.add(lineVector.mult(line).add(columnVector.mult(column)));

		if(vector.x > cellVector.x && vector.x < (cellVector.x + cellWidth) &&
				vector.y > cellVector.y && vector.y < (cellVector.y + cellHeight)) {

			/**
			 * Im folgenden wird �berpr�ft, ob der Klick in einem der vier au�erhalb des Hexagon liegenden
			 * Dreiecke gelandet ist. Wenn ja, dann wurde das Hexagon nicht getroffen.
			 */
			// oben links
			if(pointCollidesWithTriangle(vector, 
					new Vector(cellVector.x, cellVector.y + (cellHeight / 4)),
					cellVector, 
					new Vector(cellVector.x + (cellWidth / 2), cellVector.y)))
				return false;
			// oben rechts
			if(pointCollidesWithTriangle(vector,
					new Vector(cellVector.x + cellWidth, cellVector.y + (cellHeight / 4)),
					new Vector(cellVector.x + (cellWidth / 2), cellVector.y), 
					new Vector(cellVector.x + cellWidth, cellVector.y)))
				return false;
			// unten rechts
			if(pointCollidesWithTriangle(vector,
					new Vector(cellVector.x + (cellWidth / 2), cellVector.y + cellHeight), 
					new Vector(cellVector.x + cellWidth, cellVector.y + (cellHeight - (cellHeight / 4))),
					new Vector(cellVector.x + cellWidth, cellVector.y + cellHeight)))
				return false;
			// unten links
			if(pointCollidesWithTriangle(vector,
					new Vector(cellVector.x, cellVector.y + cellHeight), 
					new Vector(cellVector.x, cellVector.y + (cellHeight - (cellHeight / 4))),
					new Vector(cellVector.x + (cellWidth / 2), cellVector.y + cellHeight)))
				return false;

			return true;
		}

		return false;
	};
}