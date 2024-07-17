import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import consultar from "../utils/consultar";

const Escuelas = () => {
  const [escuelas, setEscuelas] = useState([]);
  const [categoriaEscuela, setCategoriaEscuela] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    nombre: "",
    direccion: "",
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

  const handleShowModal = (escuela) => {
    setModalData({
      id: escuela.id,
      nombre: escuela.nombre,
      direccion: escuela.direccion,
      categoria: escuela.categoria,
    });
    setShowModal(true);
  };

  const handleSubmitModal = async () => {
    try {
      console.log("Datos a escuela:", modalData);
      const response = await consultar("escuela", "POST", modalData);
      if (response.error != "0") {
        setError(response.mensaje);
      } else {
        setSuccess(response.mensaje);
        console.log("Respuesta del servidor:", response.datos);
        await fetchData(); // Refresca la tabla después de guardar los cambios
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error guardando escuela:", error);
    }
  };
  const handleEliminarEscuela = async (idEsceula) => {
    try {
      console.log("Datos a escuela:", idEsceula);
      const response = await consultar(`escuelaEliminar/${idEsceula}`, "GET", null);
      if (response.error != "0") {
        setError(response.mensaje);
      }else {
        setSuccess(response.mensaje);
      }
      console.log("Respuesta del servidor:", response.datos);
      await fetchData(); 
    } catch (error) {
      console.error("Error guardando escuela:", error);
    }
  };

  const fetchData = async () => {
    try {
      const escuelasResponse = await consultar("escuela", "GET");
      const categoriaResponse = await consultar("categoria_escuela", "GET");

      if (escuelasResponse.error != "0") {
        console.error(escuelasResponse.mensaje);
      } else {
        setEscuelas(escuelasResponse.datos);
      }

      if (categoriaResponse.error != "0") {
        console.error(categoriaResponse.mensaje);
      } else {
        setCategoriaEscuela(categoriaResponse.datos);
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
        <h1>Listado de Escuelas</h1>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="row-5 p-4">
        <Button
          variant="outline-success"
          onClick={() =>
            handleShowModal({
              id: null,
              nombre: "",
              direccion: "",
              categoria: "",
            })
          }
        >
          <i className="fas fa-times"></i>
          Nuevo
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="bg-200 text-900">
          <tr>
            <th className="sort pe-1 align-middle">#</th>
            <th className="sort pe-1 align-middle">Nombre</th>
            <th className="sort pe-1 align-middle">Dirección</th>
            <th className="sort pe-1 align-middle">Categoría</th>
            <th className="sort pe-1 align-middle">Opciones</th>
          </tr>
        </thead>
        <tbody>
          {escuelas.map((escuela, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{escuela.nombre}</td>
              <td>{escuela.direccion}</td>
              <td>{escuela.categoria}</td>
              <td>
                <Button
                  variant="outline-info"
                  onClick={() => handleShowModal(escuela)}
                >
                  <i className="fas fa-times"></i>
                  Editar
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleEliminarEscuela(escuela.id)}
                >
                  <i className="fas fa-times"></i>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Escuela</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={modalData.nombre}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDireccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={modalData.direccion}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCategoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select"
                name="categoria"
                value={modalData.categoria}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una categoría</option>
                {categoriaEscuela.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </Form.Control>
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

export default Escuelas;
