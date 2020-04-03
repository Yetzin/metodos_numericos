//  Variables

//  Eventos
window.onload = function(){
	document.getElementById("contenedor_carga").style.display = "none";
	document.querySelector('.menu_barras').onclick = menuActivar;
	let botones = document.querySelectorAll('.caja_al');
	botones.forEach((item) => {
		item.onclick = vista;
	});
	document.querySelector('html').onclick = menus;
}

//  Funciones
function menus(event){
	let id_e = event.target.id;
	if(id_e != 'mantener' && id_e != 'barra_1' && id_e != 'barra_2' && id_e != 'barra_3'){
		document.querySelector('.cont_menu_s').setAttribute('style', '');
	}
}
function menuActivar(){
	document.querySelector('.cont_menu_s').setAttribute('style', 'display: flex;');
}
function vista(){
	opcion = this.id;
	let cambiosHTML = document.querySelector('.selecc');
	cambiosHTML.setAttribute('style', '');
    switch (opcion) {
        case 'u1':
			inicializaVars();
			cambiosHTML.innerHTML = '<h3>Polinomios de la forma:</h3> <p class="polinomio_txt">a<sub>n</sub>x<sup>n</sup> + a<sub>n-1</sub>x<sup>n-1</sup> + a<sub>n-2</sub>x<sup>n-2</sup> + ... + a<sub>2</sub>x<sup>2</sup> + a<sub>1</sub>x + a<sub>0</sub></p>'
			+'<p id="bvnda">Ingrese el grado del polinomio</p>'
			+'<input class="tamm" type="number" min="0" name="grado_pol" id="grado_pol" placeholder="Grado" value="" onkeyup="if(event.keyCode == 13){ gradoPol(); }">'
			+'<br>'
			+'<div id="pol_butt_cont">'
			+'<input class="aceptar" type="button" name="pol_butt" id="pol_butt" value="Continuar" onclick="gradoPol();">'
			+'</div>';
			cambiosHTML.setAttribute('id', 'polinomio_in');
			document.getElementById('grado_pol').focus();
			document.querySelector('#polinomio_in').setAttribute('style', '');
            break;

        case 'u2':
			cambiosHTML.setAttribute('style', 'position: relative; padding: 25px; width: 90%; max-width: 400px; height: 250px; max-height: 80%; background-color: #252932; background-color: #252932cc; color: #fff;');
			cambiosHTML.innerHTML = '<p>Elija el tamaño de la matriz n<sub>*</sub>n:</p>'
			+'<input type="number" class="tamm" id="tamm" min="1" onkeydown="if(event.keyCode == 13) aceptarTam();" style="height: 40px; width: 120px; border: 3px solid #3c8397; background-color: #3c8397; background-color: #3c839794; color: #fff; font-weight: 500; font-size: 14px; padding: 0 20px; border-radius: 20px; position: absolute; margin: auto; top: 0; left: 0; right: 0; bottom: 0;">'
			+'<input type="button" onclick="aceptarTam();" class="acept" value="Aceptar">'
			+'<input type="button" class="cancel" value="Cancelar" onclick="location.reload();">';
			document.getElementById("tamm").focus();
            break;

        case 'u3':
            break;

        case 'u4':
            break;

        default:
            break;
    }
	document.documentElement.scrollTop = 0;
	document.body.scrollTop = 0;
}
