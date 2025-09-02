create extension if not exists "pgcrypto";

create table if not exists public.usuario (
  id_usuario    uuid primary key default gen_random_uuid(),
  nombre        text not null,
  email         text not null unique,
  contrasenia   text not null,          
  telefono      text,
  fecha_creacion timestamptz not null default now()
);

create table if not exists public.suscripcion (
  id_suscripcion uuid primary key default gen_random_uuid(),
  nombre         text not null unique,   
  precio_mensual numeric(10,2) not null check (precio_mensual >= 0)
);

create table if not exists public.usuario_suscripcion (
  id_usuario     uuid not null references public.usuario(id_usuario) on delete cascade,
  id_suscripcion uuid not null references public.suscripcion(id_suscripcion),
  fecha_inicio   date not null default current_date,
  estado         text not null,        
  fecha_cierre   date,
  primary key (id_usuario, id_suscripcion, fecha_inicio)
);

create table if not exists public.tip_nutricional (
  id_tip        uuid primary key default gen_random_uuid(),
  id_usuario    uuid not null references public.usuario(id_usuario) on delete set null,
  titulo        text not null,
  contenido     text not null,
  categoria     text,
  requiere_plus boolean not null default true
);

create table if not exists public.receta (
  id_receta      uuid primary key default gen_random_uuid(),
  id_usuario     uuid references public.usuario(id_usuario) on delete set null, 
  nombre         text not null,
  instrucciones  text not null,
  tiempo_preparacion_min integer,
  dificultad     text,
  fecha_creacion timestamptz not null default now()
);

create table if not exists public.ingrediente (
  id_ingrediente uuid primary key default gen_random_uuid(),
  nombre         text not null unique,
  categoria      text,
  calorias       integer,
  proteinas      numeric(8,2),
  carbohidratos  numeric(8,2),
  grasas         numeric(8,2)
);

create table if not exists public.receta_ingrediente (
  id_receta      uuid not null references public.receta(id_receta) on delete cascade,
  id_ingrediente uuid not null references public.ingrediente(id_ingrediente),
  cantidad       numeric(12,3) not null,
  unidad         text not null,
  primary key (id_receta, id_ingrediente)
);

create table if not exists public.etiquetas (
  id_etiquetas uuid primary key default gen_random_uuid(),
  nombre       text not null,
  tipo         text,
  descripcion  text
);

create table if not exists public.receta_etiqueta (
  id_receta    uuid not null references public.receta(id_receta) on delete cascade,
  id_etiqueta  uuid not null references public.etiquetas(id_etiquetas) on delete cascade,
  primary key (id_receta, id_etiqueta)
);

create table if not exists public.favoritos (
  id_usuario  uuid not null references public.usuario(id_usuario) on delete cascade,
  id_receta   uuid not null references public.receta(id_receta) on delete cascade,
  fecha_guardado timestamptz not null default now(),
  primary key (id_usuario, id_receta)
);

create table if not exists public.calificaciones (
  id_calificaciones uuid primary key default gen_random_uuid(),
  id_usuario   uuid not null references public.usuario(id_usuario) on delete cascade,
  id_receta    uuid not null references public.receta(id_receta) on delete cascade,
  estrellas    integer not null check (estrellas between 1 and 5),
  comentario   text,
  fecha_calificacion timestamptz not null default now()
);

create table if not exists public.plan_de_comidas (
  id_plan      uuid primary key default gen_random_uuid(),
  id_usuario   uuid not null references public.usuario(id_usuario) on delete cascade,
  titulo       text not null,
  fecha_inicio date not null,
  fecha_fin    date not null,
  fecha_creacion timestamptz not null default now(),
  check (fecha_fin >= fecha_inicio)
);

create table if not exists public.plan_receta (
  id_plan    uuid not null references public.plan_de_comidas(id_plan) on delete cascade,
  id_receta  uuid not null references public.receta(id_receta),
  tipo       text,           
  primary key (id_plan, id_receta, tipo)
);

create table if not exists public.usuario_ingrediente (
  id_usuario     uuid not null references public.usuario(id_usuario) on delete cascade,
  id_ingrediente uuid not null references public.ingrediente(id_ingrediente),
  cantidad       numeric(12,3) not null default 0,
  unidad         text not null,
  fecha_vencimiento date,
  ts_actualizacion timestamptz not null default now(),
  primary key (id_usuario, id_ingrediente)
);

create index if not exists idx_receta_busqueda
  on public.receta using gin (to_tsvector('spanish', coalesce(nombre,'') || ' ' || coalesce(instrucciones,'')));

create index if not exists idx_usuario_ingrediente_usuario
  on public.usuario_ingrediente (id_usuario);

create index if not exists idx_calificaciones_receta
  on public.calificaciones (id_receta, estrellas);
