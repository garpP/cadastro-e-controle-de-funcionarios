import { useState } from "react";
import { TextField, Button, Stack, Box } from "@mui/material";
import type { FormData } from "../types";

interface Props {
  next: (data: Partial<FormData>) => void;
  back: () => void;
  data: FormData;
}

export default function Step2({ next, back, data }: Props) {
  const [cargo, setCargo] = useState(data.cargo || "");
  const [telefone, setTelefone] = useState(data.telefone || "");

  const isInvalid = !cargo.trim() || !telefone.trim();

  return (
    <Stack spacing={1}>
      <TextField
        label="Cargo"
        required
        fullWidth
        margin="normal"
        value={cargo}
        onChange={(e) => setCargo(e.target.value)}
        error={cargo !== "" && !cargo.trim()}
      />

      <TextField
        label="Telefone"
        required
        fullWidth
        margin="normal"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        error={telefone !== "" && !telefone.trim()}
      />

      <Box display="flex" gap={2} mt={3}>
        <Button fullWidth variant="outlined" onClick={back}>
          Voltar
        </Button>
        <Button
          fullWidth
          variant="contained"
          disabled={isInvalid}
          onClick={() => next({ cargo, telefone })}
        >
          Revisar
        </Button>
      </Box>
    </Stack>
  );
}
