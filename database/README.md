# Datos y archivos de producción

El archivo `supabase-schema.sql` crea las tablas para productos, sus galerías y una portada por TCG. Las imágenes se guardan en el bucket `catalog-images`; la base de datos solo almacena sus rutas y datos de catálogo.

Antes de publicar, crea un proyecto en Supabase, ejecuta el SQL completo y agrega las dos variables de `.env.example` en Vercel. La primera cuenta que vaya a administrar debe tener su fila en `profiles` con `role = 'admin'`.
