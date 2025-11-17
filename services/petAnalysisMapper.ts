import { GuauVisionResponse } from './openai';
import { PetAnalysis } from '../App';

// Map energy level to icon name
const getEnergyIconName = (energyLevel: string): string => {
  const level = energyLevel.toLowerCase();
  if (level.includes('high') || level.includes('alta')) return 'activity';
  if (level.includes('medium') || level.includes('media')) return 'footprints';
  return 'home'; // low energy
};

// Map routine activity to icon name
const getRoutineIconName = (title: string, notes: string): string => {
  const text = `${title} ${notes}`.toLowerCase();
  
  if (text.includes('walk') || text.includes('paseo') || text.includes('correr')) {
    return 'footprints';
  }
  if (text.includes('play') || text.includes('juego') || text.includes('jugar')) {
    return 'gamepad2';
  }
  if (text.includes('training') || text.includes('entrena') || text.includes('mental')) {
    return 'brain';
  }
  if (text.includes('food') || text.includes('comida') || text.includes('eat')) {
    return 'coffee';
  }
  if (text.includes('rest') || text.includes('descanso') || text.includes('sleep') || text.includes('calm')) {
    return 'home';
  }
  
  return 'activity'; // default
};

// Map age stage to readable format
const formatAgeStage = (ageStage: string, locale: string): string => {
  const stage = ageStage.toLowerCase();
  
  if (locale.startsWith('es')) {
    if (stage.includes('puppy') || stage.includes('kitten')) return 'Cachorro (< 1 año)';
    if (stage.includes('young') || stage.includes('junior')) return 'Joven (1-2 años)';
    if (stage.includes('adult')) return 'Adulto (2-7 años)';
    if (stage.includes('senior')) return 'Senior (7+ años)';
    return 'Adulto';
  } else if (locale.startsWith('fr')) {
    if (stage.includes('puppy') || stage.includes('kitten')) return 'Chiot/Chaton (< 1 an)';
    if (stage.includes('young') || stage.includes('junior')) return 'Jeune (1-2 ans)';
    if (stage.includes('adult')) return 'Adulte (2-7 ans)';
    if (stage.includes('senior')) return 'Senior (7+ ans)';
    return 'Adulte';
  } else {
    // English (default)
    if (stage.includes('puppy') || stage.includes('kitten')) return 'Puppy (< 1 year)';
    if (stage.includes('young') || stage.includes('junior')) return 'Young (1-2 years)';
    if (stage.includes('adult')) return 'Adult (2-7 years)';
    if (stage.includes('senior')) return 'Senior (7+ years)';
    return 'Adult';
  }
};

// Map energy level to readable format
const formatEnergyLevel = (energyLevel: string, locale: string): string => {
  const level = energyLevel.toLowerCase();
  
  if (locale.startsWith('es')) {
    if (level.includes('high') || level.includes('very')) return 'Alta';
    if (level.includes('medium') || level.includes('moderate')) return 'Media';
    if (level.includes('low')) return 'Baja';
    return 'Media';
  } else if (locale.startsWith('fr')) {
    if (level.includes('high') || level.includes('very')) return 'Élevée';
    if (level.includes('medium') || level.includes('moderate')) return 'Moyenne';
    if (level.includes('low')) return 'Faible';
    return 'Moyenne';
  } else {
    // English (default)
    if (level.includes('high') || level.includes('very')) return 'High';
    if (level.includes('medium') || level.includes('moderate')) return 'Medium';
    if (level.includes('low')) return 'Low';
    return 'Medium';
  }
};

/**
 * Map OpenAI Guau Vision response to app's PetAnalysis format
 */
export function mapGuauVisionToPetAnalysis(
  response: GuauVisionResponse,
  imageUrl: string
): PetAnalysis | null {
  // Handle error responses
  if (response.error) {
    throw new Error(response.error.message);
  }

  // Validate required fields
  if (!response.inference || !response.recommendations) {
    throw new Error('Respuesta incompleta de la API');
  }

  const { inference, recommendations } = response;
  const locale = response.locale || 'es-ES';

  console.log('📊 Mapping analysis:', {
    species: inference.species,
    breeds: inference.breed_candidates,
    age: inference.age_stage,
    colors: inference.color_primary,
    energy: inference.energy_level
  });

  // Format species
  const species = inference.species === 'dog' 
    ? (locale.startsWith('es') ? 'Perro' : 'Dog')
    : (locale.startsWith('es') ? 'Gato' : 'Cat');

  // Extract breeds
  const breeds = inference.breed_candidates
    .filter(b => b.confidence > 0.15) // Only include breeds with >15% confidence
    .slice(0, 3) // Max 3 breeds
    .map(b => {
      // Capitalize first letter of each word
      return b.label.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    });

  // If no confident breeds, use "Mixed" or "Desconocido"
  if (breeds.length === 0) {
    breeds.push(locale.startsWith('es') ? 'Raza Mixta' : 'Mixed Breed');
  }

  // Extract colors from primary color
  const colors = inference.color_primary
    .split('/')
    .map(c => c.trim())
    .map(c => c.charAt(0).toUpperCase() + c.slice(1));

  // Format age
  const age = formatAgeStage(inference.age_stage.label, locale);

  // Format energy level
  const energyLevel = formatEnergyLevel(inference.energy_level, locale);

  // Build personality from temperament and care tips
  let personality = inference.temperament
    .slice(0, 3)
    .map(t => t.charAt(0).toUpperCase() + t.slice(1))
    .join(', ');
  
  // Add a care tip as additional personality note if available
  if (recommendations.care_tips.length > 0) {
    personality += '. ' + recommendations.care_tips[0];
  }

  // Map routine
  const routine = recommendations.routine.map(item => ({
    time: item.time,
    activity: `${item.title}: ${item.notes}`,
    iconName: getRoutineIconName(item.title, item.notes)
  }));

  return {
    species,
    breeds,
    age,
    energyLevel,
    colors,
    personality,
    routine,
    imageUrl,
    // Additional fields from Assistant
    whatsappMessage: response.communications?.share_message || response.communications?.whatsapp_message, // New field: share_message
    shareCardCopy: response.communications?.share_card_copy,
    disclaimers: response.disclaimers,
    confidence: response.confidence_overall,
    coatType: inference.coat_type,
    facts: response.insights?.facts || [] // Extract facts from Assistant response (insights.facts)
  };
}

/**
 * Get share message from Guau Vision response
 * Now uses the new 'share_message' field with rich formatting
 */
export function getWhatsAppMessage(response: GuauVisionResponse): string {
  // Try new field first (share_message), then fallback to old field (whatsapp_message)
  if (response.communications?.share_message) {
    return response.communications.share_message;
  }
  
  if (response.communications?.whatsapp_message) {
    return response.communications.whatsapp_message;
  }

  // Fallback message
  const locale = response.locale || 'es-ES';
  if (locale.startsWith('es')) {
    return '¡Mira el análisis de mi mascota hecho con Guau App! Descubre la rutina ideal para tu mascota en segundos.';
  } else {
    return 'Check out my pet\'s analysis made with Guau App! Discover your pet\'s ideal routine in seconds.';
  }
}
