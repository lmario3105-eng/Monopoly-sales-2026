'use client';

import { useRef } from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const TEAMS = [
  { name: 'Leon', icon: '🦁', affinity: 'Destilados + Accesorios', color: '#D4AF37' },
  { name: 'Tigre', icon: '🐯', affinity: 'Vapes + Ropa', color: '#E07B39' },
  { name: 'Aguila', icon: '🦅', affinity: 'Ropa + Accesorios', color: '#4A9ECC' },
  { name: 'Serpiente', icon: '🐍', affinity: 'Vapes + Destilados', color: '#5CB85C' },
];

const RULES = [
  {
    num: '01',
    title: 'OBJETIVO',
    body: 'Cada equipo compite durante el mes para acumular la mayor cantidad de puntos de ventas. El equipo con mas puntos al final del mes gana las recompensas.',
  },
  {
    num: '02',
    title: 'TURNOS Y DADOS',
    body: 'Cada equipo lanza el dado en su turno. El resultado mueve la ficha del equipo en el tablero de Monteria. Las casillas determinan bonos o eventos especiales.',
  },
  {
    num: '03',
    title: 'CATEGORIAS DE VENTA',
    body: 'Existen 4 categorias: Vapes, Destilados, Ropa y Accesorios. Cada equipo tiene afinidad con 2 categorias y obtiene +20% de puntos al vender en ellas.',
  },
  {
    num: '04',
    title: 'REGISTRO DE VENTAS',
    body: 'Las ventas se registran via WhatsApp con el comando: "registrar venta [categoria] [puntos]". Ejemplo: "registrar venta vape 150". El sistema confirma y suma automaticamente.',
  },
  {
    num: '05',
    title: 'COMODINES',
    body: 'Al caer en una casilla Comodin el equipo obtiene un comodin que puede usar para duplicar puntos en la siguiente venta, saltar una casilla penalizante o robar puntos a otro equipo.',
  },
  {
    num: '06',
    title: 'RECLUTAMIENTO',
    body: 'Invitar nuevos miembros suma 100 puntos por persona. Con 5 reclutas se obtiene un Comodin extra. Con 10 reclutas: 1,000 puntos y un Comodin Dorado.',
  },
  {
    num: '07',
    title: 'EVENTOS ESPECIALES',
    body: 'Las casillas de Evento activan sucesos aleatorios como bonos de zona, dias de ventas dobles, intercambios de posicion o penalizaciones temporales.',
  },
  {
    num: '08',
    title: 'RECOMPENSAS',
    body: 'Las casillas de Recompensa premian al equipo con puntos extra o Comodines. El equipo lider al finalizar el mes recibe el premio mayor del programa.',
  },
];

const COMMANDS = [
  { cmd: 'mi estado', desc: 'Ver tus puntos, zona y posicion actual' },
  { cmd: 'registrar venta [cat] [pts]', desc: 'Registrar una venta. Ej: registrar venta vape 200' },
  { cmd: 'tabla de posiciones', desc: 'Ver el ranking global de todos los equipos' },
  { cmd: 'invitar miembros', desc: 'Obtener tu enlace de reclutamiento personal' },
  { cmd: 'ayuda', desc: 'Ver todos los comandos disponibles' },
];

export default function ReglasPage() {
  const flyerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Screen-only toolbar */}
      <div className="print:hidden sticky top-0 z-50 bg-[#0a0a0a]/95 border-b border-[#D4AF37]/30 px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-[#D4AF37] hover:text-[#D4AF37]/80 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al Juego
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            size="sm"
            className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar PDF
          </Button>
        </div>
      </div>

      {/* Flyer content */}
      <div ref={flyerRef} className="max-w-2xl mx-auto px-4 py-8 print:py-0 print:px-0 print:max-w-none">

        {/* Hero header */}
        <header className="text-center mb-10 print:mb-6">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-full px-4 py-1 mb-4">
            <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase">Programa Oficial 2025</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tight text-balance leading-none mb-2">
            <span className="text-[#D4AF37]">MONOPOLIO</span>
            <br />
            <span className="text-white">DE VENTAS</span>
          </h1>
          <p className="text-lg font-bold tracking-widest text-white/60 uppercase">
            Monteria Edition
          </p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        </header>

        {/* Promo image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 print:mb-6 border border-[#D4AF37]/20">
          <Image
            src="/promo-banner.jpg"
            alt="Monopolio de Ventas: Monteria Edition — imagen promocional"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white font-black text-xl uppercase tracking-wide drop-shadow-lg">
              Compite · Vende · Gana
            </p>
          </div>
        </div>

        {/* Teams */}
        <section className="mb-10 print:mb-6">
          <h2 className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase mb-4">Los 4 Equipos</h2>
          <div className="grid grid-cols-2 gap-3">
            {TEAMS.map((team) => (
              <div
                key={team.name}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3"
                style={{ borderLeftColor: team.color, borderLeftWidth: 3 }}
              >
                <span className="text-2xl">{team.icon}</span>
                <div>
                  <p className="font-black uppercase text-sm" style={{ color: team.color }}>
                    {team.name}
                  </p>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Especialidad: {team.affinity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rules */}
        <section className="mb-10 print:mb-6">
          <h2 className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase mb-4">Reglas del Juego</h2>
          <div className="space-y-3">
            {RULES.map((rule) => (
              <div
                key={rule.num}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4"
              >
                <span className="text-[#D4AF37] font-black text-2xl leading-none tabular-nums flex-shrink-0 w-8">
                  {rule.num}
                </span>
                <div>
                  <p className="font-bold uppercase tracking-wide text-sm text-white mb-1">
                    {rule.title}
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {rule.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WhatsApp commands */}
        <section className="mb-10 print:mb-6">
          <h2 className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase mb-4">
            Comandos WhatsApp
          </h2>
          <div className="bg-[#0d1f0d] border border-[#5CB85C]/30 rounded-xl p-4 space-y-3">
            {COMMANDS.map((c) => (
              <div key={c.cmd} className="flex items-start gap-3">
                <span className="font-mono text-[#5CB85C] text-xs bg-[#5CB85C]/10 rounded px-2 py-0.5 flex-shrink-0 mt-0.5">
                  {c.cmd}
                </span>
                <span className="text-white/60 text-xs leading-relaxed">{c.desc}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 mt-2 text-center">
            Envia cualquiera de estos mensajes al numero de WhatsApp del programa para participar
          </p>
        </section>

        {/* Points table */}
        <section className="mb-10 print:mb-6">
          <h2 className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase mb-4">
            Tabla de Puntos
          </h2>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#D4AF37] text-black">
                  <th className="text-left px-4 py-2 font-black uppercase text-xs tracking-wide">Accion</th>
                  <th className="text-right px-4 py-2 font-black uppercase text-xs tracking-wide">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ['Venta categoria normal', '100 – 130 pts'],
                  ['Venta con afinidad de equipo (+20%)', '120 – 156 pts'],
                  ['Recluta nuevo miembro', '+100 pts'],
                  ['5 reclutas en total', '+500 pts + Comodin'],
                  ['10 reclutas en total', '+1,000 pts + Comodin Dorado'],
                  ['Casilla Recompensa', 'Variable'],
                  ['Evento especial (positivo)', 'Hasta +200 pts'],
                ].map(([action, pts]) => (
                  <tr key={action} className="bg-white/5 hover:bg-white/10 transition-colors">
                    <td className="px-4 py-2.5 text-white/80 leading-snug">{action}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-[#D4AF37] whitespace-nowrap">{pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#D4AF37]/30 pt-6 text-center space-y-1">
          <p className="text-[#D4AF37] font-black uppercase tracking-widest text-sm">
            Monopolio de Ventas
          </p>
          <p className="text-white/40 text-xs">
            Monteria Edition · Programa Oficial 2025 · Todos los derechos reservados
          </p>
          <p className="text-white/30 text-xs">
            Para soporte escribe <span className="text-[#5CB85C]">ayuda</span> por WhatsApp
          </p>
        </footer>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: #0a0a0a !important; color: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
