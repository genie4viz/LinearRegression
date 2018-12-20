function LinearRegression(data) {
    var X = [],
        y = [];

    // Get everything in array format
    for (var i = 0; i < data.length; i++) {
        X[i] = [];
        y[i] = data[i].y;
        for (var j = 0; j < data[0]['x'].length; j++) {
            X[i][j] = data[i]['x'][j];
        }
    }

    var t = matrixTranspose(X);
    var hatMatrix = matrixMultiply(matrixMultiply(matrixInvert(matrixMultiply(t, X)), t), y);
    return hatMatrix;
}


function RidgeRegression(data, lambda) {
    var X = data.x,
        y = data.y;


    var size = X[0].length,
        t = matrixTranspose(X),
        reg = matrixRegularizer(size, lambda)

    var inner = matrixAdd(matrixMultiply(t, X), reg);
    var hatMatrix = matrixMultiply(matrixMultiply(matrixInvert(inner), t), y);
    var dof = matrixTrace(matrixMultiply(X, matrixMultiply(matrixInvert(inner), t)));
    return [hatMatrix, dof];
}

function matrixTranspose(a) {
    //http://stackoverflow.com/questions/4492678/to-swap-rows-with-columns-of-matrix-in-javascript-or-jquery
    return Object.keys(a[0]).map(
        function (c) { return a.map(function (r) { return r[c]; }); }
    );
}

function matrixMultiply(m1, m2) {
    // http://tech.pro/tutorial/1527/matrix-multiplication-in-functional-javascript
    //
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function matrixInvert(M) {
    // source - http://blog.acipo.com/matrix-inversion-in-javascript/
    //
    if (M.length !== M[0].length) { return; }


    var i = 0, ii = 0, j = 0, dim = M.length, e = 0, t = 0;
    var I = [], C = [];
    for (i = 0; i < dim; i += 1) {
        I[I.length] = [];
        C[C.length] = [];
        for (j = 0; j < dim; j += 1) {

            if (i == j) { I[i][j] = 1; }
            else { I[i][j] = 0; }

            C[i][j] = M[i][j];
        }
    }

    for (i = 0; i < dim; i += 1) {
        e = C[i][i];

        if (e == 0) {
            for (ii = i + 1; ii < dim; ii += 1) {
                if (C[ii][i] != 0) {
                    for (j = 0; j < dim; j++) {
                        e = C[i][j];
                        C[i][j] = C[ii][j];
                        C[ii][j] = e;
                        e = I[i][j];
                        I[i][j] = I[ii][j];
                        I[ii][j] = e;
                    }

                    break;
                }
            }

            e = C[i][i];
            if (e == 0) { return }
        }

        for (j = 0; j < dim; j++) {
            C[i][j] = C[i][j] / e;
            I[i][j] = I[i][j] / e;
        }

        for (ii = 0; ii < dim; ii++) {
            if (ii == i) { continue; }
            e = C[ii][i];
            for (j = 0; j < dim; j++) {
                C[ii][j] -= e * C[i][j];
                I[ii][j] -= e * I[i][j];
            }
        }
    }
    return I;
}
function matrixRegularizer(size, lambda) {
    //Returns the identity matrix for a given size times lambda:

    // First generate a zero filled matrix
    var regularizer = [];
    var i = 0, j = 0;
    for (i = 0; i < size; i++) {
        regularizer[i] = [];
        for (j = 0; j < size; j++) {
            regularizer[i][j] = 0;
        }
    }

    //Then populate the diagonal with lambda
    for (i = 0; i < size; i++) {
        regularizer[i][i] = lambda;
    }

    return regularizer;
}
function matrixAdd(m1, m2) {
    //Adds two matrixes of the same size.  DOES NOT CHECK FOR THIS
    //uses matrix 1 as the new matrix

    for (var i = 0; i < m1.length; i++) {
        for (var j = 0; j < m1[0].length; j++) {
            m1[i][j] = m1[i][j] + m2[i][j];
        }
    };

    return m1;

}

function matrixTrace(m) {
    // Calculates the trace of the matrix for estimating degrees of freedom
    // Assumes matrix is square

    var i = 0,
        j = 0,
        n = m.length,
        trace = 0.0;

    for (i = 0; i < n; i++) {
        trace += m[i][i];
    }

    return trace;

}