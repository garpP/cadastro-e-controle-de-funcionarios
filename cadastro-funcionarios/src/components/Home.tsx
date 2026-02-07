import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Card,
  CardContent,
  Avatar,
  Stack,
  Popover,
  TextField,
  Button,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import ShieldIcon from "@mui/icons-material/Shield";
import GroupIcon from "@mui/icons-material/Group";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  writeBatch,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { FormData } from "../types";

interface Funcionario extends FormData {
  id: string;
}

interface Props {
  sair: () => void;
  userEmail: string | null;
  userPhoto?: string | null;
}

const drawerWidthOpen = 280;
const drawerWidthClosed = 80;

const PROTECTED_EMAIL = "admin1029@gmail.com";
const PROTECTED_CARGO = "CEO";

export default function Home({ sair, userEmail, userPhoto }: Props) {
  const [lista, setLista] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [cargoSelecionado, setCargoSelecionado] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeletingMode, setIsDeletingMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [adminCode, setAdminCode] = useState("");

  const [openModalCargo, setOpenModalCargo] = useState(false);
  const [novoCargoNome, setNovoCargoNome] = useState("");
  const [openModalUser, setOpenModalUser] = useState(false);
  const [novoUserNome, setNovoUserNome] = useState("");
  const [novoUserEmail, setNovoUserEmail] = useState("");
  const [novoUserSenha, setNovoUserSenha] = useState("");
  const [novoUserStatus, setNovoUserStatus] = useState("Ativo");

  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSenha, setEditSenha] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editCargo, setEditCargo] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "funcionarios"));
      const dados: Funcionario[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as FormData),
      }));
      setLista(dados);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const cargos = Array.from(
    new Set(
      lista
        .map((f) => f.cargo?.trim())
        .filter((cargo) => cargo && cargo !== ""),
    ),
  ).sort();

  const filtrados = cargoSelecionado
    ? lista.filter(
        (f) => f.cargo === cargoSelecionado && f.email !== "sistema@interno",
      )
    : [];

  const handleAdminCode = () => {
    if (adminCode === "adm0129384756") {
      setIsAdmin(true);
      setAnchorEl(null);
      setAdminCode("");
    } else {
      alert("Código de administrador incorreto!");
    }
  };

  const handleOpenEdit = (f: Funcionario) => {
    if (!isAdmin) return;
    if (f.email === PROTECTED_EMAIL || f.cargo === PROTECTED_CARGO) {
      return;
    }
    setEditId(f.id);
    setEditNome(f.nome);
    setEditEmail(f.email);
    setEditSenha(f.senha || "");
    setEditStatus(f.status);
    setEditCargo(f.cargo);
    setOpenModalEdit(true);
  };

  const handleUpdateFuncionario = async () => {
    // Validação extra no clique
    if (!editNome || !editEmail || !editSenha || !editCargo || !editStatus) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    try {
      setLoading(true);
      await updateDoc(doc(db, "funcionarios", editId), {
        nome: editNome,
        email: editEmail,
        senha: editSenha,
        status: editStatus,
        cargo: editCargo,
      });
      await fetchData();
      setOpenModalEdit(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  };

  const handleCriarCargo = async () => {
    if (!novoCargoNome.trim()) {
      alert("O nome do departamento é obrigatório!");
      return;
    }
    try {
      setLoading(true);
      await addDoc(collection(db, "funcionarios"), {
        nome: "Configuração de Departamento",
        email: "sistema@interno",
        cargo: novoCargoNome.trim(),
        status: "Inativo",
        createdAt: new Date(),
      });
      await fetchData();
      setCargoSelecionado(novoCargoNome.trim());
      setOpenModalCargo(false);
      setNovoCargoNome("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarFuncionario = async () => {
    if (
      !novoUserNome.trim() ||
      !novoUserEmail.trim() ||
      !novoUserSenha.trim()
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    try {
      setLoading(true);
      await addDoc(collection(db, "funcionarios"), {
        nome: novoUserNome,
        email: novoUserEmail,
        senha: novoUserSenha,
        cargo: cargoSelecionado,
        status: novoUserStatus,
        createdAt: new Date(),
      });
      await fetchData();
      setOpenModalUser(false);
      setNovoUserNome("");
      setNovoUserEmail("");
      setNovoUserSenha("");
      setNovoUserStatus("Ativo");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const excluirDepartamento = async (nomeCargo: string) => {
    if (nomeCargo === PROTECTED_CARGO) return;
    const confirmar = window.confirm(
      `Excluir "${nomeCargo}"? Todos os usuários dele serão removidos.`,
    );
    if (!confirmar) return;
    try {
      setLoading(true);
      const q = query(
        collection(db, "funcionarios"),
        where("cargo", "==", nomeCargo),
      );
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(doc(db, "funcionarios", d.id)));
      await batch.commit();
      if (cargoSelecionado === nomeCargo) setCargoSelecionado(null);
      await fetchData();
      setIsDeletingMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const excluirUser = async (id: string) => {
    const alvo = lista.find((u) => u.id === id);
    if (alvo?.email === PROTECTED_EMAIL) return;
    if (!window.confirm("Deseja realmente excluir este funcionário?")) return;
    try {
      await deleteDoc(doc(db, "funcionarios", id));
      setLista((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box display="flex" sx={{ backgroundColor: "#F8F9FC", minHeight: "100vh" }}>
      <Avatar
        src={userPhoto || ""}
        sx={{
          position: "fixed",
          top: 15,
          right: 20,
          width: 48,
          height: 48,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          zIndex: 2000,
          border: "2px solid #fff",
          cursor: "pointer",
        }}
      >
        {userEmail?.charAt(0).toUpperCase()}
      </Avatar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? drawerWidthOpen : drawerWidthClosed,
          "& .MuiDrawer-paper": {
            width: drawerOpen ? drawerWidthOpen : drawerWidthClosed,
            transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowX: "hidden",
            borderRight: "1px solid #E3E8EE",
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <Box display="flex" flexDirection="column" height="100%">
          <Box
            p={2}
            display="flex"
            alignItems="center"
            justifyContent={drawerOpen ? "space-between" : "center"}
          >
            <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
              {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>

            {drawerOpen && (
              <Box display="flex" gap={0.5}>
                {isAdmin && (
                  <>
                    <Tooltip title="Novo Departamento">
                      <IconButton
                        color="primary"
                        onClick={() => setOpenModalCargo(true)}
                      >
                        <AddCircleIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir Departamento">
                      <IconButton
                        color={isDeletingMode ? "error" : "default"}
                        onClick={() => setIsDeletingMode(!isDeletingMode)}
                      >
                        {isDeletingMode ? <CancelIcon /> : <DeleteIcon />}
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <SettingsIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          <Divider sx={{ mx: 2, mb: 2 }} />

          <List sx={{ px: 1.5, flexGrow: 1 }}>
            {cargos.map((cargo) => (
              <Box key={cargo} sx={{ position: "relative", mb: 0.5 }}>
                <ListItemButton
                  onClick={() => !isDeletingMode && setCargoSelecionado(cargo)}
                  selected={cargoSelecionado === cargo}
                  sx={{
                    borderRadius: "10px",
                    py: 1.2,
                    transition: "all 0.2s",
                    color: cargoSelecionado === cargo ? "#fff" : "#4A5568",
                    "&.Mui-selected": {
                      backgroundColor: "#1A73E8",
                      boxShadow: "0px 4px 12px rgba(26, 115, 232, 0.35)",
                      "&:hover": { backgroundColor: "#1557B0" },
                      ".MuiListItemIcon-root": { color: "#fff" },
                    },
                    "&:hover": {
                      backgroundColor:
                        cargoSelecionado === cargo ? "#1557B0" : "#F1F3F4",
                    },
                  }}
                >
                  <GroupIcon
                    sx={{ mr: drawerOpen ? 2 : 0, fontSize: 20, opacity: 0.8 }}
                  />
                  {drawerOpen && (
                    <ListItemText
                      primary={cargo}
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                        fontWeight: cargoSelecionado === cargo ? 600 : 500,
                      }}
                    />
                  )}
                  {cargo === PROTECTED_CARGO && drawerOpen && (
                    <ShieldIcon sx={{ fontSize: 16, ml: 1, opacity: 0.8 }} />
                  )}
                </ListItemButton>

                {isDeletingMode && drawerOpen && cargo !== PROTECTED_CARGO && (
                  <IconButton
                    size="small"
                    onClick={() => excluirDepartamento(cargo)}
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      bgcolor: "#FFEDED",
                      color: "#D32F2F",
                      "&:hover": { bgcolor: "#FFDADA" },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
            ))}
          </List>

          <Box p={2}>
            <ListItemButton
              onClick={sair}
              sx={{
                borderRadius: "10px",
                color: "#D32F2F",
                "&:hover": { bgcolor: "#FFF5F5" },
              }}
            >
              <LogoutIcon sx={{ mr: drawerOpen ? 2 : 0 }} />
              {drawerOpen && <ListItemText primary="Sair da Conta" />}
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        flex={1}
        sx={{ pt: "100px", px: { xs: 2, md: 6 }, pb: 6 }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress thickness={5} size={50} />
          </Box>
        ) : !cargoSelecionado ? (
          <Box textAlign="center" mt={10}>
            <GroupIcon sx={{ fontSize: 80, color: "#E0E0E0", mb: 2 }} />
            <Typography variant="h5" fontWeight={500} color="textSecondary">
              Selecione um departamento no menu lateral
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={5}
            >
              <Box>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{ color: "#1A202C", letterSpacing: "-0.02em" }}
                >
                  {cargoSelecionado}
                  {cargoSelecionado === PROTECTED_CARGO && (
                    <ShieldIcon
                      sx={{
                        ml: 2,
                        fontSize: 32,
                        color: "#1A73E8",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </Typography>
                <Typography color="textSecondary" mt={0.5}>
                  {filtrados.length} funcionários registrados
                </Typography>
              </Box>

              {isAdmin && (
                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<AddCircleIcon />}
                  sx={{
                    borderRadius: "8px",
                    px: 3,
                    py: 1.2,
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                  onClick={() => setOpenModalUser(true)}
                >
                  Novo Funcionário
                </Button>
              )}
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "60px 2fr 2fr 1.5fr 1fr 50px",
                alignItems: "center",
                px: 3,
                py: 2,
                mb: 2,
                bgcolor: "#fff",
                borderRadius: "12px",
                border: "1px solid #E3E8EE",
              }}
            >
              <Box />
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#718096",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                Nome
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#718096",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                E-mail
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#718096",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                Departamento
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#718096",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                Status
              </Typography>
              <Box />
            </Box>

            <Stack spacing={1.5}>
              {filtrados.map((f) => {
                const isProtected =
                  f.email === PROTECTED_EMAIL || f.cargo === PROTECTED_CARGO;
                return (
                  <Card
                    key={f.id}
                    elevation={0}
                    onClick={() => handleOpenEdit(f)}
                    sx={{
                      cursor: isAdmin && !isProtected ? "pointer" : "default",
                      borderRadius: "12px",
                      border: "1px solid #E3E8EE",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor:
                          isAdmin && !isProtected ? "#1A73E8" : "#E3E8EE",
                        transform:
                          isAdmin && !isProtected ? "translateY(-2px)" : "none",
                        boxShadow:
                          isAdmin && !isProtected
                            ? "0px 10px 20px rgba(0,0,0,0.04)"
                            : "none",
                      },
                    }}
                  >
                    <CardContent sx={{ py: "16px !important", px: 3 }}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "60px 2fr 2fr 1.5fr 1fr 50px",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: isProtected ? "#1A202C" : "#E8F0FE",
                            color: isProtected ? "#fff" : "#1A73E8",
                            fontWeight: "bold",
                          }}
                        >
                          {isProtected ? (
                            <ShieldIcon fontSize="small" />
                          ) : (
                            f.nome.charAt(0).toUpperCase()
                          )}
                        </Avatar>
                        <Typography fontWeight={600} color="#2D3748">
                          {f.nome}
                        </Typography>
                        <Typography color="#718096">{f.email}</Typography>
                        <Typography color="#4A5568">{f.cargo}</Typography>
                        <Box
                          sx={{
                            display: "inline-flex",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            width: "fit-content",
                            bgcolor:
                              f.status === "Ativo" ? "#E6FFFA" : "#FFF5F5",
                            color: f.status === "Ativo" ? "#2C7A7B" : "#C53030",
                          }}
                        >
                          {f.status}
                        </Box>
                        <Box textAlign="right">
                          {isAdmin && !isProtected ? (
                            <EditIcon sx={{ color: "#CBD5E0", fontSize: 20 }} />
                          ) : (
                            isProtected && (
                              <ShieldIcon
                                sx={{ color: "#1A73E8", fontSize: 18 }}
                              />
                            )
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </>
        )}
      </Box>

      <Modal open={openModalCargo} onClose={() => setOpenModalCargo(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Novo Departamento
          </Typography>
          <Typography color="textSecondary" mb={3}>
            Dê um nome para a nova área da empresa.
          </Typography>
          <TextField
            fullWidth
            required
            label="Nome do Departamento"
            variant="outlined"
            value={novoCargoNome}
            onChange={(e) => setNovoCargoNome(e.target.value)}
            error={!novoCargoNome && loading === false}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={!novoCargoNome.trim()}
            onClick={handleCriarCargo}
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            Criar Departamento
          </Button>
        </Box>
      </Modal>

      <Modal open={openModalUser} onClose={() => setOpenModalUser(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Novo Funcionário
          </Typography>
          <Typography color="textSecondary" mb={3}>
            Adicionando em <strong>{cargoSelecionado}</strong>
          </Typography>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              required
              label="Nome Completo"
              value={novoUserNome}
              onChange={(e) => setNovoUserNome(e.target.value)}
            />
            <TextField
              fullWidth
              required
              label="E-mail Corporativo"
              type="email"
              value={novoUserEmail}
              onChange={(e) => setNovoUserEmail(e.target.value)}
            />
            <TextField
              fullWidth
              required
              label="Senha de Acesso"
              type="password"
              value={novoUserSenha}
              onChange={(e) => setNovoUserSenha(e.target.value)}
            />
            <FormControl fullWidth required>
              <InputLabel>Status Inicial</InputLabel>
              <Select
                value={novoUserStatus}
                label="Status Inicial"
                onChange={(e) => setNovoUserStatus(e.target.value)}
              >
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Inativo">Inativo</MenuItem>
              </Select>
            </FormControl>
            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={!novoUserNome || !novoUserEmail || !novoUserSenha}
              onClick={handleSalvarFuncionario}
              sx={{ py: 1.5, fontWeight: "bold", mt: 1 }}
            >
              Salvar Cadastro
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={openModalEdit} onClose={() => setOpenModalEdit(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" fontWeight={700} mb={3}>
            Editar Funcionário
          </Typography>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              required
              label="Nome"
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
            />
            <TextField
              fullWidth
              required
              label="E-mail"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <TextField
              fullWidth
              required
              label="Senha"
              value={editSenha}
              onChange={(e) => setEditSenha(e.target.value)}
            />
            <FormControl fullWidth required>
              <InputLabel>Departamento</InputLabel>
              <Select
                value={editCargo}
                label="Departamento"
                onChange={(e) => setEditCargo(e.target.value)}
              >
                {cargos.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                value={editStatus}
                label="Status"
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Inativo">Inativo</MenuItem>
                <MenuItem value="Férias">Férias</MenuItem>
              </Select>
            </FormControl>
            <Box display="flex" gap={2} mt={2}>
              <Button
                fullWidth
                variant="text"
                color="error"
                onClick={() => {
                  excluirUser(editId);
                  setOpenModalEdit(false);
                }}
                sx={{ fontWeight: "bold" }}
              >
                Excluir
              </Button>
              <Button
                fullWidth
                variant="contained"
                disabled={!editNome || !editEmail || !editSenha}
                onClick={handleUpdateFuncionario}
                sx={{ py: 1.5, fontWeight: "bold" }}
              >
                Salvar Alterações
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box p={3} width={280}>
          {!isAdmin ? (
            <>
              <Typography fontWeight={700} mb={1}>
                Modo Administrador
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={2}>
                Insira o código de acesso para habilitar edições.
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="password"
                placeholder="Código"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleAdminCode}
                sx={{ fontWeight: "bold" }}
              >
                Habilitar
              </Button>
            </>
          ) : (
            <Box textAlign="center" py={1}>
              <ShieldIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography fontWeight={700} color="success.main">
                Acesso Administrativo Ativo
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 450 },
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
  p: 4,
  outline: "none",
};
