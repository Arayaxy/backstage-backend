export function mapPrismaError(err) {
  const dae = err.meta?.driverAdapterError?.cause;

  if (err.code === 'P2000') {
    err.status = 400;
    err.message = `Valor demasiado largo para la columna ${dae?.column || 'desconocida'}`;
  } else if (err.code === 'P2001') {
    err.status = 404;
    err.message = `Registro ${err.meta?.model_name || ''} no encontrado`;
  } else if (err.code === 'P2002') {
    err.status = 409;
    const field = dae?.constraint?.fields?.[0] || 'desconocido';
    err.message = `El valor del campo ${field} ya existe`;
  } else if (err.code === 'P2003') {
    err.status = 400;
    const field = dae?.constraint?.fields?.[0] || dae?.constraint?.index || 'desconocido';
    err.message = `Violación de clave foránea en el campo ${field}`;
  } else if (err.code === 'P2006') {
    err.status = 400;
    err.message = `Valor inválido para ${err.meta?.field_name || 'un campo'}`;
  } else if (err.code === 'P2007') {
    err.status = 400;
    err.message = 'Valor de entrada no válido';
  } else if (err.code === 'P2011') {
    err.status = 400;
    const field = dae?.constraint?.fields?.[0] || 'desconocido';
    err.message = `El campo ${field} no puede ser nulo`;
  } else if (err.code === 'P2014') {
    err.status = 409;
    err.message = `Violación de relación entre ${err.meta?.model_a_name || 'A'} y ${err.meta?.model_b_name || 'B'}`;
  } else if (err.code === 'P2020') {
    err.status = 400;
    err.message = `Valor fuera de rango: ${dae?.cause || ''}`;
  } else if (err.code === 'P2021') {
    err.status = 400;
    err.message = `La tabla ${dae?.table || 'desconocida'} no existe`;
  } else if (err.code === 'P2022') {
    err.status = 400;
    err.message = `La columna ${dae?.column || 'desconocida'} no existe`;
  } else if (err.code === 'P2024') {
    err.status = 503;
    err.message = 'Tiempo de espera agotado en la conexión a la base de datos';
  } else if (err.code === 'P2025') {
    err.status = 404;
    const model = err.meta?.modelName || 'Registro';
    const cause = err.meta?.cause ? `: ${err.meta.cause}` : '';
    err.message = `${model} no encontrado${cause}`;
  } else if (err.code === 'P2034') {
    err.status = 409;
    err.message = 'La transacción falló por conflicto. Intenta de nuevo';
  } else if (err.code === 'P2037') {
    err.status = 503;
    err.message = `Demasiadas conexiones: ${dae?.cause || ''}`;
  } else {
    err.status = 400;
  }

  return err;
}
