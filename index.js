/** 
 * Hace mucho tiempo, antes de intentar tomarme en serio la programacion, publique [un post en mi blog sobre el juego de la vida](https://interlan.ec/2020/05/23/el-juego-de-la-vida-en-javascript/). Habiendo mejorado mucho mis capacidades para leer codigo y hacer muchas cosas mas, decidi retomar mi blog para llenarlo con nuevos contenidos que ayuden a otras personas a las que les interesen las mismas cosas que a mi.
 * 
 * @projectname El juego de la vida. Una reescritura en vainilla javascript
 * @version 1.0
 * @author drk0027
 * @copyright 2021
 * 
 */


/**
 * # Punto
 * 
 * Esta clase almacena temporalmente las coordenadas X,Y como un objeto
 */
class Punto {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}
/**
 * # Graficos
 * 
 * Esta clase permite el control y la creacion del lienzo y las funciones que alteran el estado del lienzo
 */
class graficos {
    constructor() {
        //contexto
        this.ctx = lienzo.getContext("2d")
        //colores
        this.color_encendido = 'rgb(0, 0, 0)'
        this.color_apagado = 'rgb(255, 255, 255)'
        this.color_rejilla = 'rgb(50, 50, 50)'
        //tamaños
        this.tamaño_celula = 10
        //celdas
        this.yCelula
        this.xCelula
        this.prev = []
        this.sig = []
        //temporizador
        this.intervalo
    }

    /**
     * # Dibujar Celula
     * 
     * Permite dibujar una celula en un estado encendido o apagado en un lugar determinado del lienzo
     * @param {int} x 
     * @param {int} y 
     * @param {bool} estado 
     */
    dibujarCelula(x, y, estado) {
        if (estado == 1) {
            this.ctx.fillStyle = this.color_encendido
        } else {
            this.ctx.fillStyle = this.color_apagado
        }
        this.ctx.fillRect(x * this.tamaño_celula + 1, y * this.tamaño_celula + 1, this.tamaño_celula - 1, this.tamaño_celula - 1)
    }

    /**
     * # Pintar
     * 
     * Esta funcion cambia el estado de todas las celulas de acuerdo al que esta almacenado en la matriz original
     */
    pintar() {
        for (var x = 0; x < this.xCelula; x++) {
            for (var y = 0; y < this.yCelula; y++) {
                this.dibujarCelula(x, y, this.prev[x][y]);
            }
        }
    }
}
//inicializar clase graficos
const gx = new graficos()
//variables globales
var celula = ""
var estado = ""

/**
 * # Procesar Celula
 * 
 * Esta funcion permite calcular la posicion de la celula y determinar su estado
 * @param {Object} celula Objeto de puntos en X,Y definido en la clase Puntos
 */
function procesarCelula(celula) {
    var x = celula.x
    var y = celula.y
    var estado = 1

    if (x > gx.xCelula - 1 || y > gx.yCelula - 1) {
        return;
    }
    if (typeof estado == 'undefined') {
        estado = !gx.prev[x][y];
    }
    gx.prev[x][y] = estado;
    gx.dibujarCelula(x, y, estado);
}

/**
 * # Celda seleccionada (getPuntoBajoMouse)
 * 
 * Esta funcion permite al programa determinar en sobre que celda se encuentra posicionado el mouse a partir de las coordenadas devueltas por el evento mousedown.
 * 
 * Para calcular este valor, se realizan las siguientes operaciones
 * 
 * X=
 * 
 * Donde:
 * 
 * e.pageX: posicion del cursor en x
 * e.pageY: posicion del cursor en y
 * 
 * gx.ctx.canvas.offsetLeft: pixeles desde el lienzo hasta el borde de la pantalla a la izquierda
 * gx.ctx.canvas.offsetright: pixeles desde el lienzo hasta el borde de la pantalla arriba
 * gx.tamaño_celula: tamaño de la celula en pixeles
 * 
 * @param {Object} e eventos devueltos por el listener de mousedown
 */
function getPuntoBajoMouse(e) {
    //esta funcion permite optener un nuevo punto por medio de restar pageX (eje x devuelto por el evento del mouse) menos el offset izquierdo del lienzo, dividirlo para el tamaño de la celula (definido en la clase grafico) o establecer el punto como cero para el punto x de la clase Punto 

    /*
    esta funcion devuelve un nuevo arreglo de puntos x,y para la clase Punto
    Punto X: resta pageX (eje x devuelto por el evento del mouse) menos el offset izquierdo del lienzo, dividirlo para el tamaño de la celula (definido en la clase grafico) o establecer el punto como cero para el punto x de la clase Punto.

    Punto Y: resta pagey (eje x devuelto por el evento del mouse) menos el offset superior del lienzo, dividirlo para el tamaño de la celula (definido en la clase grafico) o establecer el punto como cero para el punto y de la clase Punto.

    */

    return new Punto((e.pageX - gx.ctx.canvas.offsetLeft) / gx.tamaño_celula | 0, ((e.pageY - gx.ctx.canvas.offsetTop) / gx.tamaño_celula) | 0);
}

/**
 * # Init
 * 
 * Esta funcion permite inicializar todas las variables necesarias para el funcionamiento de este programa
 */
function init() {
    gx.xCelula = ((gx.ctx.canvas.width - 1) / gx.tamaño_celula) | 0
    gx.yCelula = ((gx.ctx.canvas.height - 1) / gx.tamaño_celula) | 0

    //inicializa el panel en color encendido
    gx.ctx.fillStyle = gx.color_apagado
    //Pintar el fondo
    gx.ctx.fillRect(0, 0, gx.xCelula * gx.tamaño_celula, gx.yCelula * gx.tamaño_celula)
    //Definir color de la rejilla
    gx.ctx.fillStyle = gx.color_rejilla

    //Dibujar lineas verticales
    for (var x = 0; x < gx.xCelula; x++) {
        //se inicializa la matriz
        gx.prev[x] = []
        gx.sig[x] = []
        //se dibuja cada celula
        gx.ctx.fillRect(x * gx.tamaño_celula, 0, 1, gx.yCelula * gx.tamaño_celula)
        for (var y = 0; y < gx.yCelula; y++) {
            gx.prev[x][y] = false;
        }
    }

    gx.ctx.fillRect(gx.xCelula * gx.tamaño_celula, 0, 1, gx.yCelula * gx.tamaño_celula)
    //Dibujar lineas horizontales
    for (var y = 0; y < gx.yCelula; y++) {
        gx.ctx.fillRect(0, y * gx.tamaño_celula, gx.xCelula * gx.tamaño_celula, 1)
    }
    gx.ctx.fillRect(0, gx.yCelula * gx.tamaño_celula, gx.xCelula * gx.tamaño_celula, 1)
}
/**
 * # Contar Vecinos
 * 
 * Esta funcion permite contar los vecinos de una celula, sea que esta viva como si esta muerta y devuelve la cantidad de vecinos vivos que esta tenga.
 * 
 * Esquema:
 * 
 * **Esquema:**
 * 
 *        3   4   5
 *        |   |   |
 *        v   v   v
 *       __ ___ ___
 *      |   |   |   | <-3
 *      +---|---|---|
 *      | 1 | 1 | 1 | <-4
 *      +---|---|---|
 *      |   |   |   | <-5
 *      +---|---|---|
 * 
 * **calcular el vecino de 4,4**
 * 
 * xCelula la cantidad de filas de celulas
 * yCelula es la cantidad de columnas de celulas
 * 
 * |variable|estado|
 * |--------|------|
 * |prev[4][3]|verdadero|
 * |prev[5][3]|falso|
 * |prev[5][4]|falso|
 * |prev[5][5]|falso|
 * |prev[4][5]|verdadero|
 * |prev[3][5]|falso|
 * |prev[3][4]|falso|
 * |prev[3][3]|falso|
 * 
 * @param {int} x filas
 * @param {int} y columnas
 */
function _contarvecinos(x, y) {
    var cantidad = 0
    var vecinos = [
        gx.prev[x][(y - 1 + gx.yCelula) % gx.yCelula],
        gx.prev[(x + 1 + gx.xCelula) % gx.xCelula][(y - 1 + gx.yCelula) % gx.yCelula],
        gx.prev[(x + 1 + gx.xCelula) % gx.xCelula][y],
        gx.prev[(x + 1 + gx.xCelula) % gx.xCelula][(y + 1 + gx.yCelula) % gx.yCelula],
        gx.prev[x][(y + 1 + gx.yCelula) % gx.yCelula],
        gx.prev[(x - 1 + gx.xCelula) % gx.xCelula][(y + 1 + gx.yCelula) % gx.yCelula],
        gx.prev[(x - 1 + gx.xCelula) % gx.xCelula][y],
        gx.prev[(x - 1 + gx.xCelula) % gx.xCelula][(y - 1 + gx.yCelula) % gx.yCelula],
    ]

    for (var i = 0; i < vecinos.length; i++) {
        if (vecinos[i]) {//si hay valor o no
            cantidad++;
        }
    }
    return cantidad
}

/**
 * # Siguiente Generacion
 * 
 * Esta funcion se encarga de calcular la siguiente generacion de la partida, para esto, crea un nuevo arreglo con la matriz aun vigente, luego hace un barrido por cada una de las celdas buscando cuantas celulas tienen vecinos y evalua su situacion actual segun las reglas del juego de la vida. Una vez hecho esto, se copia la nueva matriz sobre la anterior, sobreescribiendola y mostrandola en pantalla.
 * 
 * ## Reglas del juego de la vida
 * 
 * - Cualquier celula viva con dos o tres compañeros vivos, sobrevive
 * - Cualquier celula muerta con tres compañeros vivos, revive
 * - Todas las demas celulas mueren en la siguiente generacion. De la misma forma, las celulas muertas, permanecen muertas
 * 
 * (Conway's game of Life, Wikipedia)
 * 
 */
function siguiente_generacion() {

    //Copiar el arreglo de la pantalla anterior en uno nuevo, que sera modificado mas adelante
    for (var x = 0; x < gx.xCelula; x++) {//numero de filas
        for (var y = 0; y < gx.yCelula; y++) {//numero de columnas
            gx.sig[x][y] = gx.prev[x][y];
        }
    }


    for (var x = 0; x < gx.xCelula; x++) {//numero de filas
        for (var y = 0; y < gx.yCelula; y++) {//numero de columnas
            var cantidad = _contarvecinos(x, y);
            // Reglas del juego de la vida
            if (gx.prev[x][y]) { //si la celula esta encendida
                if (cantidad < 2 || cantidad > 3) {//si la celula tiene menos de dos vecinos vivos o mas de tres muere
                    gx.sig[x][y] = false;
                }
            } else if (cantidad == 3) { //sino, esta viva
                gx.sig[x][y] = true;
            }
        }
    }

    //copiar arreglo modificado en el anterior
    for (var x = 0; x < gx.xCelula; x++) {
        for (var y = 0; y < gx.yCelula; y++) {
            gx.prev[x][y] = gx.sig[x][y];
        }
    }

    gx.pintar()
}
/**
 * # Limpiar
 * 
 * Cambia el estado de cada celula a apagado
 */
function limpiar() {
    for (var x = 0; x < gx.xCelula; x++) {
        for (var y = 0; y < gx.yCelula; y++) {
            gx.prev[x][y] = false
        }
    }
    gx.pintar()
}
/**
 * #Init
 * 
 * Inicializa la plataforma
 */
init()

//eventos

/**
 * # Listener: mousedown
 * 
 * Agrega un gestor de eventos que detecte cuando se hace click en una celda correspondiente a una celula
 */
lienzo.addEventListener("mousedown", e => {
    celula = getPuntoBajoMouse(e)
    procesarCelula(celula)
})

/**
 * # Iniciar
 * 
 * Inicia el temporizador que avanza cada generacion
 */
function iniciar(){
    gx.intervalo=setInterval(siguiente_generacion,500)
}

/**
 * # Parar
 * 
 * Limpia el temporizador que ejecuta la funcion de siguiente_generacion
 */
function parar(){
    clearInterval(gx.intervalo)

}

//Service-Worker

window.addEventListener('beforeinstallprompt', (event) => {
    console.log('👍', 'beforeinstallprompt', event);
    // Stash the event so it can be triggered later.
    window.deferredPrompt = event;
    // Remove the 'hidden' class from the install button container
    //divInstall.classList.toggle('hidden', false);
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }

  if (window.location.protocol === 'http:') {
      console.log("cuidado, no pùedes instalar apps desde un sitio inseguro")

    //determina si estoy en una pagina insegura
    /* const requireHTTPS = document.getElementById('requireHTTPS');
    const link = requireHTTPS.querySelector('a');
    link.href = window.location.href.replace('http://', 'https://');
    requireHTTPS.classList.remove('hidden'); */
  }

  window.addEventListener('appinstalled', (event) => {
    console.log('👍', 'appinstalled', event);
    // Clear the deferredPrompt so it can be garbage collected
    window.deferredPrompt = null;
  });