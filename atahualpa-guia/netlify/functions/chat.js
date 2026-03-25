// netlify/functions/chat.js
// Esta función corre en los servidores de Netlify.
// La API Key de Groq NUNCA llega al navegador del turista.

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL    = 'llama3-8b-8192';

const KNOWLEDGE = `
INFORMACIÓN OFICIAL DEL CANTÓN ATAHUALPA — PROVINCIA DE PICHINCHA, ECUADOR

=== DESCRIPCIÓN GENERAL ===
Atahualpa es un cantón ubicado en la zona noroccidental de la Provincia de Pichincha, Ecuador.
Está asentado en las estribaciones de los Andes, con una altitud que varía entre los 1.400 y 4.000 msnm.
Limita al norte con la provincia de Imbabura, al sur con el cantón Pedro Moncayo, al este con Cayambe
y al oeste con el cantón Cotacachi.
Su cabecera cantonal es la parroquia Atahualpa (también conocida como Llurimagua).
La población es aproximadamente de 10.000 habitantes, en su mayoría mestiza e indígena.

=== PARROQUIAS ===
El cantón Atahualpa está compuesto por las siguientes parroquias:
- Atahualpa (cabecera cantonal)
- Chavezpamba
- Ingapi
- Pacto
- Nanegal
- Nanegalito
- Gualea

=== NATURALEZA Y ATRACTIVOS TURÍSTICOS ===
1. Bosque Nublado del Noroccidente: Zona de gran biodiversidad, con orquídeas, bromelias y aves endémicas.
2. Reserva Geobotánica Pululahua (cercanías): Cráter volcánico habitado, accesible desde la región.
3. Cascada de Nambillo: Imponente cascada rodeada de vegetación primaria.
4. Ríos y piscinas naturales: Aptos para pesca deportiva, rafting y natación en ríos cristalinos.
5. Senderos ecológicos: Rutas de senderismo de distintas dificultades que atraviesan bosques primarios.
6. Miradores naturales: Puntos panorámicos con vistas a las montañas y el noroccidente.
7. Avistamiento de aves (birdwatching): El cantón registra más de 400 especies de aves.

=== GASTRONOMÍA TÍPICA ===
- Caldo de gallina criolla: Plato tradicional de la sierra ecuatoriana.
- Papas con cuy: Plato festivo y ceremonial.
- Chicha de jora: Bebida fermentada ancestral preparada de maíz.
- Colada morada y guaguas de pan (en Día de Difuntos).
- Hornado: Cerdo asado en horno de leña, típico de los mercados.
- Tamales y humitas: Preparados con maíz y envueltos en hojas.
- Queso de hoja: Queso fresco elaborado artesanalmente en la zona.
- Frutas tropicales: Naranjilla, guanábana, granadilla, disponibles en fincas locales.

Restaurantes y comedores (por actualizar con datos del GAD):
- Comedores populares en la plaza central de Atahualpa
- Fincas agroturísticas con almuerzo incluido en el tour

=== HOSPEDAJE ===
- Hosterías y cabañas ecológicas en la zona de Nanegal y Pacto
- Fincas agroturísticas que ofrecen alojamiento comunitario
- Casa comunal para grupos (previa reserva con el GAD)
- Alojamiento en casas de familia mediante turismo comunitario
(Por actualizar con nombres y contactos específicos de establecimientos)

=== FIESTAS Y EVENTOS ===
- Cantonización de Atahualpa: Desfiles cívicos, elección de reina, juegos populares.
- Semana Santa: Procesiones religiosas tradicionales, colada morada.
- Inti Raymi (Fiesta del Sol, junio): Celebración indígena con música, danza y ofrendas.
- Día de Difuntos (2 de noviembre): Visita a cementerios, colada morada, guaguas de pan.
- Navidad y Año Nuevo: Eventos culturales en el parque central.
- Rodeo criollo y corridas de toros populares (en fiestas cantonales).
- Mingas comunitarias: Tradición de trabajo colectivo que los turistas pueden presenciar.

=== ARTESANÍAS Y COMERCIO LOCAL ===
- Tejidos en lana de borrego: Fajas, ponchos, cobijas artesanales.
- Trabajo en madera: Tallados de figuras, utensilios y decoración.
- Cerámica artesanal: Ollas, jarrones y piezas decorativas.
- Producción de panela y miel: De los trapiches locales.
- Mermeladas artesanales: De frutos propios de la zona.
- Plantas medicinales: Comercializadas en mercados y ferias locales.
- Café y cacao de altura: Producción agroecológica de pequeños productores.
Ferias artesanales: Se realizan en la plaza central los fines de semana y durante fiestas.

=== CÓMO LLEGAR ===
Desde Quito:
- En bus: Desde el Terminal Terrestre de Cotocollao o la terminal Carcelén, tomar buses hacia Nanegalito o Pacto. Duración aproximada: 2 a 3 horas.
- En auto: Por la carretera Calacalí-La Independencia (E28), en dirección noroccidente. Aproximadamente 80 km desde Quito.
Señalización: Las carreteras principales están señalizadas; se recomienda GPS para caminos secundarios.

=== DATOS ÚTILES ===
- Clima: Templado-húmedo, entre 12°C y 22°C. Se recomienda llevar ropa abrigada y impermeable.
- Mejor época para visitar: Todo el año, aunque junio-agosto es la época más seca.
- Emergencias: ECU 911
- GAD Municipal de Atahualpa: Contacto por actualizar con el equipo.
- Recomendación: Respetar las normas de los espacios naturales protegidos. No dejar basura.
`;

const SYSTEM = {
  es: `Eres "Pachamama", la guía turística virtual del Cantón Atahualpa en la provincia de Pichincha, Ecuador.
Respondes SIEMPRE en ESPAÑOL, de manera amigable, cálida y entusiasta. Usas emojis con moderación.
Tienes acceso a la siguiente base de conocimiento oficial. Úsala como fuente principal.
Si el usuario pregunta algo que no está en la base de conocimiento, responde con lo que sepas sobre Ecuador y la región noroccidental, y sugiere contactar al GAD Municipal para información actualizada.
Nunca inventes datos específicos como teléfonos, precios o fechas que no estén en la base de conocimiento.
Sé conciso pero completo. Usa listas cuando sea útil.

BASE DE CONOCIMIENTO:
${KNOWLEDGE}`,

  en: `You are "Pachamama", the virtual travel guide for Atahualpa Canton in Pichincha Province, Ecuador.
You ALWAYS respond in ENGLISH, in a friendly, warm and enthusiastic way. Use emojis in moderation.
You have access to the following official knowledge base. Use it as your primary source.
If the user asks something not in the knowledge base, respond with what you know about Ecuador and the northwest region, and suggest contacting the Municipal GAD for updated information.
Never invent specific data like phone numbers, prices or dates not in the knowledge base.
Be concise but complete. Use lists when helpful.

KNOWLEDGE BASE:
${KNOWLEDGE}`
};

exports.handler = async (event) => {
  // Solo aceptar POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Leer la clave desde variables de entorno de Netlify (NUNCA del cliente)
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key no configurada en Netlify. Revisa las variables de entorno.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido' }) };
  }

  const { messages, lang = 'es' } = body;

  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Se requiere el campo "messages"' }) };
  }

  // Limitar el historial a las últimas 10 interacciones para no exceder tokens
  const trimmedMessages = messages.slice(-10);

  try {
    const groqRes = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 1000,
        messages: [
          { role: 'system', content: SYSTEM[lang] || SYSTEM.es },
          ...trimmedMessages
        ]
      })
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json();
      return {
        statusCode: groqRes.status,
        body: JSON.stringify({ error: errData.error?.message || 'Error de Groq' })
      };
    }

    const data = await groqRes.json();
    const reply = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Error interno: ${err.message}` })
    };
  }
};
