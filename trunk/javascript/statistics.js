/**
 * Diese Klasse ist zur Erhebung von Statistiken gedacht. Hier k�nnen Informationen hinterlegt werden,
 * die statistische Relevanz f�r Bomberfield haben.
 */
function Statistics() {
	/**
	 * Die Stati zu denen Informationen hinzugefuegt oder abgefragt werden koennen
	 */
	this.state = {"win":1, "lose":2, "start":3, "discarded":4};
	
	/**
	 * Hier werden die Anzahl der gesamzten Spiele festgehalten, aufgeschluesselt nach ihrer Schwierigkeit
	 */
	var gamesTotal = {};
	
	/**
	 * Hier wird die Anzahl der gewonnenen Spiele je Schwierigkeit gespeichert
	 */
	var gamesWon = {};
	
	/**
	 * Hier wird die Anzahl der verlorenen Spiele je Schwierigkeit gespeichert
	 */
	var gamesLost = {};

	/**
	 * Hier wird die Anzahl der insgesamt in Game verbrachten Sekunden pro Schwierigkeit abgespeichert
	 */
	var secondsTotal = {};
	
	/**
	 * Hier wird die Anzahl der Sekunden aller gewonnenen Spiele pro Schwierigkeit abgespeichert
	 */
	var secondsWon = {};
	
	/**
	 * Hier wird die Anzahl der Sekunden aller verlorenen Spiele pro Schwierigkeit abgespeichert
	 */
	var secondsLost = {};
	
	/**
	 * Hier werden die Bestzeiten je Schwierigkeit des Spielers abgespeichert
	 */
	var secondsBest = {};
	
	/**
	 * Hier wird abgespeichert, wieviel % der Spieler je Schwierigkeit bei verlorenen Spielen aufgedeckt hat
	 */
	var discoveredPercentLost = {};
	
	/**
	 * Hier wird abgespeichert, wieviel % der Spieler je Schwierigkeit bei gewonnenen Spielen aufgedeckt hat
	 */
	var discoveredPercentWon = {};
	
	/**
	 * Hier wird abgelegt, wieviel % der Spieler je Schwierigkeit bei abgebrochenen Spielen aufgedeckt hat
	 */
	var discoveredPercentDiscarded = {};
	
	/**
	 * Mit dieser Funktion kann man die Anzahl der Spiele des gew�nschten Status und der gew�nschten Schwierigkeit auslesen
	 */
	this.getGames = function(difficulty, state) {
		
		// Ueber den state switchen
		switch(state) {
		
		// Es soll die Anzahl der insgesamt gestarteten Spiele zur�ckgegeben werden
		case this.state.start: {
			// Pr�fen ob f�r die gew�nschte Schwierigkeit ein Wert gesetzt wurde
			if(gamesTotal[difficulty]) {
				return gamesTotal[difficulty];
			}
			return 0;
		}
		break;
		
		// Es soll die Anzahl der gewonnenen Spiele zur�ckgegeben werden		
		case this.state.win: {
			// Pr�fen ob f�r die gew�nschte Schwierigkeit ein Wert gesetzt wurde
			if(gamesWon[difficulty]) {				
				return gamesWon[difficulty];
			}
			return 0;
		}
		break;
		
		// Es soll die Anzahl der verlorenen Spiele zur�ckgegeben werden
		case this.state.lose: {
			// Pr�fen ob f�r die gew�nschte Schwierigkeit ein Wert gesetzt wurde
			if(gamesLost[difficulty]) {
				return gamesLost[difficulty];
			}
			return 0;
		}
		break;
		
		// Es soll die Anzahl der abgebrochenen Spiele zur�ckgegeben werden
		case this.state.discard: {
			var winPlusLost = 0;
			// Pr�fen ob f�r die gew�nschte Schwierigkeit an den gewonnenen Spielen ein Wert gesetzt wurde
			if(gamesWon[difficulty]) {
				winPlusLost = winPlusLost + gamesWon[difficulty]; 
			}
			// Pr�fen ob f�r die gew�nschte Schwierigkeit an den verlorenen Spielen ein Wert gesetzt wurde
			if(gamesLost[difficulty]) {
				winPlusLost = winPlusLost + gamesLost[difficulty];
			}
			// Pr�fen ob f�r die gew�nschte Schwierigkeit an den insgesamt gestarteten Spielen ein Wert gesetzt wurde
			if(gamesTotal[difficulty]) {
				return gamesTotal[difficulty] - winPlusLost;
			}
			return 0;
		}
		break;
		
		// Es gibt keine weiteren Stati
		default: return -1;
		}
	};

	/**
	 * Mit dieser Funktion kann man die gespielte Zeit des gew�nschten Status und der gew�nschten Schwierigkeit auslesen
	 */
	this.getSeconds = function(difficulty, state) {
		
		// Ueber die state switchen
		switch(state) {
		
		// Die insgesamt gespielte Zeit in Sekunden der gew�nschten Schwierigkeit zur�ckgeben
		case this.state.start: {
			// Pruefen, ob Zeiten fuer die gewuenschte schwierigkeit gesetzt sind
			if(secondsTotal[difficulty]) {
				return secondsTotal[difficulty];
			}
			return 0;
		}
		break;
		
		// Die gespielte Zeit aller gewonnenen Spiele der gew�nschten Schwierigkeit zur�ckgeben
		case this.state.win: {
			// Pruefen, ob Zeiten fuer die gewuenschte schwierigkeit gesetzt sind
			if(secondsWon[difficulty]) {
				return secondsWon[difficulty];
			}
			return 0;
		}
		break;
		
		// Die gespielte Zeit aller verlorenen Spiele der gew�nschten Schwierikeit zur�ckgeben
		case this.state.lose: {
			if(secondsLost[difficulty]) {
				return secondsLost[difficulty];
			}
			return 0;
		}
		break;
		
		// Die gespielte Zeit aller abgebrochenen Spiele der gew�nschten Schwierigkeit zur�ckgeben
		case this.state.discard: {
			var wonPlusLost = 0;
			// Pr�fen ob f�r die gew�nschte Schwierigkeit an den gewonnenen Spielen ein Wert gesetzt wurde
			if(secondsWon[difficulty]) {
				wonPlusLost = wonPlusLost + secondsWon[difficulty]; 
			}
			// Pr�fen ob f�r die gew�nschte Schwierigkeit an den verlorenen Spielen ein Wert gesetzt wurde
			if(secondsLost[difficulty]) {
				wonPlusLost = wonPlusLost + secondsLost[difficulty];
			}
			// Pr�fen ob f�r die gew�nschte Schwierigkeit an den insgesamt gestarteten Spielen ein Wert gesetzt wurde
			if(secondsTotal[difficulty]) {
				return secondsTotal[difficulty] - wonPlusLost;
			}
			return 0;
		}
		break;
		
		// Weitere Stati gibt es nicht
		default: return -1;
		}
	};
	
	/**
	 * Diese Funktion gibt die Bestzeit der gewuenschten Schwierigkeit zur�ck
	 */
	this.getBestSeconds = function(difficulty) {
		if(secondsBest[difficulty]) {
			return secondsBest[difficulty];
		}
		return 0;
	};
	
	/**
	 * Diese Funktion gibt die % der freigelegten Zellen der gew�nschten Schwierigkeit und dem gew�nschten Status zur�ck
	 */
	this.getDiscoveredPercent = function(difficulty, state) {
		
		// Ueber den state switchen
		switch(state) {
		
		// Gibt die % der aufgedeckten Zellen aller gespielten Spiele der gew�nschten Schwierigkeit zur�ck
		case this.state.start: {
			var games = 0;
			var totalPercent = 0;
			// erst die abgebrochenen
			if(discoveredPercentDiscarded[difficulty]) {
				games = games + this.getGames(difficulty, this.state.discarded);
				totalPercent = totalPercent + (this.getGames(difficulty, this.state.discarded) * discoveredPercentDiscarded[difficulty]);
			}
			// dann sie verlorenen
			if(discoveredPercentLost[difficulty]) {
				games = games + this.getGames(difficulty, this.state.lose);
				totalPercent = totalPercent + (this.getGames(difficulty, this.state.lose) * discoveredPercentLost[difficulty]);
			}
			// dann die gewonnenen
			if(discoveredPercentWon[difficulty]) {
				games = games + this.getGames(difficulty, this.state.win);
				totalPercent = totalPercent + (this.getGames(difficulty, this.state.win) * discoveredPercentWon[difficulty]);
			}
			
			if(games > 0) {				
				return totalPercent / games;
			}
			return 0;
		}
		break;
		
		// Gibt die % der aufgedeckten Zellen aller gewonnenen Spiele der gew�nschten Schwierigkeit zur�ck
		case this.state.win: {
			if(discoveredPercentWon[difficulty]) {
				return discoveredPercentWon[difficulty];
			}
			return 0;
		}
		break;
		
		// Gibt die % der aufgedeckten Zellen aller verlorenen Spiele der gew�nschten Schwierigkeit zur�ck
		case this.state.lose: {
			if(discoveredPercentLost[difficulty]) {
				return discoveredPercentLost[difficulty];
			}
			return 0;
		}
		break;
		
		// Gibt die % der aufgedeckten Zellen aller abgebrochenen Spiele der gew�nschten Schwierigkeit zur�ck
		case this.state.discard: {
			if(discoveredPercentDiscarded[difficulty]) {
				return discoveredPercentDiscarded[difficulty];
			}
			return 0;
		}
		break;
		
		// Weitere Stati werden nicht unterst�tzt
		default: return -1;
		}
	};
	
	/**
	 * Mit dieser Funktion f�gt man der Statistik ein Spiel hinzu. �ber die Stati state.win, state.lose, state.start und state.discard
	 * gib man an, welcher Art die Informtion ist.
	 * 
	 * state.win = ein gewonnenes Spiel
	 * state.lose = ein verlorenes Spiel
	 * state.start = ein gestartetes Spiel
	 * state.discard = ein abgebrochenes Spiel
	 */
	this.addGame = function(difficulty, state) {
		// �ber den gew�nschten Status switchen
		switch(state) {
		
		// Handelt es sich um ein gewonnenes Spiel
		case this.state.win: {
			if(!gamesWon[difficulty]) {
				gamesWon[difficulty] = 0;
			}
			gamesWon[difficulty]++;
		}
		break;
			
		// Handelt es sich um ein verlorenes Spiel
		case this.state.lose: {
			if(!gamesLost[difficulty]) {
				gamesLost[difficulty] = 0;
			}
			gamesLost[difficulty]++;
		}break;
		
		// Handelt es sich um ein gestartetes Spiel
		case this.state.start: {
			if(!gamesTotal[difficulty]) {
				gamesTotal[difficulty] = 0;
			}
			gamesTotal[difficulty]++;
		}
		break;
		
		// Aktuell kann man die Anzahl der abgebrochenen Spiele aus den anderen Werten ableiten
		default: break;
		}
	};

	/**
	 * Diese Funktion f�gt den Statistiken die Anzahl von ben�tigten Sekunden hinzu, geordnet nach
	 * Schwierigkeit.
	 */
	this.addSeconds = function(difficulty, state, seconds) {
		
		// Die benoetigten Sekunden auf den gesamtzaehler der entsprechenden Schwierigkeit addieren 
		if(!secondsTotal[difficulty]) {
			secondsTotal[difficulty] = 0;
		}
		secondsTotal[difficulty] = secondsTotal[difficulty] + seconds;
		
		// ueber den gewuenschten Status switchen
		switch(state) {
		
		// Handelt es sich um ein gewonnenes Spiel muss geprueft werden, ob es sich um eine neue Bestzeit handelt
		case this.state.win: {
			// Die Sekunden der gewonnenen Spiele hinzuf�gen
			if(!secondsWon[difficulty]) {
				secondsWon[difficulty] = 0;
			} 
			secondsWon[difficulty] = secondsWon[difficulty] + seconds;
		
			// Auf neue Bestzeit pr�fen
			if(!secondsBest[difficulty]) {
				secondsBest[difficulty] = seconds;
			} else {
				if(secondsBest[difficulty] < seconds) {
					secondsBest[difficulty] = seconds;
				}
			}
		}
		break;
		
		// Wenn es sich um ein verlorenes Spiel handelt
		case this.state.lose: {
			// Die Sekunden den verlorenen Spielen hinzuf�gen
			if(!secondsLost[difficulty]) {
				secondsLost[difficulty] = 0;
			} 
			secondsLost[difficulty] = secondsLost[difficulty] + seconds;
		}
		break;
		
		// Die Zeiten f�r abgebrochene Spiele k�nen aktuell noch aus den gegebenen Statistiken abgeleitet werden
		
		default: break;
		}
	};
	
	/**
	 * Hier koennen Informationen �ber die durchschnittliche % Menge der aufgedeckten Zellen je Spiel hinzugefuegt
	 * werden. F�r gewonnene Spiele muss nichts gepflet werden, da der insgesamte Durchschnitt aus den 
	 * Statistiken abgeleitet werden kann
	 */
	this.addDiscovered = function(difficulty, state, discoveredPercent) {
		
		// Ueber den state switchen
		switch(state) {
		
		case this.state.win: {
			if(!discoveredPercentWon[difficulty]) {
				didiscoveredPercentWon[difficulty] = 0;
			}
			discoveredPercentWon[difficulty] = (discoveredPercentWon[difficulty] + discoveredPercent) / 2;
		}
		break;
		
		// Wenn es sich um ein verlorenes Spiel handelt, dann addiere die % auf den Zaehler der entsprechenden schwierigkeit
		case this.state.lose: {
			if(!discoveredPercentLost[difficulty]) {
				discoveredPercentLost[difficulty] = 0;
			}
			discoveredPercentLost[difficulty] = (discoveredPercentLost[difficulty] + discoveredPercent) / 2;
		}
		break;
		
		// Wenn es sich um ein abgebrochenes Spiel handelt, dann addiere die % auf den Zaehler der entsprechenden schwierigkeit
		case this.state.discard: {
			if(!discoveredPercentDiscarded[difficulty]) {
				discoveredPercentDiscarded[difficulty] = 0;
			}
			discoveredPercentDiscarded[difficulty] = (discoveredPercentDiscarded[difficulty] + discoveredPercent) / 2;
		}
		break;
		
		default: break;
		}
		
	};
	
}