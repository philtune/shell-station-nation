export default function(callback, limit) {
	var is_waiting = false;
	return function() {               // We return a throttled function
		if ( !is_waiting ) {                // If we're not waiting
			callback.call();          // Execute users function
			is_waiting = true;              // Prevent future invocations
			setTimeout(function() {   // After a period of time
				is_waiting = false;         // And allow future invocations
			}, limit);
		}
	}
};
