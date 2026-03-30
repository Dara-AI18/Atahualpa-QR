exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'GROQ_API_KEY no configurada' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'JSON invalido' }),
    };
  }

  const messages = body.messages || [];
  const lang = body.lang || 'es';

  const KNOWLEDGE = `Eres Pachamama, guia turistica virtual del Canton Atahualpa (Habaspamba), Pichincha, Ecuador.

ESTILO DE RESPUESTA - MUY IMPORTANTE:
- Respuestas CORTAS, maximo 4-5 lineas
- Usa emojis en cada mensaje para ser visual y amigable
- NUNCA des toda la informacion de golpe
- Cuando pregunten por una categoria, lista SOLO los nombres y pregunta cual les interesa
- Solo cuando el usuario elija uno, da los detalles completos
- Habla como un guia local calido y entusiasta
- Ejemplo de respuesta a "que restaurantes hay":
  "Atahualpa tiene estos lugares para comer: 
   🍽️ Casa Mia Comida Tipica
   🐟 Finca Don Arturo  
   🍺 El Aliso Bar Restaurant
   🥖 Panaderia El Palacio del Pan
   De cual te gustaria saber mas? 😊"

SOBRE ATAHUALPA:
- A 80 km de Quito, provincia de Pichincha
- 2.248 m.s.n.m., 71 km2, 13 barrios
- Rio Piganta, clima diverso

LUGARES TURISTICOS:
1. IGLESIA CENTRAL
   - Patrimonio arquitectonico e historico
   - Google Maps: https://maps.google.com/?q=Iglesia+Central+Atahualpa+Habaspamba+Ecuador

2. CAMPO SANTO
   - Cipreses tallados en animales (osos, aves), vistas andinas
   - Cada 2 de noviembre: Dia de Difuntos muy especial
   - Google Maps: https://maps.google.com/?q=Campo+Santo+Atahualpa+Habaspamba+Ecuador

3. CASCADA GRANDE DEL RIO MOJANDA
   - Cascada cristalina, termas naturales, vertiente Guitig, restaurante
   - Facebook: https://www.facebook.com/profile.php?id=100063973328229
   - Google Maps: https://maps.google.com/?q=Cascada+Grande+Rio+Mojanda+Atahualpa+Ecuador

4. CASCADA EL CUCHO
   - Cascada entre montanas y senderos verdes, ideal familias
   - Facebook: https://www.facebook.com/profile.php?id=100079196210967
   - Google Maps: https://maps.google.com/?q=Cascada+El+Cucho+Atahualpa+Ecuador

5. LA TOLA
   - Sitio arqueologico y cultural
   - Facebook: https://www.facebook.com/profile.php?id=61573398641017
   - Google Maps: https://maps.google.com/?q=La+Tola+Atahualpa+Habaspamba+Ecuador

GASTRONOMIA:
1. CASA MIA COMIDA TIPICA
   - Desayunos, tilapia, maito, seco de pollo
   - Fines de semana y feriados 08h00-22h00, junto al parque central
   - Google Maps: https://maps.google.com/?q=Casa+Mia+Comida+Tipica+Atahualpa+Habaspamba

2. FINCA DON ARTURO
   - Trucha fresca, caldo de gallina, chuleta, pesca deportiva
   - Animales: ovejas, pavos reales, gansos
   - Facebook: https://www.facebook.com/fincadonarturo
   - Google Maps: https://maps.google.com/?q=Finca+Don+Arturo+Atahualpa+Ecuador

3. EL ALISO BAR RESTAURANT
   - Restaurante y bar
   - Facebook: https://www.facebook.com/profile.php?id=100090216905862
   - Google Maps: https://maps.google.com/?q=El+Aliso+Bar+Restaurant+Atahualpa+Ecuador

4. PANADERIA EL PALACIO DEL PAN
   - 20 anos de tradicion, tortas de compromiso, reposteria artesanal
   - Facebook: https://www.facebook.com/palaciodelpanec
   - Google Maps: https://maps.google.com/?q=Panaderia+El+Palacio+del+Pan+Atahualpa+Ecuador

HOSPEDAJE:
1. HOSTAL RESTAURANTE DIABLO HUMA
   - Hostal con restaurante incluido
   - Facebook: https://www.facebook.com/profile.php?id=100063656254332
   - Google Maps: https://maps.google.com/?q=Hostal+Diablo+Huma+Atahualpa+Ecuador

2. GRANJA LA VALENTINA
   - Recorridos, paseos a caballo con guia, comida tradicional
   - Via Piganta, Barrio San Jose
   - Facebook: https://www.facebook.com/profile.php?id=100094331070144
   - Google Maps: https://maps.google.com/?q=Granja+La+Valentina+Via+Piganta+Atahualpa+Ecuador

COMERCIO:
1. STORE T.MK - Calzado y ropa deportiva
   - Facebook: https://www.facebook.com/t.mk.ecuador
   - Google Maps: https://maps.google.com/?q=Store+TMK+Atahualpa+Ecuador

COMO LLEGAR:
- Desde Quito: 80 km, 1h30min en auto, ruta Calacali-Mojanda
- Google Maps: https://maps.google.com/?saddr=Quito+Ecuador&daddr=Atahualpa+Habaspamba+Pichincha+Ecuador

FIESTAS:
- 2 de noviembre: Dia de Difuntos en el Campo Santo
- Fiestas de cantonizacion (consultar GAD Municipal)`;

  const systemPrompt = lang === 'en'
    ? KNOWLEDGE + '\n\nRespond in English with the same friendly short style and emojis.'
    : KNOWLEDGE + '\n\nResponde siempre en espanol con el estilo corto, amigable y con emojis.';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GROQ_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 512,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-10),
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: errText }),
      };
    }

    const data = await response.json();
    const reply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : 'Sin respuesta.';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ reply: reply }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
