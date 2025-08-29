import './style.css'
import { tabularDatos, type AlineacionTabulacion } from './TabuladorTexto'
const $salida = document.querySelector("#salida");
const $agregarFila = document.querySelector("#agregarFila");
const $agregarColumna = document.querySelector("#agregarColumna");
const $tabla = document.querySelector("#tabla") as HTMLTableElement;
const $separador = document.querySelector("#separador") as HTMLInputElement;
const $relleno = document.querySelector("#relleno") as HTMLInputElement;
const $usarLineaSeparadora = document.querySelector("#usarLineaSeparadora") as HTMLInputElement;
const $ajustesLineaSeparadora = document.querySelector("#ajustesLineaSeparadora") as HTMLDivElement;
const $separadorLinea = document.querySelector("#separadorLinea") as HTMLInputElement;
const $contenidoLinea = document.querySelector("#contenidoLinea") as HTMLInputElement;
const $rellenoLinea = document.querySelector("#rellenoLinea") as HTMLInputElement;

$usarLineaSeparadora?.addEventListener("change", () => {
  if ($ajustesLineaSeparadora != null && $usarLineaSeparadora !== null) {
    if ($usarLineaSeparadora.checked) {
      $ajustesLineaSeparadora.hidden = false;
    } else {
      $ajustesLineaSeparadora.hidden = true;
    }
    generar();
  }
})

const LONGITUD_COLUMNA_POR_DEFECTO = 20;
const CONTENIDO_CELDA_DEFECTO = "Escribe el texto";
const ALINEACION_POR_DEFECTO: AlineacionTabulacion = "c";

const longitudes: number[] = [];
const alineaciones: Array<AlineacionTabulacion> = [];

const tabla: string[][] = [
];


const dibujarTabla = () => {
  if ($tabla === null) {
    return;
  }
  const $thead = document.createElement("thead");
  for (let i = 0; i < longitudes.length; i++) {
    const longitud = longitudes[i];
    const $th = document.createElement("th");
    $th.classList.add("px-4", "py-2", "border", "border-blue-200", "bg-blue-50", "text-gray-700", "text-sm");
    const $input = Object.assign(document.createElement("input"), {
      type: "number",
      value: longitud,
    })

    $input.classList.add("border", "border-blue-300", "rounded-lg", "px-2", "py-1", "shadow-sm", "focus:ring-2", "focus:ring-blue-500");

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
    $selectAlineacion.classList.add("border", "border-blue-300", "rounded-lg", "px-2", "py-1", "shadow-sm", "focus:ring-2", "focus:ring-blue-500", "ml-2");
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
  $tbody.classList.add("divide-y", "divide-blue-200");

  for (let y = 0; y < tabla.length; y++) {
    const fila = tabla[y];
    const $tr = document.createElement("tr");
    $tr.classList.add("hover:bg-blue-50", "transition");
    for (let x = 0; x < fila.length; x++) {
      const elemento = fila[x];
      const $td = document.createElement("td");
      $td.classList.add("px-2", "py-1", "border", "border-blue-200");
      const $input = Object.assign(document.createElement("input"), {
        type: "",
        value: elemento,
      })
      $input.addEventListener("input", () => {
        tabla[y][x] = $input.value;
        generar();
      })
      $input.classList.add("border", "border-blue-300", "rounded-lg", "px-2", "py-1", "shadow-sm", "focus:ring-2", "focus:ring-blue-500", "w-full");
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
  if ($salida === null) {
    return;
  }
  for (let i = 0; i < longitudes.length; i++) {
    if (longitudes[i] <= 0) {
      return alert("La longitud de cada columna debe ser mayor a 0");
    }
  }
  $salida.textContent = "";
  for (let i = 0; i < tabla.length; i++) {
    const fila = tabla[i];
    let lineasParaSeparar: string[] = [];
    if ($usarLineaSeparadora.checked) {
      lineasParaSeparar = tabularDatos(fila.map((_, indice: number) => {
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