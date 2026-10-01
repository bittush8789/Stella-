import React, { useState, useEffect } from 'react';
import {
  X,
  Activity,
  Server,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Layers,
  RefreshCw,
  Database,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Code
} from 'lucide-react';
import { ApiLogEntry } from '../types/microservices';
import { apiBus } from '../services/apiBus';
import { checkSupabaseConnection, isSupabaseConfigured, SupabaseConnectionStatus } from '../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MicroservicesMonitor: React.FC<Props> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<ApiLogEntry | null>(null);
  const [filterService, setFilterService] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'traffic' | 'supabase'>('supabase');
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConnectionStatus | null>(null);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState(false);
  const [hasCopiedSql, setHasCopiedSql] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = apiBus.subscribe((newLogs) => {
      setLogs(newLogs);
      if (!selectedLog && newLogs.length > 0) {
        setSelectedLog(newLogs[0]);
      }
    });
    runSupabaseHealthCheck();
    return () => unsubscribe();
  }, [isOpen]);

  const runSupabaseHealthCheck = async () => {
    setIsCheckingSupabase(true);
    const status = await checkSupabaseConnection();
    setSupabaseStatus(status);
    setIsCheckingSupabase(false);
  };

  const copySqlSchema = () => {
    const sql = `-- Stella Clothing E-Commerce - Complete Supabase PostgreSQL Schema
create extension if not exists "uuid-ossp";

create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  brand text not null,
  description text,
  price numeric(10, 2) not null,
  discount_price numeric(10, 2),
  available_sizes text[] not null default '{}',
  available_colors jsonb not null default '[]'::jsonb,
  stock integer not null default 0,
  rating numeric(3, 2) not null default 4.5,
  reviews_count integer not null default 0,
  status text not null default 'in_stock',
  material text,
  fit text,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.orders (
  id text primary key,
  user_id text not null,
  customer_name text not null,
  customer_email text not null,
  items jsonb not null default '[]'::jsonb,
  shipping_address jsonb not null,
  subtotal numeric(10, 2) not null,
  discount numeric(10, 2) not null default 0,
  shipping numeric(10, 2) not null default 0,
  tax numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  payment_method text not null,
  payment_status text not null default 'Pending',
  order_status text not null default 'Confirmed',
  estimated_delivery text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.cart_items (
  id text primary key,
  user_id text not null,
  product_id text references public.products(id) on delete cascade,
  size text not null,
  color jsonb not null,
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null,
  discount_price numeric(10, 2),
  added_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.wishlist_items (
  id text primary key,
  user_id text not null,
  product_id text references public.products(id) on delete cascade,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id)
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;

create policy "Allow all public on products" on public.products for all using (true);
create policy "Allow all on orders" on public.orders for all using (true);
create policy "Allow all on cart_items" on public.cart_items for all using (true);
create policy "Allow all on wishlist_items" on public.wishlist_items for all using (true);`;

    navigator.clipboard.writeText(sql);
    setHasCopiedSql(true);
    setTimeout(() => setHasCopiedSql(false), 2500);
  };

  if (!isOpen) return null;

  const services = [
    { name: 'Product Service', key: 'Product', count: logs.filter((l) => l.service === 'Product').length, color: 'text-teal-400' },
    { name: 'User Service', key: 'User', count: logs.filter((l) => l.service === 'User').length, color: 'text-indigo-400' },
    { name: 'Cart Service', key: 'Cart', count: logs.filter((l) => l.service === 'Cart').length, color: 'text-amber-400' },
    { name: 'Wishlist Service', key: 'Wishlist', count: logs.filter((l) => l.service === 'Wishlist').length, color: 'text-rose-400' },
    { name: 'Order Service', key: 'Order', count: logs.filter((l) => l.service === 'Order').length, color: 'text-blue-400' },
    { name: 'Checkout Service', key: 'Checkout', count: logs.filter((l) => l.service === 'Checkout').length, color: 'text-emerald-400' },
    { name: 'Admin Service', key: 'Admin', count: logs.filter((l) => l.service === 'Admin').length, color: 'text-purple-400' }
  ];

  const displayedLogs = filterService === 'All'
    ? logs
    : logs.filter((l) => l.service === filterService);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-hidden font-mono text-xs">
      <div
        className="w-full max-w-5xl h-[88vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-white">Backend Database & Microservices Bus</h2>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  SUPABASE POSTGRESQL READY
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Unified persistence adapter with Supabase REST client & in-memory failover
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('supabase')}
                className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
                  activeTab === 'supabase'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Supabase Backend
              </button>
              <button
                onClick={() => setActiveTab('traffic')}
                className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
                  activeTab === 'traffic'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Live REST Traffic ({logs.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= TAB 1: SUPABASE CONFIGURATION & SCHEMA ================= */}
        {activeTab === 'supabase' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Supabase Status Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-sans">
                      Supabase PostgreSQL Integration
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        supabaseStatus?.isConnected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : supabaseStatus?.isConfigured
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {supabaseStatus?.isConnected
                        ? '● LIVE CONNECTED'
                        : supabaseStatus?.isConfigured
                        ? '● CONFIGURED (VERIFYING)'
                        : '● LOCAL IN-MEMORY MODE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans mt-1">
                    {supabaseStatus?.isConnected
                      ? `Successfully connected to live Supabase project database at ${supabaseStatus.url}`
                      : 'The microservices are currently operating with in-memory persistence and are fully wired to connect to Supabase.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  onClick={runSupabaseHealthCheck}
                  disabled={isCheckingSupabase}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 flex items-center gap-2 text-xs font-sans font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSupabase ? 'animate-spin' : ''}`} />
                  Test Connection
                </button>
                <button
                  onClick={copySqlSchema}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center gap-1.5 text-xs font-sans font-bold shadow-md transition-colors cursor-pointer"
                >
                  {hasCopiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {hasCopiedSql ? 'Copied SQL!' : 'Copy schema.sql'}
                </button>
              </div>
            </div>

            {/* How to Connect 3-Step Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">1</span>
                  <span>Create Supabase Project</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Go to <strong className="text-white">supabase.com</strong> and create a free project or use your existing Supabase dashboard.
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
                  <span>Run Schema in SQL Editor</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Click the <strong className="text-white">Copy schema.sql</strong> button above, open the SQL Editor in Supabase, and click Run.
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">3</span>
                  <span>Set Environment Keys</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Add <code className="text-sky-300">VITE_SUPABASE_URL</code> and <code className="text-sky-300">VITE_SUPABASE_ANON_KEY</code> to your environment.
                </p>
              </div>
            </div>

            {/* Supabase Schema Viewer */}
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-emerald-400" />
                  Supabase PostgreSQL Schema (`/supabase/schema.sql`)
                </span>
                <span className="text-[10px] text-slate-500">
                  Tables: products, orders, cart_items, wishlist_items
                </span>
              </div>
              <pre className="text-[11px] text-emerald-300/90 max-h-60 overflow-y-auto custom-scrollbar p-2 bg-slate-900 rounded-xl">
{`-- 1. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  brand text not null,
  description text,
  price numeric(10, 2) not null,
  discount_price numeric(10, 2),
  available_sizes text[] not null default '{}',
  available_colors jsonb not null default '[]'::jsonb,
  stock integer not null default 0,
  rating numeric(3, 2) not null default 4.5,
  reviews_count integer not null default 0,
  status text not null default 'in_stock'
);

-- 2. ORDERS TABLE
create table if not exists public.orders (
  id text primary key,
  user_id text not null,
  customer_name text not null,
  customer_email text not null,
  items jsonb not null default '[]'::jsonb,
  shipping_address jsonb not null,
  subtotal numeric(10, 2) not null,
  total numeric(10, 2) not null,
  payment_method text not null,
  order_status text not null default 'Confirmed'
);`}
              </pre>
            </div>
          </div>
        )}

        {/* ================= TAB 2: LIVE REST TRAFFIC STREAM ================= */}
        {activeTab === 'traffic' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Microservices Topology Strip */}
            <div className="p-3 bg-slate-950/40 border-b border-slate-800 overflow-x-auto">
              <div className="flex items-center justify-between gap-2 min-w-[700px]">
                {services.map((svc) => (
                  <button
                    key={svc.key}
                    onClick={() => setFilterService(filterService === svc.key ? 'All' : svc.key)}
                    className={`flex-1 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      filterService === svc.key
                        ? 'bg-slate-800 border-teal-400 shadow-xs'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold ${svc.color}`}>{svc.key}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="font-sans font-bold text-xs text-white truncate mt-0.5">
                      {svc.name.replace(' Service', '')}
                    </div>
                    <div className="text-[10px] text-slate-400 tabular-nums">
                      {svc.count} Calls
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Left Traffic Feed & Right Payload Inspector */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              <div className="md:col-span-7 border-r border-slate-800 overflow-y-auto divide-y divide-slate-800/60 p-2">
                {displayedLogs.map((log) => {
                  const isSelected = selectedLog?.id === log.id;
                  const methodColor =
                    log.method === 'GET'
                      ? 'text-sky-400 bg-sky-950/60'
                      : log.method === 'POST'
                      ? 'text-emerald-400 bg-emerald-950/60'
                      : log.method === 'PUT'
                      ? 'text-amber-400 bg-amber-950/60'
                      : 'text-rose-400 bg-rose-950/60';

                  return (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-950/40 border border-teal-500/50'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${methodColor}`}>
                            {log.method}
                          </span>
                          <span className="font-semibold text-white truncate max-w-[240px]">
                            {log.endpoint}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 tabular-nums">
                          <span className="font-bold text-emerald-400">{log.status}</span>
                          <span>{log.durationMs}ms</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="md:col-span-5 bg-slate-950/70 p-4 overflow-y-auto">
                {selectedLog ? (
                  <div className="space-y-3">
                    <div className="pb-2 border-b border-slate-800">
                      <span className="text-[10px] text-teal-400 font-bold uppercase">
                        REST Contract Inspector
                      </span>
                      <h4 className="font-bold text-white text-xs mt-0.5">
                        {selectedLog.method} {selectedLog.endpoint}
                      </h4>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">
                        Payload
                      </span>
                      <pre className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-emerald-300 overflow-x-auto max-h-48 custom-scrollbar">
                        {JSON.stringify(selectedLog.responsePayload || {}, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    Select a REST call to inspect payload.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
