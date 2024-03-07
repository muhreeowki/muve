import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices";

const cookies = new Cookies();

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [signUp, setSignUp] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.store.user);

  const handleRequest = () => {
    const requestData = {
      username: username,
      password: password,
      email: email,
    };

    // set/unset auth_token in axios
    axios
      .post(
        `http://127.0.0.1:8000/${signUp ? "sign-up" : "login"}/`,
        requestData,
      )
      .then((response) => {
        // Store the token in a cookie
        console.log(response);
        dispatch(login({ ...response.data.user, token: response.data.token }));
        cookies.set("auth_token", response.data.token);
        navigate("/");
      });
  };

  useEffect(() => {
    if (user) {
      console.log(user.username + " is Logged in");
      navigate("/");
    }
  });

  return (
    <div className="relative items-center flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 bg-neutral-900 rounded-xl shadow-zinc-700 drop-shadow-xl lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-neutral-300 uppercase">
          {signUp ? "Create an Account" : "Login"}
        </h1>
        <form className="mt-6" action="">
          <div className="mb-2">
            <label className="block text-sm font-semibold text-neutral-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="block w-full px-4 py-2 mt-2 text-neutral-900 bg-white border rounded-md focus:border-neautral-400 focus:ring-neutral-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {signUp ? (
            <div className="mb-2">
              <label className="block text-sm font-semibold text-neutral-300">
                Email
              </label>
              <input
                id="email"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-neutral-900 bg-white border rounded-md focus:border-neautral-400 focus:ring-neutral-300 focus:outline-none focus:ring focus:ring-opacity-40"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            ""
          )}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-neutral-300">
              Password
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 mt-2 text-neutral-900 bg-white border rounded-md focus:border-neutral-400 focus:ring-neutral-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-6">
            <button
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-neutral-600 rounded-md hover:bg-neutral-500 focus:outline-none focus:bg-neutral-600"
              onClick={handleRequest}
            >
              {signUp ? "Sign Up" : "Login"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs font-light text-center text-gray-400">
          {" "}
          {signUp ? "Already have an account? " : "Don't have an account? "}
          <a
            href="#"
            className="font-medium text-neutral-200 hover:underline"
            onClick={() => setSignUp(signUp ? false : true)}
          >
            {signUp ? "Login" : "Sign Up"}
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
