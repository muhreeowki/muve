import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import gradient from "../assets/abstract-gradient-neon-lights.jpg";
import { login } from "../redux/slices.js";

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
    <main className="p-5 h-screen">
      <Navbar />
      <div className="w-full flex flex-col justify-items-center justify-center">
        {/* Hero */}
        <div className="overflow-hidden">
          <div className="container py-24 lg:py-32">
            <div className="md:pe-8 md:w-1/2 xl:pe-0 xl:w-5/12">
              {/* Title */}
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Transforming your music streaming experience
              </h1>
              <p className="mt-3 text-xl text-muted-foreground">
                Convert playlists seamlessly across a variety of selected
                platforms
              </p>
              {/* End Title */}
              <Separator asChild className="my-6 bg-background">
                <div className="py-3 flex items-center text-xs text-muted-foreground uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:before:border-gray-700 dark:after:border-gray-700">
                  {signUp ? "Create Account" : "Welcome Back"}
                </div>
              </Separator>
              {/* Form */}
              <form>
                <div className="mb-4">
                  <Label htmlFor="username" className="sr-only">
                    Username
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                {signUp ? (
                  <div className="mb-4">
                    <Label htmlFor="email" className="sr-only">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className="mb-4">
                  <Label htmlFor="password" className="sr-only">
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid">
                  <Button onClick={handleRequest}>
                    {signUp ? "Sign up" : "Login"}
                  </Button>
                </div>
                <p
                  className="mt-3 w-fit text-sm cursor-pointer transition-all hover:text-teal-600"
                  onClick={() => setSignUp(!signUp)}
                >
                  {signUp
                    ? "Already have an Account? Login."
                    : "Don't have an Account? Sign up."}
                </p>
              </form>
              {/* End Form */}
            </div>
          </div>
          <img
            className="hidden md:block md:absolute md:top-0 md:start-1/2 md:end-0 h-full"
            src={gradient}
            alt="image description"
          />
          {/* End Col */}
        </div>
        {/* End Hero */}
      </div>
    </main>
  );
};

export default LoginForm;
