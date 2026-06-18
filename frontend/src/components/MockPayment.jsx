import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

/* ─────────────────────────── inline styles ─────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  .mp-root * { box-sizing: border-box; font-family: 'Inter', sans-serif; }

  /* Overlay */
  .mp-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(2, 6, 23, 0.85);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: mp-fadeIn .3s ease;
  }

  @keyframes mp-fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes mp-slideUp { from { opacity:0; transform:translateY(36px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes mp-spinRing { to { transform: rotate(360deg); } }
  @keyframes mp-progressBar {
    0%   { width: 8%;  }
    25%  { width: 38%; }
    55%  { width: 62%; }
    80%  { width: 80%; }
    100% { width: 93%; }
  }
  @keyframes mp-checkPop {
    0%   { transform: scale(0) rotate(-15deg); opacity:0; }
    70%  { transform: scale(1.18) rotate(4deg); }
    100% { transform: scale(1) rotate(0deg); opacity:1; }
  }
  @keyframes mp-glowPulse {
    0%,100% { box-shadow: 0 0 18px rgba(59,130,246,.3); }
    50%      { box-shadow: 0 0 36px rgba(59,130,246,.65); }
  }

  /* Modal shell */
  .mp-modal {
    background: linear-gradient(145deg, #0d1526 0%, #111827 55%, #0d1526 100%);
    border: 1px solid rgba(99,102,241,.22);
    border-radius: 24px;
    box-shadow: 0 40px 100px rgba(0,0,0,.75), inset 0 0 0 1px rgba(255,255,255,.04);
    width: 100%; max-width: 980px;
    max-height: 92vh;
    overflow: hidden;
    animation: mp-slideUp .38s cubic-bezier(.22,1,.36,1);
  }

  /* Scrollable body */
  .mp-scroll { overflow-y: auto; max-height: 92vh; }
  .mp-scroll::-webkit-scrollbar { width: 4px; }
  .mp-scroll::-webkit-scrollbar-track { background: transparent; }
  .mp-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,.35); border-radius: 99px; }

  /* Header */
  .mp-header {
    background: linear-gradient(135deg, rgba(37,99,235,.92) 0%, rgba(79,70,229,.92) 100%);
    padding: 18px 28px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,.1);
    position: sticky; top: 0; z-index: 10;
    backdrop-filter: blur(10px);
  }
  .mp-header-badge { display: flex; align-items: center; gap: 12px; }
  .mp-header-icon {
    width: 40px; height: 40px;
    background: rgba(255,255,255,.18);
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 19px;
  }
  .mp-header h2 { color: #fff; font-size: 1.3rem; font-weight: 700; margin: 0; }
  .mp-header p  { color: rgba(255,255,255,.62); font-size: .73rem; margin: 2px 0 0; }

  .mp-close-btn {
    width: 36px; height: 36px;
    background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.18);
    border-radius: 50%;
    color: #fff; font-size: 1.35rem; line-height: 1;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background .2s, transform .2s;
  }
  .mp-close-btn:hover { background: rgba(255,255,255,.25); transform: scale(1.1) rotate(90deg); }

  /* Two-column grid */
  .mp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
    padding: 24px 26px 28px;
  }
  @media (max-width: 768px) {
    .mp-grid { grid-template-columns: 1fr; gap: 18px; padding: 18px; }
  }

  /* Glass card */
  .mp-glass {
    background: rgba(255,255,255,.035);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px;
    overflow: hidden;
    transition: border-color .25s;
  }
  .mp-glass:hover { border-color: rgba(255,255,255,.12); }

  .mp-card-head {
    padding: 13px 20px;
    border-bottom: 1px solid rgba(255,255,255,.07);
    display: flex; align-items: center; gap: 10px;
  }
  .mp-card-head-icon {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }
  .mp-card-head h3 { color: #ffffff; font-size: .88rem; font-weight: 700; margin: 0; letter-spacing: .01em; }

  /* Doctor section */
  .mp-doctor-wrap { padding: 18px 20px 20px; }
  .mp-doctor-row {
    display: flex; align-items: flex-start; gap: 16px;
    padding-bottom: 16px; margin-bottom: 16px;
    border-bottom: 1px solid rgba(255,255,255,.07);
  }
  .mp-doctor-img-wrap { position: relative; flex-shrink: 0; }
  .mp-doctor-img {
    width: 78px; height: 78px;
    border-radius: 16px;
    object-fit: cover;
    border: 2px solid rgba(99,102,241,.5);
    box-shadow: 0 8px 22px rgba(0,0,0,.45);
  }
  .mp-online-dot {
    position: absolute; bottom: -3px; right: -3px;
    width: 15px; height: 15px;
    background: #22c55e;
    border-radius: 50%;
    border: 2px solid #0d1526;
    box-shadow: 0 0 7px rgba(34,197,94,.55);
  }
  .mp-doctor-name { color: #ffffff; font-size: 1.05rem; font-weight: 700; margin: 0 0 5px; }
  .mp-doctor-spec {
    display: inline-block;
    background: linear-gradient(135deg, rgba(99,102,241,.28), rgba(168,85,247,.22));
    border: 1px solid rgba(99,102,241,.38);
    color: #c4b5fd;
    font-size: .71rem; font-weight: 600;
    padding: 3px 11px; border-radius: 99px;
    margin-bottom: 6px;
  }
  .mp-doctor-exp { color: #9ca3af; font-size: .75rem; }

  /* Appointment info rows */
  .mp-info-row {
    display: flex; align-items: center; gap: 12px;
    background: rgba(255,255,255,.035);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 12px;
    padding: 11px 14px;
    margin-bottom: 10px;
    transition: background .2s, border-color .2s;
  }
  .mp-info-row:hover { background: rgba(255,255,255,.065); border-color: rgba(255,255,255,.12); }
  .mp-info-icon {
    width: 34px; height: 34px; flex-shrink: 0; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
  }
  .mp-info-label { color: #94a3b8; font-size: .67rem; text-transform: uppercase; letter-spacing: .06em; }
  .mp-info-value { color: #ffffff; font-size: .875rem; font-weight: 600; margin-top: 2px; }

  /* Price breakdown */
  .mp-price-body { padding: 18px 20px 20px; }
  .mp-price-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,.05);
  }
  .mp-price-row:last-of-type { border-bottom: none; }
  .mp-price-label { color: #cbd5e1; font-size: .85rem; display: flex; align-items: center; gap: 6px; }
  .mp-price-label span { color: #94a3b8; font-size: .72rem; }
  .mp-price-value { color: #ffffff; font-size: .875rem; font-weight: 600; }

  .mp-price-divider {
    border: none;
    border-top: 1px dashed rgba(99,102,241,.3);
    margin: 14px 0;
  }
  .mp-total-row {
    display: flex; justify-content: space-between; align-items: center;
    background: linear-gradient(135deg, rgba(37,99,235,.22), rgba(79,70,229,.18));
    border: 1px solid rgba(99,102,241,.42);
    border-radius: 14px;
    padding: 16px 18px;
    animation: mp-glowPulse 3.5s ease infinite;
  }
  .mp-total-label { color: #ffffff; font-size: 1rem; font-weight: 700; }
  .mp-total-label span { display: block; color: #818cf8; font-size: .69rem; font-weight: 500; margin-top: 2px; }
  .mp-total-amount { color: #60a5fa; font-size: 1.85rem; font-weight: 800; letter-spacing: -.02em; }
  .mp-total-currency { font-size: 1rem; vertical-align: top; margin-top: 4px; display: inline-block; }

  /* Payment method cards */
  .mp-methods-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 18px;
  }
  @media (max-width: 480px) { .mp-methods-grid { grid-template-columns: 1fr; } }

  .mp-method-card {
    position: relative;
    background: rgba(255,255,255,.04);
    border: 1.5px solid rgba(255,255,255,.09);
    border-radius: 14px;
    padding: 16px 12px;
    cursor: pointer;
    transition: all .22s cubic-bezier(.22,1,.36,1);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    text-align: center; min-height: 112px;
  }
  .mp-method-card:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(99,102,241,0.5);
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.45), 0 0 15px rgba(99,102,241,0.15);
  }
  .mp-method-card.mp-selected {
    background: linear-gradient(145deg, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.12) 100%);
    border-color: #6366f1;
    box-shadow: 0 0 20px rgba(99,102,241,0.4), inset 0 0 0 1px rgba(99,102,241,0.2);
    transform: translateY(-4px);
  }
  .mp-method-icon-wrap {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    transition: transform .22s;
  }
  .mp-method-card:hover .mp-method-icon-wrap,
  .mp-method-card.mp-selected .mp-method-icon-wrap { transform: scale(1.12); }
  .mp-method-name { color: #ffffff; font-size: .8rem; font-weight: 700; }
  .mp-method-desc { color: #94a3b8; font-size: .67rem; line-height: 1.35; }
  .mp-method-check {
    position: absolute; top: 8px; right: 8px;
    width: 20px; height: 20px; background: #6366f1; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    animation: mp-checkPop .22s cubic-bezier(.22,1,.36,1);
  }
  .mp-method-check svg { width: 11px; height: 11px; color: #fff; }

  /* Security badge */
  .mp-security {
    background: linear-gradient(135deg, rgba(16,185,129,.1), rgba(5,150,105,.07));
    border: 1px solid rgba(16,185,129,.24);
    border-radius: 14px;
    padding: 14px 18px;
    display: flex; align-items: center; gap: 14px;
  }
  .mp-security-icon {
    width: 42px; height: 42px; flex-shrink: 0;
    background: rgba(16,185,129,.14);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .mp-security-icon svg { width: 21px; height: 21px; color: #34d399; }
  .mp-security h4 { color: #34d399; font-size: .875rem; font-weight: 700; margin: 0 0 3px; }
  .mp-security p  { color: #6ee7b7; font-size: .71rem; margin: 0; }
  .mp-security-badges { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
  .mp-badge {
    background: rgba(16,185,129,.12);
    border: 1px solid rgba(16,185,129,.2);
    border-radius: 6px;
    color: #6ee7b7; font-size: .63rem; font-weight: 600;
    padding: 2px 8px;
  }

  /* Pay button */
  .mp-pay-btn {
    width: 100%;
    padding: 15px;
    border-radius: 14px;
    font-size: 1.05rem; font-weight: 700;
    cursor: pointer;
    border: none;
    transition: all .22s cubic-bezier(.22,1,.36,1);
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    color: #fff;
    box-shadow: 0 8px 22px rgba(37,99,235,.42);
    display: flex; align-items: center; justify-content: center; gap: 10px;
    letter-spacing: .01em;
  }
  .mp-pay-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%);
    transform: translateY(-2px) scale(1.012);
    box-shadow: 0 16px 38px rgba(37,99,235,.55);
  }
  .mp-pay-btn:active:not(:disabled) { transform: translateY(0) scale(.99); }
  .mp-pay-btn:disabled { background: rgba(55,65,81,.7); cursor: not-allowed; box-shadow: none; color: #6b7280; }
  .mp-pay-btn-arrow {
    width: 28px; height: 28px;
    background: rgba(255,255,255,.15);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: .85rem;
  }
  .mp-spinner {
    width: 20px; height: 20px;
    border: 2.5px solid rgba(255,255,255,.28);
    border-top-color: #fff;
    border-radius: 50%;
    animation: mp-spinRing .7s linear infinite;
  }

  /* Column layouts */
  .mp-left-col  { display: flex; flex-direction: column; gap: 16px; }
  .mp-right-col { display: flex; flex-direction: column; gap: 16px; }

  /* ── Processing overlay ── */
  .mp-proc-modal {
    background: linear-gradient(145deg, #0d1526 0%, #111827 100%);
    border: 1px solid rgba(99,102,241,.24);
    border-radius: 24px;
    padding: 48px 40px;
    max-width: 440px; width: 100%;
    text-align: center;
    animation: mp-slideUp .32s cubic-bezier(.22,1,.36,1);
  }
  .mp-spin-ring-wrap { position: relative; width: 96px; height: 96px; margin: 0 auto 26px; }
  .mp-spin-track {
    position: absolute; inset: 0;
    border: 4px solid rgba(99,102,241,.14);
    border-radius: 50%;
  }
  .mp-spin-active {
    position: absolute; inset: 0;
    border: 4px solid transparent;
    border-top-color: #6366f1;
    border-right-color: #3b82f6;
    border-radius: 50%;
    animation: mp-spinRing 1s linear infinite;
  }
  .mp-spin-inner {
    position: absolute; inset: 12px;
    border: 3px solid transparent;
    border-bottom-color: rgba(99,102,241,.45);
    border-radius: 50%;
    animation: mp-spinRing .7s linear infinite reverse;
  }
  .mp-spin-dot {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 27px;
  }
  .mp-proc-title { color: #f1f5f9; font-size: 1.4rem; font-weight: 700; margin: 0 0 8px; }
  .mp-proc-sub   { color: #6b7280; font-size: .875rem; margin: 0 0 26px; }
  .mp-prog-track { background: rgba(255,255,255,.06); border-radius: 99px; height: 6px; overflow: hidden; margin-bottom: 12px; }
  .mp-prog-fill  {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, #2563eb, #6366f1, #8b5cf6);
    animation: mp-progressBar 2s ease forwards;
  }
  .mp-proc-note { color: #4b5563; font-size: .71rem; }

  /* ── Success overlay ── */
  .mp-success-modal {
    background: linear-gradient(145deg, #0d1526 0%, #052e16 100%);
    border: 1px solid rgba(34,197,94,.24);
    border-radius: 24px;
    padding: 48px 40px;
    max-width: 440px; width: 100%;
    text-align: center;
    animation: mp-slideUp .32s cubic-bezier(.22,1,.36,1);
  }
  .mp-success-icon {
    width: 96px; height: 96px; margin: 0 auto 22px;
    background: radial-gradient(circle, rgba(34,197,94,.22), rgba(34,197,94,.04));
    border: 2px solid rgba(34,197,94,.32);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 42px;
    animation: mp-checkPop .45s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 0 38px rgba(34,197,94,.22);
  }
  .mp-success-title { color: #4ade80; font-size: 1.5rem; font-weight: 800; margin: 0 0 10px; }
  .mp-success-sub   { color: #9ca3af; font-size: .9rem; margin: 0 0 22px; }
  .mp-success-card  {
    background: rgba(34,197,94,.08);
    border: 1px solid rgba(34,197,94,.18);
    border-radius: 14px; padding: 16px;
  }
  .mp-success-card p { color: #86efac; font-size: .8rem; margin: 0; }

  /* ── Failed overlay ── */
  .mp-failed-modal {
    background: linear-gradient(145deg, #0d1526 0%, #450a0a 100%);
    border: 1px solid rgba(239,68,68,.24);
    border-radius: 24px;
    padding: 48px 40px;
    max-width: 440px; width: 100%;
    text-align: center;
    animation: mp-slideUp .32s cubic-bezier(.22,1,.36,1);
  }
  .mp-failed-icon {
    width: 96px; height: 96px; margin: 0 auto 22px;
    background: radial-gradient(circle, rgba(239,68,68,.18), rgba(239,68,68,.04));
    border: 2px solid rgba(239,68,68,.28);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 42px;
    animation: mp-checkPop .38s cubic-bezier(.22,1,.36,1);
  }
  .mp-failed-title { color: #f87171; font-size: 1.4rem; font-weight: 800; margin: 0 0 10px; }
  .mp-failed-sub   { color: #9ca3af; font-size: .875rem; margin: 0 0 26px; }
  .mp-failed-btns  { display: flex; gap: 12px; }
  .mp-retry-btn {
    flex: 1; padding: 13px;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: #fff; border: none; border-radius: 12px;
    font-size: .9rem; font-weight: 700; cursor: pointer;
    transition: all .2s;
    box-shadow: 0 4px 16px rgba(37,99,235,.32);
  }
  .mp-retry-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(37,99,235,.5); }
  .mp-cancel-btn {
    flex: 1; padding: 13px;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.1);
    color: #9ca3af; border-radius: 12px;
    font-size: .9rem; font-weight: 600; cursor: pointer;
    transition: all .2s;
  }
  .mp-cancel-btn:hover { background: rgba(255,255,255,.1); color: #e5e7eb; }
`;

/* ─────────────────────────── SVG icons ─────────────────────────── */
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-400">
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="6" y1="14" x2="10" y2="14" />
  </svg>
);

const UpiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-400">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12" y2="18.01" />
    <path d="M9 6h6v4H9z" />
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-400">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4z" />
  </svg>
);

const BankIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-400">
    <path d="M3 22h18" />
    <path d="M6 18V9" />
    <path d="M10 18V9" />
    <path d="M14 18V9" />
    <path d="M18 18V9" />
    <path d="M12 2L2 7h20L12 2z" />
  </svg>
);

/* ─────────────────────────── payment method config ─────────────────────────── */
const paymentMethods = [
  { id: 'card',       name: 'Credit/Debit Card', icon: <CardIcon />, description: 'Visa, Mastercard, Amex',   bg: 'rgba(37,99,235,.12)'  },
  { id: 'upi',        name: 'UPI Payment',        icon: <UpiIcon />, description: 'GPay, PhonePe, Paytm',    bg: 'rgba(139,92,246,.12)' },
  { id: 'wallet',     name: 'Digital Wallet',     icon: <WalletIcon />, description: 'Paytm, Amazon Pay',       bg: 'rgba(234,179,8,.12)'  },
  { id: 'netbanking', name: 'Net Banking',         icon: <BankIcon />, description: 'All major banks',         bg: 'rgba(16,185,129,.12)' },
];

/* ═══════════════════════════════ COMPONENT ═══════════════════════════════ */
const MockPayment = ({
  appointmentData,
  onSuccess,
  onFailure,
  onClose
}) => {
  const { backendUrl, token } = useContext(AppContext);
  const [isProcessing,   setIsProcessing]   = useState(false);
  const [paymentStep,    setPaymentStep]     = useState('review');
  const [selectedMethod, setSelectedMethod] = useState('card');

  /* ── helpers ── */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('_');
    if (parts.length !== 3) return dateString;
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${parts[0]} ${months[parseInt(parts[1])] || parts[1]} ${parts[2]}`;
  };

  const consultationFee = appointmentData?.amount || 0;
  const platformFee     = Math.round(consultationFee * 0.05);
  const tax             = Math.round((consultationFee + platformFee) * 0.18);
  const totalAmount     = consultationFee + platformFee + tax;

  /* ── processMockPayment — UNCHANGED ── */
  const processMockPayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentStep('processing');

      const orderResponse = await axios.post(
        backendUrl + '/api/mock-payment/create-order',
        { appointmentId: appointmentData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.success) throw new Error(orderResponse.data.message);

      const { order } = orderResponse.data;

      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentResponse = await axios.post(
        backendUrl + '/api/mock-payment/process-payment',
        {
          orderId:       order.id,
          appointmentId: appointmentData._id,
          paymentMethod: selectedMethod
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentResponse.data.success) {
        setPaymentStep('success');
        setTimeout(() => { onSuccess(paymentResponse.data.paymentDetails); }, 1500);
      } else {
        setPaymentStep('failed');
        setTimeout(() => { onFailure(paymentResponse.data.error); }, 1500);
      }

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStep('failed');
      toast.error(error.response?.data?.message || error.message);
      setTimeout(() => { onFailure({ reason: error.message, canRetry: true }); }, 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  const retryPayment = () => { setPaymentStep('review'); };

  /* ══════════════ PROCESSING ══════════════ */
  if (paymentStep === 'processing') {
    return (
      <div className="mp-root">
        <style>{styles}</style>
        <div className="mp-overlay">
          <div className="mp-proc-modal">
            <div className="mp-spin-ring-wrap">
              <div className="mp-spin-track" />
              <div className="mp-spin-active" />
              <div className="mp-spin-inner" />
              <div className="mp-spin-dot">💳</div>
            </div>
            <h3 className="mp-proc-title">Processing Payment</h3>
            <p className="mp-proc-sub">Please wait while we securely process your payment…</p>
            <div className="mp-prog-track">
              <div className="mp-prog-fill" />
            </div>
            <p className="mp-proc-note">🔒 Do not close this window</p>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════ SUCCESS ══════════════ */
  if (paymentStep === 'success') {
    return (
      <div className="mp-root">
        <style>{styles}</style>
        <div className="mp-overlay">
          <div className="mp-success-modal">
            <div className="mp-success-icon">✅</div>
            <h3 className="mp-success-title">Payment Successful!</h3>
            <p className="mp-success-sub">Your appointment has been confirmed.</p>
            <div className="mp-success-card">
              <p>📧 You will receive a confirmation email shortly.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════ FAILED ══════════════ */
  if (paymentStep === 'failed') {
    return (
      <div className="mp-root">
        <style>{styles}</style>
        <div className="mp-overlay">
          <div className="mp-failed-modal">
            <div className="mp-failed-icon">❌</div>
            <h3 className="mp-failed-title">Payment Failed</h3>
            <p className="mp-failed-sub">Something went wrong with your payment. Please try again.</p>
            <div className="mp-failed-btns">
              <button onClick={retryPayment} className="mp-retry-btn">Retry Payment</button>
              <button onClick={onClose}      className="mp-cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════ MAIN REVIEW UI ══════════════ */
  return (
    <div className="mp-root">
      <style>{styles}</style>
      <div className="mp-overlay">
        <div className="mp-modal">
          <div className="mp-scroll">

            {/* ── Header ── */}
            <div className="mp-header">
              <div className="mp-header-badge">
                <div className="mp-header-icon">🏥</div>
                <div>
                  <h2>Complete Payment</h2>
                  <p>Secure · Encrypted · Instant confirmation</p>
                </div>
              </div>
              <button onClick={onClose} className="mp-close-btn" aria-label="Close">×</button>
            </div>

            {/* ── Two-column grid ── */}
            <div className="mp-grid">

              {/* ════ LEFT COLUMN ════ */}
              <div className="mp-left-col">

                {/* Appointment Summary Card */}
                <div className="mp-glass">
                  <div className="mp-card-head">
                    <div className="mp-card-head-icon" style={{background:'rgba(99,102,241,.22)'}}>🗓️</div>
                    <h3>Appointment Summary</h3>
                  </div>
                  <div className="mp-doctor-wrap">

                    {/* Doctor row */}
                    <div className="mp-doctor-row">
                      <div className="mp-doctor-img-wrap">
                        <img
                          src={appointmentData?.docData?.image || "https://via.placeholder.com/80"}
                          alt={appointmentData?.docData?.name || "Doctor"}
                          className="mp-doctor-img"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=Dr"; }}
                        />
                        <div className="mp-online-dot" />
                      </div>
                      <div style={{flex:1}}>
                        <p className="mp-doctor-name">{appointmentData?.docData?.name || "Doctor Name"}</p>
                        <span className="mp-doctor-spec">{appointmentData?.docData?.speciality || "Speciality"}</span>
                        <p className="mp-doctor-exp">{appointmentData?.docData?.experience || "Experienced"}</p>
                      </div>
                    </div>

                    {/* Appointment info */}
                    <div className="mp-info-row">
                      <div className="mp-info-icon" style={{background:'rgba(37,99,235,.22)'}}>📅</div>
                      <div>
                        <p className="mp-info-label">Appointment Date</p>
                        <p className="mp-info-value">{formatDate(appointmentData?.slotDate) || 'Not set'}</p>
                      </div>
                    </div>

                    <div className="mp-info-row">
                      <div className="mp-info-icon" style={{background:'rgba(139,92,246,.22)'}}>🕐</div>
                      <div>
                        <p className="mp-info-label">Appointment Time</p>
                        <p className="mp-info-value">{appointmentData?.slotTime || 'Not set'}</p>
                      </div>
                    </div>

                    {appointmentData?.docData?.address && (
                      <div className="mp-info-row">
                        <div className="mp-info-icon" style={{background:'rgba(16,185,129,.22)'}}>📍</div>
                        <div>
                          <p className="mp-info-label">Location</p>
                          <p className="mp-info-value" style={{fontSize:'.8rem'}}>{appointmentData.docData.address.line1}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Breakdown Card */}
                <div className="mp-glass">
                  <div className="mp-card-head">
                    <div className="mp-card-head-icon" style={{background:'rgba(16,185,129,.22)'}}>🧾</div>
                    <h3>Price Breakdown</h3>
                  </div>
                  <div className="mp-price-body">
                    <div className="mp-price-row">
                      <span className="mp-price-label">Consultation Fee</span>
                      <span className="mp-price-value">${consultationFee}</span>
                    </div>
                    <div className="mp-price-row">
                      <span className="mp-price-label">Platform Fee <span>(5%)</span></span>
                      <span className="mp-price-value">${platformFee}</span>
                    </div>
                    <div className="mp-price-row">
                      <span className="mp-price-label">Tax <span>(18% GST)</span></span>
                      <span className="mp-price-value">${tax}</span>
                    </div>

                    <hr className="mp-price-divider" />

                    <div className="mp-total-row">
                      <div className="mp-total-label">
                        Total Amount
                        <span>All taxes included</span>
                      </div>
                      <div className="mp-total-amount">
                        <span className="mp-total-currency">$</span>{totalAmount}
                      </div>
                    </div>
                  </div>
                </div>

              </div>{/* end LEFT */}

              {/* ════ RIGHT COLUMN ════ */}
              <div className="mp-right-col">

                {/* Payment Methods */}
                <div className="mp-glass">
                  <div className="mp-card-head">
                    <div className="mp-card-head-icon" style={{background:'rgba(139,92,246,.22)'}}>💳</div>
                    <h3>Select Payment Method</h3>
                  </div>
                  <div className="mp-methods-grid">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`mp-method-card ${selectedMethod === method.id ? 'mp-selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedMethod === method.id}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          style={{position:'absolute', opacity:0, pointerEvents:'none'}}
                        />
                        {selectedMethod === method.id && (
                          <div className="mp-method-check"><CheckIcon /></div>
                        )}
                        <div className="mp-method-icon-wrap" style={{background: method.bg}}>
                          {method.icon}
                        </div>
                        <p className="mp-method-name">{method.name}</p>
                        <p className="mp-method-desc">{method.description}</p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mp-security">
                  <div className="mp-security-icon">
                    <ShieldIcon />
                  </div>
                  <div style={{flex:1}}>
                    <h4>Secure Payment Gateway</h4>
                    <p>256-bit SSL encrypted · PCI DSS compliant</p>
                    <div className="mp-security-badges">
                      <span className="mp-badge">SSL Secured</span>
                      <span className="mp-badge">PCI DSS</span>
                      <span className="mp-badge">256-bit AES</span>
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={processMockPayment}
                  disabled={isProcessing}
                  className="mp-pay-btn"
                >
                  {isProcessing ? (
                    <>
                      <div className="mp-spinner" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <span>Pay ${totalAmount}</span>
                      <div className="mp-pay-btn-arrow">→</div>
                    </>
                  )}
                </button>

              </div>{/* end RIGHT */}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPayment;
