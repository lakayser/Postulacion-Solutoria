import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alert } from '../functions';
import { fetchUFdata } from '../api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const ShowData = () => {
  const [ufData, setUfData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [name, setName] = useState("");
  const [fecha, setFecha] = useState("");
  const [valor, setValor] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [title, setTitle] = useState("");
  const [operation, setOperation] = useState(1);
  const [id, setId] = useState("");
  const [codigo, setCodigo] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [origen, setOrigen] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/obtenerUF');
      setUfData(response.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  useEffect(() => {
    fetchData()
  }, []);
  const filteredData = ufData.filter((item) => {
    if (!startDate || !endDate) return true;
    return item.fechaIndicador >= startDate && item.fechaIndicador <= endDate;
  });

  const openModal = (op, id, name, fecha, valor, codigo, unidadMedida, origen) => {
    setId(id || '');
    setName(name || '');
    let formattedDate = "";
    if (fecha) {
      const parsedDate = new Date(fecha);
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = parsedDate.toISOString().split('T')[0];
      }
    }
    setFecha(formattedDate);
    setValor(valor || '');
    setCodigo(codigo || '');
    setUnidadMedida(unidadMedida || '');
    setOrigen(origen || '');
    setOperation(op);
    setTitle(op === 1 ? 'Registrar Producto' : 'Editar Producto');

    window.setTimeout(() => {
      document.getElementById('nombre').focus();
    }, 500);
  };


  const handleSave = () => {
    if (operation === 1) {
      console.log("Registrar producto:", { name, fecha, valor });
    } else if (operation === 2) {
      console.log("Editar producto:", { id, name, fecha, valor });
    }

  };
  const validar = () => {
    if (name.trim() === '') {
      show_alert('Escribe un nombre', 'warning');
    } else if (fecha.trim() === '') {
      show_alert('Escribe una fecha', 'warning');
    } else if (valor.trim() === '') {
      show_alert('Escribe un valor', 'warning');
    } else if (codigo.trim() === '') {
      show_alert('Escribe un código de indicador', 'warning');
    } else if (unidadMedida.trim() === '') {
      show_alert('Escribe una unidad de medida', 'warning');
    } else if (origen.trim() === '') {
      show_alert('Escribe el origen del indicador', 'warning');
    } else {
      const parametros = {
        nombreIndicador: name.trim(),
        fechaIndicador: fecha.trim(),
        valorIndicador: valor.trim(),
        codigoIndicador: codigo.trim(),
        unidadMedidaIndicador: unidadMedida.trim(),
        origenIndicador: origen.trim(),
      };

      const metodo = operation === 1 ? 'POST' : 'PUT';
      const url = operation === 1
        ? 'http://localhost:5000/guardarUF'
        : `http://localhost:5000/actualizarUF/${id}`;

      enviarSolicitud(metodo, parametros, url);
    }
  };

  const enviarSolicitud = async (metodo, parametros, url) => {
    console.log(metodo);
    console.log(parametros);
    console.log(url);

    await axios({ method: metodo, url: url, data: parametros })
      .then(function (respuesta) {
        const tipo = (respuesta.status === 200) ? 'success' : 'warning';
        var msj = respuesta.data;
        console.log(respuesta);

        show_alert(msj, tipo);
        if (tipo === 'success') {
          fetchData();
          document.getElementById('btnCerrar').click();
        }
      })
      .catch(function (error) {
        show_alert('Error en la solicitud', 'error');
        console.log(error);
      });
  };
  const deleteProduct = (id, name, fecha) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: 'Seguro que deseas eliminar la ' + name + ' del dia ' + new Date(fecha).toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') + '?',
      icon: 'question', text: 'No se podra dar marcha atras',
      showCancelButton: true, confirmButtonText: 'Si, eliminar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setId(id);
        enviarSolicitud('DELETE', null, `http://localhost:5000/eliminarUF/${id}`);
        fetchData();
      }
      else {
        show_alert('El producto no se elimino', 'info')
      }
    })
  }

  return (
    <div className='App'>
      <div className='container-fluid'>

        <div className='row mt-3'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
            <div className='table-responsive' style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Codigo Indicador</th>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Valor</th>
                    <th>Unidad de medida</th>
                    <th>Origen</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.codigoIndicador}</td>
                        <td>{item.nombreIndicador}</td>
                        <td>{new Date(item.fechaIndicador).toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}</td>
                        <td>
                          {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.valorIndicador)}
                        </td>
                        <td>{item.unidadMedidaIndicador}</td>
                        <td>{item.origenIndicador}</td>
                        <td>
                          <button className='btn btn-warning' onClick={() => openModal(2, item.id, item.nombreIndicador, item.fechaIndicador, item.valorIndicador, item.codigoIndicador, item.unidadMedidaIndicador, item.origenIndicador)} data-bs-toggle='modal' data-bs-target='#modaldata'>
                            <i className='fa-solid fa-edit'></i>
                          </button>
                          &nbsp;
                          <button className='btn btn-danger' onClick={() => deleteProduct(item.id, item.nombreIndicador, item.fechaIndicador)}>
                            <i className='fa-solid fa-trash'></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">Cargando datos...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
              <button onClick={() => openModal(1)} className='btn btn-success' data-bs-toggle='modal' data-bs-target='#modaldata'>
                <i className='fa-solid fa-circle-plus'></i> Añadir Nuevo Valor
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Filtro por fecha y gráfico */}
      <div className="row mt-4">
        <div className="col-12 col-lg-8 offset-0 offset-lg-2">
          <h2>Filtro de fecha</h2>
          <div className="d-flex mb-3">
            <div className="input-group mx-2">
              <span className="input-group-text"><i className="fa-solid fa-calendar"></i></span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="input-group mx-2">
              <span className="input-group-text"><i className="fa-solid fa-calendar"></i></span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <h2>Gráfico de UF</h2>
          <ResponsiveContainer width="90%" height={250}>
            <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="fechaIndicador"
                tickFormatter={(date) => new Date(date).toLocaleDateString('es-CL', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              />
              <YAxis domain={['dataMin', 'dataMax']} />
              <Tooltip
                labelFormatter={(label) => new Date(label).toLocaleDateString('es-CL', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
                formatter={(value) => [`${value}`, "Valor"]}
              />
              <Line type="monotone" dataKey="valorIndicador" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>

        </div>
      </div>
      <div id='modaldata' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id' value={id} ></input>
              <div className="input-group mb-3">
                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="UNIDAD DE FOMENTO (UF)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text"><i className="fa-solid fa-calendar"></i></span>
                <input
                  type="date"
                  id="fecha"
                  className="form-control"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text"><i className="fa-solid fa-dollar-sign"></i></span>
                <input
                  type="number"
                  id="valor"
                  className="form-control"
                  placeholder="Valor"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text"><i className="fa-solid fa-barcode"></i></span>
                <input
                  type="text"
                  id="codigo"
                  className="form-control"
                  placeholder="Código Indicador"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text"><i className="fa-solid fa-ruler"></i></span>
                <input
                  type="text"
                  id="unidadMedida"
                  className="form-control"
                  placeholder="Unidad de Medida"
                  value={unidadMedida}
                  onChange={(e) => setUnidadMedida(e.target.value)}
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text"><i className="fa-solid fa-globe"></i></span>
                <input
                  type="text"
                  id="origen"
                  className="form-control"
                  placeholder="Origen"
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                />
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()} className="btn btn-success">
                  <i className='fa-solid fa-floppy-disk'></i>
                </button>
              </div>
              <div className='modal-footer'>
                <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowData