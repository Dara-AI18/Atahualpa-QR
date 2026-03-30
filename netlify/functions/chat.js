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
      body: JSON.stringify({ error: 'GROQ_API_KEY not configured in Netlify environment variables' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }

  const messages = body.messages || [];
  const lang = body.lang || 'es';

  const KNOWLEDGE = `Eres Pachamama, la guia turistica virtual oficial del Canton Atahualpa (tambien conocido como Habaspamba), ubicado en la provincia de Pichincha, Ecuador, a 80 km de Quito.

SOBRE ATAHUALPA:
- Altitud maxima: 2.248 m.s.n.m.
- Extension: 71 km2
- 13 barrios pintorescos
- El rio Piganta nace en la Laguna Grande de Mojanda
- Clima diverso: subtropical, templado y frio

LUGARES TURISTICOS:

1. IGLESIA CENTRAL DE ATAHUALPA
   - Patrimonio arquitectonico e historico del canton
   - Google Maps: https://maps.google.com/?q=Iglesia+Central+Atahualpa+Habaspamba+Ecuador

2. CAMPO SANTO DE ATAHUALPA HABASPAMBA
   - Cementerio con cipreses tallados en formas de animales: osos y aves
   - Vistas impresionantes del paisaje andino
   - Cada 2 de noviembre: celebracion cultural del Dia de Difuntos
   - Google Maps: https://maps.google.com/?q=Campo+Santo+Atahualpa+Habaspamba+Ecuador

3. CASCADA GRANDE DEL RIO MOJANDA
   - Impresionante caida de agua cristalina
   - Termas naturales para relajarse
   - Vertiente de agua mineral Guitig
   - Restaurante con gastronomia tipica
   - Facebook: https://www.facebook.com/profile.php?id=100063973328229
   - Google Maps: https://maps.google.com/?q=Cascada+Grande+Rio+Mojanda+Atahualpa+Ecuador

4. CASCADA EL CUCHO
   - Caida de agua cristalina entre montanas y senderos verdes
   - Ideal para familias y parejas
   - Facebook: https://www.facebook.com/profile.php?id=100079196210967
   - Google Maps: https://maps.google.com/?q=Cascada+El+Cucho+Atahualpa+Ecuador

5. LA TOLA
   - Sitio arqueologico y cultural de Atahualpa
   - Facebook: https://www.facebook.com/profile.php?id=61573398641017
   - Google Maps: https://maps.google.com/?q=La+Tola+Atahualpa+Habaspamba+Ecuador

GASTRONOMIA Y RESTAURANTES:

1. CASA MIA COMIDA TIPICA
   - Desayunos tradicionales, tilapia, maito, seco de pollo
   - Horario: fines de semana y feriados, 08h00 a 22h00
   - Junto al parque central de Atahualpa
   - Google Maps: https://maps.google.com/?q=Casa+Mia+Comida+Tipica+Atahualpa+Habaspamba

2. FINCA DON ARTURO
   - Trucha fresca, caldo de gallina, chuleta
   - Animales: ovejas, corderos, pavos reales, gansos
   - Pesca deportiva en criadero de truchas
   - Facebook: https://www.facebook.com/fincadonarturo
   - Google Maps: https://maps.google.com/?q=Finca+Don+Arturo+Atahualpa+Ecuador

3. EL ALISO BAR RESTAURANT
   - Restaurante y bar en Atahualpa
   - Facebook: https://www.facebook.com/profile.php?id=100090216905862
   - Google Maps: https://maps.google.com/?q=El+Aliso+Bar+Restaurant+Atahualpa+Ecuador

4. PANADERIA EL PALACIO DEL PAN
   - Mas de 20 anos de tradicion
   - Especialistas en tortas de compromiso y reposteria artesanal
   - Facebook: https://www.facebook.com/palaciodelpanec
   - Google Maps: https://maps.google.com/?q=Panaderia+El+Palacio+del+Pan+Atahualpa+Ecuador

HOSPEDAJE:

1. HOSTAL RESTAURANTE DIABLO HUMA
   - Hostal con restaurante incluido
   - Facebook: https://www.facebook.com/profile.php?id=100063656254332
   - Google Maps: https://maps.google.com/?q=Hostal+Diablo+Huma+Atahualpa+Ecuador

2. GRANJA LA VALENTINA
   - Recorridos por la granja, paseos a caballo con guia
   - Comida tradicional ecuatoriana
   - Ubicacion: Via Piganta, Barrio San Jose
   - Facebook: https://www.facebook.com/profile.php?id=100094331070144
   - Google Maps: https://maps.google.com/?q=Granja+La+Valentina+Via+Piganta+Atahualpa+Ecuador

COMERCIO LOCAL:

1. STORE T.MK
   - Calzado deportivo y ropa para toda la familia
   - Facebook: https://www.facebook.com/t.mk.ecuador
   - Google Maps: https://maps.google.com/?q=Store+TMK+Atahualpa+Ecuador

COMO LLEGAR:
- Desde Quito: 80 km, aproximadamente 1h 30min en auto
- Ruta: Quito, Calacali, Mojanda, Atahualpa
- Google Maps desde Quito: https://maps.google.com/?saddr=Quito+Ecuador&daddr=Atahualpa+Habaspamba+Pichincha+Ecuador

FIESTAS Y EVENTOS:
- 2 de noviembre: Dia de Difuntos en el Campo Santo
- Fiestas de cantonizacion (consultar al GAD Municipal para fechas)

INSTRUCCIONES:
- Responde siempre de forma amigable y entusiasta
- Cuando menciones un lugar, incluye su enlace de Google Maps con el texto: Ver en Google Maps: [url]
- Cuando haya Facebook disponible, incluyelo como: Facebook: [url]
- Si el idioma es ingles, responde en ingles
- Si te preguntan algo que no esta en tu base de conocimiento, sugiere contactar al GAD Municipal de Atahualpa`;

  const systemPrompt = lang === 'en'
    ? KNOWLEDGE + '\n\nIMPORTANT: The user is writing in English. Respond in English.'
    : KNOWLEDGE + '\n\nIMPORTANTE: El usuario escribe en espanol. Responde en espanol.';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GROQ_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        max_tokens: 1024,
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
        body: JSON.stringify({ error: 'Groq API error: ' + errText }),
      };
    }

    const data = await response.json();
    const reply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : 'Sin respuesta del modelo.';

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
      body: JSON.stringify({ error: 'Internal error: ' + err.message }),
    };
  }
};
