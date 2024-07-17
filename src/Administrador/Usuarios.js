import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import consultar from '../utils/consultar';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    usuario: '',
    clave: '',
    rol: '',
    escuela: '',
    nombres: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
    setSuccess('');
    setModalData({
      usuario: '',
      clave: '',
      rol: '',
      escuela: '',
      nombres: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData({
      ...modalData,
      [name]: value,
    });
  };

  const handleShowModal = (usuario) => {
    console.log(usuario);
    setModalData({
      id: usuario.id,
      usuario: usuario.usuario,
      clave: usuario.clave,
      rol: usuario.rol,
      escuela: usuario.escuela,
      nombres: usuario.nombres,
    });
    setShowModal(true);
  };

  const handleSubmitModal = async () => {
    try {
        console.log(modalData);
      const response = await consultar('usuario', 'POST', modalData);
      if (response.error != '0') {
        setError(response.mensaje);
      } else {
        setSuccess(response.mensaje);
        await fetchData();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error guardando usuario:', error);
    }
  };

  const handleEliminarUsuario = async (idUsuario) => {
    try {
      const response = await consultar(`usuario/${idUsuario}`, 'DELETE');
      if (response.error != '0') {
        setError(response.mensaje);
      } else {
        setSuccess(response.mensaje);
        await fetchData();
      }
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [usuariosResponse, rolesResponse, escuelasResponse] = await Promise.all([
        consultar('usuario', 'GET'),
        consultar('rol', 'GET'),
        consultar('escuela', 'GET')
      ]);

      if (usuariosResponse.error == '0') setUsuarios(usuariosResponse.datos);
      if (rolesResponse.error == '0') setRoles(rolesResponse.datos);
      if (escuelasResponse.error == '0') setEscuelas(escuelasResponse.datos);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
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
        <h1>Listado de Usuarios</h1>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <div className="row-5 p-4">
        <Button variant="outline-success" onClick={() => setShowModal(true)}>
          Nuevo
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="bg-200 text-900">
          <tr>
            <th>#</th>
            <th>Nombres Y Apellidos</th>
            <th>Escuela</th>
            <th>Rol</th>
            <th>Usuario</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={usuario.id}>
              <td>{index + 1}</td>
              <td>{usuario.nombres}</td>
              <td>{usuario.escuela_nombre}</td>
              <td>{usuario.rol_nombre}</td>
              <td>@{usuario.usuario}</td>
              <td>
                <Button
                  variant="outline-info"
                  onClick={() => handleShowModal(usuario)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleEliminarUsuario(usuario.id)}
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
          <Modal.Title>{modalData.id ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsuario">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                name="usuario"
                value={modalData.usuario}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formClave">
              <Form.Label>Clave</Form.Label>
              <Form.Control
                type="password"
                name="clave"
                value={modalData.clave}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRol">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                name="rol"
                value={modalData.rol}
                onChange={handleInputChange}
              >
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formEscuela">
              <Form.Label>Escuela</Form.Label>
              <Form.Control
                as="select"
                name="escuela"
                value={modalData.escuela}
                onChange={handleInputChange}
              >
                {escuelas.map((escuela) => (
                  <option key={escuela.id} value={escuela.id}>
                    {escuela.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formNombres">
              <Form.Label>Nombres Y Apellidos</Form.Label>
              <Form.Control
                type="text"
                name="nombres"
                value={modalData.nombres}
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

export default Usuarios;
