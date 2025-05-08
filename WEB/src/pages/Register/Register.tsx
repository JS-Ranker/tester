import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaUser, FaIdCard, FaLock, FaEnvelope, FaPhone, FaPaw } from "react-icons/fa";
import styles from "./Register.module.css";
import { apiService } from "../../services/duenos";
import { validarRut, formatearRut } from "../../utils/rutValidador";

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Para el RUT, aplicamos formato mientras se escribe
    if (name === "rut") {
      // Eliminar caracteres no válidos (solo permitir números, K y k)
      const cleanValue = value.replace(/[^0-9kK]/g, '');
      
      // Mantener el formato mientras se escribe
      setFormData((prev) => ({
        ...prev,
        [name]: cleanValue,
      }));
      
      // Validar RUT
      if (cleanValue.length > 0) {
        if (!validarRut(cleanValue)) {
          setErrors(prev => ({...prev, rut: "RUT inválido"}));
        } else {
          setErrors(prev => ({...prev, rut: ""}));
        }
      } else {
        setErrors(prev => ({...prev, rut: ""}));
      }
      
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validaciones en tiempo real
    validateField(name, value);
  };
  
  // Validar un campo específico
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "nombre":
        if (!value) {
          setErrors(prev => ({...prev, nombre: "El nombre es obligatorio"}));
        } else if (value.length < 2) {
          setErrors(prev => ({...prev, nombre: "El nombre debe tener al menos 2 caracteres"}));
        } else {
          setErrors(prev => ({...prev, nombre: ""}));
        }
        break;
        
      case "apellido":
        if (!value) {
          setErrors(prev => ({...prev, apellido: "El apellido es obligatorio"}));
        } else if (value.length < 2) {
          setErrors(prev => ({...prev, apellido: "El apellido debe tener al menos 2 caracteres"}));
        } else {
          setErrors(prev => ({...prev, apellido: ""}));
        }
        break;
        
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          setErrors(prev => ({...prev, email: "El email es obligatorio"}));
        } else if (!emailRegex.test(value)) {
          setErrors(prev => ({...prev, email: "El formato del email no es válido"}));
        } else {
          setErrors(prev => ({...prev, email: ""}));
        }
        break;
        
      case "password":
        if (!value) {
          setErrors(prev => ({...prev, password: "La contraseña es obligatoria"}));
        } else if (value.length < 6) {
          setErrors(prev => ({...prev, password: "La contraseña debe tener al menos 6 caracteres"}));
        } else {
          setErrors(prev => ({...prev, password: ""}));
        }
        
        // También validamos confirmPassword si ya tiene algún valor
        if (formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            setErrors(prev => ({...prev, confirmPassword: "Las contraseñas no coinciden"}));
          } else {
            setErrors(prev => ({...prev, confirmPassword: ""}));
          }
        }
        break;
        
      case "confirmPassword":
        if (!value) {
          setErrors(prev => ({...prev, confirmPassword: "Debe confirmar la contraseña"}));
        } else if (value !== formData.password) {
          setErrors(prev => ({...prev, confirmPassword: "Las contraseñas no coinciden"}));
        } else {
          setErrors(prev => ({...prev, confirmPassword: ""}));
        }
        break;
        
      default:
        break;
    }
  };

  // Validar todo el formulario
  const validateForm = () => {
    let isValid = true;
    
    // Validar cada campo
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'telefono') { // El teléfono es opcional
        validateField(key, value);
        
        // Si hay algún error, el formulario no es válido
        if (errors[key as keyof typeof errors]) {
          isValid = false;
        }
      }
    });
    
    // Validaciones adicionales
    if (!validarRut(formData.rut)) {
      setErrors(prev => ({...prev, rut: "RUT inválido"}));
      isValid = false;
    }
    
    return isValid;
  };

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación final antes de enviar
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Preparar datos para enviar al backend
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        rut: formData.rut.replace(/\./g, '').replace(/-/g, ''), // Enviar RUT sin formato
        email: formData.email,
        telefono: formData.telefono || undefined, // Si está vacío, se enviará como undefined
        password: formData.password,
      };
      
      // Enviar petición al backend
      const response = await apiService.registrarDueno(userData);
      
      // Guardar datos del usuario en localStorage
      localStorage.setItem("currentUser", JSON.stringify(response));
      
      // Animación antes de redireccionar
      const registerForm = document.getElementById("registerForm");
      if (registerForm) {
        registerForm.classList.add(styles.formSuccess);
      }
      
      // Redireccionar después de un tiempo
      setTimeout(() => {
        navigate("/user");
      }, 1000);
      
    } catch (error: any) {
      // Mostrar error
      alert(error.message || "Error al registrar usuario");
      setIsSubmitting(false);
    }
  };

  // Formatear RUT cuando el campo pierde el foco
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name === "rut" && e.target.value && validarRut(e.target.value)) {
      setFormData(prev => ({
        ...prev,
        rut: formatearRut(e.target.value)
      }));
    }
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
              <FaArrowLeft /> <span></span>
            </Link>
            <h2 className={styles.formTitle}>Crear Cuenta</h2>
          </div>
          
          <form id="registerForm" className={styles.registerForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre">Nombre</label>
              <div className={styles.inputContainer}>
                <FaUser className={styles.inputIcon} />
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              {errors.nombre && <p className={styles.errorText}>{errors.nombre}</p>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="apellido">Apellido</label>
              <div className={styles.inputContainer}>
                <FaUser className={styles.inputIcon} />
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                  required
                />
              </div>
              {errors.apellido && <p className={styles.errorText}>{errors.apellido}</p>}
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
                  onBlur={handleBlur}
                  placeholder="Ej: 12345678-9"
                  required
                />
              </div>
              {errors.rut && <p className={styles.errorText}>{errors.rut}</p>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Correo Electrónico</label>
              <div className={styles.inputContainer}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="telefono">Teléfono (opcional)</label>
              <div className={styles.inputContainer}>
                <FaPhone className={styles.inputIcon} />
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+56 9 1234 5678"
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