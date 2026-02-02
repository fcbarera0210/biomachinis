# Configuración de Vercel Blob Storage

Este documento explica cómo configurar Vercel Blob Storage para el proyecto Biomachinis y obtener el token necesario para el desarrollo.

## Requisitos Previos

- Tener una cuenta de Vercel (ya la tienes ✅)
- Tener acceso a tu proyecto en Vercel o estar preparado para crear uno

## Pasos para Configurar Vercel Blob

### 1. Acceder a Vercel Dashboard

1. Ve a [https://vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta
3. Accede al Dashboard principal

### 2. Crear un Proyecto (si aún no lo tienes)

1. En el Dashboard, haz clic en **"Add New..."** → **"Project"**
2. Conecta tu repositorio de GitHub: `fcbarera0210/biomachinis`
3. O si prefieres, puedes crear el proyecto sin conectar el repo por ahora

### 3. Configurar Vercel Blob Storage

#### Opción A: Desde el Dashboard de Vercel

1. En tu proyecto de Vercel, ve a la pestaña **"Storage"**
2. Haz clic en **"Create Database"** o **"Add Storage"**
3. Selecciona **"Blob"** de las opciones disponibles
4. Asigna un nombre a tu blob storage (ej: `biomachinis-blob`)
5. Selecciona la región más cercana a tus usuarios
6. Haz clic en **"Create"**

#### Opción B: Desde Vercel CLI (Recomendado para desarrollo)

1. Instala Vercel CLI si no lo tienes:
   ```bash
   npm i -g vercel
   ```

2. Inicia sesión en Vercel:
   ```bash
   vercel login
   ```

3. Vincula tu proyecto (si aún no está vinculado):
   ```bash
   vercel link
   ```

4. Crea el Blob Storage:
   ```bash
   vercel blob create biomachinis-blob
   ```

### 4. Obtener el Token de Acceso (BLOB_READ_WRITE_TOKEN)

#### Método 1: Desde el Dashboard

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a **Settings** → **Storage** → Tu blob storage
3. Busca la sección **"Environment Variables"** o **"Access Tokens"**
4. Copia el token que aparece como `BLOB_READ_WRITE_TOKEN` o similar

#### Método 2: Desde Vercel CLI

1. Lista tus blob storages:
   ```bash
   vercel blob list
   ```

2. Obtén las variables de entorno:
   ```bash
   vercel env pull .env.local
   ```
   
   Esto descargará todas las variables de entorno, incluyendo el token de Blob.

#### Método 3: Crear un Token Manualmente

1. Ve a **Settings** → **Tokens** en tu cuenta de Vercel
2. Haz clic en **"Create Token"**
3. Asigna un nombre (ej: "Biomachinis Blob Token")
4. Selecciona el scope necesario (Storage/Blob)
5. Copia el token generado (solo se muestra una vez)

### 5. Configurar el Token en el Proyecto Local

1. Abre el archivo `.env` en la raíz del proyecto
2. Agrega la siguiente variable:

```env
BLOB_READ_WRITE_TOKEN=tu_token_aqui
```

**Ejemplo completo del archivo `.env`:**

```env
# Base de datos Neon
DATABASE_URL=postgresql://usuario:password@host.neon.tech/dbname?sslmode=require

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Auth.js (se generará automáticamente o puedes usar openssl)
AUTH_SECRET=tu_secret_key_aqui
AUTH_URL=http://localhost:3000
```

### 6. Verificar la Configuración

Para verificar que todo está configurado correctamente, puedes crear un script de prueba temporal:

```typescript
// test-blob.ts (temporal, para verificar)
import { put } from '@vercel/blob';

async function testBlob() {
  const blob = await put('test.txt', 'Hello World', {
    access: 'public',
  });
  console.log('Blob URL:', blob.url);
}

testBlob();
```

## Notas Importantes

- **Seguridad**: Nunca subas el archivo `.env` a Git. Asegúrate de que esté en `.gitignore`
- **Tokens**: El `BLOB_READ_WRITE_TOKEN` es sensible. Manténlo seguro
- **Región**: Elige una región cercana a tus usuarios para mejor rendimiento
- **Límites**: Revisa los límites de tu plan de Vercel para Blob Storage

## Solución de Problemas

### Error: "Blob storage not found"
- Verifica que hayas creado el blob storage en Vercel
- Asegúrate de estar usando el token correcto

### Error: "Invalid token"
- Verifica que el token esté correctamente copiado en `.env`
- Asegúrate de que no haya espacios extra o saltos de línea

### Error: "Permission denied"
- Verifica que el token tenga permisos de lectura y escritura
- Revisa que el blob storage esté activo en Vercel

## Recursos Adicionales

- [Documentación oficial de Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [Guía de Vercel CLI](https://vercel.com/docs/cli)
- [Variables de entorno en Vercel](https://vercel.com/docs/projects/environment-variables)

## Próximos Pasos

Una vez configurado Vercel Blob y agregado el token al `.env`, el proyecto estará listo para:
- Subir imágenes de portada de noticias
- Almacenar contenido multimedia
- Gestionar archivos del CMS
