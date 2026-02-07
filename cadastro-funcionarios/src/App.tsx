import { useState } from "react";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Login from "./components/Login";
import Home from "./components/Home";
import type { FormData } from "./types";
import { Container, Paper } from "@mui/material";

type Tela = "login" | "steps" | "home";

export default function App() {
  const [tela, setTela] = useState<Tela>("login");
  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [data, setData] = useState<FormData>({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    telefone: "",
    status: "Ativo",
  });

  const next = (dados: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...dados }));
    setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);

  if (tela === "login") {
    return (
      <Login
        goHome={(email) => {
          setUserEmail(email);
          setTela("home");
        }}
        goRegister={() => {
          setTela("steps");
          setStep(1);
        }}
      />
    );
  }

  if (tela === "home") {
    return (
      <Home
        sair={() => {
          setUserEmail(null);
          setTela("login");
        }}
        userEmail={userEmail}
      />
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 3 }}>
        {step === 1 && (
          <Step1 next={next} back={() => setTela("login")} data={data} />
        )}

        {step === 2 && <Step2 next={next} back={back} data={data} />}

        {step === 3 && (
          <Step3 back={back} data={data} finalizar={() => setTela("home")} />
        )}
      </Paper>
    </Container>
  );
}
