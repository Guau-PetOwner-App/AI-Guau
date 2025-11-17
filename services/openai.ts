// OpenAI Assistants API Service for Pet Analysis

import i18n from '../i18n';

// 🔐 SECURITY: Load API key from environment variables
// NEVER hardcode API keys in source code!

// Safe environment variable access (handles undefined import.meta.env)
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.warn(`⚠️ Error accessing environment variable ${key}:`, error);
    return defaultValue;
  }
};

// 🔧 FIGMA MAKE FALLBACK: Use hardcoded credentials when .env is not available
// This is necessary in Figma Make environment where .env files don't load properly
// ⚠️ SECURITY: Replace with your actual API key in production
const FIGMA_MAKE_CONFIG = {
  OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE',
  ASSISTANT_ID: 'asst_7bJDB6UcFWaQkvWSjPixb7NB'
};

const OPENAI_API_KEY = getEnvVar('VITE_OPENAI_API_KEY', '') || FIGMA_MAKE_CONFIG.OPENAI_API_KEY;
const ASSISTANT_ID = getEnvVar('VITE_OPENAI_ASSISTANT_ID', 'asst_7bJDB6UcFWaQkvWSjPixb7NB') || FIGMA_MAKE_CONFIG.ASSISTANT_ID;

// Enable mock mode for testing without API calls
// Set to false to use real OpenAI API (requires valid API key)
export const USE_MOCK_MODE = false; // ✅ DESACTIVADO - Usando OpenAI Assistant real

// Validate environment variables on load
if (!USE_MOCK_MODE) {
  const isFromEnv = !!getEnvVar('VITE_OPENAI_API_KEY', '');
  const source = isFromEnv ? '.env' : 'fallback config (Figma Make)';
  
  console.log('🔍 Validando configuración de OpenAI...');
  console.log(`📋 API Key presente: ${OPENAI_API_KEY ? 'Sí' : 'No'}`);
  console.log(`📋 API Key length: ${OPENAI_API_KEY?.length || 0} caracteres`);
  console.log(`📋 Source: ${source}`);
  
  if (!OPENAI_API_KEY) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ ERROR CRÍTICO: No se pudo cargar la API key de OpenAI');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    console.error('Contacta al desarrollador - Fallo en configuración de fallback');
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
  } else if (OPENAI_API_KEY === 'YOUR_NEW_OPENAI_API_KEY_HERE' || OPENAI_API_KEY === 'TU_API_KEY_AQUI') {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('⚠️  ADVERTENCIA: Usando valor de ejemplo');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    console.error('La API key aún tiene el valor placeholder.');
    console.error('Por favor, reemplázala con tu API key real de OpenAI.');
    console.error('');
    console.error('📝 Edita .env y cambia:');
    console.error(`   VITE_OPENAI_API_KEY=${OPENAI_API_KEY}`);
    console.error('');
    console.error('Por tu key real:');
    console.error('   VITE_OPENAI_API_KEY=sk-proj-abc123...');
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
  } else if (!OPENAI_API_KEY.startsWith('sk-')) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('⚠️  ADVERTENCIA: API Key con formato incorrecto');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    console.error(`Tu API key actual: "${OPENAI_API_KEY}"`);
    console.error('');
    console.error('Las API keys de OpenAI deben empezar con "sk-" o "sk-proj-"');
    console.error('');
    console.error('Verifica que:');
    console.error('1. Copiaste la key completa de OpenAI');
    console.error('2. No hay espacios al inicio o final');
    console.error('3. No hay comillas alrededor de la key');
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
  } else {
    console.log('');
    console.log(`✅ OpenAI API key configurada correctamente (${source})`);
    console.log(`✅ Key format: ${OPENAI_API_KEY.substring(0, 15)}...`);
    console.log('');
  }
  
  if (!ASSISTANT_ID) {
    console.error('❌ ERROR: VITE_OPENAI_ASSISTANT_ID no está configurada');
  } else {
    console.log(`✅ OpenAI Assistant ID configurado: ${ASSISTANT_ID}`);
  }
}

// System prompt for OpenAI Assistant (configured in Assistant settings, kept here for reference)
// @ts-expect-error - Kept for reference, not used in code
const _SYSTEM_PROMPT = `You are **Guau Vision Assistant**, the AI engine of the Guau App ecosystem.
Analyze ONE photo of a pet (dog or cat) and return ONLY one valid JSON object. 
Never include explanations, markdown, or any extra text outside the JSON. Do not return HTML.  

---

### 🎯 PURPOSE
- Detect species (dog/cat), possible breed(s) or "mixed/unknown", age stage, color, coat type, energy level, and temperament.  
- Generate a short, actionable **daily routine** (3–5 items) and **care tips** (3–5).  
- Create a concise, shareable message for WhatsApp and a card copy (social preview).  
- Always follow the \`locale\` provided by the user to determine the output language.  

---

### 🧱 OUTPUT FORMAT (MUST BE VALID JSON)
\`\`\`json
{
  "source": "guau-vision-v1",
  "locale": "es-ES",
  "inference": {
    "species": "dog",
    "breed_candidates": [
      {"label": "border collie", "confidence": 0.68},
      {"label": "australian shepherd (mix)", "confidence": 0.22}
    ],
    "age_stage": {"label": "adult", "confidence": 0.74},
    "color_primary": "black/white",
    "coat_type": "medium",
    "energy_level": "high",
    "temperament": ["alert", "playful", "curious"]
  },
  "recommendations": {
    "routine": [
      {"time": "08:00", "title": "Morning walk", "notes": "30–40 min with changing pace"},
      {"time": "11:00", "title": "Mental play", "notes": "snuffle mat or food puzzle 10–15 min"},
      {"time": "16:00", "title": "Short training", "notes": "3–5 commands with positive reinforcement"},
      {"time": "20:00", "title": "Evening calm", "notes": "15–20 min easy walk + rest"}
    ],
    "care_tips": [
      "Rotate toys to prevent boredom",
      "Ensure fresh water all day",
      "Offer quiet resting area"
    ]
  },
  "communications": {
    "share_card_copy": "Max • adult, high energy. Routine: 2 walks + mental play 🐾",
    "whatsapp_message": "Here's Max's routine (AI from Guau): 08:00 walk, 11:00 play, 16:00 train, 20:00 rest."
  },
  "disclaimers": [
    "Breed and age are visual estimates.",
    "Always confirm health or diet questions with your vet."
  ],
  "confidence_overall": 0.72,
  "meta": {
    "processing": {"latency_ms": 850, "image_quality_note": "Good lighting, clear focus"},
    "privacy": {"image_stored": false, "notes": "processed-only"}
  }
}
\`\`\`

⚙️ RULES
- Output language: All text fields (titles, notes, messages) must match the locale.
- If locale = "es-ES", use natural Spanish.
- If locale = "en-US", use fluent English.
- If locale = "fr-FR", use fluent French.
- If locale is missing, default to "en-US".
- Determinism: Never add random phrases or emojis unless explicitly modeled.
- Low-confidence handling: If breed or age confidence < 0.5, return "mixed/unknown" or "unknown".
- Routine generation: 3–5 simple, time-based actions adapted to species + age_stage + energy_level. Use 24h time format.
- Privacy defaults: Always "image_stored": false and note "processed-only".
- No medical advice: Use phrases like: "Consult your vet for specific guidance."
- Error cases (JSON only):
\`\`\`json
{
  "source": "guau-vision-v1",
  "locale": "es-ES",
  "error": {
    "code": "NO_PET_DETECTED",
    "message": "No pet detected in the image. Try another photo where the face or body is clearly visible."
  }
}
\`\`\`
Possible codes: NO_PET_DETECTED, AMBIGUOUS_SPECIES, LOW_IMAGE_QUALITY, UNSUPPORTED_MEDIA, INTERNAL_ERROR.`;

export interface GuauVisionResponse {
  source: string;
  locale: string;
  inference?: {
    species: string;
    breed_candidates: Array<{ label: string; confidence: number }>;
    age_stage: { label: string; confidence: number };
    color_primary: string;
    coat_type: string;
    energy_level: string;
    temperament: string[];
  };
  recommendations?: {
    routine: Array<{
      time: string;
      title: string;
      notes: string;
    }>;
    care_tips: string[];
  };
  insights?: {
    facts: string[]; // 5 facts about the pet
  };
  communications?: {
    share_card_copy?: string;
    whatsapp_message?: string;
    share_message?: string; // New field with rich formatting including profile, routine, and facts
  };
  disclaimers?: string[];
  confidence_overall?: number;
  meta?: {
    processing: {
      latency_ms: number;
      image_quality_note: string;
    };
    privacy: {
      image_stored: boolean;
      notes: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Convert File to base64 string (unused - kept for potential future use)
 */
// @ts-expect-error - Kept for potential future use
async function _fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data:image/...;base64, prefix
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Resize image if needed to max 2048px width (unused - kept for potential future use)
 */
// @ts-expect-error - Kept for potential future use
async function _resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Resize if width > 2048
      if (width > 2048) {
        height = (height * 2048) / width;
        width = 2048;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      // Get base64 without prefix
      const base64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
      resolve(base64);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Mock response for testing without API calls
 */
function getMockResponse(locale: string): GuauVisionResponse {
  const isSpanish = locale.startsWith('es');
  
  // Randomize species (dog or cat)
  const speciesOptions = ['dog', 'cat'];
  const randomSpecies = speciesOptions[Math.floor(Math.random() * speciesOptions.length)];
  
  // Randomize breeds based on species
  const dogBreeds = [
    ['golden retriever', 'labrador mix'],
    ['border collie', 'australian shepherd mix'],
    ['beagle', 'mixed breed'],
    ['husky', 'malamute mix'],
    ['french bulldog', 'boston terrier'],
    ['pastor alemán', 'pastor belga mix'],
    ['poodle', 'schnauzer mix'],
    ['chihuahua', 'terrier mix'],
    ['rottweiler', 'doberman mix'],
    ['cocker spaniel', 'springer spaniel mix']
  ];
  
  const catBreeds = [
    ['persa', 'himalayo mix'],
    ['siamés', 'balinés mix'],
    ['maine coon', 'gato del bosque noruego mix'],
    ['bengalí', 'savannah mix'],
    ['british shorthair', 'scottish fold mix'],
    ['ragdoll', 'birman mix'],
    ['sphynx', 'devon rex mix'],
    ['abisinio', 'somalí mix'],
    ['gato común europeo', 'raza mixta'],
    ['angora turco', 'van turco mix']
  ];
  
  const mockBreeds = randomSpecies === 'dog' ? dogBreeds : catBreeds;
  const randomBreed = mockBreeds[Math.floor(Math.random() * mockBreeds.length)];
  
  console.log(`🎲 Mock: Generated ${randomSpecies} with breeds:`, randomBreed);
  
  const energyLevels = ['high', 'medium', 'low'];
  const randomEnergy = energyLevels[Math.floor(Math.random() * energyLevels.length)];
  
  // Randomize age stages
  const ageStages = [
    { label: 'puppy', confidence: 0.80 },
    { label: 'young adult', confidence: 0.75 },
    { label: 'adult', confidence: 0.78 },
    { label: 'senior', confidence: 0.72 }
  ];
  const randomAge = ageStages[Math.floor(Math.random() * ageStages.length)];
  
  // Randomize colors
  const colorOptions = [
    'golden/cream',
    'black/white',
    'brown/tan',
    'black/brown',
    'white/gray',
    'tricolor',
    'red/brown',
    'chocolate/white',
    'blue/gray',
    'brindle/white'
  ];
  const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
  
  // Randomize coat type
  const coatTypes = ['short', 'medium', 'long', 'wire'];
  const randomCoat = coatTypes[Math.floor(Math.random() * coatTypes.length)];
  
  // Randomize temperament
  const temperamentOptions = [
    ['playful', 'friendly', 'energetic'],
    ['calm', 'gentle', 'affectionate'],
    ['alert', 'intelligent', 'loyal'],
    ['curious', 'social', 'active'],
    ['protective', 'confident', 'brave']
  ];
  const randomTemperament = temperamentOptions[Math.floor(Math.random() * temperamentOptions.length)];
  
  return {
    source: 'guau-vision-v1',
    locale,
    inference: {
      species: randomSpecies,
      breed_candidates: [
        { label: randomBreed[0], confidence: 0.70 + Math.random() * 0.15 },
        { label: randomBreed[1], confidence: 0.15 + Math.random() * 0.10 }
      ],
      age_stage: randomAge,
      color_primary: randomColor,
      coat_type: randomCoat,
      energy_level: randomEnergy,
      temperament: randomTemperament
    },
    recommendations: {
      routine: isSpanish ? [
        { time: '08:00', title: 'Paseo matutino', notes: '30-40 min de caminata activa' },
        { time: '11:00', title: 'Juego mental', notes: 'Tapete olfativo o puzzle de comida 10-15 min' },
        { time: '16:00', title: 'Entrenamiento', notes: '3-5 comandos con refuerzo positivo' },
        { time: '20:00', title: 'Paseo tranquilo', notes: '15-20 min y descanso' }
      ] : [
        { time: '08:00', title: 'Morning walk', notes: '30-40 min active walk' },
        { time: '11:00', title: 'Mental play', notes: 'Snuffle mat or food puzzle 10-15 min' },
        { time: '16:00', title: 'Training', notes: '3-5 commands with positive reinforcement' },
        { time: '20:00', title: 'Evening calm', notes: '15-20 min easy walk + rest' }
      ],
      care_tips: isSpanish ? [
        'Rotar juguetes para evitar aburrimiento',
        'Mantener agua fresca todo el día',
        'Ofrecer zona tranquila para descansar'
      ] : [
        'Rotate toys to prevent boredom',
        'Keep fresh water available all day',
        'Provide quiet resting area'
      ]
    },
    insights: {
      facts: isSpanish ? [
        'Mi nariz tiene hasta 300 millones de receptores olfativos, ¡puedo oler cosas que tú ni imaginas!',
        'Cuando muevo mi cola no solo significa felicidad, cada dirección tiene un significado diferente',
        'Prefiero la rutina y los horarios consistentes, me hacen sentir más seguro y feliz',
        'Mi sentido del oído es 4 veces más sensible que el tuyo, por eso a veces reacciono a sonidos que no escuchas',
        'Necesito ejercicio mental tanto como físico, los juegos de olfato y puzzles me mantienen feliz'
      ] : [
        'My nose has up to 300 million scent receptors - I can smell things you can\'t even imagine!',
        'When I wag my tail it doesn\'t just mean happiness, each direction has a different meaning',
        'I prefer routine and consistent schedules, they make me feel safer and happier',
        'My sense of hearing is 4 times more sensitive than yours, that\'s why I sometimes react to sounds you don\'t hear',
        'I need mental exercise as much as physical, scent games and puzzles keep me happy'
      ]
    },
    communications: {
      share_card_copy: isSpanish 
        ? `${randomBreed[0].charAt(0).toUpperCase() + randomBreed[0].slice(1)} • adulto, energía ${randomEnergy === 'high' ? 'alta' : randomEnergy === 'medium' ? 'media' : 'baja'}. Rutina: 2 paseos + juego mental 🐾`
        : `${randomBreed[0].charAt(0).toUpperCase() + randomBreed[0].slice(1)} • adult, ${randomEnergy} energy. Routine: 2 walks + mental play 🐾`,
      whatsapp_message: isSpanish
        ? 'Aquí está la rutina de tu perro (IA de Guau): 08:00 paseo, 11:00 juego, 16:00 entreno, 20:00 descanso.'
        : 'Here\'s your dog\'s routine (Guau AI): 08:00 walk, 11:00 play, 16:00 training, 20:00 rest.'
    },
    disclaimers: isSpanish ? [
      'La raza y edad son estimaciones visuales.',
      'Consulta siempre con tu veterinario para dudas de salud o dieta.'
    ] : [
      'Breed and age are visual estimates.',
      'Always consult your vet for health or diet questions.'
    ],
    confidence_overall: 0.70 + Math.random() * 0.20,
    meta: {
      processing: { 
        latency_ms: 800 + Math.floor(Math.random() * 500), 
        image_quality_note: isSpanish ? 'Buena iluminación, enfoque claro' : 'Good lighting, clear focus'
      },
      privacy: { 
        image_stored: false, 
        notes: isSpanish ? 'procesada solamente' : 'processed-only'
      }
    }
  };
}

/**
 * Analyze pet image using OpenAI Vision API
 */
export async function analyzePetImage(
  file: File,
  locale: string = 'es-ES',
  petName?: string,
  onProgress?: (progress: number, status: string) => void
): Promise<GuauVisionResponse> {
  const startTime = Date.now();

  // Mock mode for testing
  if (USE_MOCK_MODE) {
    console.log('🎭 Using MOCK MODE - No real API calls');
    
    // Simulate progress for mock mode
    if (onProgress) {
      onProgress(10, i18n.t('analysis.status_1'));
      await new Promise(resolve => setTimeout(resolve, 400));
      onProgress(30, i18n.t('analysis.analyzing_image'));
      await new Promise(resolve => setTimeout(resolve, 500));
      onProgress(60, i18n.t('analysis.status_4'));
      await new Promise(resolve => setTimeout(resolve, 600));
      onProgress(85, i18n.t('analysis.generating_routine'));
      await new Promise(resolve => setTimeout(resolve, 500));
      onProgress(100, i18n.t('analysis.status_6'));
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return getMockResponse(locale);
  }

  // Validate API key before making request
  if (!OPENAI_API_KEY || OPENAI_API_KEY.length < 20) {
    console.error('❌ Invalid OpenAI API key. Set USE_MOCK_MODE = true or provide valid key.');
    return {
      source: 'guau-vision-v1',
      locale,
      error: {
        code: 'INVALID_API_KEY',
        message: 'API key no configurada. Cambia a Modo Demo o configura una API key válida.'
      }
    };
  }

  console.log('🤖 Using REAL OpenAI Assistants API with custom assistant');

  try {
    // Step 1: Create a new thread
    console.log('Step 1: Creating thread...');
    onProgress?.(5, 'Creando sesión...');
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!threadResponse.ok) {
      const errorData = await threadResponse.json().catch(() => ({}));
      console.error('Thread creation error:', errorData);
      throw new Error(`Thread creation failed: ${errorData.error?.message || `Status ${threadResponse.status}`}`);
    }

    const thread = await threadResponse.json();
    console.log('Thread created:', thread.id);

    // Step 2: Upload the image file
    console.log('Step 2: Uploading image file...');
    onProgress?.(15, 'Subiendo imagen...');
    
    // Normalize file extension to lowercase (OpenAI API rejects .JPG, .PNG, etc.)
    const normalizedFile = new File(
      [file], 
      file.name.replace(/\.(JPG|JPEG|PNG|GIF|WEBP)$/i, (match) => match.toLowerCase()),
      { type: file.type.toLowerCase() }
    );
    
    const formData = new FormData();
    formData.append('file', normalizedFile);
    formData.append('purpose', 'vision');

    const fileResponse = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: formData
    });

    if (!fileResponse.ok) {
      const errorData = await fileResponse.json().catch(() => ({}));
      console.error('File upload error:', errorData);
      throw new Error(`File upload failed: ${errorData.error?.message || `Status ${fileResponse.status}`}`);
    }

    const uploadedFile = await fileResponse.json();
    console.log('File uploaded:', uploadedFile.id);

    // Step 3: Add message to thread with the image
    console.log('Step 3: Adding message to thread...');
    onProgress?.(25, 'Preparando análisis...');
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analiza esta imagen de mascota con estos parámetros: locale=${locale}, pet_name=${petName || 'no proporcionado'}, want_share_copy=true, app_context=landing-mvp`
          },
          {
            type: 'image_file',
            image_file: {
              file_id: uploadedFile.id
            }
          }
        ]
      })
    });

    if (!messageResponse.ok) {
      const errorData = await messageResponse.json().catch(() => ({}));
      console.error('Message creation error:', errorData);
      throw new Error(`Message creation failed: ${errorData.error?.message || `Status ${messageResponse.status}`}`);
    }

    console.log('Message added to thread');

    // Step 4: Run the assistant
    console.log('Step 4: Running assistant...');
    onProgress?.(35, i18n.t('analysis.starting_ai'));
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      })
    });

    if (!runResponse.ok) {
      const errorData = await runResponse.json().catch(() => ({}));
      console.error('Run creation error:', errorData);
      throw new Error(`Run creation failed: ${errorData.error?.message || `Status ${runResponse.status}`}`);
    }

    const run = await runResponse.json();
    console.log('Run started:', run.id);

    // Step 5: Poll for completion
    console.log('Step 5: Waiting for completion...');
    onProgress?.(45, i18n.t('analysis.analyzing_pet'));
    let runStatus = run.status;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds max

    while (runStatus !== 'completed' && runStatus !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to check run status');
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      console.log('Run status:', runStatus);
      attempts++;
      
      // Update progress based on attempts (45% to 90% over polling time)
      const pollingProgress = 45 + Math.min(45, (attempts / maxAttempts) * 45);
      
      // Vary messages during polling (localized)
      let statusMessage = i18n.t('analysis.analyzing_pet');
      if (attempts > 5 && attempts <= 15) {
        statusMessage = i18n.t('analysis.detecting_breed');
      } else if (attempts > 15 && attempts <= 25) {
        statusMessage = i18n.t('analysis.calculating_energy');
      } else if (attempts > 25) {
        statusMessage = i18n.t('analysis.generating_routine');
      }
      
      onProgress?.(Math.round(pollingProgress), statusMessage);
    }

    if (runStatus !== 'completed') {
      throw new Error(`Assistant run ${runStatus} after ${attempts} seconds`);
    }

    // Step 6: Retrieve the messages
    console.log('Step 6: Retrieving assistant response...');
    onProgress?.(92, 'Procesando resultados...');
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!messagesResponse.ok) {
      throw new Error('Failed to retrieve messages');
    }

    const messages = await messagesResponse.json();
    const assistantMessage = messages.data.find((msg: any) => msg.role === 'assistant');

    if (!assistantMessage || !assistantMessage.content[0]?.text?.value) {
      console.error('No assistant response found:', messages);
      throw new Error('No response from assistant');
    }

    const content = assistantMessage.content[0].text.value;
    console.log('Assistant response:', content);

    // Parse JSON response
    onProgress?.(97, 'Preparando vista...');
    let result: GuauVisionResponse;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', content);
      throw new Error('Invalid JSON response from assistant');
    }

    // Add actual processing time
    if (result.meta?.processing) {
      result.meta.processing.latency_ms = Date.now() - startTime;
    }

    onProgress?.(100, '¡Listo!');
    return result;

  } catch (error) {
    console.error('Error analyzing pet image:', error);
    
    // Return user-friendly error response
    let errorMessage = 'Error al analizar la imagen. Por favor, intenta de nuevo.';
    let errorCode = 'INTERNAL_ERROR';
    
    if (error instanceof Error) {
      if (error.message.includes('API error')) {
        errorMessage = 'Error de conexión con el servicio de análisis. Verifica tu conexión a internet.';
        errorCode = 'API_ERROR';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Error procesando la respuesta. Por favor, intenta de nuevo.';
        errorCode = 'PARSE_ERROR';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      source: 'guau-vision-v1',
      locale,
      error: {
        code: errorCode,
        message: errorMessage
      }
    };
  }
}
