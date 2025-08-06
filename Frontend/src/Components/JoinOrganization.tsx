import { useState, useEffect, FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { InputBox } from "./UI/InputBox";
import { Button } from "./UI/Button";
import { useToast } from "./UI/ToastProvider";
import { Navbar } from "./Navbars";

export const JoinOrganization = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

     if (localStorage.getItem("tokenBB")) {
      navigate("/", { replace: true });
      return;
    }
    
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      addToast({ type: "error", message: "No invitation token found.", size: "md" });
      navigate("/auth");
    }
  }, [searchParams, navigate, addToast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, status } = await axios.post(
        "https://api.brainbank.cv/v1/org/join/accept", 
        {
          token: token,
          username: username,
          password: password,
        }
      );

      if (status === 200) {
        addToast({ type: "success", message: data.message, size: "md" });
        navigate("/auth");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "An unexpected error occurred.";
      addToast({ type: "failure", message: errorMsg, size: "md" });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="dark:bg-gray-900 min-h-screen text-white">
      <Navbar closeDropDown={true} />
      <div className="flex flex-col items-center justify-center pt-30">
        <div className="w-80 md:w-full max-w-md p-8 space-y-8 border py-20 px-10 flex flex-col justify-center items-center rounded-xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center dark:text-blackOrange text-whiteOrange">
            Join Organization
          </h2>
          <p className="text-center dark:text-gray-400 text-gray-500">
            Enter your BrainBank credentials to accept the invitation.
          </p>
          <form className="mt-8 space-y-6 flex flex-col items-center" onSubmit={handleSubmit}>
            <InputBox
              variant="auth"
              placeholder="Username"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <InputBox
              variant="auth"
              placeholder="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="primary"
              size="md"
              text={loading ? "Joining..." : "Join Organization"}
              type="submit"
              disabled={loading || !username || !password}
              fullWidth
            />
          </form>
        </div>
      </div>
    </div>
  );
};
