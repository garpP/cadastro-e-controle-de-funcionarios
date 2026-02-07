import { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Divider,
  Collapse,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

interface ElectronIPC {
  send: (channel: string, ...args: unknown[]) => void;
}

interface ElectronWindow extends Window {
  require: (module: string) => { ipcRenderer: ElectronIPC };
  process: {
    type: string;
  };
}

const win = window as unknown as ElectronWindow;

const isElectron = !!(win && win.process && win.process.type);
const ipcRenderer = isElectron ? win.require("electron").ipcRenderer : null;

interface Props {
  goHome: (email: string) => void;
  goRegister: () => void;
}

export default function Login({ goHome, goRegister }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showExit, setShowExit] = useState(false);
  const [adminSenha, setAdminSenha] = useState("");

  const handleLogin = async () => {
    if (!email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const q = query(
        collection(db, "funcionarios"),
        where("email", "==", email),
        where("senha", "==", senha),
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        alert("Credenciais inválidas");
        return;
      }

      goHome(email);
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao conectar com o banco de dados.");
    }
  };

  const handleFecharSistema = () => {
    if (adminSenha === "adm0129384756") {
      if (ipcRenderer) {
        ipcRenderer.send("fechar-app");
      } else {
        alert("Comando disponível apenas na versão Desktop.");
      }
    } else {
      alert("Senha de administrador incorreta!");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f0f2f5"
    >
      <Paper sx={{ p: 4, width: 350, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Entrar
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, py: 1.5 }}
          onClick={handleLogin}
        >
          Entrar
        </Button>

        <Button fullWidth sx={{ mt: 1 }} onClick={goRegister}>
          Cadastrar Funcionário
        </Button>

        <Divider sx={{ my: 3 }} />

        {!showExit ? (
          <Button
            startIcon={<ExitToAppIcon />}
            color="error"
            variant="text"
            size="small"
            onClick={() => setShowExit(true)}
          >
            Encerrar Sistema
          </Button>
        ) : (
          <Collapse in={showExit}>
            <Box
              sx={{
                mt: 1,
                p: 2,
                bgcolor: "#fff5f5",
                borderRadius: 1,
                border: "1px solid #ffcdd2",
              }}
            >
              <Typography variant="caption" color="error" fontWeight="bold">
                SENHA MASTER:
              </Typography>
              <TextField
                size="small"
                type="password"
                fullWidth
                sx={{ mt: 1, bgcolor: "white" }}
                value={adminSenha}
                onChange={(e) => setAdminSenha(e.target.value)}
              />
              <Box display="flex" gap={1} mt={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={handleFecharSistema}
                >
                  Sair
                </Button>
                <Button
                  size="small"
                  fullWidth
                  onClick={() => {
                    setShowExit(false);
                    setAdminSenha("");
                  }}
                >
                  Voltar
                </Button>
              </Box>
            </Box>
          </Collapse>
        )}
      </Paper>
    </Box>
  );
}
