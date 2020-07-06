const celeste = document.getElementById('celeste');
const violeta = document.getElementById('violeta');
const naranja = document.getElementById('naranja');
const verde = document.getElementById('verde');

const modal = document.getElementById('modal');
const levelInput = document.getElementById('level');
const speedOnInput = document.getElementById('speedOn');
const speedOffInput = document.getElementById('speedOff');

const btnEmpezar = document.getElementById('btnEmpezar');
const openModal = document.getElementById('open');
const closeModal = document.getElementById('close');
const changeSettings = document.getElementById('changeSettings');

let ULTIMO_NIVEL;
let SPEED_LIGHT;
let SPEED_LIGHT_OFF;

function toggleModal() {
	modal.classList.toggle('hide');
}

function setSettings() {
	ULTIMO_NIVEL = Number.parseInt(levelInput.value);
	SPEED_LIGHT = 3500 / Number.parseInt(speedOnInput.value);
	SPEED_LIGHT_OFF = 2500 / Number.parseInt(speedOffInput.value);
}
setSettings();

openModal.addEventListener('click', toggleModal);
closeModal.addEventListener('click', toggleModal);

changeSettings.addEventListener('click', function () {
	setSettings();
	toggleModal();
});

class Juego {
	constructor() {
		this.inicializar = this.inicializar.bind(this);
		this.inicializar();
		this.generarSecuencia();
		setTimeout(this.siguienteNivel, 500);
	}

	inicializar() {
		this.siguienteNivel = this.siguienteNivel.bind(this);
		this.elegirColor = this.elegirColor.bind(this);
		this.toogleBtnEmpezar();
		this.nivel = 1;
		this.colores = {
			celeste,
			violeta,
			naranja,
			verde
		};
	}

	toogleBtnEmpezar() {
		btnEmpezar.classList.toggle('hide');
	}

	generarSecuencia() {
		this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(n => Math.floor(Math.random() * 4));
	}

	siguienteNivel() {
		this.subnivel = 0;
		this.iluminarSecuencia();
		this.agregarEventosClick();
	}

	transformarNumeroAColor(num) {
		switch (num) {
			case 0:
				return 'celeste';
			case 1:
				return 'violeta';
			case 2:
				return 'naranja';
			case 3:
				return 'verde';
		}
	}

	transformarColorANumero(color) {
		switch (color) {
			case 'celeste':
				return 0;
			case 'violeta':
				return 1;
			case 'naranja':
				return 2;
			case 'verde':
				return 3;
		}
	}

	iluminarSecuencia() {
		for (let i = 0; i < this.nivel; i++) {
			const color = this.transformarNumeroAColor(this.secuencia[i]);
			setTimeout(() => this.iluminarColor(color), SPEED_LIGHT * i);
		}
	}

	iluminarColor(color) {
		this.colores[color].classList.add('light');
		setTimeout(() => this.apagarcolor(color), SPEED_LIGHT_OFF);
	}

	apagarcolor(color) {
		this.colores[color].classList.remove('light');
	}

	agregarEventosClick() {
		this.colores.celeste.addEventListener('click', this.elegirColor);
		this.colores.verde.addEventListener('click', this.elegirColor);
		this.colores.violeta.addEventListener('click', this.elegirColor);
		this.colores.naranja.addEventListener('click', this.elegirColor);

		this.colores.celeste.classList.add('color-active');
		this.colores.verde.classList.add('color-active');
		this.colores.violeta.classList.add('color-active');
		this.colores.naranja.classList.add('color-active');
	}

	eliminarEventosClick() {
		this.colores.celeste.removeEventListener('click', this.elegirColor);
		this.colores.verde.removeEventListener('click', this.elegirColor);
		this.colores.violeta.removeEventListener('click', this.elegirColor);
		this.colores.naranja.removeEventListener('click', this.elegirColor);

		this.colores.celeste.classList.remove('color-active');
		this.colores.verde.classList.remove('color-active');
		this.colores.violeta.classList.remove('color-active');
		this.colores.naranja.classList.remove('color-active');
	}

	elegirColor(ev) {
		const nombreColor = ev.target.dataset.color;
		const numeroColor = this.transformarColorANumero(nombreColor);
		this.iluminarColor(nombreColor);
		if (numeroColor === this.secuencia[this.subnivel]) {
			this.subnivel++;
			if (this.subnivel === this.nivel) {
				this.nivel++;
				this.eliminarEventosClick();
				if (this.nivel === (ULTIMO_NIVEL + 1)) {
					// Gano
					this.ganoEljuego();
				} else {
					setTimeout(this.siguienteNivel, 1500);
					//Subio de nivel
				}
			}
		} else {
			// Perdio
			this.perdioElJuego();
		}
	}

	ganoEljuego() {
		swal('😎', 'Felicitaciones, ganaste el juego!', 'success')
			.then(this.inicializar);

	}

	perdioElJuego() {
		swal('😥', 'Lo lamento perdiste!', 'error')
			.then(() => {
				this.eliminarEventosClick();
				this.inicializar();
			});
	}
}

function empezarJuego() {
	window.juego = new Juego();
}