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
    background: rgba(2, 6, 23, 0.82);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: mp-fadeIn .35s ease;
  }

  @keyframes mp-fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes mp-slideUp { from { opacity:0; transform:translateY(40px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes mp-spinRing { to { transform: rotate(360deg); } }
  @keyframes mp-pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
  @keyframes mp-progressBar {
    0%   { width: 10%; }
    20%  { width: 35%; }
    50%  { width: 58%; }
    80%  { width: 78%; }
    100% { width: 92%; }
  }
  @keyframes mp-checkPop {
    0%   { transform: scale(0) rotate(-20deg); opacity:0; }
    70%  { transform: scale(1.2) rotate(5deg); }
    100% { transform: scale(1) rotate(0deg); opacity:1; }
  }
  @keyframes mp-glowPulse {
    0%,100% { box-shadow: 0 0 20px rgba(59,130,246,.35); }
    50%      { box-shadow: 0 0 40px rgba(59,130,246,.7); }
  }
  @keyframes mp-cardFloat {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-4px); }
  }

  /* Modal shell */
  .mp-modal {
    background: linear-gradient(135deg, rgba(15,23,42,.97) 0%, rgba(23,37,84,.97) 50%, rgba(15,23,42,.97) 100%);
    border: 1px solid rgba(99,102,241,.25);
    border-radius: 24px;
    box-shadow: 0 32px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.04) inset;
    width: 100%; max-width: 1020px;
    max-height: 92vh;
    overflow: hidden;
    animation: mp-slideUp .4s cubic-bezier(.22,1,.36,1);
  }

  /* Scrollable body */
  .mp-scroll { overflow-y: auto; max-height: 92vh; }
  .mp-scroll::-webkit-scrollbar { width: 5px; }
  .mp-scroll::-webkit-scrollbar-track { background: transparent; }
  .mp-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,.4); border-radius: 99px; }

  /* Header */
  .mp-header {
    background: linear-gradient(135deg, rgba(37,99,235,.9) 0%, rgba(79,70,229,.9) 100%);
    padding: 20px 28px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(99,102,241,.3);
    position: sticky; top: 0; z-index: 10;
    backdrop-filter: blur(8px);
  }
  .mp-header-badge {
    display: flex; align-items: center; gap: 10px;
  }
  .mp-header-icon {
    width: 42px; height: 42px;
    background: rgba(255,255,255,.15);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .mp-header h2 { color: #fff; font-size: 1.35rem; font-weight: 700; margin: 0; }
  .mp-header p  { color: rgba(255,255,255,.65); font-size: .75rem; margin: 2px 0 0; }

  .mp-close-btn {
    width: 38px; height: 38px;
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.15);
    border-radius: 50%;
    color: #fff; font-size: 1.4rem; line-height: 1;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background .2s, transform .2s;
  }
  .mp-close-btn:hover { background: rgba(255,255,255,.22); transform: scale(1.1); }

  /* Two-column grid */
  .mp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 24px 28px 28px;
  }
  @media (max-width: 768px) {
    .mp-grid { grid-template-columns: 1fr; gap: 20px; padding: 20px; }
  }

  /* Glass card */
  .mp-glass {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 18px;
    overflow: hidden;
  }

  .mp-card-head {
    padding: 14px 20px;
    border-bottom: 1px solid rgba(255,255,255,.07);
    display: flex; align-items: center; gap: 10px;
  }
  .mp-card-head-icon {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
  }
  .mp-card-head h3 { color: #e2e8f0; font-size: .9rem; font-weight: 600; margin: 0; }

  /* Doctor section */
  .mp-doctor-wrap { padding: 20px; }
  .mp-doctor-row {
    display: flex; align-items: flex-start; gap: 16px;
    padding-bottom: 18px; margin-bottom: 18px;
    border-bottom: 1px solid rgba(255,255,255,.07);
  }
  .mp-doctor-img-wrap { position: relative; flex-shrink: 0; }
  .mp-doctor-img {
    width: 80px; height: 80px;
    border-radius: 16px;
    object-fit: cover;
    border: 2px solid rgba(99,102,241,.5);
    box-shadow: 0 8px 24px rgba(0,0,0,.4);
  }
  .mp-online-dot {
    position: absolute; bottom: -3px; right: -3px;
    width: 16px; height: 16px;
    background: #22c55e;
    border-radius: 50%;
    border: 2px solid #0f172a;
    box-shadow: 0 0 8px rgba(34,197,94,.6);
  }
  .mp-doctor-name { color: #f1f5f9; font-size: 1.05rem; font-weight: 700; margin: 0 0 4px; }
  .mp-doctor-spec {
    display: inline-block;
    background: linear-gradient(135deg, rgba(99,102,241,.25), rgba(168,85,247,.2));
    border: 1px solid rgba(99,102,241,.35);
    color: #a5b4fc;
    font-size: .72rem; font-weight: 600;
    padding: 3px 10px; border-radius: 99px;
    margin-bottom: 6px;
  }
  .mp-doctor-exp { color: #64748b; font-size: .75rem; }

  /* Appointment info rows */
  .mp-info-row {
    display: flex; align-items: center; gap: 12px;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 10px;
    transition: background .2s;
  }
  .mp-info-row:hover { background: rgba(255,255,255,.07); }
  .mp-info-icon {
    width: 36px; height: 36px; flex-shrink: 0; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .mp-info-label { color: #64748b; font-size: .68rem; text-transform: uppercase; letter-spacing: .05em; }
  .mp-info-value { color: #e2e8f0; font-size: .875rem; font-weight: 600; margin-top: 1px; }

  /* Price breakdown */
  .mp-price-body { padding: 20px; }
  .mp-price-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid rgba(255,255,255,.05);
  }
  .mp-price-row:last-of-type { border-bottom: none; }
  .mp-price-label { color: #94a3b8; font-size: .85rem; display: flex; align-items: center; gap-6px; gap: 6px; }
  .mp-price-label span { color: #64748b; font-size: .72rem; }
  .mp-price-value { color: #cbd5e1; font-size: .875rem; font-weight: 600; }

  .mp-price-divider {
    border: none;
    border-top: 1px dashed rgba(99,102,241,.35);
    margin: 14px 0;
  }
  .mp-total-row {
    display: flex; justify-content: space-between; align-items: center;
    background: linear-gradient(135deg, rgba(37,99,235,.25), rgba(79,70,229,.2));
    border: 1px solid rgba(99,102,241,.4);
    border-radius: 14px;
    padding: 16px 18px;
    animation: mp-glowPulse 3s ease infinite;
  }
  .mp-total-label { color: #e2e8f0; font-size: 1rem; font-weight: 700; }
  .mp-total-label span { display: block; color: #6366f1; font-size: .7rem; font-weight: 500; margin-top: 2px; }
  .mp-total-amount { color: #60a5fa; font-size: 1.8rem; font-weight: 800; letter-spacing: -.02em; }
  .mp-total-currency { font-size: 1rem; vertical-align: top; margin-top: 4px; display: inline-block; }

  /* Payment method cards */
  .mp-methods-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 20px;
  }
  @media (max-width: 480px) { .mp-methods-grid { grid-template-columns: 1fr; } }

  .mp-method-card {
    position: relative;
    background: rgba(255,255,255,.04);
    border: 1.5px solid rgba(255,255,255,.1);
    border-radius: 14px;
    padding: 16px 14px;
    cursor: pointer;
    transition: all .25s cubic-bezier(.22,1,.36,1);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    text-align: center; min-height: 110px;
  }
  .mp-method-card:hover {
    background: rgba(99,102,241,.1);
    border-color: rgba(99,102,241,.4);
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0,0,0,.3);
  }
  .mp-method-card.mp-selected {
    background: linear-gradient(135deg, rgba(37,99,235,.2), rgba(79,70,229,.15));
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,.2), 0 12px 30px rgba(0,0,0,.3);
    transform: translateY(-3px);
  }
  .mp-method-icon-wrap {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    transition: transform .25s;
  }
  .mp-method-card:hover .mp-method-icon-wrap,
  .mp-method-card.mp-selected .mp-method-icon-wrap { transform: scale(1.15); }
  .mp-method-name { color: #e2e8f0; font-size: .8rem; font-weight: 600; }
  .mp-method-desc { color: #64748b; font-size: .68rem; line-height: 1.3; }
  .mp-method-check {
    position: absolute; top: 8px; right: 8px;
    width: 20px; height: 20px; background: #6366f1; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    animation: mp-checkPop .25s cubic-bezier(.22,1,.36,1);
  }
  .mp-method-check svg { width: 11px; height: 11px; color: #fff; }

  /* Realistic credit card */
  .mp-card-preview {
    margin: 0 20px 0;
    background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #7c3aed 100%);
    border-radius: 16px;
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
    animation: mp-cardFloat 4s ease-in-out infinite;
    box-shadow: 0 16px 40px rgba(0,0,0,.5);
  }
  .mp-card-preview::before {
    content: '';
    position: absolute; top: -40px; right: -40px;
    width: 160px; height: 160px;
    background: rgba(255,255,255,.06);
    border-radius: 50%;
  }
  .mp-card-preview::after {
    content: '';
    position: absolute; bottom: -60px; left: 20px;
    width: 200px; height: 200px;
    background: rgba(255,255,255,.04);
    border-radius: 50%;
  }
  .mp-card-chip {
    width: 36px; height: 26px;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    border-radius: 5px; margin-bottom: 14px;
    position: relative; z-index: 1;
  }
  .mp-card-chip::after {
    content: '';
    position: absolute; inset: 4px;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 2px;
  }
  .mp-card-number {
    color: #fff; font-size: 1.05rem; font-weight: 600;
    letter-spacing: .18em; margin-bottom: 14px;
    position: relative; z-index: 1;
    text-shadow: 0 1px 4px rgba(0,0,0,.3);
  }
  .mp-card-bottom {
    display: flex; justify-content: space-between; align-items: flex-end;
    position: relative; z-index: 1;
  }
  .mp-card-holder-label { color: rgba(255,255,255,.6); font-size: .6rem; text-transform: uppercase; letter-spacing: .08em; }
  .mp-card-holder-name { color: #fff; font-size: .8rem; font-weight: 600; margin-top: 2px; }
  .mp-card-expiry-label { color: rgba(255,255,255,.6); font-size: .6rem; text-transform: uppercase; letter-spacing: .08em; text-align: right; }
  .mp-card-expiry { color: #fff; font-size: .8rem; font-weight: 600; margin-top: 2px; }
  .mp-card-network {
    width: 42px; height: 26px; display: flex; gap: -8px;
    position: relative;
  }
  .mp-card-network::before, .mp-card-network::after {
    content: ''; position: absolute; top: 0;
    width: 26px; height: 26px; border-radius: 50%;
  }
  .mp-card-network::before { background: rgba(235,68,68,.8); left: 0; }
  .mp-card-network::after  { background: rgba(251,191,36,.8); left: 14px; }

  /* Glassmorphism inputs */
  .mp-inputs { padding: 16px 20px 20px; }
  .mp-input-group { margin-bottom: 12px; }
  .mp-input-label { color: #94a3b8; font-size: .72rem; font-weight: 500; margin-bottom: 6px; display: block; letter-spacing: .04em; }
  .mp-input {
    width: 100%; padding: 11px 14px;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px;
    color: #e2e8f0;
    font-size: .875rem; font-weight: 500;
    transition: border-color .2s, background .2s;
    outline: none;
  }
  .mp-input:focus { border-color: rgba(99,102,241,.6); background: rgba(99,102,241,.08); }
  .mp-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .mp-demo-notice {
    margin: 0 20px 16px;
    background: rgba(59,130,246,.08);
    border: 1px solid rgba(59,130,246,.2);
    border-radius: 10px;
    padding: 10px 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .mp-demo-notice p { color: #93c5fd; font-size: .72rem; margin: 0; }

  /* Security badge */
  .mp-security {
    margin: 0 0 0;
    background: linear-gradient(135deg, rgba(16,185,129,.1), rgba(5,150,105,.08));
    border: 1px solid rgba(16,185,129,.25);
    border-radius: 14px;
    padding: 14px 18px;
    display: flex; align-items: center; gap: 14px;
  }
  .mp-security-icon {
    width: 44px; height: 44px; flex-shrink: 0;
    background: rgba(16,185,129,.15);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .mp-security-icon svg { width: 22px; height: 22px; color: #34d399; }
  .mp-security h4 { color: #34d399; font-size: .875rem; font-weight: 700; margin: 0 0 3px; }
  .mp-security p  { color: #6ee7b7; font-size: .72rem; margin: 0; }
  .mp-security-badges {
    display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap;
  }
  .mp-badge {
    background: rgba(16,185,129,.12);
    border: 1px solid rgba(16,185,129,.2);
    border-radius: 6px;
    color: #6ee7b7; font-size: .65rem; font-weight: 600;
    padding: 2px 8px;
  }

  /* Pay button */
  .mp-pay-btn {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    font-size: 1.05rem; font-weight: 700;
    cursor: pointer;
    border: none;
    transition: all .25s cubic-bezier(.22,1,.36,1);
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    color: #fff;
    box-shadow: 0 8px 24px rgba(37,99,235,.4);
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .mp-pay-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%);
    transform: translateY(-2px) scale(1.015);
    box-shadow: 0 16px 40px rgba(37,99,235,.55);
  }
  .mp-pay-btn:active:not(:disabled) { transform: translateY(0) scale(.99); }
  .mp-pay-btn:disabled { background: rgba(71,85,105,.6); cursor: not-allowed; box-shadow: none; }
  .mp-pay-btn-arrow {
    width: 28px; height: 28px;
    background: rgba(255,255,255,.15);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: .85rem;
  }
  .mp-spinner {
    width: 20px; height: 20px;
    border: 2.5px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: mp-spinRing .7s linear infinite;
  }
  .mp-bottom-note { text-align: center; color: #475569; font-size: .72rem; padding-top: 4px; }

  /* Right column spacing */
  .mp-right-col { display: flex; flex-direction: column; gap: 16px; }

  /* Processing overlay */
  .mp-proc-modal {
    background: linear-gradient(135deg, rgba(15,23,42,.98) 0%, rgba(23,37,84,.98) 100%);
    border: 1px solid rgba(99,102,241,.25);
    border-radius: 24px;
    padding: 48px 40px;
    max-width: 440px; width: 100%;
    text-align: center;
    animation: mp-slideUp .35s cubic-bezier(.22,1,.36,1);
  }
  .mp-spin-ring-wrap { position: relative; width: 100px; height: 100px; margin: 0 auto 28px; }
  .mp-spin-track {
    position: absolute; inset: 0;
    border: 4px solid rgba(99,102,241,.15);
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
    border-bottom-color: rgba(99,102,241,.5);
    border-radius: 50%;
    animation: mp-spinRing .7s linear infinite reverse;
  }
  .mp-spin-dot {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
  }
  .mp-proc-title { color: #e2e8f0; font-size: 1.4rem; font-weight: 700; margin: 0 0 8px; }
  .mp-proc-sub   { color: #64748b; font-size: .875rem; margin: 0 0 28px; }
  .mp-prog-track { background: rgba(255,255,255,.07); border-radius: 99px; height: 6px; overflow: hidden; margin-bottom: 12px; }
  .mp-prog-fill  {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, #2563eb, #6366f1, #8b5cf6);
    animation: mp-progressBar 2s ease forwards;
  }
  .mp-proc-note { color: #475569; font-size: .72rem; }

  /* Success overlay */
  .mp-success-modal {
    background: linear-gradient(135deg, rgba(15,23,42,.98), rgba(5,46,22,.98));
    border: 1px solid rgba(34,197,94,.25);
    border-radius: 24px;
    padding: 48px 40px;
    max-width: 440px; width: 100%;
    text-align: center;
    animation: mp-slideUp .35s cubic-bezier(.22,1,.36,1);
  }
  .mp-success-icon {
    width: 100px; height: 100px; margin: 0 auto 24px;
    background: radial-gradient(circle, rgba(34,197,94,.25), rgba(34,197,94,.05));
    border: 2px solid rgba(34,197,94,.35);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 44px;
    animation: mp-checkPop .5s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 0 40px rgba(34,197,94,.25);
  }
  .mp-success-title { color: #4ade80; font-size: 1.5rem; font-weight: 800; margin: 0 0 10px; }
  .mp-success-sub   { color: #94a3b8; font-size: .9rem; margin: 0 0 24px; }
  .mp-success-card  {
    background: rgba(34,197,94,.08);
    border: 1px solid rgba(34,197,94,.2);
    border-radius: 14px; padding: 16px;
  }
  .mp-success-card p { color: #86efac; font-size: .8rem; margin: 0; }

  /* Failed overlay */
  .mp-failed-modal {
    background: linear-gradient(135deg, rgba(15,23,42,.98), rgba(69,10,10,.98));
    border: 1px solid rgba(239,68,68,.25);
    border-radius: 24px;
    padding: 48px 40px;
    max-width: 440px; width: 100%;
    text-align: center;
    animation: mp-slideUp .35s cubic-bezier(.22,1,.36,1);
  }
  .mp-failed-icon {
    width: 100px; height: 100px; margin: 0 auto 24px;
    background: radial-gradient(circle, rgba(239,68,68,.2), rgba(239,68,68,.04));
    border: 2px solid rgba(239,68,68,.3);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 44px;
    animation: mp-checkPop .4s cubic-bezier(.22,1,.36,1);
  }
  .mp-failed-title { color: #f87171; font-size: 1.4rem; font-weight: 800; margin: 0 0 10px; }
  .mp-failed-sub   { color: #94a3b8; font-size: .875rem; margin: 0 0 28px; }
  .mp-failed-btns  { display: flex; gap: 12px; }
  .mp-retry-btn {
    flex: 1; padding: 13px;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: #fff; border: none; border-radius: 12px;
    font-size: .9rem; font-weight: 700; cursor: pointer;
    transition: all .2s;
    box-shadow: 0 4px 16px rgba(37,99,235,.35);
  }
  .mp-retry-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,.5); }
  .mp-cancel-btn {
    flex: 1; padding: 13px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.1);
    color: #94a3b8; border-radius: 12px;
    font-size: .9rem; font-weight: 600; cursor: pointer;
    transition: all .2s;
  }
  .mp-cancel-btn:hover { background: rgba(255,255,255,.1); color: #e2e8f0; }

  /* Left column full height */
  .mp-left-col { display: flex; flex-direction: column; gap: 16px; }
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

/* payment method config with gradient colors */
const paymentMethods = [
  { id: 'card',       name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Amex',        bg: 'rgba(37,99,235,.15)',   border: 'rgba(37,99,235,.3)'   },
  { id: 'upi',        name: 'UPI Payment',        icon: '📱', description: 'GPay, PhonePe, Paytm',         bg: 'rgba(139,92,246,.15)',  border: 'rgba(139,92,246,.3)'  },
  { id: 'wallet',     name: 'Digital Wallet',     icon: '💰', description: 'Paytm, Amazon Pay',            bg: 'rgba(234,179,8,.12)',   border: 'rgba(234,179,8,.3)'   },
  { id: 'netbanking', name: 'Net Banking',         icon: '🏦', description: 'All major banks',              bg: 'rgba(16,185,129,.12)',  border: 'rgba(16,185,129,.3)'  },
];

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */
const MockPayment = ({
  appointmentData,
  onSuccess,
  onFailure,
  onClose
}) => {
  const { backendUrl, token } = useContext(AppContext);
  const [isProcessing, setIsProcessing]   = useState(false);
  const [paymentStep, setPaymentStep]     = useState('review');
  const [selectedMethod, setSelectedMethod] = useState('card');

  /* ── helpers ── */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('_');
    if (parts.length !== 3) return dateString;
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day   = parts[0];
    const month = months[parseInt(parts[1])] || parts[1];
    const year  = parts[2];
    return `${day} ${month} ${year}`;
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
          orderId: order.id,
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
                    <div className="mp-card-head-icon" style={{background:'rgba(99,102,241,.2)'}}>🗓️</div>
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
                          onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=Doctor"; }}
                        />
                        <div className="mp-online-dot" />
                      </div>
                      <div style={{flex:1}}>
                        <p className="mp-doctor-name">{appointmentData?.docData?.name || "Doctor Name"}</p>
                        <span className="mp-doctor-spec">{appointmentData?.docData?.speciality || "Speciality"}</span>
                        <p className="mp-doctor-exp">{appointmentData?.docData?.experience || "Experienced"}</p>
                      </div>
                    </div>

                    {/* Info rows */}
                    <div className="mp-info-row">
                      <div className="mp-info-icon" style={{background:'rgba(37,99,235,.2)'}}>📅</div>
                      <div>
                        <p className="mp-info-label">Appointment Date</p>
                        <p className="mp-info-value">{formatDate(appointmentData?.slotDate) || 'Not set'}</p>
                      </div>
                    </div>

                    <div className="mp-info-row">
                      <div className="mp-info-icon" style={{background:'rgba(139,92,246,.2)'}}>🕐</div>
                      <div>
                        <p className="mp-info-label">Appointment Time</p>
                        <p className="mp-info-value">{appointmentData?.slotTime || 'Not set'}</p>
                      </div>
                    </div>

                    {appointmentData?.docData?.address && (
                      <div className="mp-info-row">
                        <div className="mp-info-icon" style={{background:'rgba(16,185,129,.2)'}}>📍</div>
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
                    <div className="mp-card-head-icon" style={{background:'rgba(16,185,129,.2)'}}>🧾</div>
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
                        <span>All inclusive</span>
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
                    <div className="mp-card-head-icon" style={{background:'rgba(139,92,246,.2)'}}>💳</div>
                    <h3>Select Payment Method</h3>
                  </div>
                  <div className="mp-methods-grid">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`mp-method-card ${selectedMethod === method.id ? 'mp-selected' : ''}`}
                        style={selectedMethod === method.id ? {background: method.bg, borderColor: method.border.replace('.3','1')} : {}}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedMethod === method.id}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          style={{position:'absolute',opacity:0,pointerEvents:'none'}}
                        />
                        {selectedMethod === method.id && (
                          <div className="mp-method-check">
                            <CheckIcon />
                          </div>
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

                {/* Card Details — shown only for 'card' */}
                {selectedMethod === 'card' && (
                  <div className="mp-glass">
                    <div className="mp-card-head">
                      <div className="mp-card-head-icon" style={{background:'rgba(37,99,235,.2)'}}>🔐</div>
                      <h3>Card Details <span style={{color:'#6366f1',fontSize:'.7rem',fontWeight:500}}>(Demo Mode)</span></h3>
                    </div>

                    {/* Realistic card preview */}
                    <div style={{padding:'16px 20px 4px'}}>
                      <div className="mp-card-preview">
                        <div className="mp-card-chip" />
                        <div className="mp-card-number">1234  5678  9012  3456</div>
                        <div className="mp-card-bottom">
                          <div>
                            <div className="mp-card-holder-label">Card Holder</div>
                            <div className="mp-card-holder-name">JOHN DOE</div>
                          </div>
                          <div>
                            <div className="mp-card-expiry-label">Expires</div>
                            <div className="mp-card-expiry">12/25</div>
                          </div>
                          <div className="mp-card-network" title="Mastercard" />
                        </div>
                      </div>
                    </div>

                    {/* Glassmorphism inputs */}
                    <div className="mp-inputs">
                      <div className="mp-input-group">
                        <label className="mp-input-label">CARD NUMBER</label>
                        <input type="text" className="mp-input" defaultValue="1234 5678 9012 3456" readOnly />
                      </div>
                      <div className="mp-input-row">
                        <div className="mp-input-group" style={{margin:0}}>
                          <label className="mp-input-label">EXPIRY DATE</label>
                          <input type="text" className="mp-input" defaultValue="12/25" readOnly />
                        </div>
                        <div className="mp-input-group" style={{margin:0}}>
                          <label className="mp-input-label">CVV</label>
                          <input type="text" className="mp-input" defaultValue="•••" readOnly />
                        </div>
                      </div>
                      <div className="mp-input-group" style={{marginBottom:0}}>
                        <label className="mp-input-label">CARDHOLDER NAME</label>
                        <input type="text" className="mp-input" defaultValue="JOHN DOE" readOnly />
                      </div>
                    </div>

                    {/* Demo notice */}
                    <div className="mp-demo-notice">
                      <span>ℹ️</span>
                      <p>This is a demo payment. No real transaction will occur.</p>
                    </div>
                  </div>
                )}

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

                {/* Demo notice */}
                <p className="mp-bottom-note">
                  🎭 Demo Mode · 90% success rate for testing
                </p>

              </div>{/* end RIGHT */}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPayment;
