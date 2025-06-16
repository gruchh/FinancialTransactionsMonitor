import { useContext, useState } from "react";
import { Mail } from "lucide-react";
import InputField from "../../components/Login/InputField";
import PasswordField from "../../components/Login/PasswordField";
import CheckboxField from "../../components/Login/CheckboxField";
import SubmitButton from "../../components/Login/SubmitButton";
import LoginHeader from "../../components/Login/LoginHeader";
import LoginFooter from "../../components/Login/LoginFooter";
import StatusMessage from "../../components/Login/StatusMessage";
import { validateLoginForm } from "../../components/Login/Validation/loginValidationSchema";
import ForgotPasswordLink from "../../components/Login/ForgotPasswordLink";
import toast from "react-hot-toast";
import { login } from "../../Service/AuthService";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

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
    
    // if (!validateForm()) {
    //   console.log("Formularz zawiera błędy:", errors);
    //   return;
    // }

    setIsSubmitting(true);
    setStatus(null);

    try {
      console.log("Próba wysłania formularza z danymi:", formData);
      const response = await login(formData);
      if(response.status === 200) {
        setAuthData(response.data.token, response.data.role);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        // Removed duplicate login call
        toast.success("Zalogowano pomyślnie!");
        setStatus({ type: "success", message: "Logowanie pomyślne!" });
        navigate("/dashboard");
        console.log("Logowanie udane:", response.data);
      }
    } catch (error) {
      let errorMessage = "Wystąpił błąd podczas logowania. Spróbuj ponownie.";
      
      if (error.response) {
        // Backend zwrócił błąd
        switch (error.response.status) {
          case 401:
            errorMessage = "Nieprawidłowe dane logowania.";
            break;
          case 404:
            errorMessage = "Użytkownik nie istnieje.";
            break;
          case 500:
            errorMessage = "Błąd serwera. Spróbuj ponownie później.";
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Brak połączenia z serwerem. Sprawdź połączenie internetowe.";
      }
      
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
            value={formData.login}
            placeholder="Wprowadź nazwę użytkownika"
            label="Login"
            icon={Mail}
            error={errors.login}
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