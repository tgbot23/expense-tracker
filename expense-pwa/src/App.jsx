import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#0a0a0f;--surface:#12121a;--surface2:#1a1a26;
  --border:rgba(255,255,255,0.07);
  --accent:#7c6ff7;--accent2:#f97f6e;
  --green:#4ade80;--red:#f87171;--warn:#fbbf24;
  --text:#f0f0f8;--muted:#6b6b85;
}
body{background:var(--bg);font-family:'DM Mono',monospace;}
input,select,button{font-family:'DM Mono',monospace;}

.app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);color:var(--text);padding:24px 16px 60px;position:relative;overflow-x:hidden;}
.orb{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;opacity:.15;}
.orb1{width:300px;height:300px;background:var(--accent);top:-80px;right:-80px;}
.orb2{width:200px;height:200px;background:var(--accent2);bottom:100px;left:-60px;}
.z1{position:relative;z-index:1;}

/* HEADER */
.hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
.hdr-left .lbl{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);}
.hdr-left .ttl{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;}
.hdr-right{display:flex;gap:8px;align-items:center;}
.chip{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;color:var(--muted);letter-spacing:1px;}
.icon-btn{width:40px;height:40px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:background .2s,transform .15s;}
.icon-btn:hover{background:var(--surface);transform:scale(1.08);}

/* LOGIN */
.login-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;gap:16px;text-align:center;}
.login-icon{font-size:52px;margin-bottom:8px;}
.login-title{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;}
.login-sub{color:var(--muted);font-size:12px;letter-spacing:1px;line-height:1.7;max-width:260px;}
.google-btn{display:flex;align-items:center;gap:10px;background:#fff;color:#111;padding:14px 24px;border-radius:14px;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;letter-spacing:.5px;transition:opacity .2s,transform .15s;margin-top:8px;}
.google-btn:hover{opacity:.9;transform:translateY(-1px);}
.google-btn img{width:20px;height:20px;}

/* USER BAR */
.user-bar{display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:10px 14px;margin-bottom:18px;}
.user-avatar{width:32px;height:32px;border-radius:50%;object-fit:cover;}
.user-name{font-size:12px;color:var(--text);flex:1;}
.signout-btn{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);background:none;border:none;cursor:pointer;padding:4px 8px;}
.signout-btn:hover{color:var(--red);}

/* BALANCE CARD */
.balance-card{background:linear-gradient(135deg,#1e1b4b,#1a1230);border:1px solid rgba(124,111,247,.25);border-radius:20px;padding:22px 20px;margin-bottom:12px;position:relative;overflow:hidden;}
.balance-card::before{content:'';position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:radial-gradient(circle,rgba(124,111,247,.35),transparent 70%);border-radius:50%;}
.bal-lbl{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(124,111,247,.8);margin-bottom:6px;}
.bal-amt{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;line-height:1;margin-bottom:16px;}
.bal-cur{font-size:18px;opacity:.6;margin-right:2px;}
.bal-row{display:flex;gap:10px;}
.bal-stat{flex:1;background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;}
.bal-stat-lbl{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;}
.bal-stat-lbl.e{color:var(--red)}.bal-stat-lbl.i{color:var(--green)}
.bal-stat-val{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;}
.bal-stat-val.e{color:var(--red)}.bal-stat-val.i{color:var(--green)}

/* LIMIT BARS */
.limits-wrap{display:flex;gap:10px;margin-bottom:12px;}
.limit-box{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:12px 14px;}
.limit-box-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.limit-box-title{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);}
.limit-box-pct{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;}
.limit-track{height:4px;background:var(--surface2);border-radius:99px;overflow:hidden;}
.limit-fill{height:100%;border-radius:99px;transition:width .6s cubic-bezier(.34,1.56,.64,1);}
.limit-vals{display:flex;justify-content:space-between;margin-top:5px;}
.limit-val{font-size:9px;color:var(--muted);}

/* ALERTS */
.alert{border-radius:12px;padding:10px 14px;margin-bottom:10px;font-size:11px;letter-spacing:.5px;display:flex;align-items:center;gap:8px;border:1px solid;}
.alert.warn{background:rgba(251,191,36,.08);border-color:rgba(251,191,36,.25);color:var(--warn);}
.alert.danger{background:rgba(248,113,113,.1);border-color:rgba(248,113,113,.25);color:var(--red);}

/* INPUT CARD */
.input-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:18px 16px;margin-bottom:22px;}
.card-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:14px;}
.field{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:13px 14px;width:100%;color:var(--text);font-size:14px;outline:none;margin-bottom:10px;transition:border-color .2s;appearance:none;-webkit-appearance:none;}
.field:focus{border-color:var(--accent);}
.field::placeholder{color:var(--muted);}
.field option{background:#1a1a26;}
.toggle-row{display:flex;gap:8px;margin-bottom:10px;}
.tog{flex:1;padding:11px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);font-size:12px;letter-spacing:1px;cursor:pointer;transition:all .2s;}
.tog.ae{background:rgba(248,113,113,.15);border-color:rgba(248,113,113,.4);color:var(--red);}
.tog.ai{background:rgba(74,222,128,.12);border-color:rgba(74,222,128,.35);color:var(--green);}
.add-btn{width:100%;padding:14px;background:var(--accent);color:#fff;border:none;border-radius:12px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;cursor:pointer;transition:opacity .2s,transform .15s;}
.add-btn:hover{opacity:.88;transform:translateY(-1px);}

/* HISTORY */
.section-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.section-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);}
.pdf-btn{display:flex;align-items:center;gap:6px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:7px 12px;color:var(--text);font-size:10px;letter-spacing:1px;cursor:pointer;transition:background .2s;}
.pdf-btn:hover{background:var(--surface2);}

.date-group{margin-bottom:18px;}
.date-lbl{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;margin-bottom:7px;padding-bottom:6px;border-bottom:1px solid var(--border);}
.tx{display:flex;align-items:center;justify-content:space-between;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:11px 14px;margin-bottom:6px;position:relative;overflow:hidden;}
.tx::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;}
.tx.e::before{background:var(--red);}.tx.i::before{background:var(--green);}
.tx-left{display:flex;align-items:center;gap:10px;}
.tx-dot{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
.tx-dot.e{background:rgba(248,113,113,.15);}.tx-dot.i{background:rgba(74,222,128,.12);}
.tx-type{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);}
.tx-amt{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;}
.tx-amt.e{color:var(--red);}.tx-amt.i{color:var(--green);}
.empty{text-align:center;color:var(--muted);font-size:12px;padding:32px 0;letter-spacing:1px;}

/* MODAL / OVERLAY */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;z-index:100;padding:0 12px 24px;}
.modal{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:24px 20px;width:100%;max-width:430px;animation:slideUp .3s cubic-bezier(.34,1.56,.64,1);}
@keyframes slideUp{from{transform:translateY(60px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.modal-handle{width:40px;height:4px;background:var(--border);border-radius:99px;margin:0 auto 20px;}
.modal-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;margin-bottom:4px;}
.modal-sub{font-size:11px;color:var(--muted);letter-spacing:1px;margin-bottom:18px;}
.modal-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:6px;}
.modal-row{display:flex;gap:10px;margin-top:14px;}
.cancel-btn{flex:1;padding:13px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);color:var(--muted);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer;}
.save-btn{flex:2;padding:13px;border-radius:12px;background:var(--accent);border:none;color:#fff;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer;}
.saved-msg{text-align:center;color:var(--green);font-size:12px;letter-spacing:1px;margin-top:10px;}

/* MONTH SELECTOR */
.month-row{display:flex;gap:8px;margin-bottom:14px;overflow-x:auto;padding-bottom:4px;}
.month-row::-webkit-scrollbar{display:none;}
.month-chip{flex-shrink:0;padding:7px 14px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);font-size:11px;letter-spacing:1px;cursor:pointer;transition:all .2s;white-space:nowrap;}
.month-chip.active{background:var(--accent);border-color:var(--accent);color:#fff;}
`;

/* ─── HELPERS ────────────────────────────────────────────────── */
const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
const today = () => new Date().toISOString().split("T")[0];
const monthKey = (d) => d.slice(0, 7); // "YYYY-MM"
const monthLabel = (ym) => {
  const [y, m] = ym.split("-");
  return new Date(y, m - 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};
const formatDate = (d) => {
  if (d === today()) return "Today";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

/* ─── PDF GENERATOR ──────────────────────────────────────────── */
function generatePDF(transactions, month, userName) {
  const doc = new jsPDF();
  const label = monthLabel(month);

  doc.setFillColor(10, 10, 15);
  doc.rect(0, 0, 210, 297, "F");

  doc.setTextColor(124, 111, 247);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("EXPENSE TRACKER", 14, 18);

  doc.setTextColor(240, 240, 248);
  doc.setFontSize(20);
  doc.text(`Monthly Report — ${label}`, 14, 30);

  doc.setTextColor(107, 107, 133);
  doc.setFontSize(9);
  doc.text(`Generated for: ${userName}`, 14, 38);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 14, 44);

  // Summary
  const expenses = transactions.filter(t => t.type === "expense");
  const incomes = transactions.filter(t => t.type === "income");
  const totalExp = expenses.reduce((a, b) => a + Number(b.amount), 0);
  const totalInc = incomes.reduce((a, b) => a + Number(b.amount), 0);
  const net = totalInc - totalExp;

  doc.setFillColor(26, 26, 38);
  doc.roundedRect(14, 50, 55, 28, 4, 4, "F");
  doc.roundedRect(77, 50, 55, 28, 4, 4, "F");
  doc.roundedRect(140, 50, 56, 28, 4, 4, "F");

  doc.setFontSize(8); doc.setTextColor(107, 107, 133);
  doc.text("TOTAL EXPENSE", 18, 57);
  doc.text("TOTAL INCOME", 81, 57);
  doc.text("NET BALANCE", 144, 57);

  doc.setFontSize(13); doc.setFont("helvetica", "bold");
  doc.setTextColor(248, 113, 113); doc.text(fmt(totalExp), 18, 68);
  doc.setTextColor(74, 222, 128); doc.text(fmt(totalInc), 81, 68);
  doc.setTextColor(net >= 0 ? 74 : 248, net >= 0 ? 222 : 113, net >= 0 ? 128 : 113);
  doc.text(fmt(Math.abs(net)), 144, 68);

  // Table
  autoTable(doc, {
    startY: 86,
    head: [["Date", "Type", "Amount"]],
    body: transactions
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(t => [
        new Date(t.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        t.type.toUpperCase(),
        (t.type === "expense" ? "- " : "+ ") + fmt(t.amount)
      ]),
    styles: { font: "helvetica", fontSize: 9, textColor: [240, 240, 248], fillColor: [18, 18, 26], lineColor: [30, 30, 40], lineWidth: 0.3 },
    headStyles: { fillColor: [26, 26, 38], textColor: [124, 111, 247], fontStyle: "bold", fontSize: 9 },
    alternateRowStyles: { fillColor: [22, 22, 32] },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 45 },
      2: { cellWidth: 50, halign: "right" }
    }
  });

  doc.save(`expense-report-${month}.pdf`);
}

/* ─── MAIN APP ───────────────────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [limits, setLimits] = useState({ daily: 500, monthly: 5000 });
  const [limitInput, setLimitInput] = useState({ daily: 500, monthly: 5000 });
  const [showSettings, setShowSettings] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(monthKey(today()));

  /* AUTH */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* LOAD DATA */
  useEffect(() => {
    if (!user) return;
    loadTransactions();
    loadLimits();
  }, [user]);

  async function loadTransactions() {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });
    if (data) setTransactions(data);
  }

  async function loadLimits() {
    const { data } = await supabase
      .from("user_limits")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (data) {
      setLimits({ daily: data.daily_limit, monthly: data.monthly_limit });
      setLimitInput({ daily: data.daily_limit, monthly: data.monthly_limit });
    }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setTransactions([]);
  }

  async function addEntry() {
    if (!amount || isNaN(Number(amount))) return;
    const entry = { user_id: user.id, amount: Number(amount), type, date: today() };
    const { data } = await supabase.from("transactions").insert([entry]).select().single();
    if (data) setTransactions([data, ...transactions]);
    setAmount("");
  }

  async function saveLimits() {
    const d = Number(limitInput.daily), m = Number(limitInput.monthly);
    if (isNaN(d) || isNaN(m) || d <= 0 || m <= 0) return;
    await supabase.from("user_limits").upsert({ user_id: user.id, daily_limit: d, monthly_limit: m });
    setLimits({ daily: d, monthly: m });
    setSavedMsg("Saved ✓");
    setTimeout(() => { setSavedMsg(""); setShowSettings(false); }, 1200);
  }

  /* COMPUTED */
  const t = today();
  const thisMonth = monthKey(t);

  const todayExp = transactions.filter(x => x.type === "expense" && x.date === t).reduce((a, b) => a + Number(b.amount), 0);
  const todayInc = transactions.filter(x => x.type === "income" && x.date === t).reduce((a, b) => a + Number(b.amount), 0);

  const monthlyExp = transactions.filter(x => x.type === "expense" && monthKey(x.date) === thisMonth).reduce((a, b) => a + Number(b.amount), 0);
  const monthlyInc = transactions.filter(x => x.type === "income" && monthKey(x.date) === thisMonth).reduce((a, b) => a + Number(b.amount), 0);

  const dailyPct = Math.min((todayExp / limits.daily) * 100, 100);
  const monthlyPct = Math.min((monthlyExp / limits.monthly) * 100, 100);

  const dailyColor = dailyPct >= 100 ? "var(--red)" : dailyPct >= 80 ? "var(--warn)" : "var(--accent)";
  const monthlyColor = monthlyPct >= 100 ? "var(--red)" : monthlyPct >= 80 ? "var(--warn)" : "var(--green)";

  const net = todayInc - todayExp;

  /* HISTORY for selected month */
  const monthTx = transactions.filter(x => monthKey(x.date) === selectedMonth);
  const grouped = monthTx.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  /* Available months */
  const months = [...new Set(transactions.map(x => monthKey(x.date)))].sort((a, b) => b.localeCompare(a));
  if (!months.includes(thisMonth)) months.unshift(thisMonth);

  if (loading) return (
    <>
      <style>{STYLE}</style>
      <div className="app" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--muted)", fontSize: 12, letterSpacing: 2 }}>LOADING...</div>
      </div>
    </>
  );

  if (!user) return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <div className="orb orb1" /><div className="orb orb2" />
        <div className="z1 login-wrap">
          <div className="login-icon">💰</div>
          <div className="login-title">Expense Tracker</div>
          <div className="login-sub">Apne daily aur monthly expenses track karo. Sign in karo shuru karne ke liye.</div>
          <button className="google-btn" onClick={signInWithGoogle}>
            <img src="https://www.google.com/favicon.ico" alt="G" />
            Sign in with Google
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <div className="orb orb1" /><div className="orb orb2" />
        <div className="z1">

          {/* HEADER */}
          <div className="hdr">
            <div className="hdr-left">
              <div className="lbl">Finance</div>
              <div className="ttl">Tracker</div>
            </div>
            <div className="hdr-right">
              <div className="chip">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
              <div className="icon-btn" onClick={() => { setShowSettings(true); setLimitInput({ ...limits }); }}>⚙️</div>
            </div>
          </div>

          {/* USER BAR */}
          <div className="user-bar">
            <img className="user-avatar" src={user.user_metadata?.avatar_url || "https://www.gravatar.com/avatar?d=mp"} alt="avatar" />
            <div className="user-name">{user.user_metadata?.full_name || user.email}</div>
            <button className="signout-btn" onClick={signOut}>Sign out</button>
          </div>

          {/* BALANCE CARD */}
          <div className="balance-card">
            <div className="bal-lbl">Today's Net Balance</div>
            <div className="bal-amt">
              <span className="bal-cur">₹</span>
              {Math.abs(net).toLocaleString("en-IN")}
              {net < 0 && <span style={{ fontSize: 16, color: "var(--red)", marginLeft: 6 }}>▼</span>}
              {net > 0 && <span style={{ fontSize: 16, color: "var(--green)", marginLeft: 6 }}>▲</span>}
            </div>
            <div className="bal-row">
              <div className="bal-stat">
                <div className="bal-stat-lbl e">Today Expense</div>
                <div className="bal-stat-val e">{fmt(todayExp)}</div>
              </div>
              <div className="bal-stat">
                <div className="bal-stat-lbl i">Today Income</div>
                <div className="bal-stat-val i">{fmt(todayInc)}</div>
              </div>
            </div>
          </div>

          {/* LIMIT BARS */}
          <div className="limits-wrap">
            <div className="limit-box">
              <div className="limit-box-top">
                <div className="limit-box-title">Daily</div>
                <div className="limit-box-pct" style={{ color: dailyColor }}>{Math.round(dailyPct)}%</div>
              </div>
              <div className="limit-track"><div className="limit-fill" style={{ width: `${dailyPct}%`, background: dailyColor }} /></div>
              <div className="limit-vals">
                <div className="limit-val">{fmt(todayExp)}</div>
                <div className="limit-val">{fmt(limits.daily)}</div>
              </div>
            </div>
            <div className="limit-box">
              <div className="limit-box-top">
                <div className="limit-box-title">Monthly</div>
                <div className="limit-box-pct" style={{ color: monthlyColor }}>{Math.round(monthlyPct)}%</div>
              </div>
              <div className="limit-track"><div className="limit-fill" style={{ width: `${monthlyPct}%`, background: monthlyColor }} /></div>
              <div className="limit-vals">
                <div className="limit-val">{fmt(monthlyExp)}</div>
                <div className="limit-val">{fmt(limits.monthly)}</div>
              </div>
            </div>
          </div>

          {/* ALERTS */}
          {todayExp >= limits.daily * 0.8 && todayExp < limits.daily && (
            <div className="alert warn">⚠️ Daily limit ka 80% use ho gaya!</div>
          )}
          {todayExp >= limits.daily && (
            <div className="alert danger">🚫 Daily limit cross ho gayi! ({fmt(todayExp - limits.daily)} zyada)</div>
          )}
          {monthlyExp >= limits.monthly * 0.8 && monthlyExp < limits.monthly && (
            <div className="alert warn">⚠️ Monthly limit ka 80% use ho gaya!</div>
          )}
          {monthlyExp >= limits.monthly && (
            <div className="alert danger">🚫 Monthly limit cross ho gayi! ({fmt(monthlyExp - limits.monthly)} zyada)</div>
          )}

          {/* INPUT */}
          <div className="input-card">
            <div className="card-title">New Entry</div>
            <input className="field" placeholder="Amount (₹)" value={amount} type="number"
              onChange={e => setAmount(e.target.value)} onKeyDown={e => e.key === "Enter" && addEntry()} />
            <div className="toggle-row">
              <button className={`tog${type === "expense" ? " ae" : ""}`} onClick={() => setType("expense")}>↑ Expense</button>
              <button className={`tog${type === "income" ? " ai" : ""}`} onClick={() => setType("income")}>↓ Income</button>
            </div>
            <button className="add-btn" onClick={addEntry}>ADD ENTRY</button>
          </div>

          {/* MONTH SELECTOR */}
          <div className="month-row">
            {months.map(m => (
              <div key={m} className={`month-chip${selectedMonth === m ? " active" : ""}`} onClick={() => setSelectedMonth(m)}>
                {monthLabel(m)}
              </div>
            ))}
          </div>

          {/* HISTORY HEADER */}
          <div className="section-hdr">
            <div className="section-title">Transactions — {monthLabel(selectedMonth)}</div>
            {monthTx.length > 0 && (
              <button className="pdf-btn" onClick={() => generatePDF(monthTx, selectedMonth, user.user_metadata?.full_name || user.email)}>
                📄 PDF
              </button>
            )}
          </div>

          {/* HISTORY LIST */}
          {Object.keys(grouped).length === 0 && <div className="empty">Koi transaction nahi is mahine</div>}
          {Object.keys(grouped).sort((a, b) => b.localeCompare(a)).map(date => (
            <div className="date-group" key={date}>
              <div className="date-lbl">{formatDate(date)}</div>
              {grouped[date].map((item, i) => (
                <div key={i} className={`tx ${item.type === "expense" ? "e" : "i"}`}>
                  <div className="tx-left">
                    <div className={`tx-dot ${item.type === "expense" ? "e" : "i"}`}>{item.type === "expense" ? "↑" : "↓"}</div>
                    <div className="tx-type">{item.type}</div>
                  </div>
                  <div className={`tx-amt ${item.type === "expense" ? "e" : "i"}`}>
                    {item.type === "expense" ? "−" : "+"}{fmt(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* SETTINGS MODAL */}
          {showSettings && (
            <div className="overlay" onClick={e => e.target === e.currentTarget && setShowSettings(false)}>
              <div className="modal">
                <div className="modal-handle" />
                <div className="modal-title">Settings</div>
                <div className="modal-sub">Apni limits set karo</div>

                <div className="modal-lbl">Daily Expense Limit</div>
                <input className="field" value={limitInput.daily} type="number"
                  onChange={e => setLimitInput({ ...limitInput, daily: e.target.value })} />

                <div className="modal-lbl" style={{ marginTop: 4 }}>Monthly Expense Limit</div>
                <input className="field" value={limitInput.monthly} type="number"
                  onChange={e => setLimitInput({ ...limitInput, monthly: e.target.value })} />

                <div className="modal-row">
                  <button className="cancel-btn" onClick={() => setShowSettings(false)}>Cancel</button>
                  <button className="save-btn" onClick={saveLimits}>Save</button>
                </div>
                {savedMsg && <div className="saved-msg">{savedMsg}</div>}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
