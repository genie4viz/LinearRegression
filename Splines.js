function smoothingSplines(data, spline_locations){

	var i = 0,
		j = 0;

	var X = [],
		y = [],
		n = data.length,
		p = spline_locations.length;

	//Allocate Inital Matrix
	for (i = 0; i < n; i++){
		X[i] = [];
		for (j = 0; j < p + 4; j++){
			X[i][j] = 0;
		}
	}

	for (i = 0; i < n; i++){
		X[i][0] = 1;
		X[i][1] = data[i].x;
		X[i][2] = Math.pow(data[i].x, 2);
		X[i][3] = Math.pow(data[i].x, 3);
		y[i] = [data[i].y];

		//Now allocate knot locations

		for (j = 0; j < p; j++){
			X[i][j + 3] = Math.max(
							Math.pow(X[i][1] - spline_locations[j].x, 3), 0 
						   );
		}
	}

	return {'x': X, 'y': y};


}