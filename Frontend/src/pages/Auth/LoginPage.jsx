import { Mail } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CheckboxField from "../../components/Login/CheckboxField";
import ForgotPasswordLink from "../../components/Login/ForgotPasswordLink";
import InputField from "../../components/Login/InputField";
import LoginFooter from "../../components/Login/LoginFooter";
import LoginHeader from "../../components/Login/LoginHeader";
import PasswordField from "../../components/Login/PasswordField";
import StatusMessage from "../../components/Login/StatusMessage";
import SubmitButton from "../../components/Login/SubmitButton";
import { validateLoginForm } from "../../components/Login/Validation/loginValidationSchema";
import { AppContext } from "../../context/AppContext";
import { login } from "../../service/AuthService";

const LoginPage = () => {
  const { setAuthData } = useContext(AppContext);
  
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  }); 
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleDataChange = (e) => {
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    console.log("Input changed:", e.target.value);
    console.log(formData);
    
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const { errors, isValid } = validateLoginForm(formData);
    setErrors(errors);
    return isValid;
  };

 

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    console.log("Formularz zawiera błędy:", errors);
    return;
  }
  
  setIsSubmitting(true);
  setStatus(null);
  
  try {
    console.log("Próba wysłania formularza z danymi:", formData);
    const response = await login(formData);
    console.log("Odpowiedź z serwera:", response);
    
    if (response.status === "success") {
      console.log("Logowanie udane");
      console.log(response.data);
      
      const { token, roles } = response.data;
      console.log("ROLES: ",roles);
      
      console.log("token: ",token);

      const userRoles = roles && roles.length > 0 ? roles : ["TRADER"];
      const roleHierarchy = ["ADMIN", "TRADER"];

      const primaryRole = userRoles.find(role => roleHierarchy.includes(role)) || userRoles[0];
      
      console.log("Role użytkownika:", userRoles);
      console.log("Główna rola:", primaryRole);
      
      setAuthData(token, userRoles, response.data);
      
      localStorage.setItem("token", token);
      localStorage.setItem("roles", JSON.stringify(userRoles));
      localStorage.setItem("primaryRole", primaryRole);
      
      toast.success("Zalogowano pomyślnie!");
      setStatus({ type: "success", message: "Logowanie pomyślne!" });
      
      navigate("/dashboard");
    }  
  } catch (error) {
    console.error("Błąd podczas logowania:", error);
    const errorMessage = error.message;
    setStatus({ type: "error", message: errorMessage });
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <LoginHeader
          title="Zaloguj się"
          subtitle="Wprowadź swoje dane logowania"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <StatusMessage status={status} />

          <InputField
            id="username"
            name="username"
            type="text"
            value={formData.username}
            placeholder="Wprowadź nazwę użytkownika"
            label="Login"
            icon={Mail}
            error={errors.username}
            onChange={handleDataChange}
          />

          <PasswordField
            id="password"
            name="password"
            value={formData.password}
            placeholder="Wprowadź hasło"
            label="Hasło"
            error={errors.password}
            onChange={handleDataChange}
          />

          <div className="flex items-center justify-between">
            <CheckboxField
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleDataChange}
              label="Zapamiętaj mnie"
            />
            <ForgotPasswordLink />
          </div>

          <SubmitButton
            isSubmitting={isSubmitting}
            loadingText="Logowanie..."
            onClick={handleSubmit}
          >
            Zaloguj się
          </SubmitButton>

          <LoginFooter />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;