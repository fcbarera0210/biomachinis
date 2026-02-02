# Biomachinis - Plataforma de Noticias de Workout

Plataforma web de noticias deportivas enfocada exclusivamente en disciplinas de "Workout" y superación personal (CrossFit, Calistenia, Artes Marciales, Powerlifting).

## 🚀 Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Base de Datos:** Neon (Serverless Postgres)
- **ORM:** Drizzle ORM
- **Estilos:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Auth:** Auth.js (v5) - Credenciales (Email/Password)
- **Almacenamiento de Imágenes:** Vercel Blob
- **Editor de Texto:** Tiptap
- **Despliegue:** Vercel

## 📋 Requisitos Previos

- Node.js 18+ 
- Cuenta de Neon (PostgreSQL)
- Cuenta de Vercel (para Blob Storage)
- Variables de entorno configuradas (ver `.env.example`)

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/fcbarera0210/biomachinis.git
cd biomachinis
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` y agregar:
- `DATABASE_URL` - URL de conexión a Neon
- `BLOB_READ_WRITE_TOKEN` - Token de Vercel Blob (ver `SETUP_VERCEL_BLOB.md`)
- `AUTH_SECRET` - Secret para Auth.js (generar con `openssl rand -base64 32`)
- `AUTH_URL` - URL de la aplicación (http://localhost:3000 para desarrollo)

4. Configurar la base de datos:
```bash
# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:push
```

5. Ejecutar seed (datos iniciales):
```bash
npm run seed
```

Esto creará:
- Usuario admin: `admin@biomachinis.com` / `admin123`
- Módulos base (NEWS_MANAGE, USER_MANAGE, TAG_MANAGE)
- Etiquetas de ejemplo
- Posts de ejemplo

## 🏃 Desarrollo

Iniciar servidor de desarrollo:
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
biomachinis/
├── app/
│   ├── admin/          # Panel de administración
│   ├── noticias/       # Páginas públicas de noticias
│   ├── api/            # API routes
│   └── actions/        # Server Actions
├── components/
│   ├── admin/          # Componentes del admin
│   ├── ui/             # Componentes Shadcn/ui
│   └── ...             # Componentes públicos
├── lib/
│   ├── db/             # Schema y configuración de DB
│   ├── auth/           # Configuración de autenticación
│   └── utils.ts        # Utilidades
└── scripts/
    └── seed.ts         # Script de datos iniciales
```

## 🔐 Autenticación

El sistema utiliza Auth.js v5 con autenticación por credenciales (email/password).

**Usuario por defecto (después del seed):**
- Email: `admin@biomachinis.com`
- Password: `admin123`

## 📝 Módulos de Administración

El sistema tiene tres módulos principales:

1. **NEWS_MANAGE** - Gestión de Noticias
   - Crear, editar, eliminar noticias
   - Editor de texto rico (Tiptap)
   - Upload de imágenes a Vercel Blob
   - Asignación de etiquetas

2. **TAG_MANAGE** - Gestión de Etiquetas
   - CRUD de etiquetas
   - Validación de nombres únicos

3. **USER_MANAGE** - Gestión de Usuarios
   - CRUD de usuarios
   - Asignación de módulos por usuario
   - Activación/desactivación de usuarios

## 🎨 Características

- ✅ Modo oscuro/claro
- ✅ Diseño responsive
- ✅ Sistema de permisos modulares
- ✅ Contador de visitas
- ✅ Editor de texto rico
- ✅ Upload de imágenes
- ✅ Gestión de etiquetas
- ✅ Dashboard con métricas

## 📚 Documentación Adicional

- `PROJECT_BIBLE.md` - Especificaciones completas del proyecto
- `SETUP_VERCEL_BLOB.md` - Guía para configurar Vercel Blob Storage

## 🚢 Despliegue

El proyecto está optimizado para desplegarse en Vercel:

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Vercel
3. Desplegar automáticamente

## 📄 Licencia

Este proyecto es un demo/portafolio.
