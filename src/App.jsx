import { useState, useEffect, useRef } from "react";

// ── Nöromit Veritabanı ────────────────────────────────────────────────────────
const BASLANGIC_MITLER = [
  { id:1, baslik:"Mythe des 10% du cerveau", kategori:"Utilisation du cerveau", emoji:"🧠", mit:"Les humains n'utilisent que 10% de leur cerveau, le reste étant inactif.", bilim:"Les études d'imagerie cérébrale montrent que l'ensemble du cerveau est utilisé lors des activités quotidiennes. Aucune région cérébrale n'est définitivement inactive.", fenBaglantisi:"Dans les cours de sciences, il faut transmettre le message que chaque élève peut apprendre à pleine capacité.", alternatif:"Proposez des activités d'apprentissage variées activant différentes régions cérébrales : expériences, discussions, analyse visuelle.", kaynaklar:["Beyerstein, B.L. (1999). Whence cometh the myth that we only use 10% of our brains?"], anahtar_kelimeler:["10% du cerveau","dix pour cent","cerveau inutilisé","capacité cérébrale"] },
  { id:2, baslik:"Styles d'apprentissage (VAK)", kategori:"Apprentissage", emoji:"👁️", mit:"Chaque élève a un style d'apprentissage spécifique — visuel, auditif ou kinesthésique — et apprend mieux quand on enseigne selon ce style.", bilim:"Pashler et al. (2008) ont démontré qu'il n'existe pas de preuves fiables que les styles d'apprentissage influencent les résultats.", fenBaglantisi:"En sciences, il faut éviter d'étiqueter les élèves comme 'visuels' ou 'kinesthésiques'.", alternatif:"Proposez des représentations multiples à tous les élèves : expériences + graphiques + explications. Utilisez les principes de la Conception Universelle.", kaynaklar:["Pashler et al. (2008). Learning Styles: Concepts and Evidence."], anahtar_kelimeler:["apprenant visuel","apprenant auditif","kinesthésique","style d'apprentissage","VAK"] },
  { id:3, baslik:"Cerveau gauche / Cerveau droit", kategori:"Latéralisation cérébrale", emoji:"🔀", mit:"Les personnes pensent soit avec le cerveau gauche (logique) soit avec le cerveau droit (créatif).", bilim:"Les études fMRI montrent que les deux hémisphères travaillent ensemble pour la plupart des tâches. La personnalité 'cerveau gauche/droit' n'est pas scientifique.", fenBaglantisi:"En enseignement des sciences, évitez les étiquettes du type 'cette activité est pour les élèves cerveau droit'.", alternatif:"Combinez pensée créative et analytique dans les cours de sciences.", kaynaklar:["Nielsen et al. (2013). PLOS ONE - An Evaluation of the Left-Brain vs. Right-Brain Hypothesis"], anahtar_kelimeler:["cerveau gauche","cerveau droit","hémisphère gauche","hémisphère droit"] },
  { id:4, baslik:"Théorie des intelligences multiples", kategori:"Intelligences multiples", emoji:"🎯", mit:"Chaque élève possède un type d'intelligence spécifique (musicale, corporelle, mathématique) et doit être enseigné selon ce type.", bilim:"La théorie de Gardner est un cadre théorique ; les preuves empiriques que l'enseignement selon le type d'intelligence améliore les résultats sont insuffisantes.", fenBaglantisi:"En sciences, proposer des activités uniquement selon un type d'intelligence ne sert pas tous les élèves.", alternatif:"Créez des environnements d'apprentissage riches : combinez activités visuelles, auditives et motrices pour tous.", kaynaklar:["Waterhouse (2006). Multiple Intelligences, the Mozart Effect... Educational Psychologist."], anahtar_kelimeler:["intelligences multiples","intelligence musicale","intelligence corporelle","Gardner","type d'intelligence"] },
  { id:5, baslik:"Gym cérébrale (Brain Gym)", kategori:"Activation de l'apprentissage", emoji:"🤸", mit:"Certains mouvements physiques renforcent les connexions neuronales et améliorent directement l'apprentissage.", bilim:"Il n'existe pas de recherches indépendantes et évaluées par des pairs soutenant l'efficacité du Brain Gym.", fenBaglantisi:"Les courtes pauses en cours de sciences sont bénéfiques — non pas pour les connexions neuronales, mais pour renouveler l'attention.", alternatif:"Accordez de courtes pauses physiques entre les cours, en les présentant comme un 'renouveau de l'attention'.", kaynaklar:["Hyatt (2007). Brain Gym: Building Stronger Brains or Wishful Thinking?"], anahtar_kelimeler:["brain gym","gym cérébrale","activation cérébrale","exercice neuronal"] },
  { id:6, baslik:"Mythe des périodes critiques", kategori:"Développement cérébral", emoji:"⏰", mit:"Il existe des périodes critiques pour le développement du cerveau ; si elles sont manquées, l'apprentissage devient définitivement difficile.", bilim:"Le cerveau conserve sa plasticité tout au long de la vie. Il ne se ferme jamais à l'apprentissage.", fenBaglantisi:"Il faut éviter de penser que 'cela aurait dû être appris à l'école primaire, c'est trop difficile maintenant'.", alternatif:"Les compétences en pensée scientifique peuvent être développées à tous les âges. Concentrez-vous sur la préparation de l'élève, pas sur son âge.", kaynaklar:["Blakemore & Frith (2005). The Learning Brain: Lessons for Education."], anahtar_kelimeler:["période critique","période sensible","apprentissage précoce","cerveau fermé"] }
];

// ── Güncel Araştırmalar Veritabanı ───────────────────────────────────────────
const BASLANGIC_ARASTIRMALAR = [
  { id:1, baslik:"Prévalence des neuromythes chez les enseignants de sciences", ozet:"Une étude menée auprès de 340 enseignants de sciences au collège a révélé que 76% croyaient au mythe des styles d'apprentissage et 61% considéraient valide la théorie cerveau gauche/droit.", kaynak:"Dündar & Çakıroğlu (2024). Journal of Science Education, 12(1), 45-67.", yil:"2024", etiket:"Turquie", renk:"#4fc3f7" },
  { id:2, baslik:"Impact de la formation aux neuromythes sur les croyances des enseignants", ozet:"Une réduction de 43% des croyances aux neuromythes a été observée chez les enseignants de sciences ayant suivi une formation de sensibilisation de 8 semaines. Les interventions mobiles se sont révélées aussi efficaces que la formation en présentiel.", kaynak:"Howard-Jones et al. (2024). Mind, Brain & Education, 18(2), 112-128.", yil:"2024", etiket:"Méta-analyse", renk:"#9c64f0" },
  { id:3, baslik:"Relation entre intelligences multiples et réussite en sciences", ozet:"Une étude randomisée contrôlée a démontré que les activités scientifiques conçues selon la théorie des intelligences multiples de Gardner n'apportaient pas d'avantage académique significatif par rapport au groupe témoin.", kaynak:"Rogowsky & Calhoun (2023). Science Education, 107(4), 890-912.", yil:"2023", etiket:"ECR", renk:"#66bb6a" }
];

// ── Sabitler ──────────────────────────────────────────────────────────────────
const EMOJILER = ["🧠","👁️","🔀","🎯","🤸","⏰","💡","🔬","📚","🎓","⚡","🌱","🔑","💭","🧩","🎨","📖","🔍","🧬","🔭"];
const ARASTIRMA_RENKLERI = ["#4fc3f7","#9c64f0","#66bb6a","#f06292","#ffb74d","#80cbc4"];
const BOŞ_FORM = { baslik:"", kategori:"", yeniKategori:"", emoji:"🧠", mit:"", bilim:"", fenBaglantisi:"", alternatif:"", kaynaklar:"", anahtar_kelimeler:"" };
const BOŞ_ARASTIRMA = { baslik:"", ozet:"", kaynak:"", yil:"", etiket:"", renk:"#4fc3f7" };

// ── Yardımcı ──────────────────────────────────────────────────────────────────
function tespit_et(metin, mitler) {
  const metinKucuk = metin.toLowerCase();
  return mitler.filter(mit => mit.anahtar_kelimeler.some(k => metinKucuk.includes(k.toLowerCase())))
    .map(mit => ({ ...mit, eslesen_kelimeler: mit.anahtar_kelimeler.filter(k => metinKucuk.includes(k.toLowerCase())) }));
}

function Alan({ label, zorunlu, hata, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, color: hata ? "#f06292" : "#7986a3", fontFamily: "monospace", letterSpacing: "0.5px", display: "block", marginBottom: 5 }}>
        {label} {zorunlu && <span style={{ color: "#f06292" }}>*</span>}
      </label>
      {children}
      {hata && <div style={{ fontSize: 11, color: "#f06292", marginTop: 4 }}>⚠ {hata}</div>}
    </div>
  );
}

const inputStil = (hata) => ({
  width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${hata ? "rgba(240,98,146,0.5)" : "rgba(255,255,255,0.1)"}`,
  borderRadius: 10, padding: "10px 12px", color: "#e8eaf0", fontSize: 13, fontFamily: "inherit",
  outline: "none", boxSizing: "border-box", lineHeight: 1.6
});

// ── Ana Uygulama ──────────────────────────────────────────────────────────────
export default function App() {
  // Nöromit state
  const [mitler, setMitler] = useState(BASLANGIC_MITLER);
  const [aktifEkran, setAktifEkran] = useState("ana");
  const [secilenMit, setSecilenMit] = useState(null);
  const [oncekiEkran, setOncekiEkran] = useState("kutuphane");
  const [kategori, setKategori] = useState("Tous");
  const [analiz, setAnaliz] = useState({ metin: "", sonuclar: [], yapildi: false, aiSonuc: null });
  const [chatMesajlar, setChatMesajlar] = useState([
    { rol: "ai", icerik: "Bonjour ! Je suis l'assistant NeuroFen 🧠 Je peux vous aider à détecter les neuromythes dans vos plans de cours !" }
  ]);
  const [chatGirdi, setChatGirdi] = useState("");
  const [chatYukleniyor, setChatYukleniyor] = useState(false);
  const [analizYukleniyor, setAnalizYukleniyor] = useState(false);
  const [rozetler, setRozetler] = useState([]);
  const [form, setForm] = useState(BOŞ_FORM);
  const [duzenlemId, setDuzenlemId] = useState(null);
  const [formHata, setFormHata] = useState({});
  const [silOnay, setSilOnay] = useState(null);
  const [basariMesaj, setBasariMesaj] = useState("");
  const [emojiSecici, setEmojiSecici] = useState(false);
  const [akkordeon, setAkkordeon] = useState(null);
  // Araştırma state
  const [arastirmalar, setArastirmalar] = useState(BASLANGIC_ARASTIRMALAR);
  const [arastirmaForm, setArastirmaForm] = useState(BOŞ_ARASTIRMA);
  const [arastirmaFormHata, setArastirmaFormHata] = useState({});
  const [arastirmaDuzenlemId, setArastirmaDuzenlemId] = useState(null);
  const [arastirmaDetay, setArastirmaDetay] = useState(null);
  const [arasSilOnay, setArasSilOnay] = useState(null);
  const chatSonRef = useRef(null);

  useEffect(() => {
    if (chatSonRef.current) chatSonRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMesajlar]);

  useEffect(() => {
    if (basariMesaj) { const t = setTimeout(() => setBasariMesaj(""), 3000); return () => clearTimeout(t); }
  }, [basariMesaj]);

  const kategoriler = ["Tous", ...new Set(mitler.map(n => n.kategori))];
  const filtreliMitler = kategori === "Tous" ? mitler : mitler.filter(m => m.kategori === kategori);
  const mevcutKategoriler = [...new Set(mitler.map(n => n.kategori))];

  // ── Nöromit işlevleri ────────────────────────────────────────────────────
  function detayGit(mit, kaynak = "kutuphane") { setSecilenMit(mit); setOncekiEkran(kaynak); setAktifEkran("detay"); }
  function formGuncelle(alan, deger) { setForm(p => ({ ...p, [alan]: deger })); if (formHata[alan]) setFormHata(p => ({ ...p, [alan]: "" })); }

  function formDogrula() {
    const h = {};
    if (!form.baslik.trim()) h.baslik = "Titre obligatoire";
    if (!form.kategori && !form.yeniKategori.trim()) h.kategori = "Sélectionnez une catégorie ou saisissez-en une nouvelle";
    if (!form.mit.trim()) h.mit = "Description du mythe obligatoire";
    if (!form.bilim.trim()) h.bilim = "Explication scientifique obligatoire";
    if (!form.alternatif.trim()) h.alternatif = "Stratégie alternative obligatoire";
    if (!form.anahtar_kelimeler.trim()) h.anahtar_kelimeler = "Saisissez au moins un mot-clé";
    setFormHata(h); return Object.keys(h).length === 0;
  }

  function mitKaydet() {
    if (!formDogrula()) return;
    const kat = form.yeniKategori.trim() || form.kategori;
    const yeni = { id: duzenlemId || Date.now(), baslik:form.baslik.trim(), kategori:kat, emoji:form.emoji, mit:form.mit.trim(), bilim:form.bilim.trim(), fenBaglantisi:form.fenBaglantisi.trim(), alternatif:form.alternatif.trim(), kaynaklar:form.kaynaklar.split("\n").map(k=>k.trim()).filter(Boolean), anahtar_kelimeler:form.anahtar_kelimeler.split(",").map(k=>k.trim()).filter(Boolean) };
    if (duzenlemId) { setMitler(p => p.map(m => m.id === duzenlemId ? yeni : m)); setBasariMesaj("✅ Neuromythe mis à jour !"); }
    else { setMitler(p => [...p, yeni]); setBasariMesaj("✅ Nouveau neuromythe ajouté !"); }
    setForm(BOŞ_FORM); setDuzenlemId(null); setFormHata({}); setAktifEkran("kutuphane");
  }

  function duzenlemeBaslat(mit) {
    setForm({ baslik:mit.baslik, kategori:mit.kategori, yeniKategori:"", emoji:mit.emoji, mit:mit.mit, bilim:mit.bilim, fenBaglantisi:mit.fenBaglantisi||"", alternatif:mit.alternatif, kaynaklar:mit.kaynaklar.join("\n"), anahtar_kelimeler:mit.anahtar_kelimeler.join(", ") });
    setDuzenlemId(mit.id); setFormHata({}); setAktifEkran("mitEkle");
  }

  function mitSil(id) { setMitler(p => p.filter(m => m.id !== id)); setSilOnay(null); setBasariMesaj("🗑️ Neuromythe supprimé."); setAktifEkran("kutuphane"); }

  // ── Araştırma işlevleri ──────────────────────────────────────────────────
  function arastirmaFormGuncelle(alan, deger) { setArastirmaForm(p => ({ ...p, [alan]: deger })); if (arastirmaFormHata[alan]) setArastirmaFormHata(p => ({ ...p, [alan]: "" })); }

  function arastirmaDogrula() {
    const h = {};
    if (!arastirmaForm.baslik.trim()) h.baslik = "Titre obligatoire";
    if (!arastirmaForm.ozet.trim()) h.ozet = "Résumé obligatoire";
    if (!arastirmaForm.kaynak.trim()) h.kaynak = "Source obligatoire";
    if (!arastirmaForm.yil.trim()) h.yil = "Année obligatoire";
    setArastirmaFormHata(h); return Object.keys(h).length === 0;
  }

  function arastirmaKaydet() {
    if (!arastirmaDogrula()) return;
    const yeni = { id: arastirmaDuzenlemId || Date.now(), baslik:arastirmaForm.baslik.trim(), ozet:arastirmaForm.ozet.trim(), kaynak:arastirmaForm.kaynak.trim(), yil:arastirmaForm.yil.trim(), etiket:arastirmaForm.etiket.trim()||"Araştırma", renk:arastirmaForm.renk };
    if (arastirmaDuzenlemId) { setArastirmalar(p => p.map(a => a.id === arastirmaDuzenlemId ? yeni : a)); setBasariMesaj("✅ Recherche mise à jour !"); }
    else { setArastirmalar(p => [yeni, ...p]); setBasariMesaj("✅ Nouvelle recherche ajoutée !"); }
    setArastirmaForm(BOŞ_ARASTIRMA); setArastirmaDuzenlemId(null); setArastirmaFormHata({}); setAktifEkran("yonetici");
  }

  function arastirmaDuzenlemeBaslat(a) {
    setArastirmaForm({ baslik:a.baslik, ozet:a.ozet, kaynak:a.kaynak, yil:a.yil, etiket:a.etiket, renk:a.renk });
    setArastirmaDuzenlemId(a.id); setArastirmaFormHata({}); setAktifEkran("arastirmaEkle");
  }

  function arastirmaSil(id) { setArastirmalar(p => p.filter(a => a.id !== id)); setArasSilOnay(null); setArastirmaDetay(null); setBasariMesaj("🗑️ Recherche supprimée."); }

  // ── Analiz ──────────────────────────────────────────────────────────────
  async function analizEt() {
    if (!analiz.metin.trim()) return;
    setAnalizYukleniyor(true);
    const yerel = tespit_et(analiz.metin, mitler);
    await new Promise(r => setTimeout(r, 600));
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`Tu es un assistant expert en détection de neuromythes dans l'enseignement des sciences. Réponds en français. Retourne uniquement du JSON : {"ozet":"évaluation courte","temiz":true/false}`,
          messages:[{role:"user",content:`Évalue ce plan de cours du point de vue des neuromythes :\n\n${analiz.metin}`}] })
      });
      const veri = await res.json();
      const txt = veri.content?.map(b=>b.text||"").join("") || "";
      let aiSonuc = null;
      try { aiSonuc = JSON.parse(txt.replace(/```json|```/g,"").trim()); } catch(_) {}
      setAnaliz(p => ({ ...p, sonuclar:yerel, aiSonuc, yapildi:true }));
      if (yerel.length === 0) setRozetler(p => p.includes("temiz") ? p : [...p,"temiz"]);
    } catch(_) { setAnaliz(p => ({ ...p, sonuclar:yerel, yapildi:true })); }
    setAnalizYukleniyor(false);
  }

  async function chatGonder() {
    if (!chatGirdi.trim() || chatYukleniyor) return;
    const mesaj = chatGirdi; setChatGirdi("");
    setChatMesajlar(p => [...p,{rol:"kullanici",icerik:mesaj}]);
    setChatYukleniyor(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`Tu es l'assistant IA francophone de l'application NeuroFen. Tu aides les enseignants de sciences sur les neuromythes. Donne des réponses courtes et scientifiques.`,
          messages:[{role:"user",content:mesaj}] })
      });
      const veri = await res.json();
      const yanit = veri.content?.map(b=>b.text||"").join("") || "Désolé, une erreur s'est produite.";
      setChatMesajlar(p => [...p,{rol:"ai",icerik:yanit}]);
    } catch(_) { setChatMesajlar(p => [...p,{rol:"ai",icerik:"Problème de connexion. Veuillez réessayer."}]); }
    setChatYukleniyor(false);
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  const S = { // ortak stiller
    kart: { background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:13, padding:14, marginBottom:9 },
    btn: (renk) => ({ background:`rgba(${renk},0.12)`, border:`1px solid rgba(${renk},0.25)`, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer" }),
  };

  return (
    <div style={{ fontFamily:"'Georgia',serif", background:"#0a0e1a", minHeight:"100vh", color:"#e8eaf0", maxWidth:430, margin:"0 auto", position:"relative" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 20% 20%,rgba(99,179,237,0.07) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(154,117,241,0.07) 0%,transparent 50%)", pointerEvents:"none", zIndex:0 }} />

      {/* Toast */}
      {basariMesaj && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:"rgba(30,40,60,0.98)", border:"1px solid rgba(79,195,247,0.4)", borderRadius:12, padding:"10px 20px", fontSize:13, color:"#4fc3f7", zIndex:9999, whiteSpace:"nowrap", boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
          {basariMesaj}
        </div>
      )}

      {/* Silme Modal - Nöromit */}
      {silOnay && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:9000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#141826", border:"1px solid rgba(240,98,146,0.3)", borderRadius:16, padding:24, maxWidth:300, width:"100%" }}>
            <div style={{ fontSize:26, textAlign:"center", marginBottom:10 }}>🗑️</div>
            <div style={{ fontSize:14, fontWeight:600, color:"#fff", textAlign:"center", marginBottom:6 }}>Nöromiti Sil</div>
            <div style={{ fontSize:12, color:"#9aa5be", textAlign:"center", marginBottom:18 }}><strong style={{color:"#f06292"}}>{mitler.find(m=>m.id===silOnay)?.baslik}</strong> sera supprimé(e).</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setSilOnay(null)} style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"9px", color:"#9aa5be", fontSize:13, cursor:"pointer" }}>İptal</button>
              <button onClick={()=>mitSil(silOnay)} style={{ flex:1, background:"rgba(240,98,146,0.18)", border:"1px solid rgba(240,98,146,0.35)", borderRadius:10, padding:"9px", color:"#f06292", fontSize:13, cursor:"pointer", fontWeight:600 }}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* Silme Modal - Araştırma */}
      {arasSilOnay && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:9000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#141826", border:"1px solid rgba(240,98,146,0.3)", borderRadius:16, padding:24, maxWidth:300, width:"100%" }}>
            <div style={{ fontSize:26, textAlign:"center", marginBottom:10 }}>🗑️</div>
            <div style={{ fontSize:14, fontWeight:600, color:"#fff", textAlign:"center", marginBottom:6 }}>Araştırmayı Sil</div>
            <div style={{ fontSize:12, color:"#9aa5be", textAlign:"center", marginBottom:18 }}><strong style={{color:"#f06292"}}>{arastirmalar.find(a=>a.id===arasSilOnay)?.baslik}</strong> sera supprimé(e).</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setArasSilOnay(null)} style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"9px", color:"#9aa5be", fontSize:13, cursor:"pointer" }}>İptal</button>
              <button onClick={()=>arastirmaSil(arasSilOnay)} style={{ flex:1, background:"rgba(240,98,146,0.18)", border:"1px solid rgba(240,98,146,0.35)", borderRadius:10, padding:"9px", color:"#f06292", fontSize:13, cursor:"pointer", fontWeight:600 }}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position:"relative", zIndex:1, paddingBottom:80 }}>

        {/* HEADER */}
        <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <img src="/logo.png" alt="NeuroFen Logo" style={{ width:42, height:42, borderRadius:10, objectFit:"cover" }}/>
            <div>
              <div style={{ fontSize:19, fontWeight:700, color:"#fff", letterSpacing:"-0.5px" }}>NeuroFen</div>
              <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace" }}>Chasseuse de Neuromythes — Enseigner avec la Science</div>
            </div>
            <div style={{ marginLeft:"auto", fontSize:11, color:"#7986a3", fontFamily:"monospace" }}>{mitler.length} mythes</div>
          </div>
        </div>

        {/* ── ANA SAYFA ──────────────────────────────────────────────── */}
        {aktifEkran === "ana" && (
          <div style={{ padding:"18px 16px" }}>
            {/* Günün mitosu */}
            <div style={{ background:"linear-gradient(135deg,rgba(79,195,247,0.1),rgba(156,100,240,0.1))", border:"1px solid rgba(79,195,247,0.18)", borderRadius:16, padding:18, marginBottom:16 }}>
              <div style={{ fontSize:10, color:"#4fc3f7", fontFamily:"monospace", letterSpacing:"1px", marginBottom:6 }}>✦ LE NEUROMYTHE DU JOUR</div>
              <div style={{ fontSize:15, fontWeight:600, color:"#fff", marginBottom:6 }}>{mitler[0]?.emoji} {mitler[0]?.baslik}</div>
              <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6 }}>{mitler[0]?.mit.substring(0,100)}...</div>
              <button onClick={()=>detayGit(mitler[0],"ana")} style={{ marginTop:10, background:"rgba(79,195,247,0.12)", border:"1px solid rgba(79,195,247,0.25)", color:"#4fc3f7", borderRadius:8, padding:"6px 14px", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>Voir les détails →</button>
            </div>

            {/* Son araştırma önizleme */}
            {arastirmalar.length > 0 && (
              <div onClick={()=>setAktifEkran("arastirmalar")} style={{ background:`linear-gradient(135deg,${arastirmalar[0].renk}18,rgba(255,255,255,0.02))`, border:`1px solid ${arastirmalar[0].renk}30`, borderRadius:14, padding:14, marginBottom:16, cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontSize:10, color:arastirmalar[0].renk, fontFamily:"monospace", letterSpacing:"1px" }}>🔬 ACTUALITÉS DE LA RECHERCHE</span>
                  <span style={{ marginLeft:"auto", background:`${arastirmalar[0].renk}22`, color:arastirmalar[0].renk, borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:"monospace" }}>{arastirmalar[0].yil}</span>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:4 }}>{arastirmalar[0].baslik}</div>
                <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.5 }}>{arastirmalar[0].ozet.substring(0,90)}...</div>
                <div style={{ fontSize:11, color:arastirmalar[0].renk, marginTop:8, fontFamily:"monospace" }}>Accéder à toutes les études ({arastirmalar.length}) →</div>
              </div>
            )}

            {/* Hızlı erişim */}
            <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", letterSpacing:"1px", marginBottom:10 }}>HIZLI ERİŞİM</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              {[
                {ikon:"🔍",baslik:"Analyse de texte",alt:"Scanner le plan de cours",ekran:"analiz"},
                {ikon:"📚",baslik:"Bibliothèque",alt:`${mitler.length} neuromythes`,ekran:"kutuphane"},
                {ikon:"🔬",baslik:"Recherches",alt:`${arastirmalar.length} études récentes`,ekran:"arastirmalar"},
                {ikon:"💬",baslik:"Assistant IA",alt:"Poser une question",ekran:"chat"},
              ].map(k => (
                <button key={k.ekran} onClick={()=>setAktifEkran(k.ekran)}
                  style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:13, padding:"13px 11px", textAlign:"left", cursor:"pointer" }}>
                  <div style={{ fontSize:22, marginBottom:5 }}>{k.ikon}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:2 }}>{k.baslik}</div>
                  <div style={{ fontSize:11, color:"#7986a3" }}>{k.alt}</div>
                </button>
              ))}
            </div>

            {/* ── HAKKINDA ACCORDION ── */}
            <div style={{ marginBottom:16 }}>
              <button onClick={()=>setAkkordeon(akkordeon?"":"acik")}
                style={{ width:"100%", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:13, padding:"13px 16px", display:"flex", alignItems:"center", cursor:"pointer" }}>
                <span style={{ fontSize:16, marginRight:8 }}>ℹ️</span>
                <span style={{ fontSize:13, fontWeight:600, color:"#fff", flex:1, textAlign:"left" }}>À propos de l'application</span>
                <span style={{ color:"#7986a3", fontSize:14, transition:"transform 0.3s", transform:akkordeon?"rotate(180deg)":"rotate(0deg)" }}>▾</span>
              </button>

              {akkordeon && (
                <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:8 }}>

                  {/* Vizyon */}
                  {[
                    { id:"vizyon", ikon:"🧠", baslik:"Objectif & Vision", renk:"#4fc3f7",
                      icerik: <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.7, borderLeft:"2px solid rgba(79,195,247,0.3)", paddingLeft:10 }}>NeuroFen est une application guide basée sur l'IA, développée pour détecter les mythes neuroscientifiques que les enseignants de sciences utilisent inconsciemment dans leurs plans de cours et proposer des alternatives scientifiques.<br/><br/><span style={{color:"#4fc3f7",fontFamily:"monospace",fontSize:10}}>v1.0.0 · Mars 2026</span></div>
                    },
                    { id:"gelistirici", ikon:"👤", baslik:"Développeur / Universitaire", renk:"#9c64f0",
                      icerik: <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#9c64f0,#f06292)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🎓</div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>MCF. Mustafa Ergun</div>
                          <div style={{ fontSize:11, color:"#9aa5be", marginTop:2 }}>Chercheur en didactique des sciences</div>
                          <div style={{ fontSize:11, color:"#7986a3", marginTop:2, fontFamily:"monospace" }}>Neuroéducation · Formation des enseignants</div>
                        </div>
                      </div>
                    },
                    { id:"kilavuz", ikon:"📖", baslik:"Comment s’en servir ?", renk:"#66bb6a",
                      icerik: <div>{[
                        {no:"1",ikon:"🔍",baslik:"Analyse de texte",aciklama:"Collez votre plan de cours, l'IA détecte les neuromythes."},
                        {no:"2",ikon:"📚",baslik:"Bibliothèque",aciklama:"Explorez les neuromythes, apprenez les alternatives scientifiques."},
                        {no:"3",ikon:"🔬",baslik:"Recherches",aciklama:"Suivez les résultats des études récentes."},
                        {no:"4",ikon:"💬",baslik:"Assistant IA",aciklama:"Posez vos questions à l'IA."},
                      ].map(a => (
                        <div key={a.no} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                          <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(102,187,106,0.15)", border:"1px solid rgba(102,187,106,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#66bb6a", fontFamily:"monospace", flexShrink:0, marginTop:1 }}>{a.no}</div>
                          <div>
                            <div style={{ fontSize:12, fontWeight:600, color:"#fff" }}>{a.ikon} {a.baslik}</div>
                            <div style={{ fontSize:11, color:"#9aa5be", lineHeight:1.5, marginTop:1 }}>{a.aciklama}</div>
                          </div>
                        </div>
                      ))}</div>
                    },
                    { id:"versiyon", ikon:"🕐", baslik:"Historique des versions", renk:"#ffb74d",
                      icerik: <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                        <span style={{ background:"rgba(255,183,77,0.15)", color:"#ffb74d", borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:"monospace", flexShrink:0 }}>v1.0.0</span>
                        <div>
                          <div style={{ fontSize:11, color:"#7986a3", fontFamily:"monospace" }}>Mars 2026</div>
                          <div style={{ fontSize:12, color:"#c5cee0", marginTop:2 }}>Première Publication — 6 Neuromythes, Analyse par l'IA, Module de Recherche</div>
                        </div>
                      </div>
                    },
                    { id:"iletisim", ikon:"✉️", baslik:"Contact & Commentaires", renk:"#f06292",
                      icerik: <div>
                        <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6, marginBottom:10 }}>Contactez-moi pour vos suggestions, retours d'erreurs ou opportunités de collaboration.</div>
                        {[{ikon:"📧",etiket:"E-posta",deger:"iletisim@neurofen.app"},{ikon:"🌐",etiket:"Web",deger:"neurofen.vercel.app"}].map(k=>(
                          <div key={k.etiket} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                            <span style={{ fontSize:13 }}>{k.ikon}</span>
                            <span style={{ fontSize:11, color:"#7986a3", width:52 }}>{k.etiket}:</span>
                            <span style={{ fontSize:12, color:"#4fc3f7", fontFamily:"monospace" }}>{k.deger}</span>
                          </div>
                        ))}
                      </div>
                    },
                  ].map(b => (
                    <div key={b.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${b.renk}22`, borderLeft:`3px solid ${b.renk}55`, borderRadius:12, overflow:"hidden" }}>
                      <button onClick={()=>setAkkordeon(akkordeon===b.id?null:b.id)}
                        style={{ width:"100%", background:"none", border:"none", padding:"11px 14px", display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                        <span style={{ fontSize:14 }}>{b.ikon}</span>
                        <span style={{ fontSize:12, fontWeight:600, color:"#fff", flex:1, textAlign:"left" }}>{b.baslik}</span>
                        <span style={{ color:b.renk, fontSize:12, transition:"transform 0.2s", transform:akkordeon===b.id?"rotate(180deg)":"rotate(0deg)" }}>▾</span>
                      </button>
                      {akkordeon === b.id && (
                        <div style={{ padding:"0 14px 13px" }}>{b.icerik}</div>
                      )}
                    </div>
                  ))}

                  <div style={{ textAlign:"center", padding:"8px 0 4px" }}>
                    <div style={{ fontSize:10, color:"#4a5568", fontFamily:"monospace" }}>© 2026 NeuroFen · Tous droits réservés</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── GÜNCEL ARAŞTIRMALAR (kullanıcı görünümü) ───────────────── */}
        {aktifEkran === "arastirmalar" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:4 }}>🔬 Actualités de la Recherche</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:18 }}>Dernières études en neurosciences de l'éducation</div>

            {arastirmalar.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 20px", color:"#7986a3" }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🔬</div>
                <div style={{ fontSize:14 }}>Henüz araştırma eklenmemiş.</div>
              </div>
            ) : (
              arastirmalar.map(a => (
                <button key={a.id} onClick={()=>setArastirmaDetay(a)}
                  style={{ width:"100%", ...S.kart, textAlign:"left", cursor:"pointer", borderLeft:`3px solid ${a.renk}`, display:"block" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:4, lineHeight:1.4 }}>{a.baslik}</div>
                      <div style={{ display:"flex", gap:6 }}>
                        <span style={{ background:`${a.renk}20`, color:a.renk, borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:"monospace" }}>{a.yil}</span>
                        {a.etiket && <span style={{ background:"rgba(255,255,255,0.06)", color:"#9aa5be", borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:"monospace" }}>{a.etiket}</span>}
                      </div>
                    </div>
                    <span style={{ color:a.renk, fontSize:16, marginTop:2 }}>›</span>
                  </div>
                  <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6 }}>{a.ozet.substring(0,110)}{a.ozet.length>110?"...":""}</div>
                </button>
              ))
            )}

            {/* Araştırma detay popup */}
            {arastirmaDetay && (
              <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:8000, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setArastirmaDetay(null)}>
                <div style={{ background:"#141826", border:`1px solid ${arastirmaDetay.renk}40`, borderRadius:"20px 20px 0 0", padding:24, width:"100%", maxWidth:430, maxHeight:"80vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
                  <div style={{ width:40, height:4, background:"rgba(255,255,255,0.15)", borderRadius:2, margin:"0 auto 20px" }} />
                  <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                    <span style={{ background:`${arastirmaDetay.renk}22`, color:arastirmaDetay.renk, borderRadius:6, padding:"3px 10px", fontSize:11, fontFamily:"monospace" }}>{arastirmaDetay.yil}</span>
                    {arastirmaDetay.etiket && <span style={{ background:"rgba(255,255,255,0.06)", color:"#9aa5be", borderRadius:6, padding:"3px 10px", fontSize:11, fontFamily:"monospace" }}>{arastirmaDetay.etiket}</span>}
                  </div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#fff", marginBottom:14, lineHeight:1.4 }}>{arastirmaDetay.baslik}</div>
                  <div style={{ background:`${arastirmaDetay.renk}12`, borderLeft:`3px solid ${arastirmaDetay.renk}`, borderRadius:10, padding:14, marginBottom:14 }}>
                    <div style={{ fontSize:10, color:arastirmaDetay.renk, fontFamily:"monospace", letterSpacing:"0.5px", marginBottom:6 }}>RÉSUMÉ DE RECHERCHE</div>
                    <div style={{ fontSize:13, color:"#c5cee0", lineHeight:1.7 }}>{arastirmaDetay.ozet}</div>
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:12 }}>
                    <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginBottom:6 }}>📖 RÉFÉRENCE</div>
                    <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6, fontStyle:"italic" }}>{arastirmaDetay.kaynak}</div>
                  </div>
                  <button onClick={()=>setArastirmaDetay(null)} style={{ width:"100%", marginTop:16, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"11px", color:"#9aa5be", fontSize:13, cursor:"pointer" }}>Kapat</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ANALİZ ─────────────────────────────────────────────────── */}
        {aktifEkran === "analiz" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:4 }}>🔍 Analyse de Contenu</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:14 }}>Collez votre plan de cours, l'IA détecte les neuromythes</div>
            <textarea value={analiz.metin} onChange={e=>setAnaliz({metin:e.target.value,sonuclar:[],yapildi:false,aiSonuc:null})}
              placeholder="Écrivez ou collez votre plan de cours ici..."
              style={{...inputStil(false), minHeight:130, resize:"vertical"}} />
            <button onClick={analizEt} disabled={analizYukleniyor||!analiz.metin.trim()}
              style={{ width:"100%", marginTop:10, background:analizYukleniyor?"rgba(79,195,247,0.25)":"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:11, padding:"13px", color:"#fff", fontSize:13, fontWeight:600, cursor:analizYukleniyor?"not-allowed":"pointer" }}>
              {analizYukleniyor?"⏳ Analyse en cours...":"✦ Analyser"}
            </button>
            {analiz.yapildi && (
              <div style={{ marginTop:18 }}>
                {analiz.sonuclar.length === 0 ? (
                  <div style={{ background:"rgba(102,187,106,0.08)", border:"1px solid rgba(102,187,106,0.25)", borderRadius:12, padding:16, textAlign:"center" }}>
                    <div style={{ fontSize:26, marginBottom:6 }}>✅</div>
                    <div style={{ color:"#66bb6a", fontWeight:600 }}>Nöromit tespit edilmedi!</div>
                    <div style={{ fontSize:12, color:"#7986a3", marginTop:4 }}>Ders planınız bilimsel görünüyor.</div>
                  </div>
                ) : (
                  <>
                    <div style={{ background:"rgba(240,98,146,0.08)", border:"1px solid rgba(240,98,146,0.25)", borderRadius:12, padding:13, marginBottom:10 }}>
                      <div style={{ color:"#f06292", fontWeight:600, fontSize:13, marginBottom:4 }}>⚠️ {analiz.sonuclar.length} nöromit tespit edildi</div>
                      {analiz.aiSonuc?.ozet && <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6 }}>{analiz.aiSonuc.ozet}</div>}
                    </div>
                    {analiz.sonuclar.map(mit => (
                      <div key={mit.id} style={{ ...S.kart, borderLeft:"3px solid rgba(240,98,146,0.5)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                          <span style={{ fontSize:18 }}>{mit.emoji}</span>
                          <span style={{ fontWeight:600, color:"#fff", fontSize:13 }}>{mit.baslik}</span>
                        </div>
                        <div style={{ fontSize:12, color:"#66bb6a", lineHeight:1.5, marginBottom:7 }}>✅ {mit.alternatif}</div>
                        <button onClick={()=>detayGit(mit,"analiz")} style={{ background:"rgba(79,195,247,0.08)", border:"1px solid rgba(79,195,247,0.18)", color:"#4fc3f7", borderRadius:7, padding:"5px 11px", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>Detaylı İncele →</button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── KÜTÜPHANE ──────────────────────────────────────────────── */}
        {aktifEkran === "kutuphane" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:4 }}>
              <div style={{ fontSize:17, fontWeight:700, color:"#fff" }}>📚 La bibliothèque des neuromythes</div>
              <button onClick={()=>{setForm(BOŞ_FORM);setDuzenlemId(null);setFormHata({});setAktifEkran("mitEkle");}}
                style={{ marginLeft:"auto", background:"rgba(79,195,247,0.12)", border:"1px solid rgba(79,195,247,0.25)", color:"#4fc3f7", borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:600 }}>+ Nouveau mythe</button>
            </div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:12 }}>{mitler.length} neuromythes · {new Set(mitler.map(m=>m.kategori)).size} catégories</div>
            <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:8, marginBottom:12 }}>
              {kategoriler.map(k => (
                <button key={k} onClick={()=>setKategori(k)} style={{ whiteSpace:"nowrap", padding:"5px 12px", borderRadius:18, border:"1px solid", borderColor:kategori===k?"#4fc3f7":"rgba(255,255,255,0.1)", background:kategori===k?"rgba(79,195,247,0.12)":"transparent", color:kategori===k?"#4fc3f7":"#7986a3", fontSize:11, cursor:"pointer" }}>{k}</button>
              ))}
            </div>
            {filtreliMitler.map(mit => (
              <div key={mit.id} style={{ ...S.kart, display:"flex", alignItems:"center", gap:10 }}>
                <button onClick={()=>detayGit(mit,"kutuphane")} style={{ flex:1, background:"none", border:"none", textAlign:"left", cursor:"pointer", padding:0, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20 }}>{mit.emoji}</span>
                  <div>
                    <div style={{ fontWeight:600, color:"#fff", fontSize:13 }}>{mit.baslik}</div>
                    <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginTop:2 }}>{mit.kategori}</div>
                  </div>
                </button>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={()=>duzenlemeBaslat(mit)} style={{ background:"rgba(79,195,247,0.1)", border:"1px solid rgba(79,195,247,0.2)", color:"#4fc3f7", borderRadius:7, padding:"5px 9px", fontSize:12, cursor:"pointer" }}>✏️</button>
                  <button onClick={()=>setSilOnay(mit.id)} style={{ background:"rgba(240,98,146,0.1)", border:"1px solid rgba(240,98,146,0.2)", color:"#f06292", borderRadius:7, padding:"5px 9px", fontSize:12, cursor:"pointer" }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── DETAY ──────────────────────────────────────────────────── */}
        {aktifEkran === "detay" && secilenMit && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <button onClick={()=>setAktifEkran(oncekiEkran)} style={{ background:"none", border:"none", color:"#4fc3f7", cursor:"pointer", fontSize:12, padding:0, fontFamily:"monospace" }}>← Retour</button>
              <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                <button onClick={()=>duzenlemeBaslat(secilenMit)} style={{ background:"rgba(79,195,247,0.1)", border:"1px solid rgba(79,195,247,0.2)", color:"#4fc3f7", borderRadius:7, padding:"5px 10px", fontSize:11, cursor:"pointer" }}>✏️ Düzenle</button>
                <button onClick={()=>setSilOnay(secilenMit.id)} style={{ background:"rgba(240,98,146,0.1)", border:"1px solid rgba(240,98,146,0.2)", color:"#f06292", borderRadius:7, padding:"5px 10px", fontSize:11, cursor:"pointer" }}>🗑️ Sil</button>
              </div>
            </div>
            <div style={{ fontSize:28, marginBottom:4 }}>{secilenMit.emoji}</div>
            <div style={{ fontSize:19, fontWeight:700, color:"#fff", marginBottom:4 }}>{secilenMit.baslik}</div>
            <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginBottom:18 }}>{secilenMit.kategori}</div>
            {[
              {renk:"#f06292",baslik:"🔴 QU'EST-CE QUE LE NEUROMYTHE ?",icerik:secilenMit.mit},
              {renk:"#4fc3f7",baslik:"🔵 QUE DIT LA SCIENCE ?",icerik:secilenMit.bilim},
              secilenMit.fenBaglantisi&&{renk:"#9c64f0",baslik:"🟣 IMPACT EN COURS DE SCIENCES",icerik:secilenMit.fenBaglantisi},
              {renk:"#66bb6a",baslik:"🟢 STRATÉGIE ALTERNATIVE CORRECTE",icerik:secilenMit.alternatif},
            ].filter(Boolean).map(b => (
              <div key={b.baslik} style={{ background:"rgba(255,255,255,0.02)", borderLeft:`3px solid ${b.renk}`, borderRadius:10, padding:13, marginBottom:10 }}>
                <div style={{ fontSize:10, color:b.renk, fontFamily:"monospace", letterSpacing:"0.5px", marginBottom:6 }}>{b.baslik}</div>
                <div style={{ fontSize:13, color:"#c5cee0", lineHeight:1.7 }}>{b.icerik}</div>
              </div>
            ))}
            {secilenMit.kaynaklar.length > 0 && (
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:10, padding:13 }}>
                <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginBottom:8 }}>📖 RÉFÉRENCES</div>
                {secilenMit.kaynaklar.map((k,i) => <div key={i} style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6, paddingLeft:8, borderLeft:"1px solid rgba(255,255,255,0.08)", marginBottom:5 }}>{k}</div>)}
              </div>
            )}
          </div>
        )}

        {/* ── NÖROMİT EKLE/DÜZENLE ───────────────────────────────────── */}
        {aktifEkran === "mitEkle" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:18 }}>
              <button onClick={()=>{setAktifEkran("kutuphane");setForm(BOŞ_FORM);setDuzenlemId(null);setFormHata({});}} style={{ background:"none", border:"none", color:"#4fc3f7", cursor:"pointer", fontSize:12, padding:0, fontFamily:"monospace" }}>← İptal</button>
              <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginLeft:12 }}>{duzenlemId?"✏️ Modifier le neuromythe":"➕ Ajouter un nouveau neuromythe"}</div>
            </div>
            <Alan label="EMOJI">
              <button onClick={()=>setEmojiSecici(!emojiSecici)} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 16px", fontSize:22, cursor:"pointer" }}>{form.emoji}</button>
              {emojiSecici && (
                <div style={{ background:"#141826", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:10, marginTop:8, display:"flex", flexWrap:"wrap", gap:4 }}>
                  {EMOJILER.map(e => <button key={e} onClick={()=>{formGuncelle("emoji",e);setEmojiSecici(false);}} style={{ background:form.emoji===e?"rgba(79,195,247,0.2)":"transparent", border:"none", borderRadius:8, padding:"6px 8px", fontSize:20, cursor:"pointer" }}>{e}</button>)}
                </div>
              )}
            </Alan>
            <Alan label="TITRE DU NEUROMYTHE" zorunlu hata={formHata.baslik}>
              <input value={form.baslik} onChange={e=>formGuncelle("baslik",e.target.value)} placeholder="Ex : Mythe des 10% du cerveau" style={inputStil(formHata.baslik)} />
            </Alan>
            <Alan label="CATÉGORIE" zorunlu hata={formHata.kategori}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                {mevcutKategoriler.map(k => (
                  <button key={k} onClick={()=>{formGuncelle("kategori",k);formGuncelle("yeniKategori","");}} style={{ padding:"5px 11px", borderRadius:16, border:"1px solid", borderColor:form.kategori===k&&!form.yeniKategori?"#4fc3f7":"rgba(255,255,255,0.1)", background:form.kategori===k&&!form.yeniKategori?"rgba(79,195,247,0.15)":"transparent", color:form.kategori===k&&!form.yeniKategori?"#4fc3f7":"#9aa5be", fontSize:12, cursor:"pointer" }}>{k}</button>
                ))}
              </div>
              <input value={form.yeniKategori} onChange={e=>{formGuncelle("yeniKategori",e.target.value);if(e.target.value)formGuncelle("kategori","");}} placeholder="Saisir une nouvelle catégorie (facultatif)" style={inputStil(formHata.kategori&&!form.kategori&&!form.yeniKategori)} />
            </Alan>
            <Alan label="QUE PRÉTEND CE NEUROMYTHE ?" zorunlu hata={formHata.mit}>
              <textarea value={form.mit} onChange={e=>formGuncelle("mit",e.target.value)} placeholder="Que prétend ce neuromythe ?" style={{...inputStil(formHata.mit),minHeight:75,resize:"vertical"}} />
            </Alan>
            <Alan label="QUE DIT LA SCIENCE ?" zorunlu hata={formHata.bilim}>
              <textarea value={form.bilim} onChange={e=>formGuncelle("bilim",e.target.value)} placeholder="Que montrent les recherches ?" style={{...inputStil(formHata.bilim),minHeight:75,resize:"vertical"}} />
            </Alan>
            <Alan label="COMMENT APPARAÎT-IL EN COURS DE SCIENCES ?">
              <textarea value={form.fenBaglantisi} onChange={e=>formGuncelle("fenBaglantisi",e.target.value)} placeholder="Comment ce mythe est-il utilisé dans les cours de sciences ?" style={{...inputStil(false),minHeight:65,resize:"vertical"}} />
            </Alan>
            <Alan label="STRATÉGIE ALTERNATIVE CORRECTE" zorunlu hata={formHata.alternatif}>
              <textarea value={form.alternatif} onChange={e=>formGuncelle("alternatif",e.target.value)} placeholder="Que faut-il faire à la place ?" style={{...inputStil(formHata.alternatif),minHeight:65,resize:"vertical"}} />
            </Alan>
            <Alan label="SOURCES SCIENTIFIQUES (une source par ligne)">
              <textarea value={form.kaynaklar} onChange={e=>formGuncelle("kaynaklar",e.target.value)} placeholder={"Yazar (Yıl). Makale adı. Dergi.\nYazar2 (Yıl). Kitap adı."} style={{...inputStil(false),minHeight:65,resize:"vertical",fontFamily:"monospace",fontSize:12}} />
            </Alan>
            <Alan label="MOTS-CLÉS (séparés par des virgules)" zorunlu hata={formHata.anahtar_kelimeler}>
              <input value={form.anahtar_kelimeler} onChange={e=>formGuncelle("anahtar_kelimeler",e.target.value)} placeholder="apprenant visuel, auditif, style d'apprentissage" style={inputStil(formHata.anahtar_kelimeler)} />
              <div style={{ fontSize:11, color:"#7986a3", marginTop:4 }}>Bu kelimeler ders planı analizinde kullanılır</div>
            </Alan>
            <button onClick={mitKaydet} style={{ width:"100%", marginTop:8, background:"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:12, padding:"14px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {duzenlemId?"✅ Mettre à jour":"✅ Ajouter à la bibliothèque"}
            </button>
          </div>
        )}

        {/* ── ARAŞTIRMA EKLE/DÜZENLE (sadece yönetici) ───────────────── */}
        {aktifEkran === "arastirmaEkle" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:18 }}>
              <button onClick={()=>{setAktifEkran("yonetici");setArastirmaForm(BOŞ_ARASTIRMA);setArastirmaDuzenlemId(null);setArastirmaFormHata({});}} style={{ background:"none", border:"none", color:"#4fc3f7", cursor:"pointer", fontSize:12, padding:0, fontFamily:"monospace" }}>← İptal</button>
              <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginLeft:12 }}>{arastirmaDuzenlemId?"✏️ Modifier la recherche":"🔬 Ajouter une nouvelle recherche"}</div>
            </div>

            <Alan label="TITRE DE LA RECHERCHE" zorunlu hata={arastirmaFormHata.baslik}>
              <input value={arastirmaForm.baslik} onChange={e=>arastirmaFormGuncelle("baslik",e.target.value)} placeholder="Ex : Prévalence des neuromythes chez les enseignants de sciences" style={inputStil(arastirmaFormHata.baslik)} />
            </Alan>

            <Alan label="RÉSUMÉ DE LA RECHERCHE" zorunlu hata={arastirmaFormHata.ozet}>
              <textarea value={arastirmaForm.ozet} onChange={e=>arastirmaFormGuncelle("ozet",e.target.value)} placeholder="Principales conclusions et importance de la recherche..." style={{...inputStil(arastirmaFormHata.ozet),minHeight:100,resize:"vertical"}} />
            </Alan>

            <Alan label="SOURCE (format APA)" zorunlu hata={arastirmaFormHata.kaynak}>
              <input value={arastirmaForm.kaynak} onChange={e=>arastirmaFormGuncelle("kaynak",e.target.value)} placeholder="Auteur, A. (2024). Titre de l'article. Revue, volume(numéro), pages." style={inputStil(arastirmaFormHata.kaynak)} />
            </Alan>

            <div style={{ display:"flex", gap:10 }}>
              <div style={{ flex:1 }}>
                <Alan label="ANNÉE" zorunlu hata={arastirmaFormHata.yil}>
                  <input value={arastirmaForm.yil} onChange={e=>arastirmaFormGuncelle("yil",e.target.value)} placeholder="2024" style={inputStil(arastirmaFormHata.yil)} />
                </Alan>
              </div>
              <div style={{ flex:1 }}>
                <Alan label="ÉTIQUETTE">
                  <input value={arastirmaForm.etiket} onChange={e=>arastirmaFormGuncelle("etiket",e.target.value)} placeholder="France / Méta-analyse / ECR" style={inputStil(false)} />
                </Alan>
              </div>
            </div>

            <Alan label="COULEUR DE L'ÉTIQUETTE">
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {ARASTIRMA_RENKLERI.map(r => (
                  <button key={r} onClick={()=>arastirmaFormGuncelle("renk",r)}
                    style={{ width:32, height:32, borderRadius:"50%", background:r, border:arastirmaForm.renk===r?"3px solid #fff":"3px solid transparent", cursor:"pointer", outline:"none" }} />
                ))}
              </div>
            </Alan>

            <button onClick={arastirmaKaydet} style={{ width:"100%", marginTop:8, background:"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:12, padding:"14px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {arastirmaDuzenlemId?"✅ Mettre à jour":"✅ Ajouter la recherche"}
            </button>
          </div>
        )}

        {/* ── YÖNETİCİ PANELİ ────────────────────────────────────────── */}
        {aktifEkran === "yonetici" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:4 }}>⚙️ Yönetici Paneli</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:18 }}>Kütüphane ve araştırmaları yönetin</div>

            {/* Nöromit bölümü */}
            <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", letterSpacing:"1px", marginBottom:10 }}>NÖROMİT KÜTÜPHANESİ</div>
            <button onClick={()=>{setForm(BOŞ_FORM);setDuzenlemId(null);setFormHata({});setAktifEkran("mitEkle");}}
              style={{ width:"100%", background:"rgba(79,195,247,0.08)", border:"1px solid rgba(79,195,247,0.2)", borderRadius:12, padding:"13px", color:"#4fc3f7", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:10, textAlign:"left" }}>
              ➕ Yeni Nöromit Ekle <span style={{ float:"right", opacity:0.6 }}>{mitler.length} kayıt</span>
            </button>

            {/* Araştırma bölümü */}
            <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", letterSpacing:"1px", marginBottom:10, marginTop:20 }}>GÜNCEL ARAŞTIRMALAR</div>
            <button onClick={()=>{setArastirmaForm(BOŞ_ARASTIRMA);setArastirmaDuzenlemId(null);setArastirmaFormHata({});setAktifEkran("arastirmaEkle");}}
              style={{ width:"100%", background:"rgba(156,100,240,0.08)", border:"1px solid rgba(156,100,240,0.2)", borderRadius:12, padding:"13px", color:"#9c64f0", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:10, textAlign:"left" }}>
              🔬 Yeni Araştırma Ekle <span style={{ float:"right", opacity:0.6 }}>{arastirmalar.length} kayıt</span>
            </button>

            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:13, padding:14 }}>
              <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginBottom:12 }}>MEVCUT ARAŞTIRMALAR</div>
              {arastirmalar.length === 0 ? (
                <div style={{ fontSize:12, color:"#7986a3", textAlign:"center", padding:"12px 0" }}>Henüz araştırma eklenmemiş</div>
              ) : (
                arastirmalar.map(a => (
                  <div key={a.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:a.renk, flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, color:"#fff", fontWeight:600, lineHeight:1.3 }}>{a.baslik}</div>
                      <div style={{ fontSize:10, color:"#7986a3" }}>{a.yil} · {a.etiket}</div>
                    </div>
                    <button onClick={()=>arastirmaDuzenlemeBaslat(a)} style={{ background:"rgba(79,195,247,0.1)", border:"1px solid rgba(79,195,247,0.2)", color:"#4fc3f7", borderRadius:6, padding:"4px 8px", fontSize:11, cursor:"pointer" }}>✏️</button>
                    <button onClick={()=>setArasSilOnay(a.id)} style={{ background:"rgba(240,98,146,0.1)", border:"1px solid rgba(240,98,146,0.2)", color:"#f06292", borderRadius:6, padding:"4px 8px", fontSize:11, cursor:"pointer" }}>🗑️</button>
                  </div>
                ))
              )}
            </div>

            <div style={{ background:"rgba(255,165,0,0.05)", border:"1px solid rgba(255,165,0,0.18)", borderRadius:12, padding:13, marginTop:14 }}>
              <div style={{ fontSize:11, color:"#ffb74d", fontFamily:"monospace", marginBottom:5 }}>💡 NOT</div>
              <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6 }}>Veriler yalnızca bu oturumda saklanıyor. Kalıcı kayıt için Firebase entegrasyonu önerilir.</div>
            </div>
          </div>
        )}

        {/* ── CHAT ────────────────────────────────────────────────────── */}
        {aktifEkran === "chat" && (
          <div style={{ padding:"18px 16px", display:"flex", flexDirection:"column", height:"calc(100vh - 160px)" }}>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:4 }}>💬 AI Asistan</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:14 }}>Posez vos questions sur les neuromythes</div>
            <div style={{ flex:1, overflowY:"auto", marginBottom:10, display:"flex", flexDirection:"column", gap:10 }}>
              {chatMesajlar.map((m,i) => (
                <div key={i} style={{ display:"flex", justifyContent:m.rol==="kullanici"?"flex-end":"flex-start" }}>
                  <div style={{ maxWidth:"85%", background:m.rol==="kullanici"?"rgba(79,195,247,0.15)":"rgba(255,255,255,0.04)", border:`1px solid ${m.rol==="kullanici"?"rgba(79,195,247,0.25)":"rgba(255,255,255,0.07)"}`, borderRadius:13, padding:"9px 13px", fontSize:13, color:"#e0e0e0", lineHeight:1.6 }}>
                    {m.icerik}
                  </div>
                </div>
              ))}
              {chatYukleniyor && (
                <div style={{ display:"flex", gap:4, padding:"9px 13px", background:"rgba(255,255,255,0.04)", borderRadius:13, width:"fit-content" }}>
                  {[0,1,2].map(i=><div key={i} style={{ width:5, height:5, borderRadius:"50%", background:"#4fc3f7", animation:"pulse 1s infinite", animationDelay:`${i*0.2}s` }} />)}
                </div>
              )}
              <div ref={chatSonRef} />
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={chatGirdi} onChange={e=>setChatGirdi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&chatGonder()} placeholder="Posez votre question..." style={{ flex:1, ...inputStil(false) }} />
              <button onClick={chatGonder} disabled={chatYukleniyor||!chatGirdi.trim()} style={{ background:"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:11, width:44, cursor:"pointer", fontSize:16, opacity:chatYukleniyor?0.5:1 }}>→</button>
            </div>
          </div>
        )}
      </div>

      {/* ALT NAVİGASYON */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(10,14,26,0.96)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", zIndex:100 }}>
        {[
          {id:"ana",ikon:"⊞",etiket:"Accueil"},
          {id:"analiz",ikon:"⌖",etiket:"Analyse"},
          {id:"kutuphane",ikon:"◫",etiket:"Bibliothèque"},
          {id:"arastirmalar",ikon:"🔬",etiket:"Recherches"},
          {id:"chat",ikon:"◉",etiket:"Assistant"},
          {id:"yonetici",ikon:"⚙",etiket:"Admin"},
        ].map(tab => (
          <button key={tab.id} onClick={()=>setAktifEkran(tab.id)}
            style={{ flex:1, background:"none", border:"none", padding:"10px 2px 8px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <span style={{ fontSize:tab.id==="arastirmalar"?14:16, color:aktifEkran===tab.id?"#4fc3f7":"#fff", opacity:aktifEkran===tab.id?1:0.35 }}>{tab.ikon}</span>
            <span style={{ fontSize:8, color:aktifEkran===tab.id?"#4fc3f7":"#7986a3", fontFamily:"monospace" }}>{tab.etiket}</span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.1)}}
        button:active{transform:scale(0.97)}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(79,195,247,0.2);border-radius:2px}
        textarea:focus,input:focus{border-color:rgba(79,195,247,0.4)!important;box-shadow:0 0 0 3px rgba(79,195,247,0.07)}
      `}</style>
    </div>
  );
}
