import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaIdCard, FaLock, FaPaw } from "react-icons/fa";
import styles from "./Login.module.css";

interface User {
  name: string;
  rut: string;
  password: string;
  pets: any[];
}

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    rut: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulamos un tiempo de carga para mostrar la animación
    setTimeout(() => {
      // Obtener usuarios registrados
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Buscar usuario que coincida
      const user = users.find(
        (user: User) =>
          user.rut === loginData.rut && user.password === loginData.password
      );

      if (user) {
        // Guardar usuario en sesión
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Mostrar animación de éxito antes de redireccionar
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
          loginForm.classList.add(styles.formSuccess);
        }
        
        setTimeout(() => {
          // Redirigir al perfil
          navigate("/user");
        }, 1000);
      } else {
        alert("Credenciales incorrectas");
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.logoContainer}>
            <FaPaw className={styles.logo} />
            <h1 className={styles.brandName}>Veterinaria</h1>
          </div>
          <div className={styles.welcomeText}>
            <h2>¡Bienvenido de nuevo!</h2>
            <p>Inicia sesión para acceder a los servicios y gestionar el cuidado de tus mascotas</p>
          </div>
        </div>
        
        <div className={styles.rightPanel}>
          <div className={styles.formHeader}>
            <Link to="/" className={styles.backLink}>
              <FaArrowLeft /> <span>   </span>
            </Link>
            <h2 className={styles.formTitle}>Iniciar Sesión</h2>
          </div>
          
          <form id="loginForm" className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="rut">RUT</label>
              <div className={styles.inputContainer}>
                <FaIdCard className={styles.inputIcon} />
                <input
                  type="text"
                  id="rut"
                  name="rut"
                  value={loginData.rut}
                  onChange={handleChange}
                  placeholder="Ingresa tu RUT (ej: 12345678-9)"
                  required
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <div className={styles.inputContainer}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`${styles.loginButton} ${isSubmitting ? styles.loading : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className={styles.buttonContent}>
                  <span className={styles.spinner}></span>
                  <span>Verificando...</span>
                </div>
              ) : (
                <span>Ingresar</span>
              )}
            </button>
            
            <div className={styles.registerLinkContainer}>
              <p>¿No tienes una cuenta? <Link to="/register" className={styles.registerLink}>Regístrate aquí</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;