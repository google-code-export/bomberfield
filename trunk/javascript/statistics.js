/**
 * TODO
 */
function Statistics() {
	/**
	 * Die Stati zu denen Informationen hinzugef�gt oder abgefragt werden k�nnen
	 */
	this.state = {"win":1, "lose":2, "start":3, "discarted":4};
	
	/**
	 * Hier werden die Anzahl der gesamzten Spiele festgehalten, aufgeschl�sselt nach ihrer Schwierigkeit
	 */
	var gamesTotal = {};
	
	/**
	 * TODO
	 */
	var gamesWon = {};
	
	/**
	 * TODO
	 */
	var gamesLost = {};

	/**
	 * TODO
	 */
	var secondsTotal = {};
	
	/**
	 * TODO
	 */
	var secondsBest = {};
	
	/**
	 * TODO
	 */
	var discoveredPercentLost = {};
	
	/**
	 * TODO
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
		
		default: break;
		}
	};

	/**
	 * TODO
	 */
	this.addSeconds = function(difficulty, state, seconds) {
		
		// Die ben�tigten Sekunden auf den gesamtz�hler der entsprechenden Schwierigkeit addieren 
		if(!secondsTotal[difficulty]) {
			secondsTotal[difficulty] = 0;
		}
		secondsTotal[difficulty] = secondsTotal[difficulty] + seconds;
		
		// �ber den gew�nschten Status switchen
		switch(state) {
		// Handelt es sich um ein gewonnenes Spiel muss gepr�ft werden, ob es sich um einen neue Bestzeit handelt
		case this.state.win: {
				if(!secondsBest[difficulty]) {
					secondsBest[difficulty] = seconds;
				} else {
					if(secondsBest[difficulty] < seconds) {
						secondsBest[difficulty] = seconds;
					}
				}
			}
			break;
		
		default: break;
		}
	};
	
	/**
	 * TODO
	 */
	this.addDiscovered = function(difficulty, state, discoveredPercent) {
		
		// Wenn es sich um ein verlorenes Spiel handelt, dann addiere die % auf den Z�hler der entsprechenden schwierigkeit
		if(state === this.state.lose) {
			if(!discoveredPercentLost[difficulty]) {
				discoveredPercentLost[difficulty] = 0;
			}
			discoveredPercentLost[difficulty] = discoveredPercentLost[difficulty] + discoveredPercent;
		}
		
		// TODO evtl. discarted % auch speichern
	};
}