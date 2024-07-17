import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import consultar from "../utils/consultar";

const Alumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    escuela: "",
    cedula: "",
    nombres: "",
    apellidos: "",
    genero: "",
    estatura: "",
    peso: "",
    edad: "",
    categoria: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData({
      ...modalData,
      [name]: value,
    });
  };

  const handleShowModal = (alumno) => {
    setModalData({
      id: alumno.id,
      escuela: alumno.escuela_id,
      cedula: alumno.cedula,
      nombres: alumno.nombres,
      apellidos: alumno.apellidos,
      genero: alumno.genero,
      estatura: alumno.estatura,
      peso: alumno.peso,
      edad: alumno.edad,
      categoria: alumno.categoria,
    });
    setShowModal(true);
  };

  const handleSubmitModal = async () => {
    try {
      console.log(modalData);
      const response = await consultar("alumnoNuevo", "POST", modalData);
      if (response.error != "0") {
        setError(response.mensaje);
      } else {
        setSuccess(response.mensaje);
        await fetchData();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error guardando alumno:", error);
    }
  };

  const handleEliminarAlumno = async (idAlumno) => {
    try {
      const response = await consultar(`alumno/${idAlumno}`, "DELETE");
      if (response.error != "0") {
        setError(response.mensaje);
      } else {
        setSuccess(response.mensaje);
        await fetchData();
      }
    } catch (error) {
      console.error("Error eliminando alumno:", error);
    }
  };

  const fetchData = async () => {
    try {
      const alumnosResponse = await consultar("alumno", "GET");
      const escuelasResponse = await consultar("escuela", "GET");

      if (alumnosResponse.error == "0") {
        setAlumnos(alumnosResponse.datos);
      }

      if (escuelasResponse.error == "0") {
        setEscuelas(escuelasResponse.datos);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <div className="row p-1 d-flex justify-content-between">
        <div className="col-10">
          <Button variant="outline-warning">
            <a className="nav-link" href="/administrador">
              Regresar
            </a>
          </Button>
        </div>
        <div className="col">
          <Button variant="outline-info">
            <a className="nav-link" href="/login">
              Cerrar Sesión
            </a>
          </Button>
        </div>
      </div>

      <div className="justify-content-center text-center">
        <h1>Listado de Alumnos</h1>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="row-5 p-4">
        <Button variant="outline-success" onClick={() => setShowModal(true)}>
          Nuevo
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="bg-200 text-900">
          <tr>
            <th>#</th>
            <th>Escuela</th>
            <th>Cédula</th>
            <th>Apellidos y Nombres</th>
            <th>Género</th>
            <th>Estatura</th>
            <th>Peso</th>
            <th>Edad</th>
            <th>Categoria</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno, index) => (
            <tr key={alumno.id}>
              <td>{index + 1}</td>
              <td>{alumno.escuela_nombre}</td>
              <td>{alumno.cedula}</td>
              <td>
                {alumno.apellidos} - {alumno.nombres}
              </td>
              <td>{alumno.genero}</td>
              <td>{alumno.estatura}</td>
              <td>{alumno.peso}</td>
              <td>{alumno.edad}</td>
              <td>{alumno.categoria}</td>
              <td>
                <Button
                  variant="outline-info"
                  onClick={() => handleShowModal(alumno)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleEliminarAlumno(alumno.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalData.id ? "Editar Alumno" : "Nuevo Alumno"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEscuela">
              <Form.Label>Escuela</Form.Label>
              <Form.Control
                as="select"
                name="escuela"
                value={modalData.escuela}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una escuela</option>
                {escuelas.map((escuela) => (
                  <option key={escuela.id} value={escuela.id}>
                    {escuela.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCedula">
              <Form.Label>Cédula</Form.Label>
              <Form.Control
                type="text"
                name="cedula"
                value={modalData.cedula}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formNombres">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                name="nombres"
                value={modalData.nombres}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formApellidos">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                name="apellidos"
                value={modalData.apellidos}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formGenero">
              <Form.Label>Género</Form.Label>
              <Form.Control
                as="select"
                name="genero"
                value={modalData.genero}
                onChange={handleInputChange}
              >
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Ninguno">Ninguno</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCategoria">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                as="select"
                name="categoria"
                value={modalData.categoria}
                onChange={handleInputChange}
              >
                <option value="1">U12</option>
                <option value="2">U13</option>
                <option value="3">U14</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formEstatura">
              <Form.Label>Estatura</Form.Label>
              <Form.Control
                type="text"
                name="estatura"
                value={modalData.estatura}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPeso">
              <Form.Label>Peso</Form.Label>
              <Form.Control
                type="text"
                name="peso"
                value={modalData.peso}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEdad">
              <Form.Label>Edad</Form.Label>
              <Form.Control
                type="text"
                name="edad"
                value={modalData.edad}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSubmitModal}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Alumnos;
