import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios'

const Form = ({ isSignInPage = true }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && {
      fullName: "",
    }),
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("data :>> ", data);
    e.preventDefault();
    const res = await fetch(
      `http://localhost:8000/api/${isSignInPage ? "login" : "register"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (res.status === 400) {
      const resData = await res.json();
      console.log(resData);
      toast.error(resData.message);
    } else {
      const resData = await res.json();
      if (resData.token) {
        console.log('message:', resData.message)
        toast.success(resData.message)
        localStorage.setItem("user:token", resData.token);
        localStorage.setItem("user:detail", JSON.stringify(resData.user));
        navigate("/");
      }
    }
  };
  return (
    <div className="bg-light h-screen flex items-center justify-center">
      <div className=" bg-white w-[600px] h-[550px] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className="flex justify-center items-center">
          <img src="/image.png" />
          <p className="font-bold text-2xl -ml-[20px] mt-2">erChat</p>
        </div>
        <div className=" text-4xl font-extrabold">
          Bem-vindo {isSignInPage && "de volta"}
        </div>
        <div className=" text-xl font-light mb-[10px]">
          {isSignInPage
            ? "Faça login para conversar com seus amigos"
            : "Se inscreva para começar"}
        </div>
        <form
          className="flex flex-col items-center w-full"
          onSubmit={(e) => handleSubmit(e)}
        >
          {!isSignInPage && (
            <Input
              label="Nome"
              name="name"
              placeholder="Seu nome"
              className="mb-6 w-[75%]"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
          )}
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Seu e-mail"
            className="mb-6 w-[75%]"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <Input
            label="Senha"
            type="password"
            name="password"
            placeholder="Sua senha"
            className="mb-14 w-[75%]"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <Button
            label={isSignInPage ? "Entrar" : "Registrar-se"}
            type="submit"
            className="w-[75%] mb-2"
          />
        </form>
        <div>
          {isSignInPage ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
          <span
            className=" text-primary cursor-pointer underline"
            onClick={() =>
              navigate(`/users/${isSignInPage ? "sign_up" : "sign_in"}`)
            }
          >
            {isSignInPage ? "Registrar-se" : "Entrar"}
          </span>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default Form;
