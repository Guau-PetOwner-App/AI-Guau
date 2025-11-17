// 🐾 Facts divertidos de mascotas para mostrar durante el análisis
// Tono: Juguetón, educativo, Gen-Z friendly
// LOCALIZED: Now uses i18n translations

import i18n from './i18n';

export interface PetFact {
  text: string;
  emoji?: string;
}

// Sistema para evitar repetición
let remainingFacts: PetFact[] = [];
let allShownOnce = false;

/**
 * Get pet facts array based on current language
 */
function getPetFacts(): PetFact[] {
  try {
    const facts = i18n.t('pet_facts', { returnObjects: true }) as PetFact[];
    if (Array.isArray(facts) && facts.length > 0) {
      return facts;
    }
  } catch (error) {
    console.warn('Could not load translated pet facts, using fallback', error);
  }
  
  // Fallback to Spanish if translation fails
  return [
    { text: "Los perros pueden distinguir hasta 340 razas diferentes y cada una tiene necesidades únicas de ejercicio.", emoji: "🐕" },
    { text: "Un perro puede aprender más de 165 palabras, números y gestos. Los más inteligentes pueden aprender hasta 250!", emoji: "🧠" },
    { text: "Los perros sudan a través de sus patitas. Por eso dejan huellas húmedas en verano!", emoji: "🐾" },
    { text: "El olfato de un perro es 100,000 veces más potente que el de los humanos. Pueden oler tus emociones!", emoji: "👃" },
    { text: "Los cachorros nacen sordos, ciegos y sin dientes. Pero en 3 semanas ya son exploradores totales!", emoji: "🐶" },
  ];
}

export const petFacts: PetFact[] = getPetFacts();

// Legacy array kept for backward compatibility (will be replaced by getPetFacts)
// Note: This is kept for reference but not used - getPetFacts() is used instead
// @ts-expect-error - Legacy code kept for reference
const _legacyPetFacts: PetFact[] = [
  // 🐶 PERROS - Facts Divertidos
  {
    text: "Los perros pueden distinguir hasta 340 razas diferentes y cada una tiene necesidades únicas de ejercicio.",
    emoji: "🐕"
  },
  {
    text: "Un perro puede aprender más de 165 palabras, números y gestos. Los más inteligentes pueden aprender hasta 250!",
    emoji: "🧠"
  },
  {
    text: "Los perros sudan a través de sus patitas. Por eso dejan huellas húmedas en verano!",
    emoji: "🐾"
  },
  {
    text: "El olfato de un perro es 100,000 veces más potente que el de los humanos. Pueden oler tus emociones!",
    emoji: "👃"
  },
  {
    text: "Los cachorros nacen sordos, ciegos y sin dientes. Pero en 3 semanas ya son exploradores totales!",
    emoji: "🐶"
  },
  {
    text: "Un Golden Retriever puede llevar un huevo en la boca sin romperlo. Tan delicados como fuertes!",
    emoji: "🥚"
  },
  {
    text: "Los perros beben agua formando una cucharita con su lengua hacia atrás. Ingeniería canina!",
    emoji: "💧"
  },
  {
    text: "El perro más rápido del mundo (Greyhound) puede correr a 72 km/h. Más rápido que Usain Bolt!",
    emoji: "⚡"
  },
  {
    text: "Los perros tienen tres párpados: dos que ves y uno extra para proteger sus ojos mientras juegan.",
    emoji: "👁️"
  },
  {
    text: "Un año humano NO equivale a 7 años de perro. Los primeros 2 años cuentan más!",
    emoji: "📅"
  },
  {
    text: "Los Basset Hounds tienen más de 220 millones de receptores olfativos. Los humanos solo 5 millones!",
    emoji: "🔍"
  },
  {
    text: "Los perros inclinan la cabeza cuando les hablas para escucharte mejor y leer tus expresiones.",
    emoji: "🤔"
  },
  {
    text: "La nariz de cada perro es única, como nuestras huellas dactilares. Son irrepetibles!",
    emoji: "🐽"
  },
  {
    text: "Los Huskies pueden correr más de 160 km en un día sin cansarse. Son maratonistas naturales!",
    emoji: "🏃"
  },
  {
    text: "Los perros sueñan igual que nosotros. Si los ves mover las patas, están corriendo en sus sueños!",
    emoji: "💤"
  },
  
  // 🐱 GATOS - Facts Divertidos
  {
    text: "Los gatos pasan el 70% de su vida durmiendo. Eso es como 13-16 horas al día de siesta!",
    emoji: "😴"
  },
  {
    text: "Un gato puede rotar sus orejas 180 grados. Tienen 32 músculos en cada oreja!",
    emoji: "🐱"
  },
  {
    text: "Los gatos tienen más de 100 sonidos vocales. Los perros solo tienen 10!",
    emoji: "🗣️"
  },
  {
    text: "El ronroneo de un gato vibra a 25-150 Hz, frecuencia que puede ayudar a sanar huesos y tejidos.",
    emoji: "💖"
  },
  {
    text: "Los gatos pueden saltar hasta 6 veces su altura. Son atletas olímpicos naturales!",
    emoji: "🤸"
  },
  {
    text: "Un gato tiene más huesos que un humano: 230 huesos vs 206. Por eso son tan flexibles!",
    emoji: "🦴"
  },
  {
    text: "Los gatos sudan solo por sus patitas. Por eso cuando están nerviosos dejan huellas húmedas!",
    emoji: "🐾"
  },
  {
    text: "El récord de ronroneo más fuerte es de 67.8 decibeles. Tan ruidoso como una conversación normal!",
    emoji: "📢"
  },
  {
    text: "Los gatos no pueden saborear lo dulce. No tienen los receptores para detectar azúcar!",
    emoji: "🍰"
  },
  {
    text: "Una gata puede quedar embarazada desde los 4 meses de edad. La esterilización es importante!",
    emoji: "⚕️"
  },
  {
    text: "Los gatos pasan el 30% de su tiempo despierto acicalándose. Son muy limpios!",
    emoji: "✨"
  },
  {
    text: "Un gato puede correr hasta 48 km/h en distancias cortas. Son velocistas de élite!",
    emoji: "💨"
  },
  {
    text: "Los gatos tienen un tercer párpado (membrana nictitante) que protege sus ojos mientras cazan.",
    emoji: "👀"
  },
  {
    text: "El maullido de los gatos es solo para humanos. Entre ellos se comunican con otros sonidos!",
    emoji: "🎵"
  },
  {
    text: "Los gatos tienen bigotes en las patas delanteras para detectar presas y obstáculos.",
    emoji: "📡"
  },
  
  // 🐾 PERROS Y GATOS - Facts Generales
  {
    text: "Las mascotas reducen el estrés en un 50%. Tu amigo peludo es tu mejor terapeuta!",
    emoji: "💆"
  },
  {
    text: "Los animales pueden detectar enfermedades antes que los médicos. Su olfato detecta cambios químicos!",
    emoji: "🏥"
  },
  {
    text: "Tener una mascota mejora tu sistema inmunológico. Los niños con mascotas tienen menos alergias!",
    emoji: "🛡️"
  },
  {
    text: "Las mascotas sincronizan su ritmo cardíaco con el de sus dueños. Conexión real!",
    emoji: "❤️"
  },
  {
    text: "Un estudio mostró que acariciar a tu mascota reduce tu presión arterial en minutos.",
    emoji: "🩺"
  },
  {
    text: "Las mascotas mejoran tu vida social. Los dueños de perros hacen más amigos en el parque!",
    emoji: "🤝"
  },
  {
    text: "Los animales pueden reconocer tu cara en fotos. Te reconocen aunque no estés presente!",
    emoji: "📸"
  },
  {
    text: "Las mascotas entienden tus emociones. Pueden detectar cuando estás triste o feliz!",
    emoji: "🎭"
  },
  {
    text: "Jugar 15 minutos con tu mascota libera serotonina y oxitocina. Felicidad instantánea!",
    emoji: "🎮"
  },
  {
    text: "Las mascotas tienen sentido del tiempo. Saben exactamente cuándo es hora de comer!",
    emoji: "⏰"
  },
  
  // 🐶 PERROS - Más Facts
  {
    text: "Los Corgis eran pastores de ganado. Sus patitas cortas evitaban las patadas de las vacas!",
    emoji: "🐄"
  },
  {
    text: "Los Dálmatas nacen completamente blancos. Sus manchas aparecen a las 2-3 semanas!",
    emoji: "⚪"
  },
  {
    text: "Los Chihuahuas tienen el cerebro más grande en proporción a su cuerpo de todos los perros.",
    emoji: "🧠"
  },
  {
    text: "Los Bloodhounds pueden seguir un rastro de olor de más de 300 horas. Detectives natos!",
    emoji: "🕵️"
  },
  {
    text: "Los perros de raza grande envejecen más rápido que los pequeños. La genética es curiosa!",
    emoji: "👴"
  },
  
  // 🐱 GATOS - Más Facts
  {
    text: "Los gatos anaranjados son mayormente machos (80%). Es genética ligada al cromosoma X!",
    emoji: "🧡"
  },
  {
    text: "Un gato llamado Stubbs fue alcalde de Talkeetna, Alaska por 20 años. Democracia felina!",
    emoji: "🎩"
  },
  {
    text: "Los gatos Siameses nacen blancos y van oscureciendo con el tiempo según la temperatura.",
    emoji: "🌡️"
  },
  {
    text: "Isaac Newton inventó la gatera (puerta para gatos) para que sus gatos no interrumpieran sus experimentos.",
    emoji: "🚪"
  },
  {
    text: "El gato más longevo vivió 38 años. Se llamaba Creme Puff y vivió en Texas!",
    emoji: "🎂"
  },

  // 🐶 PERROS - Facts Adicionales
  {
    text: "Los Beagles tienen más de 220 millones de receptores olfativos. Por eso son excelentes rastreadores!",
    emoji: "🔬"
  },
  {
    text: "Los Huskies Siberianos pueden cambiar su metabolismo para correr largas distancias sin cansarse.",
    emoji: "🏔️"
  },
  {
    text: "Los Border Collies son considerados los perros más inteligentes. Pueden aprender un comando en 5 repeticiones!",
    emoji: "🎓"
  },
  {
    text: "Los perros pueden detectar cáncer, diabetes y ataques epilépticos antes de que ocurran.",
    emoji: "🏥"
  },
  {
    text: "Un Labrador llamado Endal podía usar un cajero automático. Los perros pueden ser muy inteligentes!",
    emoji: "💳"
  },
  {
    text: "Los Pug y Bulldogs roncan porque tienen narices chatas. Es normal en razas braquicéfalas!",
    emoji: "😴"
  },
  {
    text: "Los Samoyedos tienen una 'sonrisa Sammie' natural que evita que babeen cuando hace frío.",
    emoji: "😊"
  },
  {
    text: "Los perros pueden ver en la oscuridad mucho mejor que los humanos gracias a sus ojos reflectantes.",
    emoji: "🌙"
  },
  {
    text: "Un Doberman puede alcanzar su máxima velocidad en solo 3 zancadas. Son atletas natos!",
    emoji: "🏃‍♂️"
  },
  {
    text: "Los Terranova son nadadores naturales con patas palmeadas. Incluso rescatan personas en el agua!",
    emoji: "🌊"
  },
  {
    text: "Los Yorkshire Terriers eran originalmente cazadores de ratas en minas de carbón.",
    emoji: "⛏️"
  },
  {
    text: "Los Shar-Pei tienen una piel arrugada que los protegía de mordidas en peleas de perros.",
    emoji: "🐕‍🦺"
  },
  {
    text: "Los perros de trineo pueden correr en temperaturas de hasta -50°C sin congelarse!",
    emoji: "❄️"
  },
  {
    text: "Los Pastores Alemanes tienen más de 300 variaciones de ladridos para comunicarse.",
    emoji: "📢"
  },
  {
    text: "Los Shiba Inu tienen un grito especial llamado 'Shiba scream' que usan cuando están emocionados.",
    emoji: "😱"
  },

  // 🐱 GATOS - Facts Adicionales
  {
    text: "Los gatos pueden rotar sus orejas 180 grados independientemente. Son antenas naturales!",
    emoji: "📡"
  },
  {
    text: "Un gato de nombre Félicette fue el primer felino en ir al espacio en 1963. Astronauta felina!",
    emoji: "🚀"
  },
  {
    text: "Los gatos tienen un 'sentido del tiempo' tan preciso que pueden predecir rutinas con exactitud.",
    emoji: "⏱️"
  },
  {
    text: "Un gato puede saltar 5 veces su altura en un solo salto. Son máquinas de parkour!",
    emoji: "🤸‍♀️"
  },
  {
    text: "Los gatos Maine Coon pueden pesar hasta 11 kg. Son los gigantes gentiles del mundo felino!",
    emoji: "🦁"
  },
  {
    text: "Los gatos negros tienen más resistencia a ciertas enfermedades. La melanina los protege!",
    emoji: "🖤"
  },
  {
    text: "Un gato llamado Towser cazó más de 28,899 ratones en su vida. Récord Guinness!",
    emoji: "🏆"
  },
  {
    text: "Los gatos Sphynx no son completamente sin pelo. Tienen una textura como melocotón!",
    emoji: "🍑"
  },
  {
    text: "Los gatos Scottish Fold tienen orejas dobladas por una mutación genética natural.",
    emoji: "🧬"
  },
  {
    text: "Los gatos Bengala aman el agua, a diferencia de la mayoría de los gatos. Son únicos!",
    emoji: "💦"
  },
  {
    text: "Un gato puede hacer más de 100 sonidos vocales diferentes. Los perros solo 10!",
    emoji: "🎵"
  },
  {
    text: "Los gatos pasan el 15% de su vida acicalándose. Son muy limpios!",
    emoji: "🧼"
  },
  {
    text: "Los gatos tienen mejor visión nocturna que los humanos, pero peor visión de colores.",
    emoji: "🌃"
  },
  {
    text: "Un gato de granja puede mantener alejados a cientos de roedores de un granero.",
    emoji: "🌾"
  },
  {
    text: "Los gatos Ragdoll se relajan completamente cuando los cargas, como muñecos de trapo!",
    emoji: "🧸"
  },

  // 🐾 MASCOTAS - Comportamiento y Ciencia
  {
    text: "Las mascotas pueden detectar terremotos hasta 5 minutos antes de que ocurran.",
    emoji: "🌍"
  },
  {
    text: "Tener una mascota puede reducir el riesgo de enfermedades cardíacas hasta en un 24%.",
    emoji: "❤️‍🩹"
  },
  {
    text: "Los niños que crecen con mascotas desarrollan sistemas inmunológicos más fuertes.",
    emoji: "👶"
  },
  {
    text: "Las mascotas pueden aprender a reconocer hasta 100 palabras diferentes en su contexto.",
    emoji: "📚"
  },
  {
    text: "Los animales de terapia reducen la ansiedad en pacientes hasta en un 60%.",
    emoji: "🏥"
  },
  {
    text: "Las mascotas pueden sincronizar su ciclo de sueño con el de sus dueños.",
    emoji: "💤"
  },
  {
    text: "Un estudio mostró que hablarle a tu mascota mejora tu salud mental significativamente.",
    emoji: "💬"
  },
  {
    text: "Las mascotas pueden recordar eventos específicos hasta 5 años después.",
    emoji: "🧠"
  },
  {
    text: "Los animales domésticos pueden reconocer tu olor a kilómetros de distancia.",
    emoji: "👃"
  },
  {
    text: "Las mascotas tienen un 'sexto sentido' para detectar cambios de humor en sus dueños.",
    emoji: "🔮"
  },

  // 🐶 PERROS - Curiosidades Históricas
  {
    text: "Los perros fueron domesticados hace más de 15,000 años. Son nuestros mejores amigos ancestrales!",
    emoji: "🏛️"
  },
  {
    text: "En la antigua Grecia, los perros se usaban para guardar templos y tesoros.",
    emoji: "🏺"
  },
  {
    text: "Los perros Saluki son una de las razas más antiguas, con más de 7,000 años de historia!",
    emoji: "⏳"
  },
  {
    text: "Durante la Edad Media, los Mastiffs usaban armaduras en batallas. Guerreros caninos!",
    emoji: "⚔️"
  },
  {
    text: "Los Basenji son conocidos como 'perros sin ladrido' porque hacen un sonido de yodel.",
    emoji: "🎶"
  },

  // 🐱 GATOS - Curiosidades Históricas
  {
    text: "En el antiguo Egipto, matar a un gato era castigado con pena de muerte. Eran sagrados!",
    emoji: "🏺"
  },
  {
    text: "Los gatos fueron llevados en barcos para controlar plagas de ratas. Navegantes felinos!",
    emoji: "⛵"
  },
  {
    text: "En Japón, los gatos de la suerte (Maneki-neko) simbolizan fortuna y prosperidad.",
    emoji: "🎌"
  },
  {
    text: "Los vikingos tenían gatos como mascotas y símbolos de buena suerte en sus viajes.",
    emoji: "🛡️"
  },
  {
    text: "En la Edad Media, los gatos negros fueron perseguidos por supersticiones. Injusto!",
    emoji: "🏰"
  },

  // 🐾 MASCOTAS - Records y Extraordinarios
  {
    text: "El perro más grande del mundo medía 111 cm de altura. Era un Gran Danés llamado Zeus!",
    emoji: "📏"
  },
  {
    text: "El perro más pequeño del mundo cabe en una taza de té. Era un Chihuahua de 9.6 cm!",
    emoji: "☕"
  },
  {
    text: "El gato con el ronroneo más fuerte registró 67.8 decibeles. Tan ruidoso como una aspiradora!",
    emoji: "📢"
  },
  {
    text: "Un perro llamado Chaser conocía los nombres de 1,022 juguetes diferentes. Genio canino!",
    emoji: "🧩"
  },
  {
    text: "El perro más viejo vivió 29 años. Era un Pastor Australiano llamado Bluey!",
    emoji: "🎂"
  },
  {
    text: "Un gato llamado Didga puede hacer 24 trucos diferentes. Son más entrenables de lo que crees!",
    emoji: "🎪"
  },
  {
    text: "El salto más largo de un gato fue de 2.13 metros. Atletas olímpicos felinos!",
    emoji: "🥇"
  },
  {
    text: "Un Border Collie llamado Striker puede abrir una ventana de auto en 11.34 segundos!",
    emoji: "🚗"
  },
  {
    text: "El gato más largo del mundo medía 1.23 metros. Era un Maine Coon llamado Stewie!",
    emoji: "📐"
  },
  {
    text: "Un perro llamado Laika fue el primer ser vivo en orbitar la Tierra en 1957.",
    emoji: "🛸"
  },

  // 🐶 PERROS - Salud y Bienestar
  {
    text: "Pasear a tu perro 30 minutos al día reduce tu riesgo de obesidad en un 30%.",
    emoji: "🚶"
  },
  {
    text: "Los perros necesitan ejercicio mental tanto como físico. Los juguetes de puzzle son geniales!",
    emoji: "🧩"
  },
  {
    text: "Los dientes de un perro necesitan limpieza regular. La salud dental es importante!",
    emoji: "🦷"
  },
  {
    text: "Los perros pueden sufrir de estrés y ansiedad. Necesitan rutinas consistentes!",
    emoji: "😰"
  },
  {
    text: "Una dieta balanceada puede extender la vida de tu perro hasta 2 años más.",
    emoji: "🥗"
  },

  // 🐱 GATOS - Salud y Bienestar
  {
    text: "Los gatos necesitan rascadores para mantener sus uñas saludables y marcar territorio.",
    emoji: "🪵"
  },
  {
    text: "El agua corriente atrae más a los gatos. Las fuentes de agua los mantienen hidratados!",
    emoji: "⛲"
  },
  {
    text: "Los gatos necesitan jugar al menos 15 minutos al día para mantenerse saludables.",
    emoji: "🎯"
  },
  {
    text: "Una caja de arena por gato más una extra es la regla de oro para hogares felinos.",
    emoji: "📦"
  },
  {
    text: "Los gatos indoor viven en promedio 3 veces más que los gatos outdoor.",
    emoji: "🏠"
  },

  // 🐾 MASCOTAS - Comunicación
  {
    text: "Cuando tu perro te mira fijamente, está liberando oxitocina en ambos. Es amor real!",
    emoji: "😍"
  },
  {
    text: "El movimiento de cola de un perro a la derecha significa felicidad, a la izquierda es cautela.",
    emoji: "↔️"
  },
  {
    text: "Los gatos parpadean lentamente para decir 'te quiero'. Devuélveles el gesto!",
    emoji: "😊"
  },
  {
    text: "Cuando tu gato te amasa con las patas, está recordando la lactancia. Es puro amor!",
    emoji: "🐾"
  },
  {
    text: "Los perros bostezan cuando están estresados, no solo cuando tienen sueño.",
    emoji: "🥱"
  },
  {
    text: "Si tu gato te muestra la panza, confía completamente en ti. Es vulnerable!",
    emoji: "🤗"
  },
  {
    text: "Los perros inclinan la cabeza para escucharte mejor y entender tu tono emocional.",
    emoji: "🤔"
  },
  {
    text: "Cuando tu perro te trae juguetes, te está ofreciendo un regalo. Acéptalo con amor!",
    emoji: "🎁"
  },
  {
    text: "Los gatos frotan su cara contra ti para marcarte con sus feromonas. Eres de su familia!",
    emoji: "👨‍👩‍👧‍👦"
  },
  {
    text: "Si tu perro te sigue al baño, es porque para él eres parte de su manada. Te protege!",
    emoji: "🚽"
  }
];

/**
 * Obtiene un fact aleatorio de la lista (usando facts traducidos)
 */
export function getRandomFact(): PetFact {
  const facts = getPetFacts();
  const randomIndex = Math.floor(Math.random() * facts.length);
  return facts[randomIndex];
}

/**
 * Obtiene múltiples facts aleatorios sin repetir
 */
export function getRandomFacts(count: number): PetFact[] {
  const facts = getPetFacts();
  const shuffled = [...facts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, facts.length));
}

/**
 * Reinicia la cola de facts (para testing o nueva sesión)
 */
export function resetFactsQueue() {
  remainingFacts = [];
  allShownOnce = false;
}

/**
 * Obtiene un fact aleatorio que no sea el actual
 * Sistema mejorado: No repite facts hasta mostrar todos al menos una vez
 * LOCALIZED: Uses translated facts based on current i18n language
 */
export function getNextRandomFact(currentFactText?: string): PetFact {
  // Get current language facts
  const facts = getPetFacts();
  
  // Si no hay facts restantes, reiniciar la cola
  if (remainingFacts.length === 0) {
    remainingFacts = [...facts];
    
    if (allShownOnce) {
      console.log('🔄 Todos los facts mostrados. Reiniciando cola...');
    } else {
      allShownOnce = true;
    }
  }
  
  // Filtrar el fact actual de las opciones
  let availableFacts = remainingFacts;
  if (currentFactText) {
    availableFacts = remainingFacts.filter(f => f.text !== currentFactText);
    
    // Si solo queda el fact actual, usar todos
    if (availableFacts.length === 0) {
      availableFacts = remainingFacts;
    }
  }
  
  // Seleccionar fact aleatorio de los disponibles
  const randomIndex = Math.floor(Math.random() * availableFacts.length);
  const selectedFact = availableFacts[randomIndex];
  
  // Remover el fact seleccionado de la cola
  remainingFacts = remainingFacts.filter(f => f.text !== selectedFact.text);
  
  return selectedFact;
}
