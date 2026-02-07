import { useState } from "react";
import { TextField, Button, Stack, Box } from "@mui/material";
import type { FormData } from "../types";

interface Props {
  next: (data: Partial<FormData>) => void;
  back: () => void;
  data: FormData;
}

export default function Step1({ next, back, data }: Props) {
  const [nome, setNome] = useState(data.nome || "");
  const [email, setEmail] = useState(data.email || "");
  const [senha, setSenha] = useState(data.senha || "");

  const isInvalid = !nome.trim() || !email.trim() || !senha.trim();

  return (
    <Stack spacing={1}>
      <TextField
        label="Nome Completo"
        required
        fullWidth
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        error={nome !== "" && !nome.trim()}
      />
      <TextField
        label="E-mail"
        required
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={email !== "" && !email.trim()}
      />
      <TextField
        label="Senha"
        type="password"
        required
        fullWidth
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        error={senha !== "" && !senha.trim()}
      />
      <Box display="flex" gap={2} mt={2}>
        <Button fullWidth variant="outlined" onClick={back}>
          Cancelar
        </Button>
        <Button
          fullWidth
          variant="contained"
          disabled={isInvalid}
          onClick={() => next({ nome, email, senha })}
        >
          Próximo
        </Button>
      </Box>
    </Stack>
  );
}
