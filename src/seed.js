import { readFileSync } from 'node:fs';
import { randomUUIDv7 } from 'node:crypto';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import prisma from './lib/prisma.js';

const CSV_DIR = path.resolve(import.meta.dirname, '../../datos');

const readCSV = file => parse(readFileSync(path.join(CSV_DIR, file), 'utf-8'), {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

const idMap = {};

const seedUsuarios = rows => {
  const data = rows.map(r => {
    const id = randomUUIDv7();
    idMap.usuario ??= {};
    idMap.usuario[r.id] = id;
    return { id, nombreUsuario: r.nombre_usuario, rol: r.rol };
  });
  return prisma.usuario.createMany({ data, skipDuplicates: true });
};

const seedPresupuestos = rows => {
  const data = rows.map(r => {
    const id = randomUUIDv7();
    idMap.presupuesto ??= {};
    idMap.presupuesto[r.id] = id;
    return {
      id,
      estadoPresupuesto: r.estado_presupuesto === 'true',
      total: parseFloat(r.total),
      fecha: r.fecha,
      notaUbicacion: r.nota_ubicacion || null,
      precioUbicacion: parseFloat(r.precio_ubicacion),
      catering: r.catering === 'true',
      notaCatering: r.nota_catering || null,
      precioCatering: parseFloat(r.precio_catering),
      audiovisuales: r.audiovisuales === 'true',
      notaAudiovisuales: r.nota_audiovisuales || null,
      precioAudiovisuales: parseFloat(r.precio_audiovisuales),
      otros: r.otros === 'true',
      notaOtros: r.nota_otros || null,
      precioOtros: parseFloat(r.precio_otros),
      observaciones: r.observaciones || null,
    };
  });
  return prisma.presupuesto.createMany({ data, skipDuplicates: true });
};

const seedClientes = rows => {
  const data = rows.map(r => {
    const id = randomUUIDv7();
    idMap.cliente ??= {};
    idMap.cliente[r.id] = id;
    return {
      id,
      cliente: r.cliente,
      email: r.email,
      telefono: r.telefono,
      empresa: r.empresa,
      sector: r.sector,
      ciudad: r.ciudad,
    };
  });
  return prisma.cliente.createMany({ data, skipDuplicates: true });
};

const seedPonentes = rows => {
  const data = rows.map(r => {
    const id = randomUUIDv7();
    idMap.ponente ??= {};
    idMap.ponente[r.id] = id;
    return {
      id,
      nombrePonente: r.nombre_ponente,
      docuIdentificacion: r.docu_identificacion,
      email: r.email,
      sector: r.sector,
      telefono: r.telefono,
      fotoLink: r.foto_link || null,
      cvLink: r.cv_link || null,
      empresa: r.empresa,
      cargo: r.cargo,
    };
  });
  return prisma.ponente.createMany({ data, skipDuplicates: true });
};

const seedEspacios = rows => {
  const data = rows.map(r => {
    const id = randomUUIDv7();
    idMap.espacio ??= {};
    idMap.espacio[r.id] = id;
    return {
      id,
      nombreEspacio: r.nombre_espacio,
      ciudad: r.ciudad,
      direccion: r.direccion,
      aforo: parseInt(r.aforo, 10),
      nota: r.nota || null,
      telefonoContacto: r.telefono_contacto,
      nombreContacto: r.nombre_contacto,
      emailContacto: r.email_contacto,
    };
  });
  return prisma.espacio.createMany({ data, skipDuplicates: true });
};

const seedSalas = rows => {
  const data = rows.map(r => {
    const id = randomUUIDv7();
    idMap.sala ??= {};
    idMap.sala[r.id] = id;
    return {
      id,
      nombreSala: r.nombre_sala,
      tipoSala: r.tipo_sala,
      capacidadMaxSala: parseInt(r.capacidad_max_sala, 10),
      notaSala: r.nota_sala || null,
      idEspacio: idMap.espacio[r.id_espacio],
    };
  });
  return prisma.sala.createMany({ data, skipDuplicates: true });
};

const seedEventos = rows => {
  const data = rows.map(r => {
    const id = randomUUIDv7();
    idMap.evento ??= {};
    idMap.evento[r.id] = id;
    return {
      id,
      nombreEvento: r.nombre_evento,
      ciudad: r.ciudad,
      lugarConfirmado: r.lugar_confirmado,
      fechaInicio: r.fecha_inicio,
      fechaFin: r.fecha_fin,
      numeroPersonas: parseInt(r.numero_personas, 10),
      tipoEvento: r.tipo_evento,
      nota: r.nota || null,
      estado: r.estado,
      idPresupuesto: idMap.presupuesto[r.id_presupuesto] ?? null,
      idCliente: idMap.cliente[r.id_cliente],
      idSala: idMap.sala[r.id_sala] ?? null,
    };
  });
  return prisma.evento.createMany({ data, skipDuplicates: true });
};

const seedPonencias = rows => {
  const data = rows.map(r => ({
    id: randomUUIDv7(),
    nombreHotel: r.nombre_hotel,
    notaTransporte: r.nota_transporte || null,
    horarioIdaTransporte: r.horario_ida_transporte,
    horarioVueltaTransporte: r.horario_vuelta_transporte,
    localizacionHotel: r.localizacion_hotel,
    horarioPonencia: r.horario_ponencia,
    checkinHorario: r.checkin_horario,
    ponenteEstado: r.ponente_estado,
    presentacionLink: r.presentacion_link || null,
    billeteIdaLink: r.billete_ida_link || null,
    billeteVueltaLink: r.billete_vuelta_link || null,
    tipoPonencia: r.tipo_ponencia,
    idEvento: idMap.evento[r.id_evento] ?? null,
    idPonente: idMap.ponente[r.id_ponente],
  }));
  return prisma.ponencia.createMany({ data, skipDuplicates: true });
};

const CLEAR_ORDER = [
  'ponencia', 'evento', 'sala', 'espacio', 'ponente',
  'cliente', 'presupuesto', 'usuario',
];

const main = async () => {
  console.log('📂 Leyendo CSVs...');
  const usuarios = readCSV('usuarios.csv');
  const presupuestos = readCSV('presupuestos.csv');
  const clientes = readCSV('clientes.csv');
  const ponentes = readCSV('ponentes.csv');
  const espacios = readCSV('espacios.csv');
  const salas = readCSV('salas.csv');
  const eventos = readCSV('eventos.csv');
  const ponencias = readCSV('ponencias.csv');

  console.log('🧹 Limpiando base de datos...');
  for (const model of CLEAR_ORDER) {
    await prisma[model].deleteMany();
  }

  console.log('🌱 Sembrando datos...\n');
  await seedUsuarios(usuarios);
  console.log(`  ✅ usuarios (${usuarios.length})`);
  await seedPresupuestos(presupuestos);
  console.log(`  ✅ presupuestos (${presupuestos.length})`);
  await seedClientes(clientes);
  console.log(`  ✅ clientes (${clientes.length})`);
  await seedPonentes(ponentes);
  console.log(`  ✅ ponentes (${ponentes.length})`);
  await seedEspacios(espacios);
  console.log(`  ✅ espacios (${espacios.length})`);
  await seedSalas(salas);
  console.log(`  ✅ salas (${salas.length})`);
  await seedEventos(eventos);
  console.log(`  ✅ eventos (${eventos.length})`);
  await seedPonencias(ponencias);
  console.log(`  ✅ ponencias (${ponencias.length})`);

  console.log('\n🎉 Seed completado');
};

main()
  .catch(err => { console.error('\n❌ Error:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
