/**
 * Die Klasse Vector
 * 
 * Diese Klasse beschreibt einen Punkt absolut zum Nullpunkt des verwendeten Koordinatesystems, oder
 * Relativ zum betrachteten Punkt.
 */
function Vector(x, y) {
	this.x = x;
	this.y = y;
}



/**
 * Addiert zwei Vectoren miteinander und gibt den resultierenden Vector zur�ck
 */ 
Vector.prototype.add = function(v) {
	return new Vector(this.x + v.x, this.y + v.y);
};



/**
 * Subrahiert einen Vector von einem anderen und gibt den resultierenden Vector zur�ck
 */
Vector.prototype.sub = function (v) {
	return new Vector(this.x - v.x, this.y - v.y);
};



/**
 * Multipliziert den Vector mit einem Faktor und gibt den resultierenden Vektor zur�ck
 */
Vector.prototype.mult = function (factor) {
	return new Vector(this.x * factor, this.y * factor);
};



/**
 * Dividiert den Vector durch einen factor und gibt den resultierenden Vektor zur�ck
 */
Vector.prototype.div = function(factor) {
	return new Vector(this.x / factor, this.y / factor);
};



/**
 * Multipiziert diese Vector mit dem �bergebenen Vector und gibt das Ergebnis zur�ck
 */
Vector.prototype.vectorMult = function(v) {
	return new Vector(this.x * v.x, this.y * v.y);
};



/**
 * Diese Funktion berechnet den Einheitsvektor und gibt diesen zur�ck
 */
Vector.prototype.unitVector = function() {
	return this.div(this.absolute());
};



/**
 * Berechnet die L�nge des Vektors und gibt sie zur�ck
 */
Vector.prototype.absolute = function() {
	return Math.sqrt((this.x * this.x) + (this.y * this.y));
};



/**
 * Gibt den Vector als String zur�ck
 */
Vector.prototype.toString = function () {
	return x+","+y;
};