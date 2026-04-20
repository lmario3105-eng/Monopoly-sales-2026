'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, Target, Calendar, DollarSign, Shield, Users, Zap, Award, FileText } from 'lucide-react';
import Link from 'next/link';

interface WelcomeModalProps {
  onStart: () => void;
}

export function WelcomeModal({ onStart }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
      {/* Header - Warning Style */}
      <div className="flex-shrink-0 bg-gradient-to-b from-destructive/20 to-transparent pt-6 pb-4 px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-2 bg-destructive/20 px-3 py-1 rounded-full">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <span className="text-sm font-bold text-destructive">PROGRAMA OFICIAL</span>
        </div>
        <h1 className="text-xl font-bold text-foreground text-balance leading-tight">
          Monopolio de Ventas: Monteria Edition
        </h1>
        <p className="text-sm text-primary font-semibold mt-1">Tu Nuevo Modelo de Gestion Comercial</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="pb-6 space-y-5">
          {/* Critical Warning */}
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 animate-slide-up">
            <p className="text-foreground font-bold text-center text-sm leading-relaxed">
              Este es un programa de alto impacto disenado para optimizar tu rendimiento en ventas y generar resultados economicos tangibles.
            </p>
            <p className="text-destructive text-xs mt-2 text-center font-semibold">
              ESTO NO ES UN JUEGO RECREATIVO. Es una herramienta estrategica de trabajo con incentivos reales y una duracion de 1 MES.
            </p>
          </div>

          {/* Duration Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">Duracion: 1 Mes Intensivo</span>
            </div>
          </div>

          {/* How it Works */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Como Funciona: Tu Inversion en el Exito
            </h2>

            <div className="space-y-2.5">
              <GuideItem
                number={1}
                title="El Tablero es Tu Mercado Real"
                description="Visualiza Monteria dividida en 4 Zonas clave: A, B, C y D. Cada zona tiene oportunidades de venta para: Vape, Destilado, Ropa y Accesorios."
              />
              <GuideItem
                number={2}
                title="Tu Grupo Zonal, Tu Equipo"
                description="Perteneces a uno de los 4 grupos zonales. Si registras una venta de tu especialidad, obtienes +20% de Puntos de Venta extra."
              />
              <GuideItem
                number={3}
                title="Tu Lanzamiento Diario"
                description="Cada jornada tienes 1 unica oportunidad de lanzar dados para tu Grupo Zonal. Busca el boton 'LANZAR MIS DADOS!' para ejecutar tu movimiento."
              />
              <GuideItem
                number={4}
                title="Registra Tus Ventas"
                description="Utiliza el boton 'Registrar Venta'. Estos puntos se sumaran a tu desempeno personal y al total de tu Grupo Zonal."
              />
              <GuideItem
                number={5}
                title="Puntos de Venta: Tu KPI"
                description="Acumula la mayor cantidad de Puntos. Al final del mes, el equipo y los individuos con mas Puntos seran recompensados."
              />
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Reglas de Compromiso (NO son Opcionales)
            </h2>

            <div className="bg-card border border-border rounded-xl p-3 space-y-2.5">
              <RuleItem
                icon={<DollarSign className="w-4 h-4 text-accent" />}
                title="Inscripcion y Compromiso Financiero"
                description="Para participar y ser elegible para la recompensa final, se requiere una inscripcion inicial. Esta inversion garantiza acceso a plataforma, coaching y elegibilidad para incentivos."
                highlight
              />
              <RuleItem
                icon={<Award className="w-4 h-4 text-primary" />}
                title="La Venta es Oro Puro"
                description="Cada Venta registrada es una contribucion directa a tu exito personal y al de tu grupo. La exactitud y volumen son criticos."
              />
              <RuleItem
                icon={<Calendar className="w-4 h-4 text-primary" />}
                title="El Tiempo es Dinero"
                description="Tu lanzamiento diario es tu accion mas visible. Planifica cuando lo usas para maximizar el avance de tu zona."
              />
              <RuleItem
                icon={<Zap className="w-4 h-4 text-destructive" />}
                title="Adaptacion y Agilidad"
                description="Los Eventos Aleatorios simulan variaciones reales del mercado. Tu capacidad de ajuste sera tu mayor ventaja en ventas."
              />
              <RuleItem
                icon={<Shield className="w-4 h-4 text-destructive" />}
                title="Integridad Total (100% Veraz)"
                description="El registro de ventas debe ser 100% veraz y verificable. Cualquier falsificacion = descalificacion inmediata y perdida de recompensas."
                highlight
              />
              <RuleItem
                icon={<Users className="w-4 h-4 text-primary" />}
                title="Colaboracion Zonal"
                description="Tu grupo zonal es tu equipo. El exito de uno impulsa a todos. Comunicate y colabora constantemente."
              />
              <RuleItem
                icon={<Zap className="w-4 h-4 text-accent" />}
                title="Estrategia de Comodines"
                description="Usa los comodines inteligentemente para obtener ventajas competitivas y maximizar tus puntos."
              />
            </div>
          </div>

          {/* Recruitment Rewards - HIGHLIGHTED */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              RECOMPENSA URGENTE: Completa tu Grupo - 40 Integrantes Totales
            </h2>

            <div className="bg-accent/15 border-2 border-accent rounded-xl p-4 space-y-3">
              <div className="space-y-2">
                <p className="text-foreground font-bold text-sm">
                  Meta Critica: Incorpora miembros LO ANTES POSIBLE
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  El objetivo es alcanzar 40 trabajadores activos distribuidos en los 4 grupos zonales (idealmente 10 por grupo).
                </p>
              </div>

              <div className="space-y-2 bg-background rounded-lg p-3">
                <p className="text-accent font-semibold text-xs">BONUS INMEDIATOS por Reclutamiento:</p>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span><strong className="text-foreground">Por cada miembro nuevo:</strong> +100 Puntos de Venta a tu cuenta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span><strong className="text-foreground">Si completas 5 miembros en tu zona:</strong> +500 Puntos BONUS + 1 Comodin Especial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span><strong className="text-foreground">Si tu zona alcanza 10 miembros:</strong> +1000 Puntos BONUS para TODOS en tu grupo + 1 Comodin Dorado (valor x2)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span><strong className="text-foreground">Primer Grupo en Completar 10:</strong> Doble Bonus + Reconocimiento Premium + Bonus adicional al cierre</span>
                  </li>
                </ul>
              </div>

              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-2.5">
                <p className="text-xs font-semibold text-destructive">
                  OFERTA LIMITADA: Los primeros 3 grupos en alcanzar 10 miembros activos reciben RECOMPENSA ACELERADA TRIPLE.
                </p>
              </div>
            </div>
          </div>

          {/* Teams Preview */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Grupos Zonales
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <TeamPreview name="Zona A - Leon" emoji="A" specialty="Vape" color="bg-[oklch(0.7_0.2_45)]" />
              <TeamPreview name="Zona B - Tigre" emoji="B" specialty="Destilado" color="bg-[oklch(0.65_0.22_25)]" />
              <TeamPreview name="Zona C - Aguila" emoji="C" specialty="Ropa" color="bg-[oklch(0.6_0.18_195)]" />
              <TeamPreview name="Zona D - Serpiente" emoji="D" specialty="Accesorios" color="bg-[oklch(0.55_0.2_145)]" />
            </div>
          </div>

          {/* Final Message */}
          <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border border-primary/30 rounded-xl p-4 text-center">
            <p className="text-foreground font-bold text-sm text-balance">
              Preparate para un mes de desafios, crecimiento y recompensas tangibles.
            </p>
            <p className="text-primary text-xs mt-1 font-semibold">Tu Exito Comercial Comienza AHORA</p>
          </div>
        </div>
      </div>

      {/* Accept Button - sticky at bottom */}
      <div className="flex-shrink-0 bg-background border-t border-border px-4 pt-4 pb-6 space-y-2">
        <Button
          onClick={onStart}
          className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/30"
        >
          ENTENDIDO Y ACEPTO LAS CONDICIONES
        </Button>
        <Link href="/reglas" target="_blank" className="block">
          <Button
            variant="outline"
            className="w-full h-10 text-sm font-semibold gap-2 border-border"
          >
            <FileText className="w-4 h-4" />
            Ver folleto / Descargar Reglas
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground text-center">
          Al continuar, aceptas las reglas y condiciones del programa
        </p>
      </div>
    </div>
  );
}

function GuideItem({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3 flex gap-3">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
        <span className="text-primary font-bold text-xs">{number}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
        <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function RuleItem({ icon, title, description, highlight }: { icon: React.ReactNode; title: string; description: string; highlight?: boolean }) {
  return (
    <div className={`flex gap-2.5 items-start ${highlight ? 'bg-accent/10 -mx-1 px-1 py-1 rounded' : ''}`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-xs">{title}</h4>
        <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function TeamPreview({ name, emoji, specialty, color }: { name: string; emoji: string; specialty: string; color: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-2.5 flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-sm font-bold text-white`}>
        {emoji}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-foreground text-xs">{name}</p>
        <p className="text-muted-foreground text-xs">{specialty}</p>
      </div>
    </div>
  );
}
