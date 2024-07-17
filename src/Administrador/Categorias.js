import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import consultar from "../utils/consultar";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    nombre: "",
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

  const handleShowModal = (categoria) => {
    setModalData({
      id: categoria.id,
      nombre: categoria.nombre,
    });
    setShowModal(true);
  };

  const handleSubmitModal = async () => {
    try {
      console.log(modalData);
      const response = await consultar("categoria_escuela", "POST", modalData);
      if (response.error != "0") {
        setError(response.mensaje);
      } else {
        setSuccess(response.mensaje);
        console.log(response.mensaje);
        await fetchData();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error guardando categoría:", error);
    }
  };

  const handleEliminarCategoria = async (idCategoria) => {
    try {
      const response = await consultar(`categoria_escuela/${idCategoria}`, "DELETE");
      if (response.error != "0") {
        setError(response.mensaje);
      } else {
        setSuccess(response.mensaje);
        await fetchData();
      }
    } catch (error) {
      console.error("Error eliminando categoría:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await consultar("categoria_escuela", "GET");
      if (response.error != "0") {
        console.error(response.mensaje);
      } else {
        setCategorias(response.datos);
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
        <h1>Listado de Categorías</h1>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="row-5 p-4">
        <Button
          variant="outline-success"
          onClick={handleShowModal}
        >
          Nuevo
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="bg-200 text-900">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria, index) => (
            <tr key={categoria.id}>
              <td>{index + 1}</td>
              <td>{categoria.nombre}</td>
              <td>
                <Button
                  variant="outline-info"
                  onClick={() => handleShowModal(categoria)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleEliminarCategoria(categoria.id)}
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
          <Modal.Title>{modalData.id ? "Editar Categoría" : "Nueva Categoría"}</Modal.Title>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSubmitModal}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Categorias;
