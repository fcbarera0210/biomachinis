# PROYECTO: Biomachinis (Workout News Platform)

## 1. Visión General
Plataforma web de noticias deportivas enfocada exclusivamente en disciplinas de "Workout" y superación personal (CrossFit, Calistenia, Artes Marciales, Powerlifting), excluyendo deportes masivos tradicionales.
El proyecto servirá como demo/portafolio.

### Actores
1.  **Visitante (Cliente):** Accede a la web pública para leer noticias filtradas por intereses.
2.  **Administrador:** Accede al panel de control para gestionar contenido, etiquetas y usuarios.

---

## 2. Stack Tecnológico & Herramientas
* **Framework:** Next.js 15 (App Router).
* **Lenguaje:** TypeScript.
* **Base de Datos:** Neon (Serverless Postgres).
* **ORM:** Drizzle ORM.
* **Estilos:** Tailwind CSS.
* **UI Components:** Shadcn/ui (Dashboard y Admin Panel).
* **Auth:** Auth.js (v5) - Credenciales (Email/Password).
* **Almacenamiento de Imágenes:** Vercel Blob (para portadas y contenido).
* **Editor de Texto:** Tiptap.
* **Despliegue:** Vercel.

---

## 3. Arquitectura de Datos (Schema Propuesto)

### Tablas Principales

#### `users`
* `id`: uuid (PK)
* `name`: text
* `email`: text (unique)
* `password`: text (hashed)
* `is_active`: boolean
* `created_at`: timestamp

#### `modules`
* `id`: serial (PK)
* `code`: text (unique) -> `NEWS_MANAGE`, `USER_MANAGE`, `TAG_MANAGE`
* `name`: text

#### `user_modules` (Permisos)
* `user_id`: uuid (FK)
* `module_id`: int (FK)

#### `tags` (Etiquetas)
* `id`: serial (PK)
* `name`: text -> Ej: "Nutrición", "Calistenia"
* `slug`: text (unique)

#### `posts` (Noticias)
* `id`: uuid (PK)
* `title`: text
* `slug`: text (unique)
* `excerpt`: text
* `content`: json/text (Rich Text)
* `cover_image_url`: text (URL de Vercel Blob)
* `views`: integer (default 0)
* `published`: boolean
* `author_id`: uuid (FK)
* `created_at`: timestamp

#### `post_tags` (Tabla Pivote)
* `post_id`: uuid (FK -> posts.id)
* `tag_id`: int (FK -> tags.id)
* *(PK compuesta por ambos campos)*

---

## 4. Requerimientos Funcionales (MVP)

### A. Flujo Público (Cliente)
1.  **Home:** Listado de noticias (Cards). Debe mostrar las etiquetas asociadas a cada noticia.
2.  **Filtro por Etiqueta (Opcional MVP):** Al hacer clic en una etiqueta, ver noticias relacionadas.
3.  **Detalle de Noticia:** Renderizado del contenido, imagen de portada y contador de visitas (`views + 1`).

### B. Flujo Administrador (`/admin`)
1.  **Login & Middleware:** Protección de rutas basada en sesión y permisos (`user_modules`).
2.  **Dashboard:** Métricas simples (Total noticias, Total visitas).

#### Módulos (Activables por usuario)

**1. Gestión de Usuarios (`USER_MANAGE`)**
* Listado de usuarios.
* Crear/Editar usuario: Asignar Email, Password y **activar/desactivar checkboxes** de los 3 módulos disponibles (`NEWS`, `USERS`, `TAGS`).

**2. Gestión de Etiquetas (`TAG_MANAGE`)**
* **CRUD Simple:** Crear, Editar nombre, Eliminar etiquetas.
* Validar que no se dupliquen nombres.

**3. Gestión de Noticias (`NEWS_MANAGE`)**
* **Listado:** Ver noticias, estado y visitas.
* **Editor:**
    * Subida de imagen de portada (Upload a Vercel Blob -> Obtener URL -> Guardar en DB).
    * **Selector de Etiquetas:** Un `Multi-select` (combobox de Shadcn/ui) para asignar una o varias etiquetas existentes a la noticia.
    * Editor de texto rico (Tiptap).

---

## 5. Reglas de Negocio
1.  **Permisos Modulares:** La visibilidad del menú lateral (Sidebar) depende de los módulos que el usuario tenga activos en `user_modules`.
2.  **Integridad de Etiquetas:** Si se borra una etiqueta, se elimina la relación en `post_tags`, pero la noticia permanece.

---

## 6. Guía de Desarrollo para Cursor/AI (Prompts Sugeridos)

* **Prompt Inicial:** "Lee PROJECT_BIBLE.md. Inicia el proyecto Next.js con Tailwind y Shadcn/ui. Configura Drizzle con Neon para el esquema definido, incluyendo la tabla de `tags` y `post_tags`."
* **Prompt Imágenes:** "Crea un Server Action para subir imágenes usando `@vercel/blob`. Necesito un componente de UI 'ImageUpload' que permita seleccionar un archivo, subirlo y devolver la URL para guardarla en el formulario de la noticia."
* **Prompt Relaciones:** "En el formulario de crear noticias, implementa un `MultiSelect` usando Shadcn/ui que cargue las etiquetas desde la DB. Al guardar la noticia, asegúrate de insertar las relaciones correspondientes en la tabla `post_tags` usando una transacción de Drizzle."