import React, { useState, useRef, useEffect } from "react";
import { 
  Terminal, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  UploadCloud, 
  FileCode, 
  Settings, 
  Check, 
  Copy, 
  RotateCcw, 
  FileText, 
  X, 
  ChevronDown, 
  Info, 
  Layers,
  Home,
  User,
  Calendar,
  Clock,
  Download,
  Paperclip,
  Camera,
  Lock,
  Unlock,
  Key,
  Sun,
  Moon
} from "lucide-react";
import { pyFletCode, pyInstructionsAndDocs } from "./fletCode";

interface Task {
  id: number;
  title: string;
  category: "cat1" | "cat2" | "cat3" | "cat4" | "cat5";
  fileName: string | null;
  fileSize?: string;
  status: "Concluída" | "Pendente" | "Quase no fim" | "Cancelada";
  sender?: string;
  receivedDate?: string;
  deadline?: string;
  isRepeated?: boolean;
}

const CATEGORIES_LOOKUP = {
  cat1: { color: "#00FF66", bg: "rgba(0, 255, 102, 0.15)", desc: "Classe 1 (Verde)" },
  cat2: { color: "#00E5FF", bg: "rgba(0, 229, 255, 0.15)", desc: "Classe 2 (Azul)" },
  cat3: { color: "#BD00FF", bg: "rgba(189, 0, 255, 0.15)", desc: "Classe 3 (Rox0)" },
  cat4: { color: "#FF9900", bg: "rgba(255, 153, 0, 0.15)", desc: "Classe 4 (Laranja)" },
  cat5: { color: "#FF0055", bg: "rgba(255, 0, 85, 0.15)", desc: "Classe 5 (Vermelho)" },
};

const INITIAL_CLASS_NAMES = {
  cat1: "Core",
  cat2: "Ops",
  cat3: "Sec",
  cat4: "Sys",
  cat5: "Net"
};

const INITIAL_CLASS_PHOTOS = {
  cat1: "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%231E293B'/%3E%3Ccircle cx='50' cy='50' r='30' fill='%233B82F6' opacity='0.5'/%3E%3C/svg%3E",
  cat2: "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%231F2937'/%3E%3Cpath d='M20 80 L80 20 L80 80 Z' fill='%238B5CF6' opacity='0.5'/%3E%3C/svg%3E",
  cat3: "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23111827'/%3E%3Crect x='20' y='20' width='60' height='60' transform='rotate(45 50 50)' fill='%23F59E0B' opacity='0.5'/%3E%3C/svg%3E",
  cat4: "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%230F172A'/%3E%3Cpolygon points='50,20 80,80 20,80' fill='%2310B981' opacity='0.5'/%3E%3C/svg%3E",
  cat5: "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23171717'/%3E%3Ccircle cx='30' cy='50' r='20' fill='%23EF4444' opacity='0.5'/%3E%3Ccircle cx='70' cy='50' r='20' fill='%23EC4899' opacity='0.5'/%3E%3C/svg%3E"
};

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Otimizar Banco de Dados Oracle", category: "cat1", fileName: "db_backup.sql", fileSize: "45 KB", status: "Pendente", sender: "Gerência Core", receivedDate: "01/06/2026", deadline: "10/06/2026", isRepeated: false },
  { id: 2, title: "Revisar logs de intrusão na AWS", category: "cat3", fileName: "firewall_report.pdf", fileSize: "1.2 MB", status: "Quase no fim", sender: "Ops AWS Sec", receivedDate: "02/06/2026", deadline: "04/06/2026", isRepeated: true },
  { id: 3, title: "Agendar reunião com stakeholders", category: "cat2", fileName: null, status: "Concluída", sender: "Diretoria", receivedDate: "03/06/2026", deadline: "03/06/2026", isRepeated: false },
  { id: 4, title: "Migração de DNS das rotas", category: "cat5", fileName: "named.conf", fileSize: "8 KB", status: "Pendente", sender: "Infra Adm", receivedDate: "02/06/2026", deadline: "05/06/2026", isRepeated: false },
  { id: 5, title: "Atualizar dependências NPM", category: "cat4", fileName: null, status: "Cancelada", sender: "Npm Bot", receivedDate: "01/06/2026", deadline: "03/06/2026", isRepeated: true },
  { id: 6, title: "Implementar firewall de aplicação", category: "cat3", fileName: null, status: "Pendente", sender: "AWS Cloud", receivedDate: "03/06/2026", deadline: "15/06/2026", isRepeated: false },
];

function verificarAlerta(deadlineStr?: string): { pertoDoFim: boolean; mensagem: string } {
  if (!deadlineStr) return { pertoDoFim: false, mensagem: "" };
  try {
    const parts = deadlineStr.split("/");
    if (parts.length !== 3) return { pertoDoFim: false, mensagem: "" };
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    const deadlineDate = new Date(year, month, day);
    // Use the specific custom project date as "hoy" (3 de junho de 2026)
    const currentDate = new Date(2026, 5, 3); 
    
    deadlineDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 0 && diffDays <= 7) {
      return { pertoDoFim: true, mensagem: `Faltam ${diffDays} dias!` };
    }
    return { pertoDoFim: false, mensagem: "" };
  } catch (error) {
    return { pertoDoFim: false, mensagem: "Data inválida" };
  }
}

export default function App() {
  // Load state from localStorage on initial render
  const loadState = <T,>(key: string, defaultVal: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [isLightMode, setIsLightMode] = useState<boolean>(() => loadState("flet_isLightMode", false));
  
  // Auth state
  const [masterPassword, setMasterPassword] = useState<string | null>(() => loadState("flet_master_password", null));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authInput, setAuthInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"simulator" | "code">("simulator");
  const [tasks, setTasks] = useState<Task[]>(() => loadState("flet_tasks", INITIAL_TASKS));
  const [currentFilter, setCurrentFilter] = useState<keyof typeof CATEGORIES_LOOKUP | null>(null);
  const [fletView, setFletView] = useState<"dashboard" | "workspace">("dashboard");
  
  // Custom Dynamic Category Names
  const [classNames, setClassNames] = useState<Record<string, string>>(() => loadState("flet_classNames", INITIAL_CLASS_NAMES));
  
  // Custom Dynamic Category Photos
  const [classPhotos, setClassPhotos] = useState<Record<string, string>>(() => loadState("flet_classPhotos", INITIAL_CLASS_PHOTOS));

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("flet_isLightMode", JSON.stringify(isLightMode));
  }, [isLightMode]);

  useEffect(() => {
    localStorage.setItem("flet_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("flet_classNames", JSON.stringify(classNames));
  }, [classNames]);

  useEffect(() => {
    localStorage.setItem("flet_classPhotos", JSON.stringify(classPhotos));
  }, [classPhotos]);

  useEffect(() => {
    if (masterPassword !== null) {
      localStorage.setItem("flet_master_password", JSON.stringify(masterPassword));
    }
  }, [masterPassword]);
  
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempClassNames, setTempClassNames] = useState<Record<string, string>>({ ...INITIAL_CLASS_NAMES });
  const [tempClassPhotos, setTempClassPhotos] = useState<Record<string, string>>({ ...INITIAL_CLASS_PHOTOS });

  // Create / Add Task State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState<keyof typeof CATEGORIES_LOOKUP | "">("");
  const [taskSender, setTaskSender] = useState("");
  const [taskReceivedDate, setTaskReceivedDate] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskIsRepeated, setTaskIsRepeated] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<{id: number, title: string} | null>(null);

  // Toast State
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Change Password State
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  const [changePwdInput, setChangePwdInput] = useState("");
  const [changePwdError, setChangePwdError] = useState("");

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSetupPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (authInput.trim().length < 4) {
      setAuthError("A senha deve ter no mínimo 4 caracteres.");
      return;
    }
    setMasterPassword(authInput.trim());
    setIsAuthenticated(true);
    setAuthInput("");
    setAuthError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authInput.trim() === masterPassword) {
      setIsAuthenticated(true);
      setAuthInput("");
      setAuthError("");
    } else {
      setAuthError("Senha incorreta. Tente novamente.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthInput("");
    setAuthError("");
    showToast("Sessão encerrada.");
  };

  const submitChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (changePwdInput.trim().length < 4) {
      setChangePwdError("A senha deve ter no mínimo 4 caracteres.");
      return;
    }
    setMasterPassword(changePwdInput.trim());
    setChangePwdInput("");
    setChangePwdError("");
    setIsChangePwdOpen(false);
    showToast("Senha alterada com sucesso.");
  };

  const handleToggleStatus = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatusMap: Record<Task["status"], Task["status"]> = {
          "Pendente": "Concluída",
          "Concluída": "Pendente",
          "Quase no fim": "Concluída",
          "Cancelada": "Pendente"
        };
        const updatedStatus = nextStatusMap[t.status];
        showToast(`Status de '${t.title}' alterado para ${updatedStatus}`);
        return { ...t, status: updatedStatus };
      }
      return t;
    }));
  };

  const handleStatusChange = (id: number, newStatus: Task["status"]) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
    showToast(`Status atualizado para: ${newStatus}`);
  };

  const handleDeleteTask = (id: number, title: string) => {
    setTaskToDelete({ id, title });
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) return;
    setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
    showToast(`Tarefa '${taskToDelete.title}' removida.`);
    setTaskToDelete(null);
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
  };

  const handleResetTasks = () => {
    setTasks(INITIAL_TASKS);
    setCurrentFilter(null);
    setFletView("dashboard");
    setClassNames(INITIAL_CLASS_NAMES);
    setClassPhotos(INITIAL_CLASS_PHOTOS);
    showToast("Simulador redefinido para o estado inicial padrão.");
  };

  const handleGoHome = () => {
    setFletView("dashboard");
    setCurrentFilter(null);
    showToast("Executado: page.clean() -> render_dashboard()");
  };

  const handleGoToWorkspace = (key: keyof typeof CATEGORIES_LOOKUP) => {
    setCurrentFilter(key);
    setFletView("workspace");
    showToast(`Executado: page.clean() -> filter_by_class('${classNames[key]}')`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      setAttachedFile({ name: file.name, size: sizeStr });
      showToast(`Ficheiro '${file.name}' anexado.`);
    }
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      showToast("Preencha o título da tarefa!");
      return;
    }
    if (!taskCategory) {
      showToast("Selecione uma categoria!");
      return;
    }

    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const newTask: Task = {
      id: newId,
      title: taskTitle.trim(),
      category: taskCategory as any,
      fileName: attachedFile ? attachedFile.name : null,
      fileSize: attachedFile ? attachedFile.size : undefined,
      status: "Pendente",
      sender: taskSender.trim(),
      receivedDate: taskReceivedDate.trim(),
      deadline: taskDeadline.trim(),
      isRepeated: taskIsRepeated
    };

    setTasks(prev => [...prev, newTask]);
    setIsAddModalOpen(false);
    setTaskTitle("");
    setTaskCategory("");
    setTaskSender("");
    setTaskReceivedDate("");
    setTaskDeadline("");
    setTaskIsRepeated(false);
    setAttachedFile(null);
    showToast(`✓ Nova tarefa registrada na classe [${classNames[newTask.category].toUpperCase()}]`);
  };

  const handleOpenAddTask = () => {
    setTaskTitle("");
    setTaskCategory("");
    setTaskSender("");
    setTaskReceivedDate("");
    setTaskDeadline("");
    setTaskIsRepeated(false);
    setAttachedFile(null);
    setIsAddModalOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that none of the names are empty
    if (Object.values(tempClassNames).some(name => !(name as string).trim())) {
      showToast("Erro: Nenhum nome de classe/categoria pode ficar em branco.");
      return;
    }

    // Save
    setClassNames({ ...tempClassNames });
    setClassPhotos({ ...tempClassPhotos });
    setIsSettingsOpen(false);
    showToast("✓ Configuração de classes e fotos atualizada com sucesso.");
  };

  const handleOpenSettings = () => {
    setTempClassNames({ ...classNames });
    setTempClassPhotos({ ...classPhotos });
    setIsSettingsOpen(true);
  };

  const getDynamicPyFletCode = () => {
    let code = pyFletCode;
    
    const updatedNamesDict = `classes_names = {
        "cat1": "${classNames.cat1.replace(/"/g, '\\"')}",
        "cat2": "${classNames.cat2.replace(/"/g, '\\"')}",
        "cat3": "${classNames.cat3.replace(/"/g, '\\"')}",
        "cat4": "${classNames.cat4.replace(/"/g, '\\"')}",
        "cat5": "${classNames.cat5.replace(/"/g, '\\"')}"
    }`;
    
    const updatedPhotosDict = `classes_photos = {
        "cat1": "${classPhotos.cat1.replace(/"/g, '\\"')}",
        "cat2": "${classPhotos.cat2.replace(/"/g, '\\"')}",
        "cat3": "${classPhotos.cat3.replace(/"/g, '\\"')}",
        "cat4": "${classPhotos.cat4.replace(/"/g, '\\"')}",
        "cat5": "${classPhotos.cat5.replace(/"/g, '\\"')}"
    }`;

    const namesRegex = /classes_names = \{[\s\S]*?\}/;
    code = code.replace(namesRegex, updatedNamesDict);

    const photosRegex = /classes_photos = \{[\s\S]*?\}/;
    code = code.replace(photosRegex, updatedPhotosDict);

    return code;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getDynamicPyFletCode());
      setCopied(true);
      showToast("Código Python Flet copiado com sucesso!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast("Não foi possível copiar automaticamente.");
    }
  };

  const getRemainingDays = (deadlineStr?: string) => {
    if (!deadlineStr) return Infinity;
    try {
      const parts = deadlineStr.split("/");
      if (parts.length !== 3) return Infinity;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      
      const deadlineDate = new Date(year, month, day);
      const currentDate = new Date(2026, 5, 3); // 3 de junho de 2026
      
      deadlineDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      const diffTime = deadlineDate.getTime() - currentDate.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return Infinity;
    }
  };

  const getSortPriority = (task: Task) => {
    const diffDays = getRemainingDays(task.deadline);
    const isAlert = task.status !== "Concluída" && diffDays <= 7;
    
    if (isAlert) return 0;
    if (task.status !== "Concluída" && task.status !== "Cancelada") return 1;
    if (task.status === "Concluída") return 2;
    if (task.status === "Cancelada") return 3;
    return 4;
  };

  const filteredTasks = (currentFilter 
    ? tasks.filter(t => t.category === currentFilter) 
    : tasks
  ).slice().sort((a, b) => {
    const pA = getSortPriority(a);
    const pB = getSortPriority(b);
    if (pA !== pB) return pA - pB;
    return getRemainingDays(a.deadline) - getRemainingDays(b.deadline);
  });

  const countConcluidas = tasks.filter(t => t.status === "Concluída").length;
  const countPendentes = tasks.filter(t => t.status === "Pendente").length;
  const countQuaseFim = tasks.filter(t => t.status === "Quase no fim").length;
  const countCanceladas = tasks.filter(t => t.status === "Cancelada").length;

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#07080a] text-[#E2E8F0]"} font-sans flex items-center justify-center p-4 transition-colors duration-300`}>
        <div className={`w-full max-w-sm p-8 rounded-2xl border ${isLightMode ? "bg-white border-slate-200 shadow-xl" : "bg-[#0F1116] border-[#1A1F2B] shadow-2xl shadow-black/50"}`}>
          
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${isLightMode ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-[#1A1F2B] border-[#0A0D14] text-blue-400"}`}>
              {masterPassword ? <Lock size={32} /> : <Unlock size={32} />}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-mono">
                Agenda
              </h1>
              <p className={`text-sm mt-2 ${isLightMode ? "text-slate-500" : "text-slate-400"}`}>
                {masterPassword 
                  ? "Insira sua senha para acessar a área segura." 
                  : "Crie uma senha para proteger seus dados locais."}
              </p>
            </div>
          </div>

          <form onSubmit={masterPassword ? handleLogin : handleSetupPassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold">
                {masterPassword ? "SENHA" : "NOVA SENHA"}
              </label>
              <input
                type="password"
                value={authInput}
                onChange={(e) => setAuthInput(e.target.value)}
                placeholder="****"
                className={`w-full p-3 font-mono text-center tracking-widest text-lg rounded-xl border focus:outline-none transition-all ${
                  isLightMode 
                    ? "bg-slate-100 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white" 
                    : "bg-[#1A1F2B] border-[#0A0D14] text-white focus:border-blue-500/50"
                }`}
                autoFocus
              />
              {authError && (
                <p className="text-xs text-red-500 font-bold text-center mt-2 animate-in fade-in duration-200">
                  {authError}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold font-mono transition-all ${
                isLightMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                  : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 hover:border-blue-500/50"
              }`}
            >
              {masterPassword ? "ENTRAR" : "SALVAR SENHA"}
            </button>
          </form>
          
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen overflow-hidden ${isLightMode ? "bg-white text-slate-900" : "bg-[#07080a] text-[#E2E8F0]"} font-sans flex flex-col justify-between transition-colors duration-300`} id="app_root_dir">
      
      {/* HEADER PRINCIPAL */}
      <header className={`z-40 border-b ${isLightMode ? "border-slate-200 bg-slate-50" : "border-[#1A1F2B] bg-[#0A0D14]"} px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors duration-300 shadow-sm`} id="header_control">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className={`p-2 rounded-full border transition-all ${isLightMode ? "bg-white border-slate-300 text-slate-600 hover:bg-slate-100" : "bg-[#111622] border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"}`}
            title="Alternar Fundo"
          >
            {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsChangePwdOpen(true)}
            className={`p-2 rounded-full border transition-all ${isLightMode ? "bg-white border-slate-300 text-slate-600 hover:bg-slate-100" : "bg-[#111622] border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"}`}
            title="Alterar Senha"
          >
            <Key className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className={`p-2 rounded-full border transition-all ${isLightMode ? "bg-white border-slate-300 text-red-600 hover:bg-red-50 hover:border-red-200" : "bg-[#111622] border-slate-700 text-red-400 hover:text-red-300 hover:bg-red-950/30 hover:border-red-900/50"}`}
            title="Bloquear Aplicativo (Sair)"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* TOAST PANEL */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-55 bg-[#121622] border-2 border-[#1E2538] shadow-2xl p-4 rounded-lg flex items-center gap-3 max-w-sm animate-in fade-in slide-in-from-top duration-200" id="toast_box">
          <div className="h-2 w-2 rounded-full bg-[#00FF66] animate-ping" />
          <span className="text-xs font-mono text-slate-200">{toastMessage}</span>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 w-full flex flex-col overflow-hidden min-h-0" id="main_content">
        
        {activeTab === "simulator" ? (
          /* ================================================== */
          /* SIMULADOR INTERATIVO (SEM SIDEBAR CONTEXT LISTED)  */
          /* ================================================== */
          <div className="flex flex-col flex-1 animate-in fade-in duration-300 min-h-0" id="flet_app_simulator_box">

            {/* CONTEÚDO PRINCIPAL DO FLET */}
            <div className={`overflow-hidden flex flex-col flex-1 transition-colors duration-300 ${isLightMode ? "bg-white" : "bg-black"}`} id="desktop_window_frame">
              
              {/* CONTEÚDO DA TELA DO APP CENTRAL (SEM SIDEBAR) */}
              <div className="p-5 flex flex-col gap-6 flex-1 w-full max-w-7xl mx-auto min-h-0" id="desktop_layout_content">
                
                {fletView === "dashboard" ? (
                  <div className="flex flex-col gap-6 flex-1 min-h-0" id="flet_dashboard_layout">
                    {/* Header Superior: Workspace, Engrenagem de Configuração e Botão + de adição */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Home className="h-6 w-6 text-purple-500" />
                        <h2 className={`text-base font-black tracking-wider ${isLightMode ? "text-slate-800" : "text-white"}`}>Actividades</h2>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Gear / Configurações Button to edit class names as requested */}
                        <button
                          type="button"
                          onClick={handleOpenSettings}
                          className={`p-2.5 rounded-lg border transition-all shadow-sm ${isLightMode ? "border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900" : "border-slate-800 hover:border-slate-650 bg-[#111111] hover:bg-[#1A1F2C] text-slate-300 hover:text-white"}`}
                          title="Configurar Classes/Nomes"
                        >
                          <Settings className="h-5 w-5 text-purple-500" />
                        </button>
 
                        <button
                          id="open_add_task_btn"
                          onClick={handleOpenAddTask}
                          className="flex items-center gap-2 bg-[#152B1E] border border-[#00FF66]/40 hover:bg-[#1C3B29] text-[#00FF66] transition-all text-xs font-mono font-black px-4 py-2.5 rounded shadow-lg"
                        >
                          <Plus className="h-4 w-4" /> Adicionar Tarefa
                        </button>
                      </div>
                    </div>

                    <hr className={isLightMode ? "border-slate-200" : "border-[#222222]"} />

                    {/* OS 5 CÍRCULOS INDICADORES DE CATEGORIA */}
                    <div className="space-y-3">
                      <h3 className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Filtros</h3>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4" id="kpis_circles_container">
                        {Object.entries(CATEGORIES_LOOKUP).map(([key, config]) => {
                          const count = tasks.filter(t => t.category === key).length;
                          const displayName = classNames[key];
                          const photoUrl = classPhotos[key];
                          const isSelected = currentFilter === key;

                          return (
                            <button
                              key={key}
                              onClick={() => handleGoToWorkspace(key as any)}
                              className={`flex flex-col items-center justify-center p-3 rounded-full border-2 transition-all aspect-square relative cursor-pointer group overflow-hidden ${isLightMode ? "bg-slate-50 hover:bg-slate-100" : "bg-[#111111] hover:bg-slate-900"}`}
                              style={{ borderColor: isSelected ? config.color : (isLightMode ? "#E2E8F0" : "#222222") }}
                            >
                              {photoUrl && (
                                <img 
                                  src={photoUrl} 
                                  alt={displayName} 
                                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              <div className="absolute inset-x-0 inset-y-0 bg-black/65 scroll-none pointer-events-none group-hover:bg-black/50 transition-all" />
                              <span className="text-[11px] font-mono font-black transition-all group-hover:scale-105 relative z-10 text-center truncate max-w-[85px]" style={{ color: config.color }}>
                                {displayName.toUpperCase()}
                              </span>
                              <span className="text-xl font-black text-white mt-0.5 relative z-10">
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <hr className={isLightMode ? "border-slate-200" : "border-[#222222]"} />

                    {/* HISTÓRICO DE LOGS DAS TAREFAS */}
                    <div className="space-y-4 flex-1 flex flex-col min-h-0">
                      <div className={`flex items-center gap-2 text-xs font-mono font-bold ${isLightMode ? "text-slate-600" : "text-slate-300"}`}>
                        <Layers className="h-4 w-4 text-[#FFCC00]" />
                        <span>Tarefas</span>
                      </div>

                      <div className="space-y-2.5 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800" id="flet_terminal_log_list">
                        {tasks.length === 0 ? (
                          <div className={`p-8 text-center border border-dashed rounded-lg font-mono text-xs ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-400" : "bg-slate-900/10 border-slate-800 text-slate-500"}`}>
                            Nenhuma tarefa agendada.
                          </div>
                        ) : (
                          tasks.slice().sort((a, b) => {
                            const pA = getSortPriority(a);
                            const pB = getSortPriority(b);
                            if (pA !== pB) return pA - pB;
                            return getRemainingDays(a.deadline) - getRemainingDays(b.deadline);
                          }).map((task) => {
                            const cfg = CATEGORIES_LOOKUP[task.category];
                            const displayName = classNames[task.category];
                            
                            const statusColorMap = {
                              "Concluída": { text: "text-[#00FF66]", border: "border-[#00FF66]/20 bg-[#00FF66]/5", point: "bg-[#00FF66]" },
                              "Pendente": { text: "text-[#FFCC00]", border: "border-[#FFCC00]/20 bg-[#FFCC00]/5", point: "bg-[#FFCC00]" },
                              "Quase no fim": { text: "text-[#FF4500]", border: "border-[#FF4500]/20 bg-[#FF4500]/5", point: "bg-[#FF4500]" },
                              "Cancelada": { text: "text-[#94A3B8]", border: "border-slate-800 bg-[#4B5563]/5", point: "bg-[#4B5563]" }
                            };
                            const sc = statusColorMap[task.status];

                            const alertInfo = verificarAlerta(task.deadline);
                            const isAlertActive = alertInfo.pertoDoFim && task.status !== "Concluída";

                            let borderClass = isLightMode ? "border-slate-200" : "border-[#222222]";
                            if (task.status === "Concluída") {
                              borderClass = isLightMode ? "border-emerald-200 bg-emerald-50/50 opacity-80" : "border-emerald-950/40 opacity-75";
                            } else if (isAlertActive) {
                              borderClass = isLightMode ? "animate-alert-border-light shadow-sm" : "animate-alert-border shadow-sm";
                            }

                            return (
                              <div 
                                key={task.id} 
                                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${borderClass} ${isLightMode ? "bg-white shadow-sm" : "bg-[#111111]"}`}
                              >
                                <div 
                                  onClick={() => setSelectedTaskDetails(task)}
                                  className="flex items-start gap-3 w-full sm:w-auto cursor-pointer hover:opacity-85 transition-opacity"
                                  title="Clique para ver detalhes"
                                >
                                  <div className={`w-1.5 h-10 rounded shrink-0 ${sc.point}`} />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={`text-sm font-bold tracking-wide truncate ${task.status === "Concluída" ? "line-through text-slate-500" : (isLightMode ? "text-slate-800" : "text-slate-200")}`}>
                                        {task.title}
                                      </span>
                                      <span 
                                        onClick={() => handleGoToWorkspace(task.category)}
                                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase cursor-pointer ${isLightMode ? "hover:bg-slate-100" : "hover:bg-slate-800"}`}
                                        style={{ color: cfg.color, borderColor: cfg.color + "30", backgroundColor: cfg.color + (isLightMode ? "15" : "08") }}
                                        title={`Ver workspace ${displayName}`}
                                      >
                                        {displayName}
                                      </span>
                                    </div>
                                    <div className={`flex items-center gap-3 text-xs font-mono mt-1 ${isLightMode ? "text-slate-600" : "text-slate-500"}`}>
                                      <span className={`${sc.text} font-bold`}>{task.status}</span>
                                      {task.fileName && (
                                        <>
                                          <span className="opacity-50">•</span>
                                          <span className={`${isLightMode ? "text-slate-500" : "text-slate-400"} flex items-center gap-1 truncate`}>
                                            <FileText className="h-3 w-3 text-[#00E5FF]" /> {task.fileName} {task.fileSize && `(${task.fileSize})`}
                                          </span>
                                        </>
                                      )}
                                    </div>

                                    {(task.sender || task.receivedDate || task.deadline || task.isRepeated || isAlertActive) && (
                                      <div className={`flex items-center gap-2 flex-wrap mt-1.5 font-mono text-[11px] ${isLightMode ? "text-slate-500" : "text-slate-400"}`}>
                                        {task.sender && (
                                          <span className={`border px-2 py-0.5 rounded text-[10px] ${isLightMode ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-slate-950 border-slate-850 text-slate-300"}`}>
                                            De: <b className={isLightMode ? "text-slate-900" : "text-white"}>{task.sender}</b>
                                          </span>
                                        )}
                                        {task.receivedDate && (
                                          <span className={`border px-2 py-0.5 rounded text-[10px] ${isLightMode ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-slate-950 border-slate-850 text-slate-300"}`}>
                                            Recebido: <b className={isLightMode ? "text-slate-800" : "text-slate-200"}>{task.receivedDate}</b>
                                          </span>
                                        )}
                                        {task.deadline && (
                                          <span className={`border px-2 py-0.5 rounded text-[10px] ${isLightMode ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-slate-950 border-slate-850 text-slate-300"}`}>
                                            Prazo: <b className={isLightMode ? "text-orange-600" : "text-[#FFCC00]"}>{task.deadline}</b>
                                          </span>
                                        )}
                                        {isAlertActive && (
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${isLightMode ? "bg-red-50 text-red-600 animate-alert-border-light border-y-2 border-x-2" : "border-y-2 border-x-2 bg-[#FF4500]/10 text-[#FF4500] animate-alert-border"}`}>
                                            ⏰ {alertInfo.mensagem}
                                          </span>
                                        )}
                                        {task.isRepeated && (
                                          <span className="bg-[#FF9900]/10 border border-[#FF9900]/20 text-[#FF9900] px-2 py-0.5 rounded text-[10px] font-bold">
                                            ⚠️ Repetida (Alerta)
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                  <div className="relative">
                                    <select
                                      value={task.status}
                                      onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                                      className={`border rounded text-xs font-mono p-1.5 pr-6 cursor-pointer focus:outline-none appearance-none transition-colors ${isLightMode ? "bg-white border-slate-300 hover:border-slate-400 text-slate-700" : "bg-black/40 border-slate-700 hover:border-slate-500 text-slate-300"}`}
                                    >
                                      <option value="Concluída">Concluída</option>
                                      <option value="Pendente">Pendente</option>
                                      <option value="Quase no fim">Quase no fim</option>
                                      <option value="Cancelada">Cancelada</option>
                                    </select>
                                    <ChevronDown className={`h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${isLightMode ? "text-slate-500" : "text-slate-400"}`} />
                                  </div>

                                  <button
                                    onClick={() => handleToggleStatus(task.id)}
                                    className={`p-1.5 rounded transition-all ${isLightMode ? "bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-emerald-500 border border-slate-200" : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-[#00FF66]"}`}
                                    title="Concluir Rápido"
                                  >
                                    <CheckCircle className={`h-4.5 w-4.5 ${task.status === "Concluída" ? (isLightMode ? "text-emerald-500" : "text-[#00FF66]") : ""}`} />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteTask(task.id, task.title)}
                                    className={`p-1.5 rounded transition-all ${isLightMode ? "bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 border border-red-200" : "bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400"}`}
                                    title="Remover Atividade"
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* WORKSPACE VIEW SCREEN (FLET PAGE TRANSLATION AFTER CLEAN) */
                  <div className="flex flex-col gap-6 flex-1 min-h-0 animate-in fade-in duration-200" id="flet_workspace_layout">
                    
                    {/* Header ajustado: apenas o ícone, o NOME DA CLASSE e o botão voltar */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleGoHome}
                          className="p-1.5 rounded-md border border-[#C04FF5] text-[#C04FF5] hover:bg-[#C04FF5]/10 cursor-pointer transition-colors"
                          title="Ir ao início"
                        >
                          <Home className="h-5 w-5" />
                        </button>
                        <h2 className={`text-2xl font-bold tracking-tight uppercase ${isLightMode ? "text-slate-800" : "text-white"}`}>
                          {currentFilter ? classNames[currentFilter].toUpperCase() : ""}
                        </h2>
                      </div>

                      <button
                        onClick={handleGoHome}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded transition-all shadow-lg cursor-pointer"
                      >
                        ← Voltar
                      </button>
                    </div>

                    <hr className={isLightMode ? "border-slate-200" : "border-[#222222]"} />

                    {/* Exibindo tarefas de ... as requested in Python Flet code */}
                    <div className={`text-xs font-mono ${isLightMode ? "text-slate-500" : "text-slate-400"}`}>
                      Exibindo tarefas de <b className={isLightMode ? "text-slate-700" : "text-white"}>{currentFilter ? classNames[currentFilter] : ""}</b>...
                    </div>

                    {/* HISTÓRICO DE LOGS DAS TAREFAS FILTRADAS */}
                    <div className="space-y-4 flex-1 flex flex-col min-h-0">
                      <div className={`flex items-center justify-between text-xs font-mono font-bold ${isLightMode ? "text-slate-600" : "text-slate-300"}`}>
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-[#FFCC00]" />
                          <span>Tarefas</span>
                        </div>
                        <span 
                          className="px-2 py-0.5 rounded border text-[11px] font-bold"
                          style={{ 
                            color: CATEGORIES_LOOKUP[currentFilter!].color,
                            borderColor: CATEGORIES_LOOKUP[currentFilter!].color + "50",
                            backgroundColor: CATEGORIES_LOOKUP[currentFilter!].color + "10",
                          }}
                        >
                          CLASSE: {currentFilter ? classNames[currentFilter].toUpperCase() : ""}
                        </span>
                      </div>

                      <div className="space-y-2.5 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                        {filteredTasks.length === 0 ? (
                          <div className={`p-8 text-center border border-dashed rounded-lg font-mono text-xs ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-400" : "bg-slate-900/10 border-slate-800 text-slate-500"}`}>
                            Nenhuma tarefa ativa cadastrada nesta Workspace de controle.
                          </div>
                        ) : (
                          filteredTasks.map((task) => {
                            const cfg = CATEGORIES_LOOKUP[task.category];
                            const displayName = classNames[task.category];
                            
                            const statusColorMap = {
                              "Concluída": { text: "text-[#00FF66]", border: "border-[#00FF66]/20 bg-[#00FF66]/5", point: "bg-[#00FF66]" },
                              "Pendente": { text: "text-[#FFCC00]", border: "border-[#FFCC00]/20 bg-[#FFCC00]/5", point: "bg-[#FFCC00]" },
                              "Quase no fim": { text: "text-[#FF4500]", border: "border-[#FF4500]/20 bg-[#FF4500]/5", point: "bg-[#FF4500]" },
                              "Cancelada": { text: "text-[#94A3B8]", border: "border-slate-800 bg-[#4B5563]/5", point: "bg-[#4B5563]" }
                            };
                            const sc = statusColorMap[task.status];

                            const alertInfo = verificarAlerta(task.deadline);
                            const isAlertActive = alertInfo.pertoDoFim && task.status !== "Concluída";

                            let borderClass = isLightMode ? "border-slate-200" : "border-[#222222]";
                            if (task.status === "Concluída") {
                              borderClass = isLightMode ? "border-emerald-200 bg-emerald-50/50 opacity-80" : "border-emerald-950/40 opacity-75";
                            } else if (isAlertActive) {
                              borderClass = isLightMode ? "animate-alert-border-light shadow-sm" : "animate-alert-border shadow-sm";
                            }

                            return (
                              <div 
                                key={task.id} 
                                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${borderClass} ${isLightMode ? "bg-white shadow-sm" : "bg-[#111111]"}`}
                              >
                                <div 
                                  onClick={() => setSelectedTaskDetails(task)}
                                  className="flex items-start gap-3 w-full sm:w-auto cursor-pointer hover:opacity-85 transition-opacity"
                                  title="Clique para ver detalhes"
                                >
                                  <div className={`w-1.5 h-10 rounded shrink-0 ${sc.point}`} />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={`text-sm font-bold tracking-wide truncate ${task.status === "Concluída" ? "line-through text-slate-500" : (isLightMode ? "text-slate-800" : "text-slate-200")}`}>
                                        {task.title}
                                      </span>
                                      <span 
                                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase"
                                        style={{ color: cfg.color, borderColor: cfg.color + "30", backgroundColor: cfg.color + (isLightMode ? "15" : "08") }}
                                      >
                                        {displayName}
                                      </span>
                                    </div>
                                    <div className={`flex items-center gap-3 text-xs font-mono mt-1 ${isLightMode ? "text-slate-600" : "text-slate-500"}`}>
                                      <span className={`${sc.text} font-bold`}>{task.status}</span>
                                      {task.fileName && (
                                        <>
                                          <span className="opacity-50">•</span>
                                          <span className={`${isLightMode ? "text-slate-500" : "text-slate-400"} flex items-center gap-1 truncate`}>
                                            <FileText className="h-3 w-3 text-[#00E5FF]" /> {task.fileName} {task.fileSize && `(${task.fileSize})`}
                                          </span>
                                        </>
                                      )}
                                    </div>

                                    {(task.sender || task.receivedDate || task.deadline || task.isRepeated || isAlertActive) && (
                                      <div className={`flex items-center gap-2 flex-wrap mt-1.5 font-mono text-[11px] ${isLightMode ? "text-slate-500" : "text-slate-400"}`}>
                                        {task.sender && (
                                          <span className={`border px-2 py-0.5 rounded text-[10px] ${isLightMode ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-slate-950 border-slate-850 text-slate-300"}`}>
                                            De: <b className={isLightMode ? "text-slate-900" : "text-white"}>{task.sender}</b>
                                          </span>
                                        )}
                                        {task.receivedDate && (
                                          <span className={`border px-2 py-0.5 rounded text-[10px] ${isLightMode ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-slate-950 border-slate-850 text-slate-300"}`}>
                                            Recebido: <b className={isLightMode ? "text-slate-800" : "text-slate-200"}>{task.receivedDate}</b>
                                          </span>
                                        )}
                                        {task.deadline && (
                                          <span className={`border px-2 py-0.5 rounded text-[10px] ${isLightMode ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-slate-950 border-slate-850 text-slate-300"}`}>
                                            Prazo: <b className={isLightMode ? "text-orange-600" : "text-[#FFCC00]"}>{task.deadline}</b>
                                          </span>
                                        )}
                                        {isAlertActive && (
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${isLightMode ? "bg-red-50 text-red-600 animate-alert-border-light border-y-2 border-x-2" : "border-y-2 border-x-2 bg-[#FF4500]/10 text-[#FF4500] animate-alert-border"}`}>
                                            ⏰ {alertInfo.mensagem}
                                          </span>
                                        )}
                                        {task.isRepeated && (
                                          <span className="bg-[#FF9900]/10 border border-[#FF9900]/20 text-[#FF9900] px-2 py-0.5 rounded text-[10px] font-bold">
                                            ⚠️ Repetida (Alerta)
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                  <div className="relative">
                                    <select
                                      value={task.status}
                                      onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                                      className={`border rounded text-xs font-mono p-1.5 pr-6 cursor-pointer focus:outline-none appearance-none transition-colors ${isLightMode ? "bg-white border-slate-300 hover:border-slate-400 text-slate-700" : "bg-black/40 border-slate-700 hover:border-slate-500 text-slate-300"}`}
                                    >
                                      <option value="Concluída">Concluída</option>
                                      <option value="Pendente">Pendente</option>
                                      <option value="Quase no fim">Quase no fim</option>
                                      <option value="Cancelada">Cancelada</option>
                                    </select>
                                    <ChevronDown className={`h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${isLightMode ? "text-slate-500" : "text-slate-400"}`} />
                                  </div>

                                  <button
                                    onClick={() => handleToggleStatus(task.id)}
                                    className={`p-1.5 rounded transition-all ${isLightMode ? "bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-emerald-500 border border-slate-200" : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-[#00FF66]"}`}
                                    title="Concluir Rápido"
                                  >
                                    <CheckCircle className={`h-4.5 w-4.5 ${task.status === "Concluída" ? (isLightMode ? "text-emerald-500" : "text-[#00FF66]") : ""}`} />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteTask(task.id, task.title)}
                                    className={`p-1.5 rounded transition-all ${isLightMode ? "bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 border border-red-200" : "bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400"}`}
                                    title="Remover Atividade"
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                  </div>
                )}

                <hr className={isLightMode ? "border-slate-200" : "border-[#222222]"} />

                {/* PAINEL DE ALERTAS INFERIOR (Dashboard de Status) */}
                <div className={`border rounded-lg p-3 ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#111111] border-[#222222]"}`} id="alert_status_dashboard">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* Alertas com indicadores visuais de cor conforme solicitado */}
                    <div className="flex items-center gap-4 flex-wrap text-xs font-mono select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] animate-pulse" />
                        <span className={isLightMode ? "text-slate-500" : "text-slate-400"}>Concluídas (Verde): <b className={isLightMode ? "text-slate-800" : "text-white"}>{countConcluidas}</b></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00]" />
                        <span className={isLightMode ? "text-slate-500" : "text-slate-400"}>Pendentes (Amarelo): <b className={isLightMode ? "text-slate-800" : "text-white"}>{countPendentes}</b></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF4500]" />
                        <span className={isLightMode ? "text-slate-500" : "text-slate-400"}>Quase no fim (Laranja/Vermelho): <b className={isLightMode ? "text-slate-800" : "text-white"}>{countQuaseFim}</b></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4B5563]" />
                        <span className={isLightMode ? "text-slate-500" : "text-slate-400"}>Canceladas (Cinza): <b className={isLightMode ? "text-slate-800" : "text-white"}>{countCanceladas}</b></span>
                      </div>
                    </div>

                    {/* Banner dinâmico de criticidade */}
                    <div>
                      {countQuaseFim > 0 ? (
                        <div className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 ${isLightMode ? "bg-red-50 text-red-600 animate-alert-border-light border-y-2 border-x-2" : "bg-red-950/30 text-[#FF4500] animate-alert-border"}`}>
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {countQuaseFim} Actividades Limites
                        </div>
                      ) : countPendentes > 3 ? (
                        <div className="px-3 py-1 bg-[#2C250A] border border-[#FFCC00]/30 rounded text-xs text-[#FFCC00] font-mono font-bold flex items-center gap-1.5">
                          <Info className="h-3.5 w-3.5" />
                          Alta taxa de pendências ({countPendentes})
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-emerald-950/20 border border-emerald-500/20 rounded text-xs text-[#00FF66] font-mono font-bold flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5" />
                          Estabilidade operacional
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            </div>
            
          </div>
        ) : (
          /* ================================================== */
          /* EXPORTADOR DE CÓDIGO PYTHON (FLET) & DOCUMENTAÇÃO   */
          /* ================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300 overflow-y-auto flex-1 p-5 pb-8 min-h-0" id="python_code_tab">
            
            {/* Lado Esquerdo/Central: IDE para leitura e cópia */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span> 
                  CÓDIGO COMPLETO: <b className="text-slate-200">main.py (Python Flet)</b>
                </span>
                
                <button
                  id="copy_code_source"
                  onClick={handleCopyCode}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider transition-all border ${
                    copied 
                      ? "bg-emerald-950 border-emerald-500 text-[#00FF66]"
                      : "bg-[#1C1F2B] hover:bg-slate-800 border-slate-700 text-slate-200"
                  }`}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4.5 w-4.5" />}
                  {copied ? "COPIADO!" : "COPIAR CÓDIGO FONTE"}
                </button>
              </div>

              {/* IDE container */}
              <div className="bg-[#0B0C0E] border border-slate-800 rounded-xl overflow-hidden p-5 shadow-inner">
                <div className="flex items-center gap-1.5 border-b border-slate-800/80 pb-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-600/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="text-[11px] font-mono text-slate-500 ml-4">Terminal Python IDE v3.12</span>
                </div>

                <pre className="text-xs font-mono text-[#A9B1D6] overflow-x-auto max-h-[500px] leading-relaxed p-2 scrollbar-thin select-all">
                  <code>{getDynamicPyFletCode()}</code>
                </pre>
              </div>
            </div>

            {/* Lado Direito: Tutorial de exportação e dicas */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#10141D] border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between h-full">
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <Settings className="h-5 w-5 text-[#C04FF5]" />
                    <h3 className="text-sm font-black text-white tracking-widest uppercase">GUI COMPILAÇÃO EXE</h3>
                  </div>

                  <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-mono font-medium">
                    
                    <div>
                      <b className="text-white block mb-1">1. Execução Inicial local:</b>
                      <p className="text-xs text-slate-400">Verifique se tem Flet instalado na máquina e execute o arquivo.</p>
                      <pre className="bg-black/50 p-2.5 rounded border border-slate-800 text-[11px] text-[#00FF66] mt-2 select-all font-mono">
                        pip install flet{"\n"}
                        flet run main.py
                      </pre>
                    </div>

                    <hr className="border-slate-800" />

                    <div>
                      <b className="text-white block mb-1">2. Gerando Executável com Flet CLI:</b>
                      <p className="text-xs text-slate-400">O recomendável é usar o próprio utilitário do Flet que configura as dependências autônomas corretamente.</p>
                      <pre className="bg-black/50 p-2.5 rounded border border-slate-800 text-[11px] text-[#00E5FF] mt-2 select-all font-mono">
                        pip install pyinstaller{"\n"}
                        flet pack main.py --icon app_icon.ico
                      </pre>
                    </div>

                    <hr className="border-slate-800" />

                    <div>
                      <b className="text-white block mb-1">3. Através do PyInstaller puro:</b>
                      <p className="text-xs text-slate-400">Caso prefira rodar usando os comandos puros do CMD:</p>
                      <pre className="bg-black/50 p-2.5 rounded border border-slate-800 text-[11px] text-purple-400 mt-2 select-all font-mono">
                        pyinstaller --noconsole --onefile main.py
                      </pre>
                      <p className="text-[10px] text-slate-500 mt-2 leading-normal">
                        A flag <code className="text-slate-300 font-bold">--noconsole</code> previne a abertura do terminal preto do Windows em paralelo, deixando apenas a rica interface Flet Dark Luxo ativa.
                      </p>
                    </div>

                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-6 text-xs text-slate-500">
                  Código Python limpo, documentado e extremamente leve para performance desktop. 
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER DO APP */}
      <footer className="z-40 border-t border-[#1A1F2B] bg-[#07090F] px-6 py-4" id="footer_control">
        <div className="max-w-7xl mx-auto flex justify-center text-xs text-slate-500 font-mono">
          <span>Agenda Pessoal</span>
        </div>
      </footer>

      {/* MODAL CHANGE PASSWORD */}
      {isChangePwdOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#0F1116] border-2 border-slate-800 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative">
            <button
              onClick={() => setIsChangePwdOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-black text-blue-500 tracking-widest uppercase font-mono flex items-center gap-2 mb-4">
              <Key className="h-4 w-4" /> Alterar Senha
            </h3>
            <form onSubmit={submitChangePassword} className="space-y-4">
              <input
                type="password"
                required
                value={changePwdInput}
                onChange={(e) => setChangePwdInput(e.target.value)}
                placeholder="Nova senha"
                className="w-full bg-[#121622] text-white border border-slate-800 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
              />
              {changePwdError && (
                <p className="text-xs text-red-500 font-bold">{changePwdError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded font-mono transition-all"
              >
                SALVAR
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURAR CLASSES DIRETAMENTE (ENGRENAGEM) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150" id="settings_modal">
          <div className="bg-[#0F1116] border-2 border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl p-6 relative">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-[#C04FF5] tracking-widest uppercase font-mono flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Configurar Classes
                </h3>
                <p className="text-xs text-slate-400 mt-1">Renomeie e adicione fotos às 5 categorias de círculos no simulador.</p>
              </div>

              <hr className="border-slate-800" />

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {Object.keys(classNames).map((key) => {
                  const config = CATEGORIES_LOOKUP[key as keyof typeof CATEGORIES_LOOKUP];
                  const photoUrl = tempClassPhotos[key];
                  return (
                    <div key={key} className="space-y-1.5 border-b border-slate-900 pb-3 last:border-0 last:pb-0">
                      <label className="text-xs font-mono font-bold flex items-center gap-2" style={{ color: config.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                        {key.toUpperCase()} ({config.desc}):
                      </label>
                      
                      <div className="flex items-center gap-2">
                        {/* Circle Avatar Preview */}
                        <div className="w-9 h-9 rounded-full border border-slate-800 bg-slate-950 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                          {photoUrl ? (
                            <img src={photoUrl} alt="Preview" className="w-[100%] h-[100%] object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-[100%] h-[100%] flex items-center justify-center text-[10px] text-slate-500 font-mono">No photo</div>
                          )}
                        </div>

                        {/* Text Field Name */}
                        <input
                          type="text"
                          required
                          value={tempClassNames[key]}
                          onChange={(e) => setTempClassNames({ ...tempClassNames, [key]: e.target.value })}
                          placeholder="Nome da Classe"
                          className="bg-[#121622] text-white border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-purple-500 flex-1 min-w-0"
                        />

                        {/* Choose / Input image URL */}
                        <div className="flex items-center gap-1">
                          <input 
                            type="file" 
                            accept="image/*" 
                            id={`file-${key}`}
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const localUrl = URL.createObjectURL(file);
                                setTempClassPhotos({
                                  ...tempClassPhotos,
                                  [key]: localUrl
                                });
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => document.getElementById(`file-${key}`)?.click()}
                            title="Escolher Foto Local"
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 transition-all flex items-center justify-center cursor-pointer"
                          >
                            <Camera className="h-4 w-4" style={{ color: config.color }} />
                          </button>
                        </div>
                      </div>

                      {/* Image URL Input Optional */}
                      <input
                        type="text"
                        placeholder="Ou cole a URL da imagem aqui..."
                        value={photoUrl || ""}
                        onChange={(e) => setTempClassPhotos({ ...tempClassPhotos, [key]: e.target.value })}
                        className="bg-[#080B11]/50 text-slate-400 placeholder-slate-600 border border-slate-900 rounded px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-slate-700 w-full"
                      />
                    </div>
                  );
                })}
              </div>

              <hr className="border-slate-800" />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 font-mono text-xs px-4 py-2 rounded transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#1B3A2C] border border-[#00FF66]/30 text-[#00FF66] hover:bg-gradient-to-tr hover:from-emerald-950 hover:to-slate-900 hover:text-white font-mono text-xs font-black px-5 py-2 rounded transition-all"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALHES DA TAREFA */}
      {selectedTaskDetails && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150" id="task_details_modal">
          <div className="bg-[#0F1116] border-2 border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedTaskDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span 
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase"
                  style={{ 
                    color: CATEGORIES_LOOKUP[selectedTaskDetails.category].color, 
                    borderColor: CATEGORIES_LOOKUP[selectedTaskDetails.category].color + "30", 
                    backgroundColor: CATEGORIES_LOOKUP[selectedTaskDetails.category].color + "08" 
                  }}
                >
                  {classNames[selectedTaskDetails.category]}
                </span>
                <span className={`text-xs font-mono font-bold ${
                  selectedTaskDetails.status === "Concluída" ? "text-[#00FF66]" :
                  selectedTaskDetails.status === "Pendente" ? "text-[#FFCC00]" :
                  selectedTaskDetails.status === "Quase no fim" ? "text-[#FF4500]" : "text-slate-400"
                }`}>
                  {selectedTaskDetails.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-wide font-mono mt-2 break-words">
                Detalhes: {selectedTaskDetails.title}
              </h3>
            </div>

            <hr className="border-slate-800 my-4" />

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-500">Remetente:</span>
                <span className="text-slate-200 text-right">{selectedTaskDetails.sender || "Não especificado"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-500">Recebido:</span>
                <span className="text-slate-200 text-right">{selectedTaskDetails.receivedDate || "Não especificado"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-500">Prazo:</span>
                <span className="text-[#FFCC00] text-right">{selectedTaskDetails.deadline || "Não especificado"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-2 items-center">
                <span className="text-slate-500">Anexo / Ficheiro:</span>
                <span className="text-[#00E5FF] italic flex items-center justify-end gap-1 text-right">
                  {selectedTaskDetails.fileName ? (
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      {selectedTaskDetails.fileName} {selectedTaskDetails.fileSize && `(${selectedTaskDetails.fileSize})`}
                      <button
                        onClick={() => {
                          showToast(`Arquivo ${selectedTaskDetails.fileName} exportado com sucesso!`);
                        }}
                        className="ml-1.5 p-0.5 border border-[#00E5FF]/30 hover:border-[#00E5FF] bg-slate-900 text-[#00E5FF] rounded transition-all cursor-pointer"
                        title="Exportar Documento"
                      >
                        <Download className="h-3 w-3" />
                      </button>
                    </span>
                  ) : (
                    <span className="text-slate-400">Nenhum anexo</span>
                  )}
                  <div className="ml-2">
                    <input
                      type="file"
                      id={`update-file-${selectedTaskDetails.id}`}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const sizeKb = Math.round(file.size / 1024);
                          const fileSizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)}MB` : `${sizeKb}KB`;
                          
                          setTasks(tasks.map(t => 
                            t.id === selectedTaskDetails.id 
                              ? { ...t, fileName: file.name, fileSize: fileSizeStr }
                              : t
                          ));
                          setSelectedTaskDetails({
                            ...selectedTaskDetails,
                            fileName: file.name,
                            fileSize: fileSizeStr
                          });
                          showToast(`Documento atualizado para ${file.name}`);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => document.getElementById(`update-file-${selectedTaskDetails.id}`)?.click()}
                      className="p-1 px-2 border border-[#00E5FF]/30 hover:border-[#00E5FF] bg-slate-900 text-[#00E5FF] rounded text-[10px] transition-all cursor-pointer ml-1"
                      title="Anexar ou Atualizar Documento"
                    >
                      {selectedTaskDetails.fileName ? "Atualizar" : "Anexar Arquivo"}
                    </button>
                  </div>
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-500">Alerta de Prazo:</span>
                <span className="text-right">
                  {verificarAlerta(selectedTaskDetails.deadline).pertoDoFim && selectedTaskDetails.status !== "Concluída" ? (
                    <span className="text-[#FF4500] font-bold animate-pulse">
                      ⏰ {verificarAlerta(selectedTaskDetails.deadline).mensagem}
                    </span>
                  ) : (
                    <span className="text-slate-400">Nenhum alerta ativo</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">Atividade Repetida:</span>
                <span className="text-right">
                  {selectedTaskDetails.isRepeated ? (
                    <span className="text-[#FFCC00] font-bold">⚠️ Sim (Alerta de reincidência)</span>
                  ) : (
                    <span className="text-slate-405">Não</span>
                  )}
                </span>
              </div>
            </div>

            <hr className="border-slate-800 my-4" />

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedTaskDetails(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-black px-5 py-2.5 rounded transition-all cursor-pointer shadow-lg w-full text-center"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR EXCLUSÃO DE TAREFA */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150" id="delete_task_confirm_modal">
          <div className={`${isLightMode ? "bg-white border-red-200" : "bg-[#0F1116] border-red-900/50"} border-2 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative transition-colors duration-300`}>
            
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${isLightMode ? "bg-red-50 border-red-100" : "bg-red-950/50 border-red-900/50"}`}>
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              
              <div>
                <h3 className={`text-lg font-bold mb-2 ${isLightMode ? "text-slate-900" : "text-white"}`}>Apagar Tarefa</h3>
                <p className={`text-sm ${isLightMode ? "text-slate-600" : "text-slate-400"}`}>
                  Tem certeza de que deseja apagar a tarefa "<strong>{taskToDelete.title}</strong>"? 
                  Esta ação não pode ser desfeita.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full mt-4">
                <button
                  type="button"
                  onClick={cancelDeleteTask}
                  className={`flex-1 px-4 py-2 text-xs font-bold font-mono rounded transition-colors ${
                    isLightMode
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteTask}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-mono rounded transition-colors shadow-lg shadow-red-600/20"
                >
                  Sim, Apagar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR TAREFA (DASHBOARD SIMULATOR) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150" id="add_task_modal">
          <div className="bg-[#0F1116] border-2 border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl p-6 relative">
            
            {/* Close trigger button */}
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <form onSubmit={handleAddTaskSubmit} className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-[#FFCC00] tracking-widest uppercase font-mono">REGISTAR NOVA TAREFA</h3>
                <p className="text-xs text-slate-400 mt-1">Configure e registre uma nova atividade no catálogo do simulador.</p>
              </div>

              <hr className="border-slate-800" />

              {/* Título */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-slate-300">NOME DA ATIVIDADE / TÍTULO:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Otimizar consulta SQL de faturamento"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="bg-[#121622] text-white border border-slate-800 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#00FF66] w-full"
                />
              </div>

              {/* Quem enviou */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-slate-300">QUEM ENVIOU:</label>
                <input
                  type="text"
                  placeholder="Ex: Gerência de TI / Diretoria"
                  value={taskSender}
                  onChange={(e) => setTaskSender(e.target.value)}
                  className="bg-[#121622] text-white border border-slate-800 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#00FF66] w-full"
                />
              </div>

              {/* Datas de Recebimento e Prazo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold text-slate-300">DATA DE RECEBIMENTO:</label>
                  <input
                    type="text"
                    placeholder="Ex: DD/MM/AAAA"
                    value={taskReceivedDate}
                    onChange={(e) => setTaskReceivedDate(e.target.value)}
                    className="bg-[#121622] text-white border border-slate-800 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#00FF66] w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold text-slate-300">PRAZO FINAL:</label>
                  <input
                    type="text"
                    placeholder="Ex: DD/MM/AAAA"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="bg-[#121622] text-white border border-slate-800 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#00FF66] w-full"
                  />
                </div>
              </div>

              {/* Atividade Repetida */}
              <div className="flex items-center gap-2 bg-[#121622] border border-slate-850 p-3 rounded-lg">
                <input
                  type="checkbox"
                  id="task_is_repeated"
                  checked={taskIsRepeated}
                  onChange={(e) => setTaskIsRepeated(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-750 bg-[#121622] text-[#00FF66] focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer"
                />
                <label htmlFor="task_is_repeated" className="text-xs font-mono font-bold text-slate-300 cursor-pointer select-none">
                  Atividade Repetida (Ativar alerta de sobreeletricidade/repetição)
                </label>
              </div>

              {/* Categoria / Classe das 5 círculos */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-slate-300">CLASSE (SELECIONE UMA DAS 5 BOLAS):</label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.keys(CATEGORIES_LOOKUP).map((catName) => {
                    const cfg = CATEGORIES_LOOKUP[catName as keyof typeof CATEGORIES_LOOKUP];
                    const isSelected = taskCategory === catName;
                    
                    return (
                      <button
                        key={catName}
                        type="button"
                        onClick={() => setTaskCategory(catName as any)}
                        className={`py-2 rounded font-mono text-[10px] font-black border transition-all ${
                          isSelected 
                            ? "bg-slate-900 text-white" 
                            : "bg-[#111319] text-slate-400 hover:text-white border-slate-850"
                        }`}
                        style={{ borderColor: isSelected ? cfg.color : undefined }}
                      >
                        {classNames[catName].toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* File local attachment simulation */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-slate-300">BOTÃO DE UPLOAD (ANEXAR FICHEIRO LOCAL):</label>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-slate-800 bg-[#121622] rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-800/40 hover:border-[#00E5FF] transition-all"
                >
                  <UploadCloud className="h-6 w-6 text-[#00E5FF]" />
                  <div className="text-center">
                    <span className="text-xs font-mono text-[#00E5FF] hover:underline font-bold">Importar do Computador</span>
                    <p className="text-[10px] text-slate-500 mt-1">Anexe imagens, backup de BD, scripts (.sql, .py, .pdf)</p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {attachedFile && (
                  <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/20 px-3 py-2 rounded text-[11px] font-mono text-[#00FF66]">
                    <span className="truncate">📎 {attachedFile.name} ({attachedFile.size})</span>
                    <button type="button" onClick={() => setAttachedFile(null)} className="hover:text-red-400 text-xs">Remover</button>
                  </div>
                )}
              </div>

              <hr className="border-slate-850" />

              {/* Botões do modal */}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 font-mono text-xs px-4 py-2 rounded transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#122E1E] border border-[#00FF66]/30 text-[#00FF66] hover:bg-gradient-to-tr hover:from-emerald-950 hover:to-slate-900 hover:text-white font-mono text-xs font-black px-5 py-2 rounded transition-all"
                >
                  Registar em Agenda
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
