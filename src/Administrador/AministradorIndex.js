import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AministradorIndex = () => {
  return (
    <Container>
      <header>
        <h1>Bienvenido Administrador</h1>
      </header>
      <nav>
        <Nav>
          <Nav.Item>
            <Nav.Link href="/administrador/escuelas">Escuelas</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/administrador/categorias">Categorías</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/administrador/usuarios">Usuarios</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/administrador/alumnos">Alumnos</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/login">Cerrar Sesión</Nav.Link>
          </Nav.Item>
        </Nav>
      </nav>
    </Container>
  );
};

export default AministradorIndex;
