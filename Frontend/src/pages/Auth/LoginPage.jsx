import { Mail } from "lucide-react";
import { useState } from "react";
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
import { validateLoginForm } from "../../utils/Validation/loginValidationSchema";
import { useAuth } from "../../hooks";

const LoginPage = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const handleDataChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({
      ...data,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (error) {
      clearError(); 
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
      return;
    }

    try {
      const result = await login({
        username: formData.username,
        password: formData.password,
      });
      
      if (result.success) {
        toast.success("Zalogowano pomyślnie!");
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Logowanie nie powiodło się");
      }
    } catch (error) {
      toast.error("Wystąpił nieoczekiwany błąd", error);
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
          {error && (
            <StatusMessage 
              status={{ type: "error", message: error }} 
            />
          )}

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
            isSubmitting={isLoading}
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