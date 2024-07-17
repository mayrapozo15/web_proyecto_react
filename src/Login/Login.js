// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import consultar from '../utils/consultar';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('mayrap');
  const [password, setPassword] = useState('12345');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await consultar(`login/${email}/${password}`, 'GET');
      if(response.error != '0')
        setError(response.mensaje);
      else
      if(response.error != 0){
        alert(response.mensaje);
    }else{
        if(response.datos[0]['rol'] == 1){
            navigate('/administrador');
        }else{
            if(response.datos[0]['rol'] == 2)
            navigate('/entrenador');
        }
    }
      
    } catch (error) {
      setError('Error en las credenciales');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-50 p-4 shadow-sm rounded bg-white">
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
          <div className="text-center mt-3">
            <Link to="/registrar">No tienes una cuenta? Regístrate aquí</Link>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
