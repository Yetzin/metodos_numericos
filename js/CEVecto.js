// Código para los algoritmos de Ortogonalización, QR y Eigenvalores
var _tam;
var _matriz_original;
var _continuar = true;
var _cero = false;
var _m_Q;
var _vect;
var _msg_result;
var con = 0;

function trasp(A){
	var A_t = new Array(_tam);
	for(var i = 0; i < _tam; i++){
		A_t[i] = new Array(_tam);
		for(var j = 0; j < _tam; j++){
			A_t[i][j] = A[j][i];
		}
	}
	return A_t;
}
function productoPunto(v1, v2){
	var _res = 0;
	for(var i = 0; i < _tam; i++){
		_res += v1[i] * v2[i];
	}
	return _res;
}
function Norma(_V){
	var _res = 0;
	for(var i = 0; i < _tam; i++){
		_res += _V[i] * _V[i];
	}
	return Math.sqrt(_res);
}
function Proy(_V, _U){
	var _res = _U;
	if(productoPunto(_U, _U).toFixed(4)*1 == 0){
		var pP = 0;
		for(var i = 0; i < _tam; i++){
			_res[i] *= pP;
		}
	} else {
		var pP = (productoPunto(_V, _U)/productoPunto(_U, _U));
		for(var i = 0; i < _tam; i++){
			_res[i] *= pP;
		}
	}
	return _res;
}
function restaV(v1, v2){
	var _res = new Array(_tam);
	for(var i = 0; i < _tam; i++){
		_res[i] = v1[i] - v2[i];
	}
	return _res;
}
var v0 = new Array(3);
v0[0] = 0;
v0[1] = 0;
v0[2] = 0;
function ortonormaliza(vect, k){
	var res = new Array();
	res = vect;
	for(var i = 0; i < k; i++){
		res = restaV(res, Proy(vect, _m_Q[i]));
	}
	/*if(k > 0){
		res = vect;
		for(var i = 0; i < k; i++){
			res = restaV(res, Proy(trasp(_matriz_original)[i], vect));
		}
	} else {
		res = vect;
	}*/
	return res;
}
/*function orthonormaliza(matrz, k){
	var column = new Array(k);
	for(var l1 = 0; l1 < k; l1++){
		for(var l2 = 0; l2 < k; l2++){
			column[l2] = matrz[l2][l1];
		}
		for(var l2 = 0; l2 < l1; l2++){
		}
		for(var l3 = 0; l3 < k; l3++){
			matrz[l3][l1] = column[l3];
		}
	}
	return matrz;
}*/
function normaliza(vect){
	var res = new Array(_tam);
	var _norm = Norma(vect);
	for(var i = 0; i < _tam; i++){
		if(_norm.toFixed(4)*1 == 0){
			//_continuar = false;
			//_cero = true;
			//_msg_result = 'Norm';
			res[i] = 0;
			//alert("Divisor cero, norm.{"+con+"}");
		} else {
			//console.log(_norm.toFixed(11)*1);
			res[i] = vect[i]/_norm;
		}
	}
	return res;
}
function multMat(matA, matB, tam){
	var resul = new Array(tam);
	for(var i = 0; i < tam; i++){
		resul[i] = new Array(tam);
		for(var j = 0; j < tam; j++){
			resul[i][j] = 0;
			for(var k = 0; k < tam; k++){
				resul[i][j] += ((matA[i][k].toFixed(11))*(matB[k][j].toFixed(11))).toFixed(11)*1;
			}
		}
	}
	return resul;
}
function triangularSup(matEv, tam){
	var _result = true;
	for(var i = 0; i < tam; i++){
		for(var j = 0; j < i; j++){
			if((matEv[i][j].toFixed(6)*1) != 0){
				_result = false;
			}
		}
	}
	return _result;
}
function triangularInf(matEv, tam){
	var _result = true;
	for(var i = 0; i < tam; i++){
		for(var j = (i+1); j < tam; j++){
			if((matEv[i][j].toFixed(6)*1) != 0){
				_result = false;
			}
		}
	}
	return _result;
}
function realizaOPS(tam){
	_msg_result = '';
	con = 0;
	_tam = tam;
	_matriz_original = new Array(tam);
	_m_Q = new Array(tam);
	var mR = new Array(tam);
	for(var i = 0; i < tam; i++){
		_matriz_original[i] = new Array(tam);
		for(var j = 0; j < tam; j++){
			_matriz_original[i][j] = parseFloat(document.getElementById("a"+i+"_"+j).value).toFixed(11)*1;
		}
	}
	while(!triangularSup(_matriz_original, tam) && !triangularInf(_matriz_original, tam)/* && _continuar*/ && con < 20000){
		if(con == 0){
			_msg_result += "<br><br><br><br>Aplicando Gram-Schmidt con A<sub>0</sub>:<br><br>";
		}
		for(var i = 0; i < tam/* && _continuar*/; i++){
			_m_Q[i] = ortonormaliza(trasp(_matriz_original)[i], i);
			if(con == 0){
				_msg_result += (i > 0? '<p style="display: inline-block; padding: 5px;">,</p>' : '') + '<table>';
				for(var vs = 0; vs < tam; vs++){
					_msg_result += '<tr><td style="width: 70px;"><input type="text" class="elm_ij" value="' + (_m_Q[i][vs].toFixed(6)*1) + '"></td></tr>';
				}
				_msg_result += '</table>';
			}
		}
		if(con == 0){
			_msg_result += '<br><br><br><p>La matriz Q<sub>0</sub> es:</p><br> <div style="display: inline-block; height: max-content; text-align: center; vertical-align: middle;"><div style="display: table; width: 100%; height: 100%;"><div style="display: table-cell; vertical-align: middle;"><div style="vertical-align: middle; display: inline;">Q<sub>0</sub> = </div><table style="vertical-align: middle;">';
		}

		for(var i = 0; i < tam/* && _continuar*/; i++){
			_m_Q[i] = normaliza(_m_Q[i], i);
		}
		_m_Q = trasp(_m_Q);
		if(con == 0){
			for(var vs = 0; vs < tam; vs++){
				_msg_result += '<tr>';
				for(var vs2 = 0; vs2 < tam; vs2++){
					_msg_result += '<td style="width: 70px;"><input type="text" class="elm_ij" value="' + (_m_Q[vs][vs2].toFixed(6)*1) + '"></td>';
				}
				_msg_result += '</tr>';
			}
		}
		mR = multMat(trasp(_m_Q),_matriz_original,tam);
		if(con == 0){
			_msg_result += '</table></div></div></div> <br><br><br><p>La matriz R<sub>0</sub> es:</p><br> <div style="display: inline-block; height: max-content; text-align: center; vertical-align: middle;"><div style="display: table; width: 100%; height: 100%;"><div style="display: table-cell; vertical-align: middle;"><div style="vertical-align: middle; display: inline;">R<sub>0</sub> = </div><table style="vertical-align: middle;">';
			//_msg_result += mR;
			for(var vs = 0; vs < tam; vs++){
				_msg_result += '<tr>';
				for(var vs2 = 0; vs2 < tam; vs2++){
					_msg_result += '<td style="width: 70px;"><input type="text" class="elm_ij" value="' + (mR[vs][vs2].toFixed(6)*1) + '"></td>';
				}
				_msg_result += '</tr>';
			}
			_msg_result += '</table></div></div></div>';
		}

		_matriz_original = multMat(mR, _m_Q, tam);
		con++;
	}

	//	Fin
	_msg_result += '<br><br><br><p>La matriz A<sub>i+1</sub> resultante es:</p><br> <div style="display: inline-block; height: max-content; text-align: center; vertical-align: middle;"><div style="display: table; width: 100%; height: 100%;"><div style="display: table-cell; vertical-align: middle;"><div style="vertical-align: middle; display: inline;">A<sub>i+1</sub> = </div><table style="vertical-align: middle;">';
	//for(var i = 0; i < tam; i++){
	//	_msg_result += _matriz_original[i];
	//}
	for(var vs = 0; vs < tam; vs++){
		_msg_result += '<tr>';
		for(var vs2 = 0; vs2 < tam; vs2++){
			_msg_result += '<td style="width: 70px;"><input type="text" class="elm_ij" value="' + (_matriz_original[vs][vs2].toFixed(6)*1) + '"></td>';
		}
		_msg_result += '</tr>';
	}
	_msg_result += '</table></div></div></div><br><br><br>';
	var txt_ei = '<br><br><p>Las iteraciones fueron <u><b>' + con + '</b></u> y los eigenvalores son:</p> <div style="display: inline-block; height: max-content; text-align: center; vertical-align: middle;"><div style="display: table; width: 100%; height: 100%;"><div style="display: table-cell; vertical-align: middle;"><table style="vertical-align: middle;"><tr>';
	for(var vs = 0; vs < tam; vs++){
		txt_ei += '<td style="width: 70px;"><input type="text" class="elm_ij" value="' + (_matriz_original[vs][vs].toFixed(6)*1) + '"></td>';
	}
	txt_ei += '</tr></table></div></div></div>';
	_msg_result += (_cero? 'Ocurrió una división por cero.<br>' : '');// + txt_ei;
	document.getElementById("matriz").setAttribute("style", "min-width: 700px;");
	document.getElementById("txt_mat").innerHTML = 'Eigenvalores de la matriz '+tam+'<sub>*</sub>'+tam+':';
	document.getElementById("_resultados").innerHTML = (txt_ei + _msg_result);
	document.getElementById("contenedor_carga").style.display = "none";
}
