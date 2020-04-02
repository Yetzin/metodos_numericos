var _grado = '';
var _grado_real;
var _polinomio = new Array();
var _polinomio_derivado = new Array();
var _0 = '0'.charCodeAt();
var _9 = '9'.charCodeAt();
var canvas;
var context;
var delta = new Object();
var arrastrar = false;
var _inicio_grafica_c;
var _fin_grafica_c;
var _X = 0;
var _Y = 0;
var _step_grafica_c = 10;
var _raices = new Array();
var _f_r;

//  Funciones
function inicializaVars(){
    _grado = '';
    _grado_real = null;
    _polinomio = new Array();
    _polinomio_derivado = new Array();
    canvas = null;
    context = null;
    delta = new Object();
    arrastrar = false;
    _inicio_grafica_c = null;
    _fin_grafica_c = null;
    _X = 0;
    _Y = 0;
    _step_grafica_c = 10;
    _raices = new Array();
    _f_r = null;
}
//  Se valida que la entrada str represente un número
function validaGrado(str){
    let resultado = true;
    if(str.length > 0){
        for(let i = 0; i < str.length; i++){
            if(str[i].charCodeAt() < _0 || _9 < str[i].charCodeAt()){
                resultado = false;
            }
        }
    } else {
        resultado = false;
    }
    return resultado;
}
function validaInput(str){
    let resultado = true;
    if(str.length > 0){
        for(let i = 0; i < str.length; i++){
            if(str[i].charCodeAt() < _0 || _9 < str[i].charCodeAt()){
                if(str[i].charCodeAt() != '-'.charCodeAt() && str[i].charCodeAt() != '+'.charCodeAt() && str[i].charCodeAt() != '.'.charCodeAt()){
                    resultado = false;
                }
            }
        }
    } else {
        resultado = false;
    }
    return resultado;
}
function derivar(_grado_polinomio, _coeficientes_polinomio){
    let _derivado = new Array();
    if(_grado_polinomio > 0){
        for(let i = _grado_polinomio; i > 0; i--){
            _derivado[i-1] = _coeficientes_polinomio[i] * i;
        }
    } else {
        _derivado[0] = 0;
    }
    return _derivado;
}

function opResult(_grado_polinomio, _coeficientes_polinomio){
    //  Variables de control para mostrar el polinomio.
    let _pol_res = '';                                                              //  Aquí se guarda el resultado
    let _coef_inicio = _coeficientes_polinomio[_grado_polinomio] != 0;              //  Verifica el coeficiente del primer término
    let _verificar_grado = _coeficientes_polinomio[_grado_polinomio] == 0;          //  Verifica si el grado del polinomio es correcto o debe ser cambiado
    _grado_real = _grado_polinomio;                                                 //  Guarda el verdadero valor del grado del polinomio
    //_f_r = _grado_real;

    //  Primer término del polinomio.
    if(_coef_inicio && _grado_polinomio > 0){
        _pol_res += (_coeficientes_polinomio[_grado_polinomio] < 0? ' - ' : '');    //  Se encarga de poner un signo menos en caso de que sea negativo el primer número
        _pol_res += ((Math.abs(_coeficientes_polinomio[_grado_polinomio]) != 1? Math.abs(_coeficientes_polinomio[_grado_polinomio]) : '') + (_grado_polinomio != 1? 'x<sup>' + _grado_polinomio + '</sup>' : 'x') + (_coeficientes_polinomio[_grado_polinomio - 1] > 0? ' + ' : (_coeficientes_polinomio[_grado_polinomio - 1] < 0? ' - ' : '')));
    }

    //  Los términos después del primero y antes del último.
    for(let i = _grado_polinomio - 1; i > 0; i--){
        if(_coeficientes_polinomio[i] != 0){
            if(_verificar_grado){
                _grado_real = i;
                _verificar_grado = _coeficientes_polinomio[i] == 0;
            }
            _pol_res += (Math.abs(_coeficientes_polinomio[i]) != 1? Math.abs(_coeficientes_polinomio[i]) : '') + (i != 1? 'x<sup>' + i + '</sup>' : 'x') + (_coeficientes_polinomio[i - 1] > 0? ' + ' : (_coeficientes_polinomio[i - 1] < 0? ' - ' : ''));
        } else {
            if(_coeficientes_polinomio[i - 1] != 0 && _pol_res.length > 0){
                _pol_res += (_coeficientes_polinomio[i-1] > 0? ' + ' : ' - ');
            }
            if(_coeficientes_polinomio[i - 1] != 0 && _pol_res.length == 0 && (i - 1) != 0){
                _pol_res += (_coeficientes_polinomio[i-1] < 0? ' - ' : '');
            }
        }
    }

    //  El último término del polinomio.
    if(_pol_res.length > 0){
        if(_coeficientes_polinomio[0] != 0){
            _pol_res += Math.abs(_coeficientes_polinomio[0]);
        }
    } else {
        _pol_res = (_coeficientes_polinomio[0] < 0? ' - ' : '') + Math.abs(_coeficientes_polinomio[0]);
        _grado_real = 0;
    }
    return _pol_res;
}

//  Funciones para obtener valores de los polinomios evaluados en x, así como su derivada
function f_de(x){
    let _resultado = 0;
    let _x;
    for(let i = _grado; i > 0; i--){
        _x = x;
        for(let j = i; j > 1; j--){
            _x *= x;
        }
        _resultado += _polinomio[i] * _x;
    }
    _resultado += _polinomio[0];
    return _resultado;
}
function f_prima_de(x){
    let _resultado = 0;
    let _x;
    for(let i = _grado - 1; i > 0; i--){
        _x = x;
        for(let j = i; j > 1; j--){
            _x *= x;
        }
        _resultado += _polinomio_derivado[i] * _x;
    }
    _resultado += _polinomio_derivado[0];
    return _resultado;
}

//  Esta función sirve para obtener las cotas mediante división sintética
function obtenerIntervalo(_grad, _pol){
    let _intervalo = new Array(2);                                                  //  En esta variable se guardan las cotas
    let _grad_control = 0;                                                          //  En caso de requerir un polinomio a partir de una división sintética
    let _pol_control = new Array();                                                 //  En caso de requerirse
    let _div_coeficientes = new Array();                                            //  Guarda los valores necesarios para la división sintética
    let _div_length = _grad;
    let _valid = false;
    let _recorrido = true;
    let _cota = _pol[0];
    let _d_dire;
    let _cambio = false;
    let direccion = 0;
    _intervalo[0] = null;
    _intervalo[1] = null;

    while(!_valid && _div_length > 0){
        if(_pol[_div_length] != 0){
            _valid = true;
        } else {
            _div_length--;
        }
    }

    for(let i = _div_length; i >= 0; i--){
        _div_coeficientes[i] = _pol[i];
    }
    if(_div_coeficientes[_div_length] < 0){
        for(let i = _div_length; i >= 0; i--){
            _div_coeficientes[i] = -(_div_coeficientes[i]);
        }
        _cambio = true;
    }
    while(_recorrido && (_intervalo[0] == null || _intervalo[1] == null)){
        if(direccion > 0){
            _cota = _cota + 1;
        } else if(direccion < 0){
            _cota = _cota - 1;
        }
        _pol_control[_div_length-1] = _div_coeficientes[_div_length];
        if(_pol_control[_div_length-1] < 0){                                        //  Primer coeficiente
            _d_dire = 1;
        } else {
            _d_dire = -1;
        }
        for(let n = _div_length; n > 1; n--){
            _pol_control[n-2] = _pol_control[n-1]*_cota + _div_coeficientes[n-1];
            if(_pol_control[n-2] < 0 && _d_dire < 0){                               //  Coeficientes intermedios
                _d_dire = 1;
            }
        }
        if((_pol_control[0]*_cota + _div_coeficientes[0]) < 0 && _d_dire < 0){      //  Último coeficiente
            _d_dire = 1;
        }

        let n_coef = "";
        for(let i = _div_length - 1; i >= 0; i--){
            n_coef += _pol_control[i] + " ";
        }

        if(direccion == 0){
            direccion = _d_dire;
        }

        //	Aún no estoy seguro de que esta validación sea la más adecuada y se contemplan futuros cambios
        if((_pol_control[0]*_cota + _div_coeficientes[0]) == 0 && direccion < 0){	//	Es posible que funcione también _d_dire en vez de direccion
            _d_dire = -(_d_dire);
        }

        if((_d_dire < 0 && direccion > 0) || (_d_dire > 0 && direccion < 0)){
            if(_intervalo[1] == null){
                if(direccion < 0){
                    _intervalo[1] = _cota + 1;
                } else {
                    _intervalo[1] = _cota;
                }
                _cambio = false;
                for(let i = _div_length; i > 0; i--){
                    _div_coeficientes[i] = (i%2==0? _pol[i] : -(_pol[i]));
                }
                _div_coeficientes[0] = _pol[0];
                if(_div_coeficientes[_div_length] < 0){
                    for(let i = _div_length; i >= 0; i--){
                        _div_coeficientes[i] = -(_div_coeficientes[i]);
                    }
                    _cambio = true;
                }
                _cota = _div_coeficientes[0];
                direccion = 0;
            } else if(_intervalo[0] == null){
                if(direccion < 0){
                    _intervalo[0] = -(_cota + 1);
                } else {
                    _intervalo[0] = -(_cota);
                }
                _recorrido = false;
            }
        }
    }

    _intervalo[0] = Math.round(_intervalo[0]);
    _intervalo[1] = Math.round(_intervalo[1]);

    if(_intervalo[0] > _intervalo[1]){
        let _comdn = _intervalo[0];
        _intervalo[1] = _intervalo[0];
        _intervalo[0] = _comdn;
    }
    if(_intervalo[0] == _intervalo[1]){
        _intervalo[0] -= 1;
        _intervalo[1] += 1;
    }

    console.log("La cota menor es: " + _intervalo[0]);
    console.log("La cota mayor es: " + _intervalo[1]);

    return _intervalo;
}

function getX(dato, size_graf, _intervalo){
    return ((size_graf/(_intervalo[1] - _intervalo[0])) * (dato - _intervalo[0]));
}
function getY(dato, size_graf, _intervalo){
    return (size_graf/2 - (dato*size_graf/(_intervalo[1] - _intervalo[0])));
}

function minimizaGraf(){
    _inicio_grafica_c -= 1/4;
    _fin_grafica_c += 1/4;
    //if(_step_grafica_c > 10){
    //    _step_grafica_c--;
    //}
    generaGrafica(_inicio_grafica_c, _fin_grafica_c, _step_grafica_c);
}
function maximizaGraf(){
    if(_fin_grafica_c - _inicio_grafica_c > 1){
        _inicio_grafica_c += 1/4;
        _fin_grafica_c -= 1/4;
        //if(_step_grafica_c < 30){
        //    _step_grafica_c++;
        //}
        generaGrafica(_inicio_grafica_c, _fin_grafica_c, _step_grafica_c);
    }
}

function oMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {x: Math.round(evt.clientX - rect.left), y: Math.round(evt.clientY - rect.top)};
}

function siguienteX(_x_, _y_, _y_prima){
    let _resultd;
    if(_y_prima != 0){
        _resultd = _x_ - _y_/_y_prima;
    } else {
        _resultd = _x_;
    }
    return _resultd;
}
function obtenerRaices(_ini_i, _fin_i){
    _f_r = 0;
    _ini_i--;
    _fin_i++;
    let _new_x = _ini_i;
    let _pos = f_de(_new_x) > 0;
    for(let i = _ini_i; i <= _fin_i && _f_r < _grado_real + 1; i+=0.1){
        /*if(f_de(i) == 0){
            _raices[_f_r] = i.toFixed(12);
            _raices[_f_r] *= 1;
            _f_r++;
            i+=0.1;
        } else*/
        if((_pos && f_de(i) < 0) || (!_pos && f_de(i) > 0)){
            //if(f_prima_de(i+0.1)*f_prima_de(i) > 0){
                _new_x = i;
                for(let j = 0; j < 20; j++){
                    _new_x = siguienteX(_new_x.toFixed(12)*1, f_de(_new_x.toFixed(12)*1), f_prima_de(_new_x.toFixed(12)*1));
                }
                if(f_de(_new_x).toFixed(12) == 0){
                    console.log(1 + " _ " + i.toFixed(1)*1 + " _ " + _new_x);
                    _raices[_f_r] = _new_x.toFixed(12)*1;
                    _f_r++;
                }
            /*} else {
                console.log("Error..." + i);
            }*/
        } else if(f_prima_de(i)*f_prima_de(i+0.1) < 0 || (f_de(i) == 0)){
            _new_x = i;
            let _aux = siguienteX(_new_x, f_de(_new_x), f_prima_de(_new_x));
            if(i-0.1 < _aux && _aux < i+0.1){
                for(let j = 0; j < 100; j++){
                    _new_x = siguienteX(_new_x, f_de(_new_x), f_prima_de(_new_x));
                }
                if(f_de(_new_x).toFixed(12) == 0 && (i-0.1 < _new_x && _new_x < i+0.1)){
                    console.log(2 + " _ " + i + " _ " + _new_x);
                    _raices[_f_r] = _new_x.toFixed(12)*1;
                    _f_r++;
                }
            }

            i+=0.1;
            _new_x = i;
            _aux = siguienteX(_new_x.toFixed(12)*1, f_de(_new_x.toFixed(12)*1), f_prima_de(_new_x.toFixed(12)*1));
            if(i-0.1 < _aux && _aux < i+0.1){
                for(let j = 0; j < 100; j++){
                    _new_x = siguienteX(_new_x, f_de(_new_x), f_prima_de(_new_x));
                }
                if(f_de(_new_x).toFixed(12) == 0 && (i-0.1 < _new_x && _new_x < i+0.1)){
                    console.log(2 + " _ " + i + " _ " + _new_x);
                    _raices[_f_r] = _new_x.toFixed(12)*1;
                    _f_r++;
                }
            }
        }
        _pos = f_de(i) > 0;
    }
    console.log(_raices);
}

function generaGrafica(_inicio, _fin, _step){
    let _intervalo = new Array();
    canvas = document.querySelector('canvas');
    let _dim_x = document.getElementById('funcion_pol').offsetWidth;
    let _dim_y = document.getElementById('funcion_pol').offsetHeight;
    canvas.width = _dim_x;
    canvas.height = _dim_y;
    _intervalo[0] = _inicio - (_fin - _inicio)*_X/_dim_x;
    _intervalo[1] = _fin - (_fin - _inicio)*_X/_dim_x;								//	El eje y está invertido
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    let _x = _intervalo[0]*_step - 1;
    let _lim_y;
    let _lim_x;
    let _intrvl_l = 1;
    let _cord_cx;
    let _cord_cy;
    let _size_tg = 15;

    while((_intrvl_l*20) < (_intervalo[1] - _intervalo[0])*_step){
        _intrvl_l*=10;
    }
    _intrvl_l/=10;
    _size_tg = ((_size_tg*_intrvl_l*_step)/(_intervalo[1] - _intervalo[0]));

    //	Dibujo del eje x
    context.beginPath();
    context.moveTo(0, (_dim_y/2) + _Y);
    context.lineTo(_dim_x,(_dim_y/2) + _Y);
    context.strokeStyle = "#fff";
    context.lineWidth = 1;
    context.stroke();
    for(let i = _intrvl_l; i < (_intervalo[1]); i+=_intrvl_l){
        _cord_cx = getX(i, _dim_x, _intervalo);
        _cord_cy = getY((_intrvl_l/5), _dim_y, _intervalo) + _Y;
        context.beginPath();
        context.moveTo(_cord_cx, getY(-(_intrvl_l/5), _dim_y, _intervalo) + _Y);
        context.lineTo(_cord_cx, _cord_cy);
        context.strokeStyle = "#fff";
        context.lineWidth = 1;
        //context.stroke();

        //context.beginPath();
        context.font = _size_tg + "px Arial";
        context.fillStyle = "#fff";
        context.fillText(i.toFixed(1)*1, _cord_cx, _cord_cy);
        context.stroke();
    }
    for(let i = -_intrvl_l; i > (_intervalo[0]); i-=_intrvl_l){
        _cord_cx = getX(i, _dim_x, _intervalo);
        _cord_cy = getY((_intrvl_l/5), _dim_y, _intervalo) + _Y;
        context.beginPath();
        context.moveTo(_cord_cx, getY(-(_intrvl_l/5), _dim_y, _intervalo) + _Y);
        context.lineTo(_cord_cx, _cord_cy);
        context.strokeStyle = "#fff";
        context.lineWidth = 1;
        //context.stroke();

        //context.beginPath();
        context.font = _size_tg + "px Arial";
        context.fillStyle = "#fff";
        context.fillText(i.toFixed(1)*1, _cord_cx, _cord_cy);
        context.stroke();
    }

    //	Dibujo del eje y
    context.beginPath();
    context.moveTo(((-_intervalo[0])*_dim_x/(_intervalo[1] - _intervalo[0])), 0);
    context.lineTo(((-_intervalo[0])*_dim_x/(_intervalo[1] - _intervalo[0])), _dim_y);
    context.strokeStyle = "#fff";
    context.lineWidth = 1;
    context.stroke();
    for(let i = _intrvl_l; (getY(i, _dim_y, _intervalo) + _Y) > 0; i+=_intrvl_l){
        _cord_cx = getX((_intrvl_l/5), _dim_x, _intervalo);
        _cord_cy = getY(i, _dim_y, _intervalo) + _Y;
        context.beginPath();
        context.moveTo(getX(-(_intrvl_l/5), _dim_x, _intervalo), _cord_cy);
        context.lineTo(_cord_cx, _cord_cy);
        context.strokeStyle = "#fff";
        context.lineWidth = 1;
        //context.stroke();

        //context.beginPath();
        context.font = _size_tg + "px Arial";
        context.fillStyle = "#fff";
        context.fillText(i.toFixed(1)*1, _cord_cx, _cord_cy);
        context.stroke();
    }
    for(let i = -_intrvl_l; (getY(i, _dim_y, _intervalo) + _Y) < _dim_y; i-=_intrvl_l){
        _cord_cx = getX((_intrvl_l/5), _dim_x, _intervalo);
        _cord_cy = getY(i, _dim_y, _intervalo) + _Y;
        context.beginPath();
        context.moveTo(getX(-(_intrvl_l/5), _dim_x, _intervalo), _cord_cy);
        context.lineTo(_cord_cx, _cord_cy);
        context.strokeStyle = "#fff";
        context.lineWidth = 1;
        //context.stroke();

        //context.beginPath();
        context.font = _size_tg + "px Arial";
        context.fillStyle = "#fff";
        context.fillText(i.toFixed(1)*1, _cord_cx, _cord_cy);
        context.stroke();
    }

    //	Curva o recta
    context.beginPath();
    context.moveTo(getX(_x/_step, _dim_x, _intervalo), getY(f_de(_x/_step), _dim_y, _intervalo) + _Y);
    _x++;
    while(_x <= _intervalo[1]*_step + 1){
        _lim_y = getY(f_de(_x/_step), _dim_y, _intervalo) + _Y;
        _lim_x = getX(_x/_step, _dim_x, _intervalo);
        //if(_lim_y > 0 && _lim_y < _dim_y){
            if(((f_prima_de(_x/_step) / (f_prima_de((_x-1)/_step)==0? 0.0001 : f_prima_de((_x-1)/_step))) < 0.9)
            || ((f_prima_de(_x/_step) / (f_prima_de((_x-1)/_step)==0? 0.0001 : f_prima_de((_x-1)/_step))) > 1.4)){
                //console.log("Suavizando gráfica...");
                for(let i = 0; i < 10; i++){
                    context.lineTo(getX(((_x + i*0.1)/_step), _dim_x, _intervalo), (getY(f_de((_x + i*0.1)/_step), _dim_y, _intervalo) + _Y));
                }
            } else {
                context.lineTo(_lim_x, _lim_y);
            }
        //}
        _x++;
    }
    context.strokeStyle = "#9e62e1";
    context.lineWidth = 2;
    context.stroke();
}

//  En cuanto se obtenga el grado del polinomio el texto de la vista se cambiará
function gradoPol(){
    _grado = document.getElementById('grado_pol').value;
    if(_grado.length == 0){
        alert("Es necesario indicar el grado del polinomio.");
    } else {
        if(validaGrado("" + _grado) && _grado >= 0){
            let _html = '<p id="bvnda">Ingrese el coeficiente a<sub>'+ _grado +'</sub></p>'+
            '<input class="coeficiente_pol" type="text" name="coeficiente_pol" id="coeficiente_pol" value="" placeholder="Coeficiente '+ _grado +'" onkeyup="if(event.keyCode == 13){ coeficientePol('+ _grado +'); }" />'+
            '<br /><br />'+
            '<div id="pol_butt_cont">'+
            '<input type="button" class="aceptar" name="pol_butt" id="pol_butt" value="Continuar" onclick="coeficientePol('+ _grado +');" />'+
            '</div>';
            document.getElementById('polinomio_in').innerHTML = _html;
            document.getElementById('coeficiente_pol').focus();
            posicion = _grado - 1;
        } else {
            alert("El " + document.getElementById('grado_pol').value + " no es un número válido.");
        }
    }
}
function muestraPuntos(){
    // $(".puntos_grafica").css("display","inline-block");
    // $("#dat_butt").attr("value","Ocultar tabla");
    // $("#dat_butt").attr("onclick","ocultaPuntos();");
    document.querySelector('.puntos_grafica').setAttribute('style', 'display: inline-block;');
    document.querySelector('#dat_butt').innerHTML = 'Ocultar tabla -';
    document.querySelector('#dat_butt').setAttribute('onclick', 'ocultaPuntos();');
}
function ocultaPuntos(){
    // $(".puntos_grafica").css("display","");
    // $("#dat_butt").attr("value","Mostrar tabla");
    // $("#dat_butt").attr("onclick","muestraPuntos();");
    document.querySelector('.puntos_grafica').setAttribute('style', '');
    document.querySelector('#dat_butt').innerHTML = 'Mostrar tabla +';
    document.querySelector('#dat_butt').setAttribute('onclick', 'muestraPuntos();');
}
function realizaOps(){
    //  Para finalizar se realizan las operaciones correspondientes
    let _pol_res = opResult(_grado, _polinomio);                                    //  Se obtiene un texto para representar un polinomio a partir del grado y el array de coeficientes
    let _pol_res_dev = '';                                                          //  Esta variable sirve para guardar el texto del polinomio derivado
    let _conservar_grado = _grado_real;                                             //  Se guarda el valor del polinomio antes de derivarlo devido que es posible que se cambie este valor al obtener el texto del polinomio derivado
    let _html = '<h2>El grado es: '+ _grado_real +'</h2> <h3>El polinomio es:</h3> <h4>P<sub>'+ _grado_real +'</sub>(x) = ' + _pol_res + '</h4>';
    let _raices_intervalo_pol = obtenerIntervalo(_conservar_grado, _polinomio);     //  Aquí se guardan el intervalo donde se encuentre o encuentren las raíces
    _polinomio_derivado = derivar(_grado, _polinomio);                              //  Se obtiene la derivada del polinomio en otro array
    _pol_res_dev = opResult((_grado_real - 1),_polinomio_derivado);                 //  Se obtiene el texto del polinomio
    _html += '<h3>El polinomio derivado es:</h3> <h4>P\'<sub>'+ (_conservar_grado) +'</sub>(x) = ' + _pol_res_dev + '</h4>';

    _html += '<br><p>La gráfica del polinomio es:</p><div class="cont_canvas"><div id="funcion_pol"><div class="botones_graf"> <div type="button" name="dat_butt_t" id="dat_butt_t" value="" onclick="maximizaGraf();"><div class="linea_bt" id="lineabt_h"></div><div class="linea_bt" id="lineabt_v"></div></div> <div type="button" name="dat_butt_t" id="dat_butt_t" value="" onclick="minimizaGraf();" ><div class="linea_bt" id="lineabt_h2"></div></div> </div><canvas class="canvas_obj"></canvas></div></div><br>';

    let _x = (_raices_intervalo_pol[0] * 10).toFixed(1)*1;
    _html += '<br><div class="tab_contenedor"><div type="button" name="dat_butt" id="dat_butt" value="" onclick="muestraPuntos();">Mostrar tabla +</div><div class="puntos_grafica"><p style="margin: 5px 0;">Si se toma f(x) = P<sub>'+ _conservar_grado +'</sub>(x), y se evalúa en el intervalo ['+ _raices_intervalo_pol[0] +', '+ _raices_intervalo_pol[1] +'] con saltos de 0.1 unidades se obtienen los siguientes valores:</p><table border="0">';
    while(_x <= (_raices_intervalo_pol[1]*10)){
        let res_f = f_de((_x/10).toFixed(1)*1);
        let res_f_prima = f_prima_de((_x/10).toFixed(1)*1);
        _html += '<tr><td><div id="'+ (res_f > 0? 'positivo' : (res_f < 0? 'negativo' : 'cero')) +'">f('+ (_x/10).toFixed(1)*1 +') = ' + (res_f.toFixed(4) * 1) + '</div></td><td><div id="'+ (res_f_prima > 0? 'positivo' : (res_f_prima < 0? 'negativo' : 'cero')) +'">' + 'f\'('+ (_x/10).toFixed(1)*1 +') = ' + (res_f_prima.toFixed(4) * 1) + '</div></td></tr>';
        _x += 1;
    }
    _html += '</table></div></div><br>';
    _inicio_grafica_c = _raices_intervalo_pol[0];
    _fin_grafica_c = _raices_intervalo_pol[1];

    // $("#polinomio_in").attr("style","padding: 30px; background-color: rgb(153, 160, 230); color: #000;");
    document.querySelector('#polinomio_in').setAttribute('style', 'width: 80%; padding: 30px; text-align: left;');
    _html += '<br><div class="m_raices"><p style="text-align: center; margin: 0;">Raíces reales encontradas en:</p>';
    obtenerRaices(_inicio_grafica_c, _fin_grafica_c);
    for(let i = 0; i < _raices.length; i++){
        _html += '<div style="padding: 15px; display: inline-block;"><div class="raiz_r">x<sub>' + (i+1) + '</sub> = ' + _raices[i] + '</div></div>';
    }
    _html += '</div>';

    //  Se modifica la vista para mostrar los resultados
    // $("#polinomio_in").css("max-width","80%");
    // document.querySelector('#polinomio_in').setAttribute('style', 'max-width: 80%;');
    //$("#polinomio_in").css("max-height","700px");
    document.getElementById('polinomio_in').innerHTML = _html;
    //  Después de canbiar la información de la vista se escribe la gráfica en canvas
    generaGrafica(_inicio_grafica_c, _fin_grafica_c, _step_grafica_c);

    //	Estos eventos permiten mover la gráfica
    canvas.addEventListener("mousedown", function(evt) {
        let mousePos = oMousePos(canvas, evt);
        arrastrar = true;
        delta.x = _X - mousePos.x;
        delta.y = _Y - mousePos.y;
    }, false);
    canvas.addEventListener("mousemove", function(evt) {
        let mousePos = oMousePos(canvas, evt);
        if(arrastrar){
            context.clearRect(0, 0, canvas.width, canvas.height);
            _X = mousePos.x + delta.x;
            _Y = mousePos.y + delta.y;
            generaGrafica(_inicio_grafica_c, _fin_grafica_c, _step_grafica_c);
        }
    }, false);
    canvas.addEventListener("mouseup", function(evt) {
        arrastrar = false;
    }, false);
}

//  Se capturan los coeficientes y cuando no falten más por capturar se volverá a cambiar el texto de la vista
function coeficientePol(posicion){
    if(validaInput(document.getElementById('coeficiente_pol').value)){
        _polinomio[posicion] = parseFloat(document.getElementById('coeficiente_pol').value);
        let _html = '<p id="bvnda">Ingrese el coeficiente a<sub>'+ (posicion - 1) +'</sub></p>'+
            '<input class="coeficiente_pol" type="text" name="coeficiente_pol" id="coeficiente_pol" value="" placeholder="Coeficiente '+ (posicion - 1) +'" onkeyup="if(event.keyCode == 13){ coeficientePol('+ (posicion - 1) +'); }" />'+
            '<br /><br />'+
            '<div id="pol_butt_cont">'+
            '<input class="aceptar" type="button" name="pol_butt" id="pol_butt" value="Continuar" onclick="coeficientePol('+ (posicion - 1) +');" />'+
            '</div>';
        if(posicion > 0){
            document.getElementById('polinomio_in').innerHTML = _html;
            document.getElementById('coeficiente_pol').focus();
        } else {
            document.getElementById('polinomio_in').setAttribute('style', 'width: 80%;');
            realizaOps();
        }
    } else {
        alert(document.getElementById('coeficiente_pol').value + "no es un número.")
    }
}
