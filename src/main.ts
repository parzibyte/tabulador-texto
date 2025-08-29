import './style.css'
import { tabularDatos, type AlineacionTabulacion } from './TabuladorTexto'
const $salida = document.querySelector("#salida");
const $agregarFila = document.querySelector("#agregarFila");
const $agregarColumna = document.querySelector("#agregarColumna");
const $tabla = document.querySelector("#tabla");
const $separador = document.querySelector("#separador");
const $relleno = document.querySelector("#relleno");
const $usarLineaSeparadora = document.querySelector("#usarLineaSeparadora");
const $ajustesLineaSeparadora = document.querySelector("#ajustesLineaSeparadora");
const $separadorLinea = document.querySelector("#separadorLinea");
const $contenidoLinea = document.querySelector("#contenidoLinea");
const $rellenoLinea = document.querySelector("#rellenoLinea");

$usarLineaSeparadora?.addEventListener("change", () => {
  if ($usarLineaSeparadora.checked) {
    $ajustesLineaSeparadora.hidden = false;
  } else {
    $ajustesLineaSeparadora.hidden = true;
  }
  generar();
})

const LONGITUD_COLUMNA_POR_DEFECTO = 20;
const CONTENIDO_CELDA_DEFECTO = "Escribe el texto";
const ALINEACION_POR_DEFECTO: AlineacionTabulacion = "c";

const longitudes: number[] = [];
const alineaciones: Array<AlineacionTabulacion> = [];

const tabla: string[][] = [
];


const dibujarTabla = () => {
  const $thead = document.createElement("thead");
  for (let i = 0; i < longitudes.length; i++) {
    const longitud = longitudes[i];
    const $th = document.createElement("th");
    const $input = Object.assign(document.createElement("input"), {
      type: "number",
      value: longitud,
    })
    //

    const $selectAlineacion = document.createElement("select");
    $selectAlineacion.appendChild(Object.assign(document.createElement("option"), {
      value: "c",
      textContent: "Centro"
    }))

    $selectAlineacion.appendChild(Object.assign(document.createElement("option"), {
      value: "i",
      textContent: "Izquierda"
    }))
    $selectAlineacion.appendChild(Object.assign(document.createElement("option"), {
      value: "d",
      textContent: "Derecha"
    }))
    $selectAlineacion.addEventListener("change", () => {
      alineaciones[i] = $selectAlineacion.value as AlineacionTabulacion;
      generar();
    })
    //
    $input.addEventListener("input", () => {
      longitudes[i] = $input.valueAsNumber;
      generar();
    })
    $th.appendChild($input);
    $th.appendChild($selectAlineacion);
    $thead.appendChild($th);
  }
  const $tbody = document.createElement("tbody");

  for (let y = 0; y < tabla.length; y++) {
    const fila = tabla[y];
    const $tr = document.createElement("tr");
    for (let x = 0; x < fila.length; x++) {
      const elemento = fila[x];
      const $td = document.createElement("td");
      const $input = Object.assign(document.createElement("input"), {
        type: "",
        value: elemento,
      })
      $input.addEventListener("input", () => {
        tabla[y][x] = $input.value;
        generar();
      })
      $td.appendChild($input);
      $tr.appendChild($td);
    }
    $tbody.appendChild($tr);
  }

  $tabla.tHead?.remove();
  $tabla.tBodies[0]?.remove();
  $tabla.appendChild($thead);
  $tabla?.appendChild($tbody);

}

const agregarFila = () => {
  let cantidadColumnas = 1;
  if (tabla.length > 0) {
    cantidadColumnas = tabla[0].length
  } else {
    longitudes.push(LONGITUD_COLUMNA_POR_DEFECTO);
    alineaciones.push(ALINEACION_POR_DEFECTO);
  }
  tabla.push(new Array(cantidadColumnas).fill(CONTENIDO_CELDA_DEFECTO))
  dibujarTabla()
  generar()
}
const agregarColumna = () => {
  for (const fila of tabla) {
    fila.push(CONTENIDO_CELDA_DEFECTO)
  }
  longitudes.push(LONGITUD_COLUMNA_POR_DEFECTO);
  alineaciones.push(ALINEACION_POR_DEFECTO);
  dibujarTabla()
  generar()
}

const generar = () => {
  $salida.textContent = "";
  for (let i = 0; i < tabla.length; i++) {
    const fila = tabla[i];
    let lineasParaSeparar: string[] = [];
    if ($usarLineaSeparadora.checked) {
      lineasParaSeparar = tabularDatos(fila.map((contenido: string, indice: number) => {
        return {
          alineacion: alineaciones[indice], contenido: $contenidoLinea.value, maximaLongitud: longitudes[indice]
        }
      }), $rellenoLinea.value, $separadorLinea.value)
    }


    const lineas = tabularDatos(fila.map((contenido: string, indice: number) => {
      return {
        alineacion: alineaciones[indice], contenido: contenido, maximaLongitud: longitudes[indice],
      }
    }), $relleno.value, $separador.value)

    if ($usarLineaSeparadora.checked) {
      $salida.textContent += lineasParaSeparar.join("\n") + "\n";
    }
    $salida.textContent += lineas.join("\n") + "\n";
    if (i + 1 >= tabla.length) {

      if ($usarLineaSeparadora.checked) {
        $salida.textContent += lineasParaSeparar.join("\n") + "\n";
      }
    }
  }
  return;
}

$agregarColumna!.addEventListener("click", () => {
  agregarColumna()
})

$agregarFila!.addEventListener("click", () => {
  agregarFila();
})
$separador?.addEventListener("input", () => {
  generar()
})

$relleno?.addEventListener("input", () => {
  generar()
})

$separadorLinea?.addEventListener("input", () => {
  generar()
})

$contenidoLinea?.addEventListener("input", () => {
  generar()
})

$rellenoLinea?.addEventListener("input", () => {
  generar()
})

agregarFila();
dibujarTabla()
generar()