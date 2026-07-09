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

function toBool(val) {
  const v = clean(val).toLowerCase();
  return v === '1' || v === 'true' || v === 'aprobado' || v === 'si';
}

async function seedTable(config) {
  const rows = readCSV(config.file);
  if (!rows.length) { console.log(`0 registros en ${config.file}, saltando`); ID_MAP[config.name] = {}; return; }

  const intFields = config.intFields ?? [];
  const floatFields = config.floatFields ?? [];
  const boolFields = config.boolFields ?? [];
  const dateFields = config.dateFields ?? [];
  const idMap = {};
  const data = rows.map(row => {
    const entry = {};
    for (const [csvCol, prismaField] of Object.entries(config.map)) {
      if (csvCol === config.idField) {
        const uuid = crypto.randomUUID();
        idMap[row[csvCol]] = uuid;
        entry[prismaField] = uuid;
      } else if (intFields.includes(prismaField)) {
        entry[prismaField] = parseInt(clean(row[csvCol]), 10) || 0;
      } else if (floatFields.includes(prismaField)) {
        entry[prismaField] = parseFloat(clean(row[csvCol])) || 0;
      } else if (boolFields.includes(prismaField)) {
        entry[prismaField] = toBool(row[csvCol]);
      } else if (dateFields.includes(prismaField)) {
        const v = clean(row[csvCol]);
        if (!v) {
          entry[prismaField] = new Date('2026-01-01');
        } else if (/^\d{2}:\d{2}$/.test(v)) {
          entry[prismaField] = new Date(`2026-01-01T${v}:00`);
        } else if (/^\d{4}-\d{2}-\d{2}/.test(v)) {
          entry[prismaField] = new Date(v);
        } else {
          entry[prismaField] = new Date('2026-01-01T00:00:00');
        }
      } else {
        entry[prismaField] = clean(row[csvCol]);
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
    name: 'usuario', file: 'usuarios.csv', model: 'usuario', idField: 'id_usuario',
    map: { id_usuario: 'id', nombre_usuario: 'nombreUsuario', rol: 'rol' },
    fks: {},
  },
  {
    name: 'estado', file: 'estados.csv', model: 'estado', idField: 'id_estado',
    map: { id_estado: 'id', descripcion: 'descripcion' },
    fks: {},
  },
  {
    name: 'presupuesto', file: 'presupuestos.csv', model: 'presupuesto', idField: 'id_presupuesto',
    map: {
      id_presupuesto: 'id', estado_presupuesto: 'estadoPresupuesto', total: 'total', fecha: 'fecha',
      nota_ubicacion: 'notaUbicacion', precio_ubicacion: 'precioUbicacion',
      catering: 'catering', nota_catering: 'notaCatering', precio_catering: 'precioCatering',
      audiovisuales: 'audiovisuales', nota_audiovisuales: 'notaAudiovisuales',
      precio_audiovisuales: 'precioAudiovisuales', otros: 'otros',
      nota_otros: 'notaOtros', precio_otros: 'precioOtros', observaciones: 'observaciones',
    },
    fks: {},
    floatFields: ['total', 'precioUbicacion', 'precioCatering', 'precioAudiovisuales', 'precioOtros'],
    boolFields: ['estadoPresupuesto', 'catering', 'audiovisuales', 'otros'],
    dateFields: ['fecha'],
  },
  {
    name: 'cliente', file: 'clientes.csv', model: 'cliente', idField: 'id_cliente',
    map: {
      id_cliente: 'id', cliente: 'cliente', email: 'email', telefono: 'telefono',
      empresa: 'empresa', sector: 'sector', ciudad: 'ciudad',
    },
    fks: {},
  },
  {
    name: 'ponente', file: 'ponentes.csv', model: 'ponente', idField: 'id_ponente',
    map: {
      id_ponente: 'id', nombre_ponente: 'nombrePonente', doc_identificacion: 'docuIdentificacion',
      email: 'email', sector: 'sector', telefono: 'telefono',
      foto_link: 'fotoLink', cv_link: 'cvLink', empresa: 'empresa', cargo: 'cargo',
    },
    fks: {},
  },
  {
    name: 'espacio', file: 'espacios.csv', model: 'espacio', idField: 'id_espacio',
    map: {
      id_espacio: 'id', nombre_espacio: 'nombreEspacio', ciudad: 'ciudad', direccion: 'direccion',
      aforo: 'aforo', nota: 'nota', telefono_contacto: 'telefonoContacto',
      nombre_contacto: 'nombreContacto', email_contacto: 'emailContacto',
    },
    fks: {},
    intFields: ['aforo'],
  },
  {
    name: 'sala', file: 'salas.csv', model: 'sala', idField: 'id_sala',
    map: {
      id_sala: 'id', nombre_sala: 'nombreSala', tipo: 'tipoSala',
      capacidad_max_sala: 'capacidadMaxSala', nota_sala: 'notaSala',
    },
    fks: { id_espacio: { field: 'idEspacio', ref: 'espacio' } },
    intFields: ['capacidadMaxSala'],
  },
  {
    name: 'ponencia', file: 'evento_ponente.csv', model: 'ponencia', idField: 'id_evento_ponente',
    map: {
      id_evento_ponente: 'id', nombre_hotel: 'nombreHotel', nota_transporte: 'notaTransporte',
      horario_ida_transporte: 'horarioIdaTransporte',
      horario_vuelta_transporte: 'horarioVueltaTransporte',
      localizacion_hotel: 'localizacionHotel', horario_ponencia: 'horarioPonencia',
      checking_horario: 'checkinHorario', ponente_estado: 'ponenteEstado',
      presentacion_link: 'presentacionLink', billete_ida_link: 'billeteIdaLink',
      billete_vuelta_link: 'billeteVueltaLink', tipo_ponencias: 'tipoPonencia',
    },
    fks: { id_ponente: { field: 'idPonente', ref: 'ponente' } },
    dateFields: ['horarioIdaTransporte', 'horarioVueltaTransporte', 'horarioPonencia', 'checkinHorario'],
  },
  {
    name: 'evento', file: 'eventos.csv', model: 'evento', idField: 'id_evento',
    map: {
      id_evento: 'id_evento', nombre_evento: 'nombreEvento', ciudad: 'ciudad',
      lugar_confirmado: 'lugarConfirmado', fecha_inicio: 'fechaInicio',
      fecha_fin: 'fechaFin', numero_personas: 'numeroPersonas',
      tipo_evento: 'tipoEvento', nota: 'nota',
    },
    fks: {
      id_cliente: { field: 'idCliente', ref: 'cliente' },
      id_estado: { field: 'idEstado', ref: 'estado' },
      id_presupuesto: { field: 'idPresupuesto', ref: 'presupuesto' },
      id_sala: { field: 'idSala', ref: 'sala' },
      id_ponencia: { field: 'idPonencia', ref: 'ponencia' },
    },
    intFields: ['numeroPersonas'],
    dateFields: ['fechaInicio', 'fechaFin'],
  },
];

const clearOrder = ['evento', 'ponencia', 'sala', 'espacio', 'ponente', 'cliente', 'presupuesto', 'estado', 'usuario'];

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