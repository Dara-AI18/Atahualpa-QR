# 🏔️ Guía Turística Virtual — Cantón Atahualpa

Chatbot turístico con IA para el Cantón Atahualpa, Pichincha, Ecuador.
Desarrollado como proyecto para el GAD Municipal de Atahualpa.

## Estructura del proyecto

```
atahualpa-guia/
├── index.html                  ← Interfaz del chatbot (frontend)
├── netlify.toml                ← Configuración de Netlify
├── netlify/
│   └── functions/
│       └── chat.js             ← Función serverless (protege la API Key)
└── README.md
```

## ¿Cómo funciona la seguridad?

```
Turista → index.html → /.netlify/functions/chat → api.groq.com
                            ↑
                    La API Key vive aquí,
                    en los servidores de Netlify.
                    Nunca llega al navegador.
```

## Despliegue en Netlify (paso a paso)

### 1. Subir el proyecto a GitHub

```bash
# En tu computadora, abre la carpeta del proyecto y ejecuta:
git init
git add .
git commit -m "Guía turística Atahualpa - primer deploy"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/atahualpa-guia.git
git push -u origin main
```

### 2. Crear cuenta en Netlify
- Ve a https://netlify.com y regístrate gratis con tu cuenta de GitHub.

### 3. Conectar el repositorio
- En Netlify: **Add new site → Import an existing project → GitHub**
- Selecciona el repositorio `atahualpa-guia`
- Build command: (dejar vacío)
- Publish directory: `.`
- Clic en **Deploy site**

### 4. Agregar la API Key de Groq (¡IMPORTANTE!)
- En Netlify ve a: **Site configuration → Environment variables → Add a variable**
- Key: `GROQ_API_KEY`
- Value: tu clave que empieza con `gsk_...`
- Clic en **Save**
- Luego ve a **Deploys → Trigger deploy → Deploy site** para aplicar el cambio

### 5. Obtener tu URL pública
Netlify te dará una URL como: `https://atahualpa-guia.netlify.app`
También puedes configurar un dominio personalizado gratis.

### 6. Generar el QR
- Ve a https://qr-code-generator.com
- Pega tu URL de Netlify
- Descarga en PNG de alta resolución
- Imprime en carteles, folletos o señalética del cantón

## Personalización del contenido

Para actualizar la información del cantón (restaurantes, contactos, fechas exactas):
1. Abre `netlify/functions/chat.js`
2. Busca la sección `const KNOWLEDGE = ...`
3. Edita el texto con los datos reales del GAD
4. Sube los cambios a GitHub (Netlify se actualiza automáticamente)

## Clave Groq gratuita

Regístrate en https://console.groq.com/keys
No requiere tarjeta de crédito.
El plan gratuito permite miles de consultas diarias.

---
Proyecto desarrollado con: HTML · JavaScript · Groq Llama 3 · Netlify Functions
