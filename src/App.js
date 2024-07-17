import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Login/Registrar';
import AdmniIndex from './Administrador/AministradorIndex';
import AdmniEscuelas from './Administrador/Escuelas';
import AdmniAlumnos from './Administrador/Alumnos';
import AdmniCategorias from './Administrador/Categorias';
import AdmniUsuarios from './Administrador/Usuarios';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
          <Route path="/administrador" element={<AdmniIndex />} />
          <Route path="/administrador/escuelas" element={<AdmniEscuelas />} />
          <Route path="/administrador/alumnos" element={<AdmniAlumnos />} />
          <Route path="/administrador/categorias" element={<AdmniCategorias />} />
          <Route path="/administrador/usuarios" element={<AdmniUsuarios />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
