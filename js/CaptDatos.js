// Clase para la lectura de los datos
// window.onload = function(){
// 	document.getElementById("tamm").focus();
// }
var _n = 0;
var _dir = false;
var _dir2 = false;

function esNumero(_dat){
	var _res = _dat.length > 0;
	if(_res){
		if((_dat[0].charCodeAt() == '-'.charCodeAt() || _dat[0].charCodeAt() == '+'.charCodeAt()) && _dat.length > 1){
			for(var i = 1; _res && i < _dat.length; i++){
				_res = ('0'.charCodeAt() <= _dat[i].charCodeAt() && _dat[i].charCodeAt() <= '9'.charCodeAt()) || _dat[i].charCodeAt() == '.'.charCodeAt();
			}
		} else if('0'.charCodeAt() <= _dat[0].charCodeAt() && _dat[0].charCodeAt() <= '9'.charCodeAt()){
			for(var i = 1; _res && i < _dat.length; i++){
				_res = ('0'.charCodeAt() <= _dat[i].charCodeAt() && _dat[i].charCodeAt() <= '9'.charCodeAt()) || _dat[i].charCodeAt() == '.'.charCodeAt();
			}
		} else {
			_res = false;
		}
	}
	return _res;
}
function verfKey(_dat, i, j){
	var _id_d = 'a'+i+'_'+j;
	var _element = document.getElementById(_id_d);
	var _length = _element.value.length;
	switch(_dat){
		case 37:
			if(0 < j && _element.selectionStart == 0 && (_element.selectionStart == _element.selectionEnd)){
				if((_dir && !_dir2) || _length == 0){
					document.getElementById("a"+i+"_"+(j-1)).focus();
					_dir2 = true;
				} else {
					_dir = true;
					_dir2 = false;
				}
			} else {
				if(j == 0 && _element.selectionStart == 0 && (_element.selectionStart == _element.selectionEnd) && i > 0){
					document.getElementById("a"+(i-1)+"_"+(_n-1)).focus();
				}
				_dir = false;
			}
			break;
		case 38:
			if(0 < i){
				document.getElementById("a"+(i-1)+"_"+j).focus();
			}
			break;
		case 39:
			if(j < _n-1 && _element.selectionStart == _length && (_element.selectionStart == _element.selectionEnd)){
				if((_dir && _dir2) || _length == 0){
					document.getElementById("a"+i+"_"+(j+1)).focus();
					_dir2 = false;
				} else {
					_dir = true;
					_dir2 = true;
				}
			} else {
				if(j == _n-1 && _element.selectionStart == _length && (_element.selectionStart == _element.selectionEnd) && i < _n-1){
					document.getElementById("a"+(i+1)+"_0").focus();
				}
				_dir = false;
			}
			break;
		case 40:
			if(i < _n-1){
				document.getElementById("a"+(i+1)+"_"+j).focus();
			}
			break;
		default:
			if(_element.selectionStart == 0 || _element.selectionStart == _length){
				_dir = true;
				_dir2 = (_element.selectionStart == _length);
			} else {
				_dir = false;
			}
			if(esNumero(_element.value)){
				_element.removeAttribute("style");
			} else {
				_element.setAttribute("style", "border: 2px solid #3c8397;");
			}
			break;
	}
}
function proceso(tam){
	var _html = '<div id="matriz" class="matriz"><p id="txt_mat">Llenado de la matriz '+tam+'<sub>*</sub>'+tam+':</p><br><table>';
	for(var i = 0; i < tam; i++){
		_html += '<tr>';
		for(var j = 0; j < tam; j++){
			_html += '<td><input onkeyup="verfKey(event.keyCode, '+i+', '+j+');" style="border: 2px solid #3c8397;" type="text" class="elm_ij" id="a'+i+'_'+j+'"></td>';
		}
		_html += '</tr>';
	}
	_html += '</table><br>';
	_html += '<div id="_resultados" class="bt_h"><div class="separa_a"><a class="acep_bt" onclick="aceptOPS('+tam+');">Aceptar</a></div><div class="separa_a"><a class="acep_bt" onclick="location.reload();">Cancelar</a></div></div>';
	_html += '</div>';
	document.getElementById("contenido").innerHTML = _html;
	document.getElementById("a0_0").focus();
	document.getElementById("contenedor_carga").style.display = "none";
}
function creaMat(tam){
	_n = tam;
	document.getElementById("contenedor_carga").removeAttribute("style");
	Concurrent.Thread.create(proceso, tam);
}
function cnclMat(){
	var delElem = document.getElementById("advtr");
	delElem.parentNode.removeChild(delElem);
}
function aceptarTam(){
	var tam_mat = document.getElementById("tamm").value;
	if(tam_mat > 0){
		if(tam_mat > 30){
			var _html = '<div id="advtr" class="advtr">'
				+'<div class="advtr_ctr"><div class="advtr_msg">'
				+'<h3>¡Advertencia! la matriz es muy grande.</h3>'
				+'<br>'
				+'<p>Es probable que la matriz <u>no se ajuste adecuadamente a la ventana</u> de su navegador y además, entre más grande sea la matriz y dependiendo de la capacidad del equipo, <u>es probable que su navegador web se alente</u> así como también su equipo.</p>'
				+'<div class="bts_am">'
				+'<div class="bts_am_sp"><a onclick="creaMat(' + tam_mat + ');">Continuar</a></div>'
				+'<div class="bts_am_sp"><a onclick="cnclMat();">Cancelar</a></div>'
				+'</div>'
				+'</div></div>'
				+'</div>';
			document.getElementById("contenido").innerHTML += _html;
		} else {
			creaMat(tam_mat);
		}
	} else {
		alert("Error");
	}
}
function aceptOPS(tam){
	var continuar = true;
	var _i = 0;
	var _j = 0;
	for(var i = 0; i < tam && continuar; i++){
		for(var j = 0; j < tam && continuar; j++){
			continuar = esNumero(document.getElementById("a"+i+"_"+j).value);
			if(!continuar){
				_i = i;
				_j = j;
			}
		}
	}
	if(continuar){
		document.getElementById("contenedor_carga").removeAttribute("style");
		Concurrent.Thread.create(realizaOPS, tam);
		//realizaOPS(tam);
	} else {
		alert("Todos los campos deben ser números.");
		document.getElementById("a"+_i+"_"+_j).focus();
	}
}
