import { useState } from "react";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import { RootState, useAppDispatch } from "../service/store/store";
import { Navigate } from "react-router-dom";
import { authLoginApi } from "../service/store/auth.reducer";
import { useToken } from "../hooks/token";
import { routerPaths } from "../utils/constanst";
import { useSelector } from "react-redux";

function Login() {
  const loading = useSelector((state: RootState) => state.auth.loading);
  const dispatch = useAppDispatch();
  const isAuth = useToken();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    dispatch(authLoginApi(form));
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      handleLogin();
    }
  };

  return isAuth ? (
    <Navigate to={`/${routerPaths.home}`} />
  ) : (
    <div className="d-flex justify-content-center align-items-center p-2">
      <Form
        inline
        style={{ width: "100%", maxWidth: 500, marginTop: 300 }}
      >
        <h3>Imess - Login</h3>
        <FormGroup>
          <Label
            for="exampleEmail"
            hidden
          >
            Email
          </Label>
          <Input
            id="exampleEmail"
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
        </FormGroup>
        <FormGroup>
          <Label
            for="examplePassword"
            hidden
          >
            Password
          </Label>
          <Input
            id="examplePassword"
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onKeyDown={handleKeyDown}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />
        </FormGroup>
        <Button
          style={{ display: "block", width: "100%" }}
          color="primary"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Form>
      {loading && (
        <div className="loading-container">
          <Spinner>Vui lòng chờ trong giây lát ...</Spinner>
        </div>
      )}
    </div>
  );
}

export default Login;
