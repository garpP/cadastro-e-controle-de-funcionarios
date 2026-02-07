import {
  Button,
  Typography,
  CircularProgress,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { FormData } from "../types";
import { useState } from "react";

interface Props {
  back: () => void;
  data: FormData;
  finalizar: () => void;
}

export default function Step3({ back, data, finalizar }: Props) {
  const [loading, setLoading] = useState(false);

  const salvar = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, "funcionarios"), {
        ...data,
        status: "Ativo",
        createdAt: new Date(),
      });
      alert("Funcionário cadastrado com sucesso!");
      finalizar();
    } catch (err) {
      console.error("Erro ao salvar no Firebase:", err);
      alert("Erro ao salvar os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Revisão dos Dados
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
        <Typography variant="caption">NOME</Typography>
        <Typography mb={1}>{data.nome}</Typography>
        <Divider />
        <Typography variant="caption">CARGO</Typography>
        <Typography>{data.cargo}</Typography>
      </Paper>
      <Box display="flex" gap={2}>
        <Button fullWidth variant="outlined" onClick={back} disabled={loading}>
          Voltar
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={salvar}
          disabled={loading}
          color="success"
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Finalizar Cadastro"
          )}
        </Button>
      </Box>
    </Box>
  );
}
