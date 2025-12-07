import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Brain, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  Settings, 
  Activity, 
  AlertCircle,
  FileText,
  HelpCircle,
  Layers,
  X,
  Loader2,
  Key,
  GraduationCap
} from 'lucide-react';

/**
 * TIPAGEM TYPESCRIPT (Adicionado para corrigir erros de Build)
 */
interface FlashcardItem { q: string; a: string; originTopic?: string; }
interface ClosedItem { q: string; options: string[]; correct: number; originTopic?: string; }
interface OpenItem { q: string; a: string; originTopic?: string; }
interface SummaryItem { topic: string; text: string; originTopic?: string; }

interface DatabaseStructure {
  [key: string]: {
    summary?: string;
    flashcards?: { q: string; a: string }[];
    closed?: { q: string; options: string[]; correct: number }[];
    open?: { q: string; a: string }[];
  }
}

interface TopicStructure {
  [key: string]: string[];
}

/**
 * BANCO DE DADOS SIMULADO (FALLBACK)
 */
const TOPICS: TopicStructure = {
  Hepatologia: [
    "Cirrose",
    "Esquistossomose / Hipertensão Portal",
    "Hepatites",
    "Megacólon / Megaesôfago"
  ],
  Infectologia: [
    "Meningites",
    "Arboviroses",
    "Leptospirose",
    "HIV / Oportunistas"
  ],
  Endocrinologia: [
    "Diabetes e Complicações",
    "Tireoide",
    "Hipófise",
    "Adrenal",
    "Obesidade"
  ],
  Dermatologia: [
    "Neoplasias Benignas / Lesões Precursoras",
    "Neoplasias Malignas",
    "Hanseníase",
    "Psoríase",
    "Leishmaniose Tegumentar"
  ]
};

const DATA_BASE: DatabaseStructure = {
  "Cirrose": {
    summary: `DEFINIÇÃO E ETIOLOGIA
A cirrose hepática representa o estágio final de diversas doenças hepáticas crônicas, caracterizada pela desorganização da arquitetura lobular normal do fígado, substituída por nódulos de regeneração cercados por tecido fibroso. As principais etiologias no Brasil são: Álcool, Hepatites Virais (B e C) e Doença Hepática Gordurosa Não Alcoólica (NASH).

FISIOPATOLOGIA
Ocorre ativação das Células Estreladas (de Ito), que se transdiferenciam em miofibroblastos, produzindo colágeno excessivo. Isso leva à capilarização dos sinusóides e aumento da resistência vascular intra-hepática, gerando Hipertensão Portal.

QUADRO CLÍNICO
1. Descompensada: Icterícia, ascite, encefalopatia hepática, hemorragia digestiva alta (varizes).
2. Estigmas periféricos: Eritema palmar, telangiectasias (aranhas vasculares), ginecomastia, atrofia testicular, rarefação de pelos (Chvostek), circulação colateral (Cabeça de Medusa).

DIAGNÓSTICO
- Clínico + Laboratorial (Plaquetopenia é o marcador mais sensível de hipertensão portal).
- Imagem: USG com Doppler (fígado heterogêneo, bordas rombas, fluxo hepatofugal).
- Elastografia Hepática (Fibroscan).
- Padrão-Ouro: Biópsia Hepática (embora pouco realizada atualmente se a clínica for soberana).

CLASSIFICAÇÃO (Prognóstico)
- Child-Pugh: Avalia Bilirrubina, Encefalopatia, Ascite, RNI e Albumina ("BEATA").
- MELD: Bilirrubina, RNI e Creatinina (usado para fila de transplante).

TRATAMENTO
- Cessar o agente agressor (álcool, vírus).
- Rastreio de CHC (USG a cada 6 meses).
- Profilaxia de varizes: Beta-bloqueador não seletivo (Propranolol) ou Ligadura Elástica.
- Ascite: Restrição sódica + Espironolactona e Furosemida.
- PBE: Cefalosporina de 3ª geração.
- Curativo: Transplante Hepático.`,
    flashcards: [
      { q: "Qual o score utilizado para avaliar a gravidade da cirrose baseada em bilirrubina, albumina, RNI, ascite e encefalopatia?", a: "Score de Child-Pugh." },
      { q: "O que caracteriza a Síndrome Hepatorrenal?", a: "Insuficiência renal funcional em paciente com doença hepática avançada e hipertensão portal, sem outra causa aparente." },
      { q: "Qual a conduta inicial na ascite tensa?", a: "Paracentese de alívio com reposição de albumina se retirada > 5L." }
    ],
    closed: [
      { q: "Qual dos achados abaixo NÃO faz parte dos critérios de Child-Pugh?", options: ["Ascite", "Bilirrubina", "Plaquetas", "Tempo de Protrombina (RNI)"], correct: 2 },
      { q: "Na peritonite bacteriana espontânea (PBE), qual o critério diagnóstico no líquido ascítico?", options: ["> 250 polimorfonucleares/mm³", "> 500 leucócitos totais", "Cultura positiva obrigatória", "Glicose < 40mg/dL"], correct: 0 }
    ],
    open: [
      { q: "Descreva a fisiopatologia da hipertensão portal na cirrose.", a: "Aumento da resistência vascular intra-hepática (fibrose e nódulos) somado ao aumento do fluxo sanguíneo esplâncnico (vasodilatação mediada por óxido nítrico)." }
    ]
  },
  "Diabetes e Complicações": {
    summary: `DEFINIÇÃO
Síndrome metabólica de origem múltipla, decorrente da falta de insulina e/ou da incapacidade de a insulina exercer adequadamente seus efeitos (resistência insulínica).

DIAGNÓSTICO (Critérios ADA/SBD)
- Glicemia de Jejum >= 126 mg/dL.
- Hemoglobina Glicada (HbA1c) >= 6,5%.
- TOTG (75g) 2h >= 200 mg/dL.
- Glicemia ao acaso >= 200 mg/dL com sintomas clássicos (4 Ps: Poliúria, Polidipsia, Polifagia, Perda de peso).
*Necessário confirmar com segunda amostra, exceto se sintomático inequívoco.

CLASSIFICAÇÃO
- DM Tipo 1: Destruição autoimune das células beta (Anti-GAD, Anti-IA2). Geralmente jovens, magros, propensos a cetoacidose.
- DM Tipo 2: Resistência insulínica + falência progressiva das células beta. Associado a obesidade e idade > 40 anos.

COMPLICAÇÕES AGUDAS
1. Cetoacidose Diabética (CAD): Típica do DM1. Glicemia > 250, Acidose metabólica (pH < 7.3, BIC < 15), Cetonúria/Cetonemia. TTO: Hidratação vigorosa, Insulina Regular EV, Potássio.
2. Estado Hiperosmolar Hiperglicêmico (EHH): Típico do DM2 (idosos). Glicemia > 600, Hiperosmolaridade > 320, Desidratação severa.

COMPLICAÇÕES CRÔNICAS
- Microvasculares: Retinopatia (fundo de olho anual), Nefropatia (albuminúria anual), Neuropatia.
- Macrovasculares: IAM, AVC, DAOP.

TRATAMENTO
- DM1: Insulinoterapia plena (Basal-Bolus).
- DM2: MEV + Metformina (1ª linha). Associar iSGLT2 ou análogo GLP-1 se doença cardiovascular ou renal.`,
    flashcards: [
      { q: "Qual a meta de HbA1c para a maioria dos adultos não gestantes?", a: "< 7,0%." },
      { q: "Quais os 3 pilares do tratamento da Cetoacidose Diabética?", a: "Hidratação venosa, Insulinoterapia e Correção eletrolítica (Potássio)." },
      { q: "Qual a primeira linha medicamentosa para DM2 sem contraindicações?", a: "Metformina." }
    ],
    closed: [
      { q: "Qual o mecanismo de ação dos inibidores da SGLT2 (Glifozinas)?", options: ["Aumentam secreção de insulina", "Reduzem absorção intestinal de glicose", "Inibem a reabsorção renal de glicose", "Aumentam sensibilidade muscular à insulina"], correct: 2 },
      { q: "Paciente com DM1, hálito cetônico e dor abdominal. Qual o provável diagnóstico?", options: ["Estado Hiperosmolar", "Cetoacidose Diabética", "Hipoglicemia", "Acidose Lática"], correct: 1 }
    ],
    open: [
      { q: "Diferencie Cetoacidose Diabética (CAD) de Estado Hiperosmolar Hiperglicêmico (EHH).", a: "CAD: Mais comum no DM1, glicemia > 250, pH < 7.3, cetonúria positiva. EHH: Mais comum no DM2, glicemia > 600, pH > 7.3, osmolaridade > 320, cetonúria ausente/leve." }
    ]
  },
};

// Gerador de dados genéricos (Backup do Backup)
const getGenericData = (topic: string, type: string) => {
  if (type === 'summary') return `RESUMO ESTRUTURADO DE ${topic.toUpperCase()}

DEFINIÇÃO
Conceito fundamental sobre ${topic}, abrangendo sua natureza patológica e importância epidemiológica.

FISIOPATOLOGIA
Mecanismos biológicos e moleculares que levam ao desenvolvimento da doença.

QUADRO CLÍNICO
Sinais e sintomas cardinais que permitem a suspeita diagnóstica.

DIAGNÓSTICO
Exames laboratoriais e de imagem essenciais para confirmação.

TRATAMENTO
Abordagem terapêutica padrão-ouro, incluindo medidas farmacológicas e não farmacológicas.`;
  
  if (type === 'flashcards') return [
    { q: `Defina o conceito principal de ${topic}.`, a: "Conceito chave e fundamental da patologia." },
    { q: `Qual o tratamento padrão-ouro para ${topic}?`, a: "Terapia farmacológica ou cirúrgica específica." },
    { q: `Cite 3 diagnósticos diferenciais de ${topic}.`, a: "Doença A, Doença B e Doença C." }
  ];
  if (type === 'closed') return [
    { q: `Sobre ${topic}, é CORRETO afirmar:`, options: ["É uma doença viral", "O diagnóstico é puramente clínico", "O tratamento é sempre cirúrgico", "A epidemiologia é irrelevante"], correct: 1 },
    { q: `Qual o principal fator de risco para ${topic}?`, options: ["Tabagismo", "Sedentarismo", "Genética", "Varia conforme a etiologia"], correct: 3 }
  ];
  if (type === 'open') return [
    { q: `Discorra sobre o quadro clínico típico de ${topic}.`, a: "Sinais e sintomas cardinais associados à progressão da doença." }
  ];
  return [];
};

// ================= COMPONENTES VISUAIS =================

// Botão de Tópico (Design Card)
interface TopicButtonProps {
  topic: string;
  selected: boolean;
  onClick: (topic: string) => void;
}

const TopicButton = ({ topic, selected, onClick }: TopicButtonProps) => (
  <button
    onClick={() => onClick(topic)}
    className={`
      relative group p-4 text-left rounded-xl transition-all duration-300 border
      flex items-center justify-between
      ${selected 
        ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-200 scale-[1.02]' 
        : 'bg-white text-slate-600 border-slate-100 hover:border-teal-300 hover:shadow-md hover:-translate-y-0.5'}
    `}
  >
    <span className="font-medium text-sm pr-6">{topic}</span>
    <div className={`
      w-6 h-6 rounded-full flex items-center justify-center transition-all
      ${selected ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-teal-50'}
    `}>
      {selected ? <CheckCircle size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-teal-400" />}
    </div>
  </button>
);

// Modal de Configurações
interface ModalSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ModalSettings = ({ isOpen, onClose, apiKey, setApiKey }: ModalSettingsProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in relative z-10">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <div className="p-2 bg-teal-100 rounded-lg text-teal-700">
              <Settings size={20} />
            </div>
            Configurações
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-colors"><X size={20} /></button>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Google Gemini API Key</label>
          <div className="relative group">
            <Key className="absolute left-3 top-3 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSyCFNUfZZj1vHI0xA26D9TP2Sgc6Lej6rJw"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 focus:bg-white font-mono text-sm"
            />
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
            <strong className="text-teal-700">Modo IA:</strong> Com a chave, o app gera questões infinitas e inéditas. Sem a chave, usa o banco de dados fixo para demonstração.
          </p>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 active:scale-[0.98] transition-all shadow-lg shadow-teal-200"
        >
          Salvar Configuração
        </button>
      </div>
    </div>
  );
};

// Cartão Flashcard (Estilo Papel)
const Flashcard = ({ data }: { data: FlashcardItem }) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [data]);

  return (
    <div 
      className="perspective-1000 w-full max-w-xl h-96 cursor-pointer group select-none"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Frente */}
        <div className="absolute w-full h-full bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center justify-center backface-hidden hover:shadow-2xl transition-shadow">
          <div className="absolute top-6 right-6 p-2 bg-teal-50 text-teal-600 rounded-full">
            <HelpCircle size={24} />
          </div>
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4">Flashcard</span>
          <h3 className="text-2xl font-bold text-center text-slate-800 leading-tight">{data.q}</h3>
          <div className="mt-auto pt-8 flex flex-col items-center gap-2">
             <div className="w-12 h-1 bg-slate-100 rounded-full" />
             <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Toque para virar</p>
          </div>
        </div>
        
        {/* Verso */}
        <div className="absolute w-full h-full bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center rotate-y-180 backface-hidden border border-teal-500">
           <div className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full">
            <BookOpen size={24} />
          </div>
          <span className="text-xs font-bold text-teal-200 tracking-widest uppercase mb-4">Resposta</span>
          <p className="text-xl text-center leading-relaxed font-medium overflow-y-auto max-h-full px-2 custom-scrollbar">{data.a}</p>
        </div>
      </div>
    </div>
  );
};

// Quiz Fechado (Estilo Moderno)
const ClosedQuestion = ({ data, onNext }: { data: ClosedItem, onNext: () => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);
  };

  const isCorrect = selected === data.correct;

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
      <div className="mb-8">
         <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wide mb-3">Quiz</span>
         <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">{data.q}</h3>
      </div>
      
      <div className="space-y-3">
        {data.options.map((opt, idx) => {
          let style = "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-teal-300";
          let iconStyle = "border-slate-300 text-transparent bg-white";

          if (showFeedback) {
            if (idx === data.correct) {
              style = "bg-green-50 border-green-500 text-green-900 ring-1 ring-green-500";
              iconStyle = "bg-green-500 border-green-500 text-white";
            } else if (idx === selected) {
              style = "bg-red-50 border-red-500 text-red-900 ring-1 ring-red-500";
              iconStyle = "bg-red-500 border-red-500 text-white";
            } else {
              style = "opacity-50 border-slate-100 bg-slate-50 grayscale";
            }
          }
          
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showFeedback}
              className={`w-full p-4 md:p-5 text-left rounded-xl border-2 transition-all duration-200 group flex items-start gap-4 ${style}`}
            >
              <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${iconStyle}`}>
                <CheckCircle size={14} fill="currentColor" />
              </div>
              <span className="font-medium text-base md:text-lg">{opt}</span>
            </button>
          );
        })}
      </div>
      
      {showFeedback && (
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
          <div className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isCorrect ? <><CheckCircle size={18} /> Resposta Correta!</> : <><X size={18} /> Resposta Incorreta</>}
          </div>
          <button 
            onClick={() => { setSelected(null); setShowFeedback(false); onNext(); }}
            className="w-full md:w-auto px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-bold shadow-lg shadow-teal-200 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            Próxima Questão <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

// Questão Aberta (Estilo Clean)
const OpenQuestion = ({ data, onNext }: { data: OpenItem, onNext: () => void }) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
  }, [data]);

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wide mb-3">Questão Discursiva</span>
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">{data.q}</h3>
      </div>

      <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 mb-8 flex gap-4">
        <Brain size={24} className="text-amber-500 shrink-0" />
        <div>
          <h4 className="font-bold text-amber-800 text-sm mb-1">Exercício Mental</h4>
          <p className="text-sm text-amber-700/80">
            Formule sua resposta completa mentalmente antes de conferir o gabarito oficial.
          </p>
        </div>
      </div>

      {!revealed ? (
        <button 
          onClick={() => setRevealed(true)}
          className="w-full py-4 bg-slate-50 text-slate-600 font-bold rounded-xl border-2 border-dashed border-slate-300 hover:bg-white hover:border-teal-400 hover:text-teal-600 transition-all flex items-center justify-center gap-2 group"
        >
          <BookOpen size={20} className="group-hover:scale-110 transition-transform"/>
          Revelar Resposta Sugerida
        </button>
      ) : (
        <div className="animate-fade-in space-y-6">
          <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border-l-4 border-teal-500">
            <h4 className="font-bold text-teal-800 mb-4 flex items-center gap-2">
              <CheckCircle size={18} /> Gabarito Oficial:
            </h4>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
              {data.a}
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => { setRevealed(false); onNext(); }}
              className="w-full md:w-auto px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-bold shadow-lg shadow-teal-200 flex items-center justify-center gap-2 transition-all"
            >
              Próxima <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= APP PRINCIPAL =================

export default function App() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [mode, setMode] = useState<string | null>(null); // 'summary', 'open_q', 'closed_q', 'flashcard'
  const [view, setView] = useState('selection'); // 'selection', 'study'
  const [studyData, setStudyData] = useState<any[]>([]); // Usando any[] para flexibilidade dos dados mistos
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Configurações e Estado de API
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyCFNUfZZj1vHI0xA26D9TP2Sgc6Lej6rJw');
  const [isLoading, setIsLoading] = useState(false);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const fetchAIQuestions = async (selectedMode: string, topicsList: string[]) => {
    const topicString = topicsList.join(", ");
    let prompt = "";
    
    // Engenharia de Prompt para JSON estrito
    if (selectedMode === 'summary') {
      prompt = `Gere um RESUMO MÉDICO COMPLETO E ROBUSTO (nível livro texto/Residência Médica) sobre: ${topicString}. O texto deve ser longo, detalhado e estruturado em seções claras: 1) Definição/Etiologia, 2) Fisiopatologia, 3) Quadro Clínico e Exame Físico, 4) Diagnóstico (Exames complementares e Padrão-ouro), 5) Tratamento e Manejo. Use letras MAIÚSCULAS para os títulos das seções. Retorne UM ARRAY JSON onde cada objeto tem o formato: {"topic": "Nome do Tópico", "text": "Texto completo do resumo aqui..."}. NÃO use markdown complexo (como ** ou ##), use apenas quebras de linha e CapsLock para hierarquia.`;
    } else if (selectedMode === 'flashcard') {
      prompt = `Crie 5 flashcards médicos desafiadores de nível residência médica sobre: ${topicString}. Retorne APENAS UM ARRAY JSON cru no formato: [{"q": "Pergunta curta/conceito", "a": "Resposta detalhada", "originTopic": "Tópico Relacionado"}]. Misture os tópicos.`;
    } else if (selectedMode === 'open_q') {
      prompt = `Crie 3 questões discursivas médicas complexas sobre: ${topicString}. Retorne APENAS UM ARRAY JSON cru no formato: [{"q": "Enunciado da questão", "a": "Gabarito completo e explicado", "originTopic": "Tópico Relacionado"}].`;
    } else if (selectedMode === 'closed_q') {
      prompt = `Crie 5 questões de múltipla escolha nível prova de residência médica sobre: ${topicString}. Retorne APENAS UM ARRAY JSON cru no formato: [{"q": "Enunciado clínico", "options": ["Opção A", "Opção B", "Opção C", "Opção D"], "correct": numero_index_0_a_3, "originTopic": "Tópico Relacionado"}]. Misture os tópicos.`;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0].content) {
        throw new Error("Erro na resposta da API");
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);

    } catch (error) {
      console.error("Erro AI:", error);
      alert("Erro ao gerar com IA. Verifique sua chave ou tente novamente. Usando modo offline.");
      return null;
    }
  };

  const generateContent = async (selectedMode: string) => {
    if (selectedTopics.length === 0) {
      alert("Por favor, selecione pelo menos um assunto.");
      return;
    }

    setIsLoading(true);
    let compiledData: any[] = [];

    // CAMINHO 1: USAR IA (Se tiver chave)
    if (apiKey && apiKey.length > 10) {
      const aiData = await fetchAIQuestions(selectedMode, selectedTopics);
      if (aiData) {
        compiledData = aiData;
      } else {
        // Fallback
      }
    }

    // CAMINHO 2: MODO OFFLINE (Se não tiver chave ou IA falhou)
    if (compiledData.length === 0) {
      selectedTopics.forEach(topic => {
        const topicData = DATA_BASE[topic];
        if (selectedMode === 'summary') {
          const text = topicData?.summary || getGenericData(topic, 'summary');
          compiledData.push({ topic, text });
        } else {
          // Lógica simplificada para acessar propriedades dinâmicas com verificação de tipo manual ou any
          const items = (topicData as any)?.[selectedMode === 'closed_q' ? 'closed' : selectedMode === 'open_q' ? 'open' : 'flashcards'] 
                        || getGenericData(topic, selectedMode === 'closed_q' ? 'closed' : selectedMode === 'open_q' ? 'open' : 'flashcards');
          
          const taggedItems = items.map((item: any) => ({ ...item, originTopic: topic }));
          compiledData = [...compiledData, ...taggedItems];
        }
      });
      // Shuffle no offline
      if (selectedMode !== 'summary') {
        compiledData.sort(() => Math.random() - 0.5);
      }
    }

    setStudyData(compiledData);
    setMode(selectedMode);
    setCurrentIndex(0);
    setView('study');
    setIsLoading(false);
  };

  const handleNext = async () => {
    if (currentIndex < studyData.length - 1) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (apiKey && apiKey.length > 10) {
        const confirm = window.confirm("Bateria concluída! Deseja gerar NOVAS questões com IA sobre estes temas?");
        if (confirm) {
          if (mode) generateContent(mode); 
        } else {
          setCurrentIndex(0);
        }
      } else {
        alert("Bateria concluída! Reiniciando ciclo (Modo Offline).");
        setCurrentIndex(0);
        setStudyData(prev => [...prev].sort(() => Math.random() - 0.5));
      }
    }
  };

  // Renderização da Tela de Seleção
  const renderSelection = () => (
    <div className="max-w-5xl mx-auto pb-32 pt-8 px-4">
      {/* Navbar Superior */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
             <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-none">MedStudy</h1>
            <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">Infinite Learning</span>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(true)} 
          className="bg-white hover:bg-slate-50 text-slate-500 hover:text-teal-600 transition-all p-2.5 rounded-xl border border-slate-200 hover:border-teal-200 hover:shadow-md"
          title="Configurações"
        >
          <Settings size={22} />
        </button>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">O que vamos estudar hoje?</h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Selecione os tópicos abaixo e deixe nossa IA gerar um plano de estudo personalizado e infinito para você.
        </p>
        {apiKey && (
           <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-bold animate-fade-in border border-teal-100">
              <Brain size={14} className="animate-pulse"/>
              <span>IA Conectada & Pronta</span>
           </div>
        )}
      </div>

      {/* Grid de Tópicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {Object.entries(TOPICS).map(([category, topics]) => (
          <div key={category} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 flex items-center gap-3 text-lg">
                {category === 'Hepatologia' && <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Activity size={20} /></div>}
                {category === 'Infectologia' && <div className="p-2 bg-green-100 text-green-600 rounded-lg"><AlertCircle size={20} /></div>}
                {category === 'Endocrinologia' && <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Layers size={20} /></div>}
                {category === 'Dermatologia' && <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><FileText size={20} /></div>}
                {category}
              </h2>
              <span className="text-xs font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full">
                {topics.filter(t => selectedTopics.includes(t)).length}/{topics.length}
              </span>
            </div>
            <div className="p-4 grid gap-3">
              {topics.map(topic => (
                <TopicButton 
                  key={topic} 
                  topic={topic} 
                  selected={selectedTopics.includes(topic)} 
                  onClick={toggleTopic} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Barra fixa inferior (Action Bar) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-40">
        <div className="bg-slate-900/90 backdrop-blur-md text-white p-3 md:p-4 rounded-3xl shadow-2xl shadow-slate-900/40 border border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 px-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-teal-500 border-2 border-slate-800 flex items-center justify-center text-xs font-bold">
                {selectedTopics.length}
              </div>
            </div>
            <span className="text-sm font-medium text-slate-300 hidden md:block">
               {selectedTopics.length === 0 ? "Selecione tópicos" : "Tópicos selecionados"}
            </span>
          </div>

          {isLoading ? (
            <div className="flex-1 flex justify-center items-center text-teal-400 font-bold py-2">
              <Loader2 className="animate-spin mr-3" /> Gerando Conteúdo Inteligente...
            </div>
          ) : (
            <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
              {[
                { id: 'summary', icon: FileText, label: 'Resumo', color: 'hover:bg-indigo-600' },
                { id: 'open_q', icon: Brain, label: 'Abertas', color: 'hover:bg-purple-600' },
                { id: 'closed_q', icon: CheckCircle, label: 'Quiz', color: 'hover:bg-teal-600' },
                { id: 'flashcard', icon: RefreshCw, label: 'Cards', color: 'hover:bg-blue-600' },
              ].map((btn) => (
                <button 
                  key={btn.id}
                  onClick={() => generateContent(btn.id)}
                  disabled={selectedTopics.length === 0}
                  className={`
                    px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                    ${selectedTopics.length === 0 ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500' : `bg-slate-800 text-white ${btn.color} hover:shadow-lg active:scale-95`}
                  `}
                >
                  <btn.icon size={16} /> {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Renderização da Tela de Estudo
  const renderStudy = () => {
    const currentItem = studyData[currentIndex];
    const progress = studyData.length > 0 ? ((currentIndex + 1) / studyData.length) * 100 : 0;

    return (
      <div className="max-w-4xl mx-auto min-h-screen flex flex-col pt-8 pb-32 px-4">
        {/* Header de Estudo */}
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-sm z-30 py-4">
          <button 
            onClick={() => setView('selection')}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white"
          >
            <div className="p-1 rounded-md bg-white border border-slate-200 group-hover:border-slate-300 shadow-sm">
              <ChevronLeft size={16} />
            </div>
            <span>Encerrar Sessão</span>
          </button>
          
          <div className="flex flex-col items-end">
             <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-full mb-1">
                {mode === 'summary' ? 'Leitura' : 'Prática'}
             </span>
             <div className="text-xs font-semibold text-slate-400">
                {mode === 'summary' ? 'Resumo Completo' : `Questão ${currentIndex + 1} de ${studyData.length}`}
             </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        {mode !== 'summary' && (
          <div className="w-full bg-slate-200 h-2 rounded-full mb-12 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-teal-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(20,184,166,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="flex-1 flex flex-col items-center">
          
          {mode !== 'summary' && currentItem && (
            <div className="mb-8 flex flex-col items-center animate-fade-in">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tópico Atual</span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-center bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100">
                 {currentItem.originTopic || "Geral"}
              </h2>
            </div>
          )}

          {mode === 'summary' ? (
            <div className="w-full space-y-8 animate-fade-in">
              {studyData.map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-blue-500"></div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100 flex items-center gap-3">
                    <BookOpen className="text-teal-500" size={32} />
                    {item.topic}
                  </h2>
                  <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-serif text-justify">
                    {item.text.split('\n').map((line: string, i: number) => (
                       <p key={i} className="mb-4">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              <div className="bg-teal-50 p-8 rounded-3xl text-center border border-teal-100">
                <CheckCircle size={48} className="text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-teal-900 mb-2">Leitura Concluída!</h3>
                <p className="text-teal-700">Você revisou todo o conteúdo selecionado.</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center animate-fade-in">
              {mode === 'flashcard' && currentItem && (
                <div className="flex flex-col items-center w-full">
                  <Flashcard data={currentItem} />
                  <div className="mt-12 flex gap-4">
                    <button 
                      onClick={handleNext} 
                      className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95"
                    >
                      Próximo Card <ChevronRight />
                    </button>
                  </div>
                </div>
              )}

              {mode === 'closed_q' && currentItem && (
                <ClosedQuestion data={currentItem} onNext={handleNext} />
              )}

              {mode === 'open_q' && currentItem && (
                <OpenQuestion data={currentItem} onNext={handleNext} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}