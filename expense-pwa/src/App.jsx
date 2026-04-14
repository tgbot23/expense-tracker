import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

:root {
  --bg: #f2f2f7;
  --surface: #ffffff;
  --surface2: #f2f2f7;
  --surface3: #e5e5ea;
  --border: rgba(0,0,0,0.08);
  --accent: #007aff;
  --accent-light: rgba(0,122,255,0.12);
  --red: #ff3b30;
  --red-light: rgba(255,59,48,0.12);
  --green: #34c759;
  --green-light: rgba(52,199,89,0.12);
  --orange: #ff9500;
  --orange-light: rgba(255,149,0,0.12);
  --text: #000000;
  --text2: #3c3c43;
  --text3: #8e8e93;
  --text4: #aeaeb2;
}

html, body { height: 100%; background: var(--bg); font-family: 'Inter', -apple-system, sans-serif; }

/* SCROLLBAR */
::-webkit-scrollbar { display: none; }

/* APP SHELL */
.app { max-width: 430px; margin: 0 auto; min-height: 100dvh; background: var(--bg); color: var(--text); display: flex; flex-direction: column; position: relative; overflow: hidden; }
.scroll-area { flex: 1; overflow-y: auto; padding: 0 16px 90px; }

/* ── ANIMATIONS ── */
@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes shimmer { from { background-position: -200px 0; } to { background-position: 200px 0; } }
@keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes checkmark { from { stroke-dashoffset: 50; } to { stroke-dashoffset: 0; } }

.a-fadeUp { animation: fadeUp 0.45s cubic-bezier(0.34,1.2,0.64,1) both; }
.a-fadeUp-d1 { animation: fadeUp 0.45s cubic-bezier(0.34,1.2,0.64,1) 0.05s both; }
.a-fadeUp-d2 { animation: fadeUp 0.45s cubic-bezier(0.34,1.2,0.64,1) 0.1s both; }
.a-fadeUp-d3 { animation: fadeUp 0.45s cubic-bezier(0.34,1.2,0.64,1) 0.15s both; }
.a-fadeUp-d4 { animation: fadeUp 0.45s cubic-bezier(0.34,1.2,0.64,1) 0.2s both; }
.a-fadeUp-d5 { animation: fadeUp 0.45s cubic-bezier(0.34,1.2,0.64,1) 0.25s both; }
.a-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both; }

/* ── HAPTIC BUTTON ── */
.hbtn { transition: transform 0.12s ease, opacity 0.12s ease; cursor: pointer; user-select: none; }
.hbtn:active { transform: scale(0.94); opacity: 0.75; }

/* ── STATUS BAR AREA ── */
.status-bar { height: env(safe-area-inset-top, 0px); background: var(--bg); }

/* ── LOGIN ── */
.login-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100dvh; padding: 32px 24px; background: var(--bg); gap: 0; }
.login-logo-wrap { width: 88px; height: 88px; background: var(--accent); border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 42px; margin-bottom: 28px; box-shadow: 0 8px 32px rgba(0,122,255,0.28); animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
.login-title { font-size: 30px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 8px; animation: fadeUp 0.4s 0.1s both; }
.login-sub { font-size: 15px; color: var(--text3); text-align: center; line-height: 1.5; max-width: 240px; margin-bottom: 48px; animation: fadeUp 0.4s 0.15s both; }
.google-btn { display: flex; align-items: center; gap: 12px; background: var(--surface); color: var(--text); padding: 15px 28px; border-radius: 16px; border: 1px solid var(--border); font-size: 16px; font-weight: 600; width: 100%; max-width: 300px; justify-content: center; box-shadow: 0 2px 12px rgba(0,0,0,0.08); animation: fadeUp 0.4s 0.2s both; }
.google-btn img { width: 22px; height: 22px; border-radius: 50%; }
.login-footer { position: absolute; bottom: 32px; font-size: 12px; color: var(--text4); animation: fadeIn 0.4s 0.4s both; }

/* ── HEADER ── */
.header { padding: 16px 16px 8px; background: var(--bg); position: sticky; top: 0; z-index: 10; }
.header-inner { display: flex; align-items: center; justify-content: space-between; }
.header-title { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
.header-right { display: flex; align-items: center; gap: 10px; }
.avatar-btn { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 2px solid var(--border); background: var(--surface3); }
.avatar-btn img { width: 100%; height: 100%; object-fit: cover; }
.icon-pill { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }

/* ── BALANCE CARD ── */
.balance-card { background: var(--accent); border-radius: 24px; padding: 24px 20px; margin-bottom: 12px; color: #fff; position: relative; overflow: hidden; box-shadow: 0 8px 32px rgba(0,122,255,0.22); }
.balance-card::before { content: ''; position: absolute; top: -40px; right: -40px; width: 180px; height: 180px; background: rgba(255,255,255,0.08); border-radius: 50%; }
.balance-card::after { content: ''; position: absolute; bottom: -60px; left: -20px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%; }
.bal-lbl { font-size: 12px; font-weight: 500; opacity: 0.75; letter-spacing: 0.3px; margin-bottom: 6px; }
.bal-amount { font-size: 44px; font-weight: 700; letter-spacing: -1.5px; line-height: 1; margin-bottom: 20px; position: relative; z-index: 1; }
.bal-amount .currency { font-size: 24px; font-weight: 500; opacity: 0.8; vertical-align: top; margin-top: 8px; display: inline-block; }
.bal-stats { display: flex; gap: 10px; position: relative; z-index: 1; }
.bal-stat { flex: 1; background: rgba(255,255,255,0.15); border-radius: 14px; padding: 12px 14px; backdrop-filter: blur(10px); }
.bal-stat-lbl { font-size: 10px; font-weight: 500; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.bal-stat-val { font-size: 18px; font-weight: 700; letter-spacing: -0.5px; }

/* ── LIMIT CARDS ── */
.limit-row { display: flex; gap: 10px; margin-bottom: 12px; }
.limit-card { flex: 1; background: var(--surface); border-radius: 18px; padding: 14px; border: 1px solid var(--border); }
.limit-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.limit-name { font-size: 12px; font-weight: 600; color: var(--text2); }
.limit-pct { font-size: 13px; font-weight: 700; }
.limit-track { height: 5px; background: var(--surface3); border-radius: 99px; overflow: hidden; margin-bottom: 8px; }
.limit-fill { height: 100%; border-radius: 99px; transition: width 0.8s cubic-bezier(0.34,1.2,0.64,1); }
.limit-vals { display: flex; justify-content: space-between; }
.limit-val { font-size: 11px; color: var(--text3); font-weight: 500; }

/* ── ALERTS ── */
.alert { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 14px; margin-bottom: 10px; font-size: 13px; font-weight: 500; animation: slideDown 0.3s cubic-bezier(0.34,1.2,0.64,1); }
.alert.warn { background: var(--orange-light); color: var(--orange); }
.alert.danger { background: var(--red-light); color: var(--red); }
.alert-icon { font-size: 16px; flex-shrink: 0; }

/* ── SECTION TITLE ── */
.section-title { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 12px; margin-top: 4px; }

/* ── ADD ENTRY CARD ── */
.add-card { background: var(--surface); border-radius: 20px; padding: 16px; border: 1px solid var(--border); margin-bottom: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
.amount-input-wrap { position: relative; margin-bottom: 12px; }
.currency-prefix { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 20px; font-weight: 600; color: var(--text3); pointer-events: none; }
.amount-input { width: 100%; background: var(--surface2); border: 1.5px solid transparent; border-radius: 14px; padding: 16px 16px 16px 34px; font-size: 22px; font-weight: 700; color: var(--text); outline: none; letter-spacing: -0.5px; font-family: 'Inter', sans-serif; transition: border-color 0.2s, background 0.2s; }
.amount-input:focus { border-color: var(--accent); background: var(--surface); }
.amount-input::placeholder { color: var(--text4); font-weight: 500; font-size: 18px; }
.type-row { display: flex; background: var(--surface2); border-radius: 12px; padding: 3px; margin-bottom: 12px; gap: 3px; }
.type-btn { flex: 1; padding: 10px; border-radius: 10px; font-size: 14px; font-weight: 600; border: none; background: transparent; color: var(--text3); transition: all 0.2s cubic-bezier(0.34,1.2,0.64,1); cursor: pointer; }
.type-btn.active-exp { background: var(--surface); color: var(--red); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.type-btn.active-inc { background: var(--surface); color: var(--green); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.add-btn { width: 100%; padding: 16px; background: var(--accent); color: #fff; border: none; border-radius: 14px; font-size: 16px; font-weight: 700; letter-spacing: -0.2px; transition: opacity 0.15s, transform 0.15s; }
.add-btn:active { transform: scale(0.97); opacity: 0.88; }

/* ── SUCCESS TOAST ── */
.toast { position: fixed; top: 60px; left: 50%; transform: translateX(-50%); background: #1c1c1e; color: #fff; padding: 12px 20px; border-radius: 14px; font-size: 14px; font-weight: 600; z-index: 999; animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both; display: flex; align-items: center; gap: 8px; white-space: nowrap; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

/* ── MONTH CHIPS ── */
.month-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; margin-bottom: 12px; }
.month-chip { flex-shrink: 0; padding: 7px 16px; border-radius: 99px; font-size: 13px; font-weight: 600; border: 1.5px solid var(--border); background: var(--surface); color: var(--text3); transition: all 0.2s; white-space: nowrap; }
.month-chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }

/* ── TRANSACTIONS ── */
.tx-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.pdf-btn { display: flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 7px 12px; font-size: 12px; font-weight: 600; color: var(--text2); }
.date-label { font-size: 13px; font-weight: 600; color: var(--text3); margin-bottom: 6px; margin-top: 14px; letter-spacing: 0.2px; }
.tx-item { display: flex; align-items: center; background: var(--surface); border-radius: 16px; padding: 13px 14px; margin-bottom: 6px; border: 1px solid var(--border); gap: 12px; animation: fadeUp 0.3s cubic-bezier(0.34,1.2,0.64,1) both; transition: transform 0.15s; }
.tx-item:active { transform: scale(0.98); }
.tx-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.tx-icon.exp { background: var(--red-light); }
.tx-icon.inc { background: var(--green-light); }
.tx-info { flex: 1; }
.tx-type { font-size: 15px; font-weight: 600; color: var(--text); }
.tx-date-sub { font-size: 12px; color: var(--text3); margin-top: 1px; }
.tx-amount { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }
.tx-amount.exp { color: var(--red); }
.tx-amount.inc { color: var(--green); }

/* ── EMPTY STATE ── */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px 24px; gap: 10px; }
.empty-icon { font-size: 44px; margin-bottom: 4px; }
.empty-title { font-size: 17px; font-weight: 600; color: var(--text2); }
.empty-sub { font-size: 14px; color: var(--text3); text-align: center; }

/* ── SKELETON ── */
.skeleton { background: linear-gradient(90deg, var(--surface3) 25%, var(--surface2) 50%, var(--surface3) 75%); background-size: 400px 100%; animation: shimmer 1.4s infinite; border-radius: 12px; }
.sk-card { height: 160px; border-radius: 24px; margin-bottom: 12px; }
.sk-row { display: flex; gap: 10px; margin-bottom: 12px; }
.sk-half { flex: 1; height: 90px; border-radius: 18px; }
.sk-tx { height: 64px; border-radius: 16px; margin-bottom: 6px; }

/* ── BOTTOM NAV ── */
.bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: rgba(242,242,247,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-top: 1px solid var(--border); padding: 8px 16px calc(8px + env(safe-area-inset-bottom, 0px)); display: flex; justify-content: space-around; z-index: 50; }
.nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 4px 16px; border-radius: 12px; transition: all 0.2s; cursor: pointer; min-width: 60px; }
.nav-item.active .nav-icon { color: var(--accent); }
.nav-item.active .nav-label { color: var(--accent); }
.nav-icon { font-size: 22px; line-height: 1; transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); color: var(--text3); }
.nav-item.active .nav-icon { transform: scale(1.15); }
.nav-label { font-size: 10px; font-weight: 600; color: var(--text3); letter-spacing: 0.2px; }

/* ── MODAL ── */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); z-index: 100; display: flex; align-items: flex-end; justify-content: center; animation: fadeIn 0.2s both; padding: 0 0 env(safe-area-inset-bottom, 0px); }
.modal { background: var(--surface); border-radius: 28px 28px 0 0; padding: 20px 20px calc(20px + env(safe-area-inset-bottom, 0px)); width: 100%; max-width: 430px; animation: slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) both; }
.modal-handle { width: 36px; height: 4px; background: var(--surface3); border-radius: 99px; margin: 0 auto 20px; }
.modal-title { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 4px; }
.modal-sub { font-size: 14px; color: var(--text3); margin-bottom: 20px; }
.modal-label { font-size: 12px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.modal-input { width: 100%; background: var(--surface2); border: 1.5px solid transparent; border-radius: 14px; padding: 14px 16px; font-size: 16px; font-weight: 600; color: var(--text); outline: none; font-family: 'Inter', sans-serif; margin-bottom: 14px; transition: border-color 0.2s; }
.modal-input:focus { border-color: var(--accent); }
.modal-row { display: flex; gap: 10px; margin-top: 6px; }
.cancel-btn { flex: 1; padding: 15px; border-radius: 14px; background: var(--surface2); border: none; color: var(--text2); font-size: 16px; font-weight: 600; font-family: 'Inter', sans-serif; }
.save-btn { flex: 2; padding: 15px; border-radius: 14px; background: var(--accent); border: none; color: #fff; font-size: 16px; font-weight: 700; font-family: 'Inter', sans-serif; }

/* ── PROFILE MODAL ── */
.profile-card { background: var(--surface2); border-radius: 18px; padding: 20px; display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.profile-avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border); flex-shrink: 0; }
.profile-name { font-size: 17px; font-weight: 700; }
.profile-email { font-size: 13px; color: var(--text3); margin-top: 2px; }
.signout-btn { width: 100%; padding: 15px; border-radius: 14px; background: var(--red-light); border: none; color: var(--red); font-size: 16px; font-weight: 700; font-family: 'Inter', sans-serif; margin-top: 8px; }

/* ── STATS PAGE ── */
.stat-card { background: var(--surface); border-radius: 20px; padding: 18px; border: 1px solid var(--border); margin-bottom: 10px; }
.stat-card-title { font-size: 13px; font-weight: 600; color: var(--text3); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.4px; }
.stat-big { font-size: 32px; font-weight: 700; letter-spacing: -1px; }
.stat-big.red { color: var(--red); }
.stat-big.green { color: var(--green); }
.stat-row { display: flex; gap: 10px; }
.stat-half { flex: 1; }
`;

/* ─── HELPERS ────────────────────────────────────────────────── */
const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
const today = () => new Date().toISOString().split("T")[0];
const monthKey = (d) => d.slice(0, 7);
const monthLabel = (ym) => {
  const [y, m] = ym.split("-");
  return new Date(y, m - 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};
const formatDate = (d) => {
  const t = today();
  if (d === t) return "Today";
  const yest = new Date(); yest.setDate(yest.getDate() - 1);
  if (d === yest.toISOString().split("T")[0]) return "Yesterday";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

/* ─── PDF ──────────────────────────────────────────────────────── */
function generatePDF(transactions, month, userName) {
  const doc = new jsPDF();
  const label = monthLabel(month);
  doc.setFillColor(242, 242, 247);
  doc.rect(0, 0, 210, 297, "F");
  doc.setTextColor(0, 122, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("EXPENSE TRACKER", 14, 18);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text(`Report — ${label}`, 14, 30);
  doc.setTextColor(142, 142, 147);
  doc.setFontSize(9);
  doc.text(`${userName}`, 14, 38);
  doc.text(`${new Date().toLocaleDateString("en-IN")}`, 14, 44);

  const expenses = transactions.filter(t => t.type === "expense");
  const incomes = transactions.filter(t => t.type === "income");
  const totalExp = expenses.reduce((a, b) => a + Number(b.amount), 0);
  const totalInc = incomes.reduce((a, b) => a + Number(b.amount), 0);
  const net = totalInc - totalExp;

  autoTable(doc, {
    startY: 56,
    head: [["Date", "Type", "Amount"]],
    body: transactions
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(t => [
        new Date(t.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        t.type.toUpperCase(),
        (t.type === "expense" ? "- " : "+ ") + fmt(t.amount)
      ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 122, 255] },
  });
  doc.save(`expense-${month}.pdf`);
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
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(monthKey(today()));
  const [activeTab, setActiveTab] = useState("home");
  const amountRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

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

  useEffect(() => {
    if (!user) return;
    loadTransactions();
    loadLimits();
  }, [user]);

  async function loadTransactions() {
    const { data } = await supabase
      .from("transactions").select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });
    if (data) setTransactions(data);
  }

  async function loadLimits() {
    const { data } = await supabase
      .from("user_limits").select("*")
      .eq("user_id", user.id).single();
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
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) return;
    const entry = { user_id: user.id, amount: num, type, date: today() };
    const { data } = await supabase.from("transactions").insert([entry]).select().single();
    if (data) {
      setTransactions([data, ...transactions]);
      showToast(type === "expense" ? `↑ ${fmt(num)} added` : `↓ ${fmt(num)} added`);
    }
    setAmount("");
    amountRef.current?.blur();
  }

  async function saveLimits() {
    const d = Number(limitInput.daily), m = Number(limitInput.monthly);
    if (isNaN(d) || isNaN(m) || d <= 0 || m <= 0) return;
    await supabase.from("user_limits").upsert({ user_id: user.id, daily_limit: d, monthly_limit: m });
    setLimits({ daily: d, monthly: m });
    setShowSettings(false);
    showToast("✓ Limits saved");
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
  const dailyColor = dailyPct >= 100 ? "var(--red)" : dailyPct >= 80 ? "var(--orange)" : "var(--accent)";
  const monthlyColor = monthlyPct >= 100 ? "var(--red)" : monthlyPct >= 80 ? "var(--orange)" : "var(--green)";
  const net = todayInc - todayExp;

  const monthTx = transactions.filter(x => monthKey(x.date) === selectedMonth);
  const grouped = monthTx.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const months = [...new Set(transactions.map(x => monthKey(x.date)))].sort((a, b) => b.localeCompare(a));
  if (!months.includes(thisMonth)) months.unshift(thisMonth);

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "User";

  /* All time stats */
  const allExp = transactions.filter(x => x.type === "expense").reduce((a, b) => a + Number(b.amount), 0);
  const allInc = transactions.filter(x => x.type === "income").reduce((a, b) => a + Number(b.amount), 0);

  /* ── LOADING ── */
  if (loading) return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <div className="scroll-area" style={{ paddingTop: 80 }}>
          <div className="skeleton sk-card" />
          <div className="sk-row"><div className="skeleton sk-half" /><div className="skeleton sk-half" /></div>
          <div className="skeleton sk-tx" />
          <div className="skeleton sk-tx" />
          <div className="skeleton sk-tx" />
        </div>
      </div>
    </>
  );

  /* ── LOGIN ── */
  if (!user) return (
    <>
      <style>{STYLE}</style>
      <div className="login-page">
        <div className="login-logo-wrap">💰</div>
        <div className="login-title">Expense Tracker</div>
        <div className="login-sub">Track your daily & monthly expenses with ease</div>
        <button className="google-btn hbtn" onClick={signInWithGoogle}>
          <img src="https://www.google.com/favicon.ico" alt="G" />
          Continue with Google
        </button>
        <div className="login-footer">Your data is private & secure</div>
      </div>
    </>
  );

  /* ── HOME TAB ── */
  const HomeTab = (
    <>
      {/* Balance Card */}
      <div className="balance-card a-fadeUp">
        <div className="bal-lbl">TODAY'S NET BALANCE</div>
        <div className="bal-amount">
          <span className="currency">₹</span>
          {Math.abs(net).toLocaleString("en-IN")}
          {net < 0 && <span style={{ fontSize: 20, marginLeft: 8, opacity: 0.8 }}>↓</span>}
          {net > 0 && <span style={{ fontSize: 20, marginLeft: 8, opacity: 0.8 }}>↑</span>}
        </div>
        <div className="bal-stats">
          <div className="bal-stat">
            <div className="bal-stat-lbl">Expense</div>
            <div className="bal-stat-val">{fmt(todayExp)}</div>
          </div>
          <div className="bal-stat">
            <div className="bal-stat-lbl">Income</div>
            <div className="bal-stat-val">{fmt(todayInc)}</div>
          </div>
        </div>
      </div>

      {/* Limit Cards */}
      <div className="limit-row a-fadeUp-d1">
        <div className="limit-card">
          <div className="limit-top">
            <div className="limit-name">Daily</div>
            <div className="limit-pct" style={{ color: dailyColor }}>{Math.round(dailyPct)}%</div>
          </div>
          <div className="limit-track"><div className="limit-fill" style={{ width: `${dailyPct}%`, background: dailyColor }} /></div>
          <div className="limit-vals"><span className="limit-val">{fmt(todayExp)}</span><span className="limit-val">{fmt(limits.daily)}</span></div>
        </div>
        <div className="limit-card">
          <div className="limit-top">
            <div className="limit-name">Monthly</div>
            <div className="limit-pct" style={{ color: monthlyColor }}>{Math.round(monthlyPct)}%</div>
          </div>
          <div className="limit-track"><div className="limit-fill" style={{ width: `${monthlyPct}%`, background: monthlyColor }} /></div>
          <div className="limit-vals"><span className="limit-val">{fmt(monthlyExp)}</span><span className="limit-val">{fmt(limits.monthly)}</span></div>
        </div>
      </div>

      {/* Alerts */}
      {todayExp >= limits.daily * 0.8 && todayExp < limits.daily && (
        <div className="alert warn"><span className="alert-icon">⚠️</span>Daily limit ka 80% use ho gaya!</div>
      )}
      {todayExp >= limits.daily && (
        <div className="alert danger"><span className="alert-icon">🚫</span>Daily limit cross! ({fmt(todayExp - limits.daily)} extra)</div>
      )}
      {monthlyExp >= limits.monthly * 0.8 && monthlyExp < limits.monthly && (
        <div className="alert warn"><span className="alert-icon">⚠️</span>Monthly limit ka 80% use ho gaya!</div>
      )}
      {monthlyExp >= limits.monthly && (
        <div className="alert danger"><span className="alert-icon">🚫</span>Monthly limit cross! ({fmt(monthlyExp - limits.monthly)} extra)</div>
      )}

      {/* Add Entry */}
      <div className="section-title a-fadeUp-d2">New Entry</div>
      <div className="add-card a-fadeUp-d3">
        <div className="amount-input-wrap">
          <span className="currency-prefix">₹</span>
          <input ref={amountRef} className="amount-input" placeholder="0" value={amount} type="number"
            onChange={e => setAmount(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addEntry()} />
        </div>
        <div className="type-row">
          <button className={`type-btn hbtn ${type === "expense" ? "active-exp" : ""}`} onClick={() => setType("expense")}>↑ Expense</button>
          <button className={`type-btn hbtn ${type === "income" ? "active-inc" : ""}`} onClick={() => setType("income")}>↓ Income</button>
        </div>
        <button className="add-btn hbtn" onClick={addEntry}>Add Entry</button>
      </div>
    </>
  );

  /* ── HISTORY TAB ── */
  const HistoryTab = (
    <>
      <div className="month-scroll">
        {months.map(m => (
          <div key={m} className={`month-chip hbtn ${selectedMonth === m ? "active" : ""}`} onClick={() => setSelectedMonth(m)}>
            {monthLabel(m)}
          </div>
        ))}
      </div>
      <div className="tx-header">
        <div className="section-title" style={{ marginBottom: 0 }}>Transactions</div>
        {monthTx.length > 0 && (
          <button className="pdf-btn hbtn" onClick={() => generatePDF(monthTx, selectedMonth, userName)}>
            📄 PDF
          </button>
        )}
      </div>
      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗂️</div>
          <div className="empty-title">No transactions</div>
          <div className="empty-sub">Is mahine koi entry nahi hai</div>
        </div>
      ) : (
        Object.keys(grouped).sort((a, b) => b.localeCompare(a)).map(date => (
          <div key={date}>
            <div className="date-label">{formatDate(date)}</div>
            {grouped[date].map((item, i) => (
              <div key={i} className="tx-item">
                <div className={`tx-icon ${item.type === "expense" ? "exp" : "inc"}`}>
                  {item.type === "expense" ? "↑" : "↓"}
                </div>
                <div className="tx-info">
                  <div className="tx-type">{item.type === "expense" ? "Expense" : "Income"}</div>
                  <div className="tx-date-sub">{formatDate(date)}</div>
                </div>
                <div className={`tx-amount ${item.type === "expense" ? "exp" : "inc"}`}>
                  {item.type === "expense" ? "−" : "+"}{fmt(item.amount)}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </>
  );

  /* ── STATS TAB ── */
  const StatsTab = (
    <>
      <div className="section-title">Overview</div>
      <div className="stat-row a-fadeUp">
        <div className="stat-half">
          <div className="stat-card">
            <div className="stat-card-title">Total Expense</div>
            <div className="stat-big red">{fmt(allExp)}</div>
          </div>
        </div>
        <div className="stat-half">
          <div className="stat-card">
            <div className="stat-card-title">Total Income</div>
            <div className="stat-big green">{fmt(allInc)}</div>
          </div>
        </div>
      </div>
      <div className="stat-card a-fadeUp-d1">
        <div className="stat-card-title">Net Savings</div>
        <div className="stat-big" style={{ color: allInc - allExp >= 0 ? "var(--green)" : "var(--red)" }}>
          {allInc - allExp >= 0 ? "+" : "−"}{fmt(Math.abs(allInc - allExp))}
        </div>
      </div>
      <div className="stat-card a-fadeUp-d2">
        <div className="stat-card-title">This Month Expense</div>
        <div className="stat-big red">{fmt(monthlyExp)}</div>
      </div>
      <div className="stat-card a-fadeUp-d3">
        <div className="stat-card-title">This Month Income</div>
        <div className="stat-big green">{fmt(monthlyInc)}</div>
      </div>
      <div className="stat-card a-fadeUp-d4">
        <div className="stat-card-title">Total Transactions</div>
        <div className="stat-big" style={{ color: "var(--accent)" }}>{transactions.length}</div>
      </div>
    </>
  );

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <div className="status-bar" />

        {/* Header */}
        <div className="header">
          <div className="header-inner">
            <div className="header-title">
              {activeTab === "home" && "Finance"}
              {activeTab === "history" && "History"}
              {activeTab === "stats" && "Stats"}
            </div>
            <div className="header-right">
              <div className="icon-pill hbtn" onClick={() => setShowSettings(true)}>⚙️</div>
              <div className="avatar-btn hbtn" onClick={() => setShowProfile(true)}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" referrerPolicy="no-referrer" />
                  : <div style={{ width: "100%", height: "100%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{userName[0]}</div>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="scroll-area">
          {activeTab === "home" && HomeTab}
          {activeTab === "history" && HistoryTab}
          {activeTab === "stats" && StatsTab}
        </div>

        {/* Bottom Nav */}
        <div className="bottom-nav">
          {[
            { id: "home", icon: "🏠", label: "Home" },
            { id: "history", icon: "📋", label: "History" },
            { id: "stats", icon: "📊", label: "Stats" },
          ].map(tab => (
            <div key={tab.id} className={`nav-item hbtn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
              <div className="nav-icon">{tab.icon}</div>
              <div className="nav-label">{tab.label}</div>
            </div>
          ))}
        </div>

        {/* Toast */}
        {toast && <div className="toast">{toast}</div>}

        {/* Settings Modal */}
        {showSettings && (
          <div className="overlay" onClick={e => e.target === e.currentTarget && setShowSettings(false)}>
            <div className="modal">
              <div className="modal-handle" />
              <div className="modal-title">Limits</div>
              <div className="modal-sub">Apni daily aur monthly limits set karo</div>
              <div className="modal-label">Daily Limit</div>
              <input className="modal-input" value={limitInput.daily} type="number"
                onChange={e => setLimitInput({ ...limitInput, daily: e.target.value })} />
              <div className="modal-label">Monthly Limit</div>
              <input className="modal-input" value={limitInput.monthly} type="number"
                onChange={e => setLimitInput({ ...limitInput, monthly: e.target.value })} />
              <div className="modal-row">
                <button className="cancel-btn hbtn" onClick={() => setShowSettings(false)}>Cancel</button>
                <button className="save-btn hbtn" onClick={saveLimits}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {showProfile && (
          <div className="overlay" onClick={e => e.target === e.currentTarget && setShowProfile(false)}>
            <div className="modal">
              <div className="modal-handle" />
              <div className="modal-title">Profile</div>
              <div className="profile-card">
                {avatarUrl
                  ? <img className="profile-avatar" src={avatarUrl} alt="avatar" referrerPolicy="no-referrer" />
                  : <div className="profile-avatar" style={{ background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 22 }}>{userName[0]}</div>
                }
                <div>
                  <div className="profile-name">{userName}</div>
                  <div className="profile-email">{user.email}</div>
                </div>
              </div>
              <button className="signout-btn hbtn" onClick={() => { signOut(); setShowProfile(false); }}>Sign Out</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
