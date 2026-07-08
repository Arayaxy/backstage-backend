import 'dotenv/config';
import fs from 'fs';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';

const CSV_DIR = 'C:\\Users\\Isild\\Downloads';
const ID_MAP = {};

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') { inQuotes = !inQuotes; continue; }
    if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; continue; }
    current += char;
  }
  result.push(current.trim());
  return result;
}

function readCSV(filename) {
  let content = fs.readFileSync(`${CSV_DIR}\\${filename}`, 'utf-8');
  if (content.startsWith('Fragmento')) content = content.slice(content.indexOf('\n') + 1);
  content = content.trim();
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const values = parseCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

function clean(val) {
  if (val === 'mull' || val === '' || val === undefined || val === null) return '';
  return val;
}

async function seedTable(config) {
  const rows = readCSV(config.file);
  if (!rows.length) { console.log(`0 registros en ${config.file}, saltando`); ID_MAP[config.name] = {}; return; }

  const intFields = config.intFields ?? [];
  const idMap = {};
  const data = rows.map(row => {
    const entry = {};
    for (const [csvCol, prismaField] of Object.entries(config.map)) {
      if (csvCol === config.idField) {
        const uuid = crypto.randomUUID();
        idMap[row[csvCol]] = uuid;
        entry[prismaField] = uuid;
      } else {
        entry[prismaField] = intFields.includes(prismaField) ? parseInt(clean(row[csvCol]), 10) || 0 : clean(row[csvCol]);
      }
    }
    for (const [csvCol, { field, ref }] of Object.entries(config.fks)) {
      entry[field] = ID_MAP[ref]?.[row[csvCol]] ?? null;
    }
    return entry;
  });

  await prisma[config.model].createMany({ data });
  console.log(`${data.length} registros insertados en ${config.model}`);
  ID_MAP[config.name] = idMap;
}

const tables = [
  {
    name: 'estado', file: 'estados.csv', model: 'estado', idField: 'id_estado',
    map: { id_estado: 'id_estado', descripcion: 'descripcion' },
    fks: {},
  },
  {
    name: 'cliente', file: 'clientes.csv', model: 'cliente', idField: 'id_cliente',
    map: { id_cliente: 'id_cliente', cliente: 'cliente', email: 'email', telefono: 'telefono', empresa: 'empresa', sector: 'sector', ciudad: 'ciudad' },
    fks: {},
  },
  {
    name: 'ponente', file: 'ponentes.csv', model: 'ponente', idField: 'id_ponente',
    map: { id_ponente: 'id_ponente', nombre_ponente: 'nombre_ponente', doc_identificacion: 'docu_identificacion', email: 'email', sector: 'sector', telefono: 'telefono', foto_link: 'foto_link', cv_link: 'cv_link', empresa: 'empresa', cargo: 'cargo' },
    fks: {},
  },
  {
    name: 'espacio', file: 'espacios.csv', model: 'espacio', idField: 'id_espacio',
    map: { id_espacio: 'id_espacio', nombre_espacio: 'nombre_espacio', ciudad: 'ciudad', direccion: 'direccion', aforo: 'aforo', nota: 'nota', telefono_contacto: 'telefono_contacto', nombre_contacto: 'nombre_contacto', email_contacto: 'email_contacto' },
    fks: {},
  },
  {
    name: 'sala', file: 'salas.csv', model: 'sala', idField: 'id_sala',
    map: { id_sala: 'id_sala', nombre_sala: 'nombre_sala', tipo: 'tipo_sala', capacidad_max_sala: 'capacidad_max_sala', nota_sala: 'nota_sala' },
    fks: { id_espacio: { field: 'espacioId', ref: 'espacio' } },
  },
  {
    name: 'evento', file: 'eventos.csv', model: 'evento', idField: 'id_evento',
    map: { id_evento: 'id_evento', nombre_evento: 'nombre_evento', ciudad: 'ciudad', lugar_confirmado: 'lugar_confirmado', fecha_inicio: 'fecha_inicio', fecha_fin: 'fecha_fin', numero_personas: 'numero_personas', tipo_evento: 'tipo_evento', nota: 'nota' },
    fks: { id_estado: { field: 'estadoId', ref: 'estado' }, id_cliente: { field: 'clienteId', ref: 'cliente' } },
    intFields: ['numero_personas'],
  },
  {
    name: 'evento_ponente', file: 'evento_ponente.csv', model: 'eventos_ponente', idField: 'id_evento_ponente',
    map: { id_evento_ponente: 'id_evento_ponente', nombre_hotel: 'nombre_hotel', nota_transporte: 'nota_transporte', horario_ida_transporte: 'horario_ida_transporte', horario_vuelta_transporte: 'horario_vuelta_transporte', localizacion_hotel: 'localizacion_hotel', horario_ponencia: 'horario_ponencia', checking_horario: 'checkin_horario', ponente_estado: 'ponente_estado', presentacion_link: 'presentacion_link', billete_ida_link: 'billete_ida_link', billete_vuelta_link: 'billete_vuelta_link', tipo_ponencias: 'tipo_ponencia' },
    fks: { id_ponente: { field: 'ponenteId', ref: 'ponente' }, id_evento: { field: 'eventoId', ref: 'evento' } },
  },
  {
    name: 'presupuesto', file: 'presupuestos.csv', model: 'presupuesto', idField: 'id_presupuesto',
    map: { id_presupuesto: 'id_presupuesto', estado_presupuesto: 'estado_presupuesto', total: 'total', fecha: 'fecha', nota_ubicacion: 'nota_ubicacion', precio_ubicacion: 'precio_ubicacion', nota_catering: 'nota_catering', precio_catering: 'precio_catering', nota_audiovisuales: 'nota_audiovisuales', precio_audiovisuales: 'precio_audiovisuales', nota_otros: 'nota_otros', precio_otros: 'precio_otros', observaciones: 'observaciones' },
    fks: { id_evento: { field: 'eventoId', ref: 'evento' } },
    intFields: ['total', 'precio_ubicacion', 'precio_catering', 'precio_audiovisuales', 'precio_otros'],
  },
];

// Limpiar datos existentes (orden inverso respetando FKs)
const clearOrder = ['presupuesto', 'eventos_ponente', 'evento', 'sala', 'espacio', 'ponente', 'cliente', 'estado'];
for (const model of clearOrder) {
  await prisma[model].deleteMany();
}

try {
  for (const t of tables) await seedTable(t);
  console.log('\nSeed completado correctamente');
} catch (error) {
  console.error('Error durante el seed:', error.message);
  console.error(error.stack);
} finally {
  await prisma.$disconnect();
}
