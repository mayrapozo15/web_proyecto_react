import React, { useState, useEffect } from "react";
import axios from "axios";
import consultar from "../utils/consultar";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

const Registrar = () => {
  const navigate = useNavigate();
  const [escuelas, setEscuelas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formValues, setFormValues] = useState({
    escuela: "",
    usuario: "",
    clave: "",
    nombres: "",
    rol: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const escuelasResponse = await consultar("escuela", "GET");
        const rolesResponse = await consultar("rol", "GET");

        if (escuelasResponse.error == "0") {
          setEscuelas(escuelasResponse.datos);
        } else {
          setError(escuelasResponse.mensaje);
        }

        if (rolesResponse.error == "0") {
          setRoles(rolesResponse.datos);
        } else {
          setError(rolesResponse.mensaje);
        }
      } catch (error) {
        setError("Error al cargar datos");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log("Datos a registrar:", formValues);
      const response = await consultar("usuario", "POST", formValues);
      if (response.error != "0") {
        setError(response.mensaje);
      } else {
        setSuccess(response.mensaje);
        console.log("Respuesta del servidor:", response.datos);
        navigate('/login');
      }
    } catch (error) {
      setError("Error en las credenciales");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-none w-50">
        <Card.Header className="text-center">
          <h4 className="mb-0 upper">Registrar Usuario</h4>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Escuela</Form.Label>
              <Form.Control
                as="select"
                id="escuela"
                value={formValues.escuela}
                onChange={handleChange}
              >
                <option value="">Seleccione una escuela</option>
                {escuelas.map((escuela) => (
                  <option key={escuela.id} value={escuela.id}>
                    {escuela.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Usuario<span className="req">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                id="usuario"
                value={formValues.usuario}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Clave<span className="req">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                id="clave"
                value={formValues.clave}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Nombres y Apellidos Completos<span className="req">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                id="nombres"
                value={formValues.nombres}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Seleccione Rol</Form.Label>
              <Form.Control
                as="select"
                id="rol"
                value={formValues.rol}
                onChange={handleChange}
              >
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <Row className="justify-content-center">
              <Col className="text-center">
                <Button variant="outline-success" onClick={handleRegister}>
                  Registrar
                </Button>
                <div className="mt-3">
                  <Link to="/login">
                    ¿Ya tienes una cuenta? Inicia sesión aquí
                  </Link>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Registrar;
