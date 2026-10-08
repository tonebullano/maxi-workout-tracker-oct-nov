import { useState, useEffect } from "react";

const C = {
  bg: "#F5F3F0", surface: "#FFFFFF", border: "#E3DFD9",
  text: "#1A1714", muted: "#96918C", faint: "#EDEBE7",
  pecho: "#1B5EA8", espalda: "#2D6A4F", hombros: "#8B4513", piernas: "#8B1A1A",
  mes1: "#1B5EA8", mes2: "#8B1A1A",
};

const DAYS_LABEL = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const GYM_DAYS = ["Pecho/Tríceps", "Espalda/Bíceps", "Hombros/Upper", "Piernas/Hombros"];
const SHORT = { "Pecho/Tríceps": "Pecho", "Espalda/Bíceps": "Espal", "Hombros/Upper": "Homb", "Piernas/Hombros": "Pier" };
const SK = "plan_conte_v3";


// ── MESES ──
const MESES = [
  { name: "Mes 1", weeks: [1, 2, 3, 4], subtitle: "Base de volumen", color: C.mes1, desc: "4 semanas de progresión: más series y carga cada semana. Superseries marcadas para entrar en 60 min." },
  { name: "Mes 2", weeks: [5, 6, 7, 8], subtitle: "Nuevo estímulo", color: C.mes2, desc: "Mismos grupos musculares con ejercicios y ángulos distintos para seguir progresando." },
];

function getMes(weekNum) {
  return MESES.find(m => m.weeks.includes(weekNum)) || MESES[0];
}

// ── PLAN DE ENTRENAMIENTO (8 semanas · 4 días de fuerza · sin cardio) ──
const H1 = ["4×10", "4×10", "4×8-10", "4×8-10"];
const H2 = ["3×10", "3×10", "4×8-10", "4×8-10"];
const R = (r, suf) => ["3×" + r + (suf || ""), "3×" + r + (suf || ""), "3×" + r + (suf || ""), "3×" + r + (suf || "")];
const SS_NOTE = "Superseries: los ejercicios con la misma letra se hacen seguidos, sin descanso entre ellos. Descansás recién después del segundo.";

const PLAN = {
  "Pecho/Tríceps": {
    color: C.pecho,
    label: "Pecho · Tríceps · Core",
    duration: "55–60 min",
    focus: "Press, aperturas y tríceps. " + SS_NOTE,
    calentamiento: [
      { name: "Movilidad dinámica", duration: "3 min", note: "Círculos de hombro, rotaciones de columna torácica y muñecas. Sin cardio previo." },
      { name: "Series de aproximación", duration: "2 series", note: "En el primer ejercicio: 1 serie con ~50% del peso x10 y 1 serie con ~70% x6, antes de las series efectivas." },
    ],
    mesData: {
      1: {
        abs: [
          { name: "Rueda abdominal (rollout)", posicion: "De rodillas, manos en la rueda, espalda neutra.", note: "Rodás hacia adelante hasta donde la zona lumbar no se arquee y volvés contrayendo el abdomen. Core: anti-extensión.", schemeByWeek: ["3×8", "3×8", "3×10", "3×10"] },
          { name: "Plancha con toque de hombro", posicion: "En posición de plancha alta, pies algo abiertos.", note: "Tocás un hombro con la mano contraria sin girar la cadera. Cuenta total de toques. Core: anti-rotación.", schemeByWeek: ["3×16", "3×18", "3×20", "3×20"] },
        ],
        sections: [
          {
            label: "Press y aperturas",
            exercises: [
              { name: "Press de banca con barra", posicion: "Acostado en banco plano, barra.", note: "Codos a unos 45° del cuerpo. Bajás controlado al pecho y empujás sin bloquear de golpe.", schemeByWeek: H1 },
              { name: "Press inclinado con mancuernas", posicion: "Banco a 30-45°, una mancuerna por mano.", note: "Parte alta del pecho. Bajada controlada, sin chocar las mancuernas arriba.", schemeByWeek: H2, startKg: 13, unit: "kg c/u" },
              { name: "Apertura en pec deck", posicion: "Sentado, codos levemente flexionados.", note: "Tu máximo registrado es 59 kg x 12. Arrancá cerca de 50 kg. Cerrás apretando el pecho, sin impulso.", schemeByWeek: R("12"), startKg: 50, unit: "kg", ss: "A" },
              { name: "Cruce en polea alta", posicion: "De pie entre dos poleas altas, cruce frontal.", note: "Apretá el pecho al final del recorrido, sin impulso. PLAN B si no podés usar la polea: apertura con mancuernas en banco plano, 3×12.", schemeByWeek: R("12"), ss: "B" },
            ],
          },
          {
            label: "Tríceps",
            exercises: [
              { name: "Tríceps en polea, codos pegados", posicion: "De pie frente a la polea alta, codos fijos al cuerpo.", note: "Tu máximo registrado es 17 kg x 14. Extensión completa abajo, sin balancear el torso.", schemeByWeek: R("12"), startKg: 17, unit: "kg", ss: "A" },
              { name: "Press francés con barra Z, acostado", posicion: "Acostado en banco plano, barra Z con los brazos estirados sobre el pecho.", note: "Doblás solo los codos y bajás la barra hacia la frente. Los codos quedan fijos, apuntando al techo. Volvés estirando los brazos. Bajá con control, el peso pasa cerca de la cara.", schemeByWeek: R("10"), ss: "B" },
              { name: "Tríceps tras nuca en polea", posicion: "De espaldas a la polea, cuerda o barra detrás de la cabeza.", note: "Extensión completa sin abrir los codos hacia afuera.", schemeByWeek: R("12") },
            ],
          },
        ],
      },
      2: {
        abs: [
          { name: "Plancha con arrastre de disco", posicion: "En plancha alta, un disco en el piso al costado.", note: "Con una mano arrastrás el disco por debajo del cuerpo hacia el otro lado, sin girar la cadera. Core: anti-rotación.", schemeByWeek: ["3×6/lado", "3×8/lado", "3×8/lado", "3×10/lado"] },
          { name: "Hollow body hold", posicion: "Boca arriba, brazos y piernas extendidos y elevados.", note: "La zona lumbar pegada al piso todo el tiempo. Si se despega, flexioná las rodillas. Core: anti-extensión.", schemeByWeek: ["3×20 seg", "3×25 seg", "3×30 seg", "3×35 seg"] },
        ],
        sections: [
          {
            label: "Press y aperturas (nuevos ángulos)",
            exercises: [
              { name: "Press plano con mancuernas", posicion: "Acostado en banco plano, una mancuerna por mano.", note: "Más rango de movimiento que con barra. Bajás hasta sentir estiramiento en el pecho.", schemeByWeek: H1 },
              { name: "Press inclinado con barra o Smith", posicion: "Banco a 30°, barra libre o en máquina Smith.", note: "Parte alta del pecho con más carga que con mancuernas.", schemeByWeek: H2 },
              { name: "Cruce en polea baja a alta", posicion: "De pie entre dos poleas bajas, los brazos suben en arco hacia el frente.", note: "Énfasis en la parte alta del pecho. PLAN B si no podés usar la polea: apertura con mancuernas en banco inclinado, 3×12.", schemeByWeek: R("12"), ss: "A" },
              { name: "Fondos en paralelas (asistidos o con peso)", posicion: "Cuerpo suspendido entre paralelas, torso levemente inclinado adelante.", note: "Pecho bajo y tríceps. Si usás máquina asistida, reducí la asistencia semana a semana.", schemeByWeek: R("8-10") },
            ],
          },
          {
            label: "Tríceps (nuevos)",
            exercises: [
              { name: "Press francés con mancuernas, acostado", posicion: "Acostado en banco plano, una mancuerna por mano, brazos estirados sobre el pecho.", note: "Doblás solo los codos y bajás las mancuernas a los lados de la cabeza. Codos fijos. Bajá con control.", schemeByWeek: R("10"), ss: "A" },
              { name: "Tríceps con cuerda sobre la cabeza", posicion: "De espaldas a la polea, cuerda detrás de la cabeza, un pie adelante.", note: "Estirás los brazos hacia adelante y arriba, con los codos cerca de las orejas.", schemeByWeek: R("12") },
              { name: "Patada de tríceps en polea", posicion: "Torso inclinado adelante, codo fijo a la altura de la cadera.", note: "Extensión completa con pausa arriba.", schemeByWeek: R("12", "/lado") },
            ],
          },
        ],
      },
    },
  },

  "Espalda/Bíceps": {
    color: C.espalda,
    label: "Espalda · Bíceps · Core",
    duration: "55–60 min",
    focus: "Dorsal, remos y bíceps. " + SS_NOTE,
    calentamiento: [
      { name: "Movilidad dinámica", duration: "3 min", note: "Círculos de hombro, retracciones escapulares y rotaciones de columna torácica. Sin cardio previo." },
      { name: "Series de aproximación", duration: "2 series", note: "En el primer ejercicio: 1 serie con ~50% del peso x10 y 1 serie con ~70% x6, antes de las series efectivas." },
    ],
    mesData: {
      1: {
        abs: [
          { name: "Elevación de piernas colgado", posicion: "Colgado de la barra, piernas juntas.", note: "Subís las piernas con la pelvis enrollada, sin balancearte. Bajás controlado. Core: anti-extensión.", schemeByWeek: ["3×10", "3×12", "3×12", "3×14"] },
          { name: "Plancha lateral con elevación de cadera", posicion: "De costado, apoyado en el antebrazo y el pie.", note: "Subís y bajás la cadera con control. Core: oblicuos y estabilidad lateral.", schemeByWeek: ["3×8/lado", "3×10/lado", "3×10/lado", "3×12/lado"] },
        ],
        sections: [
          {
            label: "Dorsal y remo",
            exercises: [
              { name: "Jalón al pecho, agarre ancho", posicion: "Polea alta, agarre ancho, jalás hacia la parte alta del pecho.", note: "Tu máximo registrado es 41,3 kg x 12. Pecho arriba, codos hacia abajo y atrás.", schemeByWeek: H1, startKg: 40, unit: "kg" },
              { name: "Remo en máquina", posicion: "Sentado, pecho contra el apoyo, tirás hacia el cuerpo.", note: "Codos pegados al cuerpo, pausa de 1 seg al final del recorrido.", schemeByWeek: H2 },
              { name: "Remo con mancuerna a un brazo, apoyado en banco", posicion: "Una mano y una rodilla en el banco, mancuerna en la otra mano.", note: "Espalda plana. Tirás el codo hacia la cadera.", schemeByWeek: R("10", " c/u") },
              { name: "Remo en polea baja, agarre estrecho", posicion: "Sentado, polea baja, agarre en V.", note: "Espalda recta, pecho afuera. Tirás hacia el ombligo.", schemeByWeek: R("12") },
            ],
          },
          {
            label: "Bíceps",
            exercises: [
              { name: "Bíceps con barra Z de pie", posicion: "De pie, barra Z, codos fijos al cuerpo.", note: "Sin balancear el torso para ayudarte.", schemeByWeek: R("10"), ss: "A" },
              { name: "Bíceps martillo con mancuernas", posicion: "De pie, agarre neutro.", note: "Tu máximo registrado es 15,8 kg x 8. Trabaja también el braquial.", schemeByWeek: R("10"), startKg: 14, unit: "kg c/u", ss: "A" },
              { name: "Bíceps en banco Scott", posicion: "Sentado en banco Scott, brazos apoyados.", note: "Rango completo, sin soltar de golpe abajo.", schemeByWeek: R("10") },
            ],
          },
        ],
      },
      2: {
        abs: [
          { name: "Chop con mancuerna, de alto a bajo", posicion: "De pie, mancuerna con las dos manos arriba de un hombro.", note: "Bajás la mancuerna en diagonal hacia la cadera opuesta, rotando el tronco. Pies firmes. Core: rotación controlada.", schemeByWeek: ["3×8/lado", "3×10/lado", "3×10/lado", "3×12/lado"] },
          { name: "Elevación de piernas colgado", posicion: "Colgado de la barra, piernas juntas.", note: "Subís las piernas con la pelvis enrollada, sin balancearte. Core: anti-extensión.", schemeByWeek: ["3×12", "3×12", "3×14", "3×15"] },
        ],
        sections: [
          {
            label: "Dorsal y remo (ejercicios nuevos)",
            exercises: [
              { name: "Dominadas (asistidas o libres)", posicion: "Colgado de la barra, agarre un poco más ancho que los hombros.", note: "Subís llevando el pecho a la barra. Si usás asistencia, reducila de a poco.", schemeByWeek: ["4×6", "4×6", "4×6-8", "4×6-8"] },
              { name: "Jalón al pecho, agarre supino", posicion: "Polea alta, palmas hacia vos.", note: "Más activación de bíceps y dorsal bajo.", schemeByWeek: H2, startKg: 45, unit: "kg" },
              { name: "Remo con pecho apoyado", posicion: "Pecho apoyado en un banco inclinado, mancuernas colgando.", note: "Sin impulso desde la espalda baja. Tirás los codos hacia atrás.", schemeByWeek: R("10") },
              { name: "Pullover en polea alta", posicion: "De pie, polea alta, brazos casi extendidos.", note: "Jalás hacia abajo hasta los muslos. Amplitud del dorsal.", schemeByWeek: R("12") },
            ],
          },
          {
            label: "Bíceps (variantes)",
            exercises: [
              { name: "Bíceps con mancuernas, banco inclinado", posicion: "Sentado en banco inclinado, brazos colgando.", note: "Mayor estiramiento del bíceps al inicio.", schemeByWeek: R("10", " c/u"), ss: "A" },
              { name: "Bíceps en polea baja con barra recta", posicion: "De pie frente a la polea baja.", note: "Tensión constante en todo el recorrido.", schemeByWeek: R("12"), startKg: 17, unit: "kg", ss: "A" },
              { name: "Martillo con cuerda en polea", posicion: "De pie, polea baja, cuerda con agarre neutro.", note: "Codos fijos, apretás arriba.", schemeByWeek: R("12") },
            ],
          },
        ],
      },
    },
  },

  "Hombros/Upper": {
    color: C.hombros,
    label: "Hombros · Upper body · Core",
    duration: "55–60 min",
    focus: "Hombros más empuje y tirón con otros ángulos, y brazos al final. " + SS_NOTE,
    calentamiento: [
      { name: "Movilidad dinámica", duration: "3 min", note: "Círculos grandes de hombro adelante y atrás, apertura de pecho con banda o sin ella. Sin cardio previo." },
      { name: "Series de aproximación", duration: "2 series", note: "En el primer ejercicio: 1 serie con ~50% del peso x10 y 1 serie con ~70% x6, antes de las series efectivas." },
    ],
    mesData: {
      1: {
        abs: [
          { name: "Pallof press", posicion: "De pie de costado a la polea o banda, manos al pecho.", note: "Estirás los brazos al frente sin que el tronco rote y volvés al pecho. Core: anti-rotación.", schemeByWeek: ["3×8/lado", "3×10/lado", "3×10/lado", "3×12/lado"] },
          { name: "Dead bug", posicion: "Boca arriba, brazos al techo y rodillas a 90°.", note: "Bajás brazo y pierna opuestos sin despegar la zona lumbar del piso. Core: anti-extensión.", schemeByWeek: ["3×8/lado", "3×10/lado", "3×10/lado", "3×12/lado"] },
        ],
        sections: [
          {
            label: "Hombros",
            exercises: [
              { name: "Press de hombros con mancuernas, sentado", posicion: "Sentado con respaldo, una mancuerna por mano.", note: "Tu máximo registrado es 14 kg x 7. Arrancá cerca de 12-14 kg. Empujás sin arquear la espalda.", schemeByWeek: H1, startKg: 14, unit: "kg c/u" },
              { name: "Elevación lateral con mancuernas", posicion: "De pie, mancuernas a los costados.", note: "Subís hasta la altura del hombro con el codo levemente flexionado. Sin balancear.", schemeByWeek: R("12"), ss: "A" },
              { name: "Deltoides posterior en máquina", posicion: "Sentado frente a la máquina, apertura hacia atrás.", note: "Aislamiento de la parte posterior del hombro.", schemeByWeek: R("12"), ss: "A" },
              { name: "Face pull con cuerda", posicion: "De pie, polea a la altura de los ojos.", note: "Jalás hacia la cara abriendo los codos. Muy bueno para el hombro y la postura.", schemeByWeek: R("12-15") },
            ],
          },
          {
            label: "Upper body (empuje y tirón)",
            exercises: [
              { name: "Press de pecho en máquina, agarre neutro", posicion: "Sentado, palmas enfrentadas.", note: "Carga distinto que la barra. Controlá la bajada.", schemeByWeek: R("10") },
              { name: "Jalón al pecho, agarre neutro", posicion: "Polea alta, palmas enfrentadas.", note: "Codos hacia abajo y atrás, pecho arriba.", schemeByWeek: R("10") },
            ],
          },
          {
            label: "Brazos",
            exercises: [
              { name: "Curl alternado con mancuernas", posicion: "De pie o sentado, una mancuerna por mano, subís una a la vez.", note: "Codos fijos, sin balanceo.", schemeByWeek: R("10"), ss: "B" },
              { name: "Tríceps con cuerda en polea", posicion: "De pie, polea alta, cuerda.", note: "Separás las puntas de la cuerda al final del movimiento.", schemeByWeek: R("12"), ss: "B" },
            ],
          },
        ],
      },
      2: {
        abs: [
          { name: "Plancha de apoyo corto (RKC)", posicion: "En plancha sobre antebrazos, codos algo adelantados.", note: "Apretás glúteos, cuádriceps y abdomen al máximo. Tiempo corto, tensión máxima. Core: anti-extensión.", schemeByWeek: ["3×20 seg", "3×20 seg", "3×25 seg", "3×25 seg"] },
          { name: "Leñador de rodillas con mancuerna", posicion: "Una rodilla en el piso, mancuerna con las dos manos.", note: "Bajás la mancuerna en diagonal desde arriba de un hombro hacia la cadera opuesta, sin mover la pelvis. Core: rotación controlada.", schemeByWeek: ["3×8/lado", "3×10/lado", "3×10/lado", "3×12/lado"] },
        ],
        sections: [
          {
            label: "Hombros (nuevos)",
            exercises: [
              { name: "Press militar con barra", posicion: "De pie o sentado, barra al frente del cuerpo.", note: "Empuje vertical completo. Glúteos y abdomen apretados para no arquear la espalda.", schemeByWeek: ["4×8", "4×8", "4×6-8", "4×6-8"] },
              { name: "Elevación lateral en polea, un brazo", posicion: "De costado a la polea baja.", note: "Tensión constante que la mancuerna no da.", schemeByWeek: R("12", "/lado"), ss: "A" },
              { name: "Pájaro con mancuernas, banco inclinado", posicion: "Pecho apoyado en el banco inclinado, mancuernas colgando.", note: "Abrís los brazos hacia los costados. Más control que en máquina.", schemeByWeek: R("12"), ss: "A" },
              { name: "Remo axilar de pie", posicion: "De pie, barra o mancuernas.", note: "Tirás hacia las axilas con los codos altos. Deltoides posterior y trapecio.", schemeByWeek: R("10") },
            ],
          },
          {
            label: "Upper body (nuevas variantes)",
            exercises: [
              { name: "Press de pecho en máquina, un brazo", posicion: "Sentado, un brazo por vez.", note: "Corrige diferencias entre lados. Sin rotar el torso.", schemeByWeek: R("10", "/lado") },
              { name: "Remo en máquina, agarre ancho", posicion: "Sentado, pecho contra el apoyo, agarre ancho.", note: "Espalda alta. Codos hacia afuera y atrás.", schemeByWeek: R("10") },
            ],
          },
          {
            label: "Brazos",
            exercises: [
              { name: "Martillo con mancuernas", posicion: "De pie, agarre neutro.", note: "Codos fijos al cuerpo.", schemeByWeek: R("10"), ss: "B" },
              { name: "Tríceps con cuerda sobre la cabeza", posicion: "De espaldas a la polea, cuerda detrás de la cabeza, un pie adelante.", note: "Estirás los brazos hacia adelante y arriba.", schemeByWeek: R("12"), ss: "B" },
            ],
          },
        ],
      },
    },
  },

  "Piernas/Hombros": {
    color: C.piernas,
    label: "Piernas · Hombros · Core",
    duration: "55–60 min",
    focus: "Piernas primero, con glúteo sin hip thrust, y dos ejercicios de hombro al final. " + SS_NOTE + " Si te sobra tiempo, sumá gemelos 3×15 al final.",
    calentamiento: [
      { name: "Movilidad dinámica", duration: "3 min", note: "Círculos de cadera, sentadilla con peso corporal y movilidad de tobillo. Sin cardio previo." },
      { name: "Series de aproximación", duration: "2 series", note: "En el primer ejercicio: 1 serie con ~50% del peso x10 y 1 serie con ~70% x6, antes de las series efectivas." },
    ],
    mesData: {
      1: {
        abs: [
          { name: "Plancha larga", posicion: "En plancha sobre antebrazos, cuerpo en línea.", note: "Glúteos apretados, costillas abajo, sin hundir la cadera. Core: anti-extensión.", schemeByWeek: ["3×40 seg", "3×45 seg", "3×50 seg", "3×60 seg"] },
          { name: "Leñador de bajo a alto con mancuerna", posicion: "De pie, mancuerna cerca de una rodilla.", note: "Subís la mancuerna en diagonal hasta arriba del hombro opuesto, rotando el tronco. Core: rotación controlada.", schemeByWeek: ["3×8/lado", "3×10/lado", "3×10/lado", "3×12/lado"] },
        ],
        sections: [
          {
            label: "Piernas y glúteo",
            exercises: [
              { name: "Sentadilla con barra", posicion: "Barra en la espalda alta, sentadilla completa.", note: "Rodillas siguen la línea de los pies, pecho arriba. Bajás controlado.", schemeByWeek: H1 },
              { name: "Peso muerto rumano con barra", posicion: "De pie, barra frente a los muslos, rodillas levemente flexionadas.", note: "Llevás la cadera hacia atrás, la barra baja pegada a las piernas. Espalda recta. Glúteo e isquios.", schemeByWeek: H2 },
              { name: "Prensa 45°", posicion: "Acostado en la prensa, pies al ancho de hombros.", note: "Rango completo sin despegar la zona lumbar del respaldo.", schemeByWeek: R("10-12") },
              { name: "Curl femoral acostado", posicion: "Boca abajo en la máquina, rodillas en el borde del banco.", note: "Tu máximo registrado es 45 kg x 8. Bajada de 3 seg.", schemeByWeek: R("10-12"), startKg: 45, unit: "kg" },
              { name: "Extensión de cuádriceps", posicion: "Sentado en la máquina, extensión de rodilla.", note: "Tu máximo registrado es 45 kg x 8. Arrancá cerca de 45 kg.", schemeByWeek: R("12"), startKg: 45, unit: "kg", ss: "B" },
              { name: "Gemelos de pie", posicion: "En máquina de gemelos o en un escalón con una mancuerna en la mano.", note: "Subís hasta el máximo, bajás hasta estirar el gemelo. Pausa de 1 seg arriba.", schemeByWeek: R("15"), ss: "A" },
            ],
          },
          {
            label: "Hombros (al final)",
            exercises: [
              { name: "Elevación lateral con mancuernas", posicion: "De pie, mancuernas a los costados.", note: "Subís hasta la altura del hombro con el codo levemente flexionado. Sin balancear.", schemeByWeek: R("12-15"), ss: "A" },
              { name: "Deltoides posterior en máquina", posicion: "Sentado frente a la máquina, apertura hacia atrás.", note: "Aislamiento de la parte posterior del hombro.", schemeByWeek: R("12"), ss: "B" },
            ],
          },
        ],
      },
      2: {
        abs: [
          { name: "Bird dog con pausa", posicion: "En cuatro apoyos, manos bajo los hombros y rodillas bajo las caderas.", note: "Estirás el brazo derecho adelante y la pierna izquierda atrás a la vez, hasta quedar en línea con el torso. Mantenés 3 seg sin girar la cadera ni arquear la espalda. Cambiás de lado. Core: anti-rotación.", schemeByWeek: ["3×6/lado", "3×8/lado", "3×8/lado", "3×10/lado"] },
          { name: "Pallof con pausa", posicion: "De pie de costado a la polea o banda, manos al pecho.", note: "Estirás los brazos al frente y mantenés 3 seg sin que el tronco rote. Volvés al pecho. Core: anti-rotación.", schemeByWeek: ["3×6/lado", "3×8/lado", "3×8/lado", "3×10/lado"] },
        ],
        sections: [
          {
            label: "Piernas y glúteo (nuevos)",
            exercises: [
              { name: "Sentadilla búlgara con mancuernas", posicion: "Pie de atrás apoyado en un banco, una mancuerna por mano.", note: "Paso largo, torso levemente inclinado. Bajás controlado. Glúteo y cuádriceps.", schemeByWeek: R("8-10", "/lado") },
              { name: "Peso muerto rumano con barra (más carga)", posicion: "De pie, barra frente a los muslos, rodillas levemente flexionadas.", note: "Mismo ejercicio del mes 1 con más carga. Espalda recta, cadera hacia atrás.", schemeByWeek: R("8-10") },
              { name: "Prensa 45° con pies altos", posicion: "Acostado en la prensa, pies arriba en la plataforma.", note: "Más énfasis en glúteo e isquios que la prensa estándar.", schemeByWeek: R("10") },
              { name: "Curl femoral sentado", posicion: "Sentado en la máquina, flexionás las rodillas.", note: "Otro ángulo de cadera que el acostado. Bajada de 3 seg.", schemeByWeek: R("10-12"), startKg: 45, unit: "kg" },
              { name: "Zancadas caminando con mancuernas", posicion: "De pie, mancuernas a los costados, paso largo alternando.", note: "Trabajo unilateral. Torso erguido, rodilla delantera sobre el pie.", schemeByWeek: R("10", "/lado"), ss: "B" },
              { name: "Abducción de cadera en máquina", posicion: "Sentado, abrís las piernas contra las almohadillas.", note: "Glúteo medio. Controlá el regreso.", schemeByWeek: R("12-15"), ss: "A" },
            ],
          },
          {
            label: "Hombros (al final)",
            exercises: [
              { name: "Press de hombro con mancuernas", posicion: "Sentado con respaldo, una mancuerna por mano.", note: "Menos carga que en el día de hombros, ya vienen las piernas cansadas.", schemeByWeek: R("10"), ss: "A" },
              { name: "Elevación lateral en polea", posicion: "De costado a la polea baja.", note: "Tensión constante en todo el recorrido.", schemeByWeek: R("12", "/lado"), ss: "B" },
            ],
          },
        ],
      },
    },
  },
};

function load() { try { return JSON.parse(localStorage.getItem(SK) || "{}"); } catch { return {}; } }
function persist(d) { try { localStorage.setItem(SK, JSON.stringify(d)); } catch {} }
function todayKey() { return new Date().toISOString().slice(0, 10); }
function getMondayOf(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}
function addDays(dateStr, n) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
function formatDate(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function getCurrentWeekNum(startDate) {
  if (!startDate) return 1;
  const start = new Date(startDate + "T12:00:00");
  const now = new Date();
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24 * 7));
  return Math.min(Math.max(diff + 1, 1), 8);
}

function weekIdx(weekNum) {
  // index 0-3 within its month
  return ((weekNum - 1) % 4);
}

function Tag({ text, color }) {
  return <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: color + "18", color }}>{text}</span>;
}

function SectionHeader({ label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0 8px" }}>
      <div style={{ width: 3, height: 13, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

function ExerciseRow({ ex, globalIdx, schemeText, accent, log, onLogChange, onTap, prevLog, comment, onCommentChange }) {
  const [showComment, setShowComment] = useState(false);
  return (
    <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 11, marginBottom: 7, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "stretch" }}>
        <button onClick={onTap} style={{ flex: 1, padding: "12px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, minWidth: 18 }}>{globalIdx + 1}</span>
            <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{ex.name}</span>
          </div>
          {ex.posicion && <div style={{ paddingLeft: 26, fontSize: 11, color: C.muted, fontStyle: "italic" }}>{ex.posicion}</div>}
          <div style={{ paddingLeft: 26, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Tag text={schemeText} color={accent} />
            {ex.ss ? <Tag text={"Superserie " + ex.ss} color={C.hombros} /> : null}
            {ex.startKg ? <span style={{ fontSize: 11, color: C.muted }}>ref: {ex.startKg} {ex.unit || "kg"}</span> : null}
          </div>
          {prevLog && (prevLog.kg || prevLog.reps) && (
            <div style={{ paddingLeft: 26 }}>
              <span style={{ fontSize: 10, color: C.muted, background: C.faint, borderRadius: 5, padding: "2px 6px" }}>
                Anterior: {prevLog.kg ? prevLog.kg + (ex.unit || " kg") : ""}{prevLog.kg && prevLog.reps ? " × " : ""}{prevLog.reps ? prevLog.reps + " reps" : ""}
              </span>
            </div>
          )}
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center", justifyContent: "center", padding: "0 10px", borderLeft: "1px solid " + C.border, minWidth: 76 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label style={{ fontSize: 9, color: C.muted, letterSpacing: 0.5, marginBottom: 2 }}>{ex.unit ? ex.unit.toUpperCase() : "KG"}</label>
            <input type="number" inputMode="decimal" placeholder="—" value={log.kg || ""} onChange={e => onLogChange("kg", e.target.value)}
              style={{ width: 46, textAlign: "center", background: log.kg ? accent + "12" : C.faint, border: log.kg ? "1.5px solid " + accent + "40" : "none", borderRadius: 7, padding: "5px 2px", color: C.text, fontSize: 14, fontWeight: 700, outline: "none", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label style={{ fontSize: 9, color: C.muted, letterSpacing: 0.5, marginBottom: 2 }}>REPS</label>
            <input type="number" inputMode="numeric" placeholder="—" value={log.reps || ""} onChange={e => onLogChange("reps", e.target.value)}
              style={{ width: 46, textAlign: "center", background: log.reps ? accent + "12" : C.faint, border: log.reps ? "1.5px solid " + accent + "40" : "none", borderRadius: 7, padding: "5px 2px", color: C.text, fontSize: 14, fontWeight: 700, outline: "none", fontFamily: "inherit" }} />
          </div>
          <button onClick={() => setShowComment(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: "2px", color: comment ? accent : C.border }}>💬</button>
        </div>
      </div>
      {showComment && (
        <div style={{ padding: "8px 14px", borderTop: "1px solid " + C.border, background: C.faint }}>
          <input type="text" placeholder="Nota, sustitución, cómo se sintió..." value={comment || ""} onChange={e => onCommentChange(e.target.value)}
            style={{ width: "100%", background: "white", border: "1px solid " + C.border, borderRadius: 7, padding: "7px 10px", color: C.text, fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
        </div>
      )}
    </div>
  );
}

function ExerciseDetail({ ex, schemeText, accent, mes, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,23,20,0.5)", zIndex: 60, display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: "18px 18px 0 0", width: "100%", padding: "20px 20px 36px", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 18px" }} />
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <Tag text={schemeText} color={accent} />
          <Tag text={mes.name + " · " + mes.subtitle} color={mes.color} />
        </div>
        <h3 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 4px" }}>{ex.name}</h3>
        {ex.posicion && <p style={{ fontSize: 13, color: accent, fontWeight: 600, margin: "0 0 8px" }}>{ex.posicion}</p>}
        {ex.note && <p style={{ color: C.text, fontSize: 14, lineHeight: 1.6, margin: "0 0 12px" }}>{ex.note}</p>}
        {ex.startKg ? (
          <div style={{ background: C.faint, borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 12, color: C.muted }}>Carga de referencia inicial: <strong style={{ color: C.text }}>{ex.startKg} {ex.unit || "kg"}</strong> (según tus máximos previos, ajustá según sensación).</p>
          </div>
        ) : null}
        <p style={{ fontSize: 12, color: C.muted, margin: "0 0 16px" }}>⏱ <strong style={{ color: C.text }}>60 a 90 seg</strong> entre series · <strong style={{ color: C.text }}>1'30" a 2'</strong> entre ejercicios{ex.ss ? " (en superserie, sin pausa entre A y B)" : ""}</p>
        <button onClick={onClose} style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: C.faint, color: C.muted, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cerrar</button>
      </div>
    </div>
  );
}

function DayModal({ dateStr, existing, onSave, onClose }) {
  const ex = existing || {};
  const [gymDay, setGymDay] = useState(ex.gymDay || null);
  const [weekNum, setWeekNum] = useState(ex.weekNum || 1);

  function save() {
    const data = {};
    if (gymDay) { data.gymDay = gymDay; data.weekNum = weekNum; }
    onSave(data);
  }

  const wArr = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,23,20,0.45)", zIndex: 50, display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: "18px 18px 0 0", width: "100%", padding: "20px 20px 36px", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 18px" }} />
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 2px" }}>¿Qué entrenaste?</h3>
        <p style={{ color: C.muted, fontSize: 13, margin: "0 0 20px" }}>{formatDate(dateStr)}</p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8, fontWeight: 700 }}>🏋️ Día de gym</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {GYM_DAYS.map(function (d) {
              const dp = PLAN[d];
              const active = gymDay === d;
              return (
                <button key={d} onClick={() => setGymDay(active ? null : d)} style={{ padding: "10px 14px", borderRadius: 10, border: "1.5px solid " + (active ? dp.color : C.border), background: active ? dp.color + "12" : C.surface, color: active ? dp.color : C.muted, fontWeight: 700, fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                  {d}
                </button>
              );
            })}
          </div>
          {gymDay && (
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Semana</label>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {wArr.map(function (w) {
                  const m = getMes(w);
                  return (
                    <button key={w} onClick={() => setWeekNum(w)} style={{ width: 36, height: 36, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: weekNum === w ? "2px solid " + m.color : "1.5px solid " + C.border, background: weekNum === w ? m.color : C.surface, color: weekNum === w ? "white" : C.muted }}>{w}</button>
                  );
                })}
              </div>
              <div style={{ marginTop: 8 }}>
                <Tag text={getMes(weekNum).name + " · " + getMes(weekNum).subtitle} color={getMes(weekNum).color} />
              </div>
            </div>
          )}
        </div>

        <button onClick={save} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: C.text, color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Guardar día</button>
        {existing && <button onClick={() => onSave(null)} style={{ width: "100%", marginTop: 8, padding: 12, borderRadius: 12, border: "1px solid " + C.border, background: "transparent", color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Borrar registro</button>}
      </div>
    </div>
  );
}

function WeekCalendar({ saved, weekStart, onDayTap }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = todayKey();
  return (
    <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ display: "flex" }}>
        {days.map((d, i) => {
          const isToday = d === today;
          const entry = saved["day_" + d];
          const gymColor = entry && entry.gymDay ? PLAN[entry.gymDay].color : null;
          const weekN = entry && entry.weekNum ? entry.weekNum : null;
          const shortLabel = entry && entry.gymDay ? SHORT[entry.gymDay] : null;
          return (
            <button key={d} onClick={() => onDayTap(d)} style={{ flex: 1, borderRight: i < 6 ? "1px solid " + C.border : "none", background: isToday ? C.text + "05" : "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "8px 0 6px", textAlign: "center", borderBottom: "1px solid " + C.border, width: "100%", background: isToday ? C.text + "08" : "transparent" }}>
                <div style={{ fontSize: 9, color: C.muted }}>{DAYS_LABEL[i]}</div>
                <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isToday ? C.text : C.muted, marginTop: 1 }}>{new Date(d + "T12:00:00").getDate()}</div>
              </div>
              <div style={{ flex: 1, padding: "5px 2px", display: "flex", flexDirection: "column", gap: 3, alignItems: "center", minHeight: 48, justifyContent: "center" }}>
                {gymColor ? (
                  <div style={{ width: "92%", padding: "3px 0", borderRadius: 5, background: gymColor + "20", textAlign: "center" }}>
                    <span style={{ fontSize: 8, fontWeight: 700, color: gymColor }}>{shortLabel}{weekN ? " S" + weekN : ""}</span>
                  </div>
                ) : (
                  <div style={{ width: "92%", padding: "3px 0", borderRadius: 5, border: "1px dashed " + C.border, textAlign: "center" }}>
                    <span style={{ fontSize: 9, color: C.border }}>+</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function sessionKey(gymDay, weekNum) { return "s_" + gymDay + "_w" + weekNum; }
function logKey(sIdx, eIdx) { return sIdx + "_" + eIdx; }

function WeekDropdown({ weekNum, setWeekNum, mes }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      <p style={{ margin: "0 0 8px", fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>Semana</p>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", padding: "12px 16px", borderRadius: 12,
        border: "1.5px solid " + mes.color, background: mes.color + "08",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit"
      }}>
        <div style={{ textAlign: "left" }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: mes.color }}>S{weekNum} · {mes.name}</span>
          <span style={{ fontSize: 12, color: C.muted, marginLeft: 8 }}>{mes.subtitle}</span>
        </div>
        <span style={{ color: mes.color, fontSize: 14 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 20, background: C.surface, border: "1.5px solid " + C.border, borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
          {MESES.map(m => (
            <div key={m.name}>
              <div style={{ padding: "8px 16px", background: C.faint, borderBottom: "1px solid " + C.border }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: m.color, letterSpacing: 1, textTransform: "uppercase" }}>{m.name} · {m.subtitle}</span>
              </div>
              <div style={{ display: "flex", gap: 6, padding: "10px 12px", borderBottom: "1px solid " + C.border }}>
                {m.weeks.map(w => {
                  const active = weekNum === w;
                  return (
                    <button key={w} onClick={() => { setWeekNum(w); setOpen(false); }} style={{
                      flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                      border: active ? "2px solid " + m.color : "1.5px solid " + C.border,
                      background: active ? m.color : "transparent",
                      color: active ? "white" : C.muted, fontFamily: "inherit"
                    }}>S{w}</button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [weekNum, setWeekNum] = useState(1);
  const [planDay, setPlanDay] = useState("Pecho/Tríceps");
  const [detail, setDetail] = useState(null);
  const [saved, setSaved] = useState(load);
  const [fbText, setFbText] = useState("");
  const [fbResp, setFbResp] = useState("");
  const [fbLoading, setFbLoading] = useState(false);
  const [fbDone, setFbDone] = useState(false);
  const [dayModal, setDayModal] = useState(null);
  const [weekStart, setWeekStart] = useState(getMondayOf(todayKey()));

  useEffect(() => {
    if (saved.programStart) {
      const detected = getCurrentWeekNum(saved.programStart);
      setWeekNum(detected);
    }
  }, [saved.programStart]);

  const dp = PLAN[planDay];
  const mes = getMes(weekNum);
  const accent = dp.color;
  const mesNum = mes.weeks[0] <= 4 ? 1 : 2;
  const mesData = dp.mesData[mesNum];
  const wi = weekIdx(weekNum);

  function updateSaved(newData) { setSaved(newData); persist(newData); }

  function setProgramStart(dateStr) {
    const nd = Object.assign({}, saved, { programStart: dateStr });
    updateSaved(nd);
  }

  function saveDayEntry(dateStr, data) {
    if (data === null) {
      const nd = Object.assign({}, saved);
      delete nd["day_" + dateStr];
      updateSaved(nd);
    } else {
      const nd = Object.assign({}, saved);
      nd["day_" + dateStr] = Object.assign({}, data, { date: dateStr, updatedAt: new Date().toISOString() });
      updateSaved(nd);
    }
    setDayModal(null);
  }

  function getLog(sIdx, eIdx) {
    const key = sessionKey(planDay, weekNum);
    const entry = saved[key];
    return (entry && entry.logs) ? (entry.logs[logKey(sIdx, eIdx)] || { kg: "", reps: "" }) : { kg: "", reps: "" };
  }

  function getComment(sIdx, eIdx) {
    const key = sessionKey(planDay, weekNum);
    const entry = saved[key];
    return (entry && entry.comments) ? (entry.comments[logKey(sIdx, eIdx)] || "") : "";
  }

  function setLog(sIdx, eIdx, field, val) {
    const key = sessionKey(planDay, weekNum);
    const existing = saved[key] || {};
    const logs = Object.assign({}, existing.logs || {});
    const lk = logKey(sIdx, eIdx);
    logs[lk] = Object.assign({}, logs[lk] || {}, { [field]: val });
    const nd = Object.assign({}, saved);
    nd[key] = Object.assign({}, existing, { logs, gymDay: planDay, weekNum, updatedAt: new Date().toISOString() });
    updateSaved(nd);
  }

  function setComment(sIdx, eIdx, val) {
    const key = sessionKey(planDay, weekNum);
    const existing = saved[key] || {};
    const comments = Object.assign({}, existing.comments || {});
    comments[logKey(sIdx, eIdx)] = val;
    const nd = Object.assign({}, saved);
    nd[key] = Object.assign({}, existing, { comments, gymDay: planDay, weekNum, updatedAt: new Date().toISOString() });
    updateSaved(nd);
  }

  function getPrevLog(sIdx, eIdx) {
    if (weekNum <= 1) return null;
    const prevKey = sessionKey(planDay, weekNum - 1);
    const entry = saved[prevKey];
    if (!entry || !entry.logs) return null;
    return entry.logs[logKey(sIdx, eIdx)] || null;
  }

  function finishSession() {
    const today = todayKey();
    const dayKey = "day_" + today;
    const existing = saved[dayKey] || {};
    const nd = Object.assign({}, saved);
    nd[dayKey] = Object.assign({}, existing, { gymDay: planDay, weekNum, date: today, updatedAt: new Date().toISOString() });
    updateSaved(nd);
    setScreen("feedback");
  }

  function exportCSV() {
    const rows = [["Semana", "Mes", "Dia", "Ejercicio", "Kg", "Reps", "Comentario"]];
    for (let w = 1; w <= 8; w++) {
      GYM_DAYS.forEach(gDay => {
        const key = sessionKey(gDay, w);
        const entry = saved[key];
        if (!entry || !entry.logs) return;
        const m = getMes(w);
        const gymDp = PLAN[gDay];
        const mN = m.weeks[0] <= 4 ? 1 : 2;
        const mData = gymDp.mesData[mN];
        mData.sections.forEach((sec, sIdx) => {
          sec.exercises.forEach((ex, eIdx) => {
            const log = entry.logs[logKey(sIdx, eIdx)];
            const comment = entry.comments ? (entry.comments[logKey(sIdx, eIdx)] || "") : "";
            if (log && (log.kg || log.reps)) {
              rows.push(["S" + w, m.name, gDay, ex.name, log.kg || "", log.reps || "", comment]);
            }
          });
        });
      });
    }
    const csv = rows.map(r => r.map(v => '"' + String(v).split('"').join('""') + '"').join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "plan_maxi.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  async function sendFeedback() {
    if (!fbText.trim()) return;
    setFbLoading(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          system: "Sos un entrenador personal profesional especializado en hipertrofia. El usuario mide 1,84 m, pesa 80 kg y sigue un plan de 4 días de fuerza en gimnasio (pecho/tríceps, espalda/bíceps, hombros/upper, piernas/hombros), con core en cada día y sin cardio. Objetivo: ganar masa muscular y bajar grasa abdominal. Ya está en plena actividad. Respondé en español, conciso, máximo 4 oraciones. Foco en ajustes concretos de carga, técnica o descanso. Si habla de grasa abdominal, recordá que depende sobre todo de alimentación y pasos diarios.",
          messages: [{ role: "user", content: "Feedback " + planDay + " Semana " + weekNum + " (" + mes.name + "): " + fbText }]
        })
      });
      const data = await r.json();
      setFbResp(data.content ? data.content.filter(b => b.type === "text").map(b => b.text).join("") : "Error.");
      setFbDone(true);
    } catch (e) { setFbResp("Error de conexión."); }
    setFbLoading(false);
  }

  const f = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

  // ── HOME ──
  if (screen === "home") return (
    <div style={Object.assign({}, f, { minHeight: "100vh", background: C.bg, color: C.text, paddingBottom: 48 })}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {dayModal && <DayModal dateStr={dayModal} existing={saved["day_" + dayModal]} onSave={d => saveDayEntry(dayModal, d)} onClose={() => setDayModal(null)} />}

      <div style={{ padding: "44px 20px 20px", background: C.surface, borderBottom: "1px solid " + C.border }}>
        <p style={{ margin: 0, fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>Plan activo</p>
        <h1 style={{ margin: "4px 0 2px", fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Conte · 8 semanas</h1>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: C.muted }}>Hipertrofia · Fuerza · Core</p>

        <div style={{ display: "flex", gap: 6 }}>
          {MESES.map(m => (
            <div key={m.name} style={{ flex: 1, padding: "8px 6px", borderRadius: 10, background: m.color + "12", border: "1px solid " + m.color + "30", textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: m.color }}>{m.name}</div>
              <div style={{ fontSize: 9, color: C.muted, marginTop: 1 }}>S{m.weeks[0]}-{m.weeks[3]}</div>
            </div>
          ))}
        </div>
      </div>

      {!saved.programStart && (
        <div style={{ margin: "16px 20px 0", background: mes.color + "10", border: "1px solid " + mes.color + "30", borderRadius: 12, padding: "14px 16px" }}>
          <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 14 }}>¿Cuándo arrancás?</p>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: C.muted }}>Ingresá la fecha de inicio para que la app detecte la semana automáticamente.</p>
          <input type="date" onChange={e => setProgramStart(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid " + C.border, background: C.surface, color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
        </div>
      )}

      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>{formatDate(weekStart)} — {formatDate(addDays(weekStart, 6))}</p>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={() => setWeekStart(addDays(weekStart, -7))} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18, padding: "0 2px" }}>‹</button>
            <button onClick={() => setWeekStart(getMondayOf(todayKey()))} style={{ background: "none", border: "1px solid " + C.border, borderRadius: 6, color: C.muted, cursor: "pointer", fontSize: 11, padding: "3px 8px" }}>Hoy</button>
            <button onClick={() => setWeekStart(addDays(weekStart, 7))} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18, padding: "0 2px" }}>›</button>
          </div>
        </div>
        <WeekCalendar saved={saved} weekStart={weekStart} onDayTap={d => setDayModal(d)} />
        <p style={{ margin: "0 0 4px", fontSize: 11, color: C.muted }}>Tocá cualquier día para registrar qué entrenaste.</p>

        <div style={{ height: 1, background: C.border, margin: "18px 0" }} />

        <WeekDropdown weekNum={weekNum} setWeekNum={setWeekNum} mes={mes} />

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {GYM_DAYS.map(d => {
            const dp2 = PLAN[d];
            const active = planDay === d;
            const key = sessionKey(d, weekNum);
            const hasData = saved[key] && saved[key].logs && Object.keys(saved[key].logs).length > 0;
            return (
              <button key={d} onClick={() => { setPlanDay(d); setScreen("day"); }} style={{ padding: "14px 16px", borderRadius: 12, border: "1.5px solid " + (active ? dp2.color : C.border), background: active ? dp2.color + "08" : C.surface, color: C.text, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: dp2.color }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{d}</div>
                    <div style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>{dp2.label} · {dp2.duration}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {hasData && <span style={{ fontSize: 11, color: dp2.color, fontWeight: 700 }}>✓</span>}
                  <span style={{ color: C.muted, fontSize: 18 }}>›</span>
                </div>
              </button>
            );
          })}
        </div>

        <button onClick={() => setScreen("history")} style={{ width: "100%", marginTop: 8, padding: "12px", borderRadius: 12, border: "1.5px solid " + C.border, background: "transparent", color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Historial y exportar</button>
      </div>
    </div>
  );

  // ── DAY VIEW ──
  if (screen === "day") {
    let globalIdx = 0;
    const key = sessionKey(planDay, weekNum);
    const hasAnyLog = saved[key] && saved[key].logs && Object.keys(saved[key].logs).length > 0;

    return (
      <div style={Object.assign({}, f, { minHeight: "100vh", background: C.bg, color: C.text, paddingBottom: 48 })}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        {detail && <ExerciseDetail ex={detail.ex} schemeText={detail.schemeText} accent={accent} mes={mes} onClose={() => setDetail(null)} />}

        <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid " + C.border, background: C.surface, position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", padding: 0 }}>← Volver</button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: accent }}>{planDay} · S{weekNum}</div>
              <div style={{ fontSize: 11, color: mes.color, fontWeight: 600 }}>{mes.name} · {mes.subtitle}</div>
            </div>
            {hasAnyLog ? <span style={{ fontSize: 11, color: C.espalda, fontWeight: 600 }}>✓ guardado</span> : <div style={{ width: 60 }} />}
          </div>
        </div>

        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ background: mes.color + "0A", border: "1px solid " + mes.color + "25", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 12, color: mes.color, fontWeight: 600 }}>{dp.focus}</p>
          </div>

          <SectionHeader label="Entrada en calor" color={C.muted} />
          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 11, overflow: "hidden", marginBottom: 8 }}>
            {dp.calentamiento.map((m, i) => (
              <div key={i} style={{ padding: "10px 14px", borderBottom: i < dp.calentamiento.length - 1 ? "1px solid " + C.border : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{m.name}</span>
                  <span style={{ fontSize: 11, color: C.muted, flexShrink: 0, marginLeft: 8 }}>{m.duration}</span>
                </div>
                {m.note && <p style={{ margin: 0, fontSize: 11, color: C.muted, lineHeight: 1.4 }}>{m.note}</p>}
              </div>
            ))}
          </div>

          <SectionHeader label="Core · Abdominales" color={C.muted} />
          {mesData.abs.map((ex, i) => (
            <button key={i} onClick={() => setDetail({ ex, schemeText: ex.schemeByWeek[wi] })} style={{ width: "100%", background: C.surface, border: "1px solid " + C.border, borderRadius: 11, marginBottom: 7, padding: "12px 14px", cursor: "pointer", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, minWidth: 18 }}>{i + 1}</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{ex.name}</span>
              </div>
              <div style={{ paddingLeft: 26, marginTop: 4 }}>
                <Tag text={ex.schemeByWeek[wi]} color={C.muted} />
              </div>
            </button>
          ))}

          {mesData.sections.map((section, sIdx) => (
            <div key={sIdx}>
              <SectionHeader label={section.label} color={accent} />
              {section.exercises.map((ex, eIdx) => {
                const gi = globalIdx++;
                const schemeText = ex.schemeByWeek[wi];
                return (
                  <ExerciseRow key={eIdx} ex={ex} globalIdx={gi} schemeText={schemeText} accent={accent}
                    log={getLog(sIdx, eIdx)}
                    onLogChange={(field, val) => setLog(sIdx, eIdx, field, val)}
                    onTap={() => setDetail({ ex, schemeText })}
                    prevLog={getPrevLog(sIdx, eIdx)}
                    comment={getComment(sIdx, eIdx)}
                    onCommentChange={val => setComment(sIdx, eIdx, val)} />
                );
              })}
            </div>
          ))}

          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, padding: "12px 16px", margin: "16px 0" }}>
            <p style={{ margin: "0 0 8px", fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>Descansos</p>
            {[["Entre series", "60 a 90 seg"], ["Entre ejercicios", "1'30\" a 2'"], ["Superserie A + B", "sin pausa, descanso al terminar B"]].map(pair => (
              <div key={pair[0]} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.muted }}>{pair[0]}</span>
                <span style={{ fontSize: 12, color: C.text, fontWeight: 600, flexShrink: 0 }}>{pair[1]}</span>
              </div>
            ))}
          </div>

          <button onClick={finishSession} style={{ width: "100%", padding: "15px", borderRadius: 12, border: "none", background: accent, color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            Terminar y dar feedback →
          </button>
          <button onClick={() => setScreen("home")} style={{ width: "100%", marginTop: 8, padding: "12px", borderRadius: 12, border: "1.5px solid " + C.border, background: "transparent", color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            ← Volver (datos guardados)
          </button>
        </div>
      </div>
    );
  }

  // ── FEEDBACK ──
  if (screen === "feedback") return (
    <div style={Object.assign({}, f, { minHeight: "100vh", background: C.bg, color: C.text, padding: "40px 20px" })}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: accent + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 12px" }}>✓</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Sesión registrada</h2>
        <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>{planDay} · S{weekNum} · {mes.name}</p>
      </div>
      {!fbDone ? (
        <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 14, padding: 18, marginBottom: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>¿Cómo estuvo?</p>
          <p style={{ color: C.muted, fontSize: 12, margin: "0 0 12px", lineHeight: 1.5 }}>Cargas, técnica, qué costó más, cómo te sentiste.</p>
          <textarea value={fbText} onChange={e => setFbText(e.target.value)} placeholder="Ej: El press de banca con 30kg costó la última serie. La sentadilla se sintió bien..." rows={4}
            style={{ width: "100%", background: C.bg, border: "1.5px solid " + C.border, borderRadius: 9, padding: "12px", color: C.text, fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.5 }} />
          <button onClick={sendFeedback} disabled={fbLoading || !fbText.trim()} style={{ width: "100%", marginTop: 10, padding: 13, borderRadius: 10, border: "none", background: fbText.trim() ? accent : C.border, color: fbText.trim() ? "white" : C.muted, fontWeight: 700, fontSize: 14, cursor: fbText.trim() ? "pointer" : "default" }}>
            {fbLoading ? "Analizando..." : "Enviar →"}
          </button>
        </div>
      ) : (
        <div style={{ background: accent + "0C", border: "1px solid " + accent + "25", borderRadius: 14, padding: 18, marginBottom: 14 }}>
          <p style={{ margin: "0 0 10px", fontSize: 11, color: accent, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Tu entrenador dice</p>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{fbResp}</p>
        </div>
      )}
      <button onClick={() => setScreen("home")} style={{ width: "100%", padding: 13, borderRadius: 12, border: "1.5px solid " + C.border, background: "transparent", color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>← Volver al inicio</button>
    </div>
  );

  // ── HISTORY ──
  if (screen === "history") return (
    <div style={Object.assign({}, f, { minHeight: "100vh", background: C.bg, color: C.text, padding: "40px 20px", paddingBottom: 48 })}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20 }}>← Volver</button>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 20px", letterSpacing: -0.3 }}>Historial</h2>

      <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, padding: 14, marginBottom: 20 }}>
        <p style={{ margin: "0 0 10px", fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>Exportar CSV</p>
        <button onClick={exportCSV} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid " + C.text, background: C.text, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>↓ Descargar todo</button>
      </div>

      {MESES.map(m => {
        const hasAny = m.weeks.some(w => GYM_DAYS.some(d => saved[sessionKey(d, w)] && saved[sessionKey(d, w)].logs && Object.keys(saved[sessionKey(d, w)].logs).length > 0));
        if (!hasAny) return null;
        return (
          <div key={m.name} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: m.color }} />
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: m.color }}>{m.name} · {m.subtitle}</p>
            </div>
            {m.weeks.map(w => GYM_DAYS.map(gDay => {
              const key = sessionKey(gDay, w);
              const entry = saved[key];
              if (!entry || !entry.logs || !Object.keys(entry.logs).length) return null;
              const gymDp = PLAN[gDay];
              const mN = m.weeks[0] <= 4 ? 1 : 2;
              const mData = gymDp.mesData[mN];
              return (
                <div key={key} style={{ background: C.surface, borderRadius: 12, padding: 14, marginBottom: 8, border: "1px solid " + C.border, borderLeft: "3px solid " + gymDp.color }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: gymDp.color, marginBottom: 8 }}>{gDay} · S{w}</div>
                  {mData.sections.map((sec, sIdx) =>
                    sec.exercises.map((ex, eIdx) => {
                      const log = entry.logs[logKey(sIdx, eIdx)];
                      const comment = entry.comments ? entry.comments[logKey(sIdx, eIdx)] : null;
                      if (!log || (!log.kg && !log.reps)) return null;
                      return (
                        <div key={sIdx + "_" + eIdx} style={{ marginBottom: comment ? 6 : 4 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: C.muted, flex: 1 }}>{ex.name}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
                              {log.kg ? log.kg + " " + (ex.unit || "kg") : ""}
                              {log.kg && log.reps ? " × " : ""}
                              {log.reps ? log.reps + " reps" : ""}
                            </span>
                          </div>
                          {comment && <p style={{ margin: "2px 0 0 0", fontSize: 11, color: C.muted, fontStyle: "italic" }}>💬 {comment}</p>}
                        </div>
                      );
                    })
                  )}
                </div>
              );
            }))}
          </div>
        );
      })}

      {Object.keys(saved).filter(k => k.indexOf("day_") === 0 || k.indexOf("s_") === 0).length === 0 && (
        <p style={{ color: C.muted, fontSize: 14, textAlign: "center", padding: "32px 0" }}>Todavía no registraste ninguna actividad.</p>
      )}
    </div>
  );

  return null;
}