import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaUser, FaIdCard, FaLock, FaPaw } from "react-icons/fa";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rut: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validaciones en tiempo real
    if (name === "password") {
      if (value.length < 6) {
        setErrors(prev => ({...prev, password: "La contraseña debe tener al menos 6 caracteres"}));
      } else {
        setErrors(prev => ({...prev, password: ""}));
      }
    }
    
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrors(prev => ({...prev, confirmPassword: "Las contraseñas no coinciden"}));
      } else {
        setErrors(prev => ({...prev, confirmPassword: ""}));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación final antes de enviar
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({...prev, confirmPassword: "Las contraseñas no coinciden"}));
      return;
    }
    
    if (formData.password.length < 6) {
      setErrors(prev => ({...prev, password: "La contraseña debe tener al menos 6 caracteres"}));
      return;
    }
    
    setIsSubmitting(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some((user: any) => user.rut === formData.rut);

      if (userExists) {
        alert("Este RUT ya está registrado");
        setIsSubmitting(false);
        return;
      }

      const newUser = {
        name: formData.name,
        rut: formData.rut,
        password: formData.password,
        pets: [],
      };

      localStorage.setItem("users", JSON.stringify([...users, newUser]));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      
      // Animación antes de redireccionar
      const registerForm = document.getElementById("registerForm");
      if (registerForm) {
        registerForm.classList.add(styles.formSuccess);
      }
      
      setTimeout(() => {
        navigate("/user");
      }, 1000);
    }, 800);
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
            <h2>¡Bienvenido!</h2>
            <p>Regístrate para acceder a todos nuestros servicios para el cuidado de tus mascotas</p>
          </div>
        </div>
        
        <div className={styles.rightPanel}>
          <div className={styles.formHeader}>
            <Link to="/" className={styles.backLink}>
              <FaArrowLeft /> <span>   </span>
            </Link>
            <h2 className={styles.formTitle}>Crear Cuenta</h2>
          </div>
          
          <form id="registerForm" className={styles.registerForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nombre Completo</label>
              <div className={styles.inputContainer}>
                <FaUser className={styles.inputIcon} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre y apellido"
                  required
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="rut">RUT</label>
              <div className={styles.inputContainer}>
                <FaIdCard className={styles.inputIcon} />
                <input
                  type="text"
                  id="rut"
                  name="rut"
                  value={formData.rut}
                  onChange={handleChange}
                  placeholder="Ej: 12345678-9"
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              {errors.password && <p className={styles.errorText}>{errors.password}</p>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <div className={styles.inputContainer}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                  required
                />
              </div>
              {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}
            </div>
            
            <button 
              type="submit" 
              className={`${styles.registerButton} ${isSubmitting ? styles.loading : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className={styles.buttonContent}>
                  <span className={styles.spinner}></span>
                  <span>Procesando...</span>
                </div>
              ) : (
                <span>Registrarse</span>
              )}
            </button>
            
            <div className={styles.loginLinkContainer}>
              <p>¿Ya tienes una cuenta? <Link to="/login" className={styles.loginLink}>Iniciar Sesión</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;