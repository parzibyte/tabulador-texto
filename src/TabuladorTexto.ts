const AlineacionTabulacion = {
    Izquierda: "i",
    Derecha: "d",
    Centro: "c",
} as const;
export type AlineacionTabulacion =
    typeof AlineacionTabulacion[keyof typeof AlineacionTabulacion];
type ParaTabular = {
    contenido: string, maximaLongitud: number, alineacion: AlineacionTabulacion,
}
const separarCadenaEnArregloSiSuperaLongitud = (cadena: string, maximaLongitud: number): Array<string> => {
    const resultado = [];
    let indice = 0;
    while (indice < cadena.length) {
        const pedazo = cadena.substring(indice, indice + maximaLongitud);
        indice += maximaLongitud;
        resultado.push(pedazo);
    }
    return resultado;
}
const dividirCadenasYEncontrarMayorConteoDeBloques = (contenidosConMaximaLongitud: Array<ParaTabular>): [Array<{ separadas: Array<string>, maximaLongitud: number, alineacion: AlineacionTabulacion, }>, number] => {
    let mayorConteoDeCadenasSeparadas = 0;
    const cadenasSeparadas = [];
    for (const contenido of contenidosConMaximaLongitud) {
        const separadas = separarCadenaEnArregloSiSuperaLongitud(contenido.contenido, contenido.maximaLongitud);
        cadenasSeparadas.push({ separadas, maximaLongitud: contenido.maximaLongitud, alineacion: contenido.alineacion });
        if (separadas.length > mayorConteoDeCadenasSeparadas) {
            mayorConteoDeCadenasSeparadas = separadas.length;
        }
    }
    return [cadenasSeparadas, mayorConteoDeCadenasSeparadas];
}
/**
 * 
 * @param cadenas un arreglo de objetos. Cada objeto dentro del arreglo creará una nueva columna dentro de la tabla
 * @param relleno 
 * @param separadorColumnas 
 * @returns 
 */
export const tabularDatos = (cadenas: Array<{ contenido: string, maximaLongitud: number, alineacion: AlineacionTabulacion }>, relleno: string, separadorColumnas: string) => {
    const [arreglosDeContenidosConMaximaLongitudSeparadas, mayorConteoDeBloques] = dividirCadenasYEncontrarMayorConteoDeBloques(cadenas)
    let indice = 0;
    const lineas = [];
    while (indice < mayorConteoDeBloques) {
        let linea = "";
        for (const contenidos of arreglosDeContenidosConMaximaLongitudSeparadas) {
            let cadena = "";
            if (indice < contenidos.separadas.length) {
                cadena = contenidos.separadas[indice];
            }
            if (cadena.length < contenidos.maximaLongitud) {
                /*
                En este punto ya sabemos que es obligatorio rellenar
                la cadena porque sobra espacio, así que
                aprovechamos para alinear
                 */
                const diferencia = contenidos.maximaLongitud - cadena.length;
                if (contenidos.alineacion === AlineacionTabulacion.Izquierda) {
                    cadena = cadena + relleno.repeat(diferencia);
                } else if (contenidos.alineacion === AlineacionTabulacion.Derecha) {
                    cadena = relleno.repeat(diferencia) + cadena;
                } else if (contenidos.alineacion === AlineacionTabulacion.Centro) {
                    const rellenoIzquierdo = Math.floor(diferencia / 2);
                    const rellenoDerecho = diferencia - rellenoIzquierdo;
                    cadena = relleno.repeat(rellenoIzquierdo) + cadena + relleno.repeat(rellenoDerecho);
                }
            }
            linea += cadena + separadorColumnas;
        }
        lineas.push(linea);
        indice++;
    }
    return lineas;
}