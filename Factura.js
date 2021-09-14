const formDetelle = document.getElementById("formDetalle");
const inputCantidad = document.getElementById("inputCantidad");
const selectDescripcion = document.getElementById("selectDescripcion");
const inputPUnitario = document.getElementById("inputPUnitario");
const inputPTotal = document.getElementById("inputPTotal");
const cuerpoTabla = document.getElementById("cuerpoTabla");
const btnGuardar = document.getElementById("btnGuardar");
const inputNombre = document.getElementById("inputNombre");
const inputRuc = document.getElementById("inputRuc");
const inputNro = document.getElementById("inputNro");
const inputDireccion = document.getElementById("inputDireccion");
const inputFecha = document.getElementById("inputFecha");
const formCabecera = document.getElementById("formCabecera");

let facturas = [];
let arregloDetalle = [];
let arregloProductos = [
  { id: 1, nombre: "Galletitas Dori", precio: 123.0 },
  { id: 2, nombre: "Agua bb 5L", precio: 300.0 },
  { id: 3, nombre: "Chocolate fif", precio: 450.0 },
  { id: 4, nombre: "Alfajor Gualma", precio: 500.0 },
];

const verificarFacturasLocalStorage = () => {
  const facturasLS = JSON.parse(localStorage.getItem("facturas")); //obtengo el string q tengo guardado en el ls
  //forma 1
  // if(facturasLS){
  //     facturas = facturasLS;
  // }
  //forma 2
  facturas = facturasLS || []; //si la factura no es null accede y sino guarda un arreglo vacio
};

verificarFacturasLocalStorage();

const llenarProductos = () => {
  arregloProductos.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.id;
    option.innerText = p.nombre;
    selectDescripcion.appendChild(option);
  });
};
llenarProductos();

const getNombreProductoById = (id) => {
  const objProducto = arregloProductos.find((p) => {
    //buscar el producto
    if (p.id === +id) {
      return p;
    }
  });
  return objProducto.nombre;
};

const getPrecioProductoById = (id) => {
  const objProducto = arregloProductos.find((p) => {
    //buscar el producto
    if (p.id === +id) {
      return p;
    }
  });
  return objProducto.precio;
};

const redibujarTabla = () => {
  cuerpoTabla.innerHTML = ""; //cada vez q se ejecute se limpia la tabla
  arregloDetalle.forEach((detalle) => {
    let fila = document.createElement("tr");
    fila.innerHTML = `  <td>${detalle.cant}</td>
                            <td>${getNombreProductoById(
                              detalle.descripcion
                            )}</td>
                            <td>${detalle.pUnit}</td>
                            <td>${detalle.pTotal}</td>`;

    let tdEliminar = document.createElement("td");
    let botonEliminar = document.createElement("button");
    botonEliminar.classList.add("btn", "btn-danger");
    botonEliminar.innerText = "Eliminar";
    botonEliminar.onclick = () => {
      eliminarDetalleById(detalle.descripcion);
    };

    tdEliminar.appendChild(botonEliminar);
    fila.appendChild(tdEliminar);
    cuerpoTabla.appendChild(fila);
  });
};

const eliminarDetalleById = (id) => {
  arregloDetalle = arregloDetalle.filter((detalle) => {
    if (+id !== +detalle.descripcion) {
      //retorno todos los objetos exceptop el q quiero eliminar
      return detalle;
    }
  });
  redibujarTabla();
};

const agregarDetalle = (objDetalle) => {
  //buscar si el objeto detalle ya existia en el arreglo detalla
  //de ser asi sumar las cantidades para que solo aparezca una vez en el arreglo

  const resultado = arregloDetalle.find((detalle) => {
    //busco si el obj detalle existe
    if (+objDetalle.descripcion === +detalle.descripcion) {
      return detalle;
    }
  });

  if (resultado) {
    //si existe el obj detalle
    arregloDetalle = arregloDetalle.map((detalle) => {
      //busco el objeto y lo modifico
      if (+detalle.descripcion === +objDetalle.descripcion) {
        return {
          cant: +detalle.cant + +objDetalle.cant,
          descripcion: detalle.descripcion,
          pTotal: (+detalle.cant + +objDetalle.cant) * +detalle.pUnit,
          pUnit: +detalle.pUnit,
        };
      }
      return detalle;
    });
  } else {
    arregloDetalle.push(objDetalle);
  }
};

formDetelle.onsubmit = (e) => {
  //se agregue un nuevo detalle a la factura, la e seria el evento
  e.preventDefault(); //para q no se actualice la pagina

  // Creando objeto detalle
  const objDetalle = {
    cant: inputCantidad.value,
    descripcion: selectDescripcion.value,
    pUnit: inputPUnitario.value,
    pTotal: inputPTotal.value,
  };

  agregarDetalle(objDetalle);
  redibujarTabla();
};

btnGuardar.onclick = () => {
  //crear el objeto de la cabecera de la factura
  let objFactura = {
    nombre: inputNombre.value,
    direccion: inputNombre.value,
    fecha: inputFecha.value,
    nro: inputNro.value,
    ruc: inputRuc.value,
    detalle: arregloDetalle,
  };
  facturas.push(objFactura);

  //limpiar campos
  formCabecera.reset();
  formDetelle.reset();

  //guardarlo en el localStorage
  localStorage.setItem("facturas", JSON.stringify(facturas));
  //borrar tabla del tbody
  arregloDetalle = [];
  redibujarTabla();
};

selectDescripcion.onchange = () => {
  //cada vez q cambie el elemento
  if (selectDescripcion.value === "0") {
    formDetelle.reset();
    return;
  }

  const precio = getPrecioProductoById(selectDescripcion.value);

  if (precio) {
    inputPUnitario.value = precio;
    calcularTotal(); //cada vez q cambue el select se va a calcular el total
  }
};

const calcularTotal = () => {
  const cantidad = +inputCantidad.value; //con el + lo transformo a entero
  const pUnit = +inputPUnitario.value;
  const total = cantidad * pUnit;
  inputPTotal.value = total.toFixed(2); // toFixed(2) -> se redondea el numero a 2 decimales
};

inputCantidad.onkeyup = () => {
  //cada vez q precione una tecla se va a autocalcular
  calcularTotal();
};
inputCantidad.onchange = () => {
  //cada vez q incremente la cantidad en el input
  calcularTotal();
};
