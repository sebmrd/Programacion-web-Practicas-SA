'use strict';

const nombre = 'Sebas';
const apellido = 'Alvarado';
let ciclo = 6;
const notas = [8, 9, 10, 7];

const calcularPromedio = (notas) => {
    if (notas.length === 0) return 0;
    let suma = notas.reduce((acc, nota) => acc + nota, 0);
    return suma / notas.length;
};

document.getElementById('nombre').textContent = 'Nombre: ' + nombre;
document.getElementById('apellido').textContent = 'Apellido: ' + apellido;
document.getElementById('ciclo').textContent = 'Ciclo: ' + ciclo;

document.getElementById('promedio').textContent = 'Promedio: ' + calcularPromedio(notas);

console.log('Datos cargados correctamente');