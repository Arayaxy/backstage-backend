-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL,
    "cliente" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "espacios" (
    "id" UUID NOT NULL,
    "nombre_espacio" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "aforo" INTEGER NOT NULL,
    "nota" TEXT NOT NULL,
    "telefono_contacto" TEXT NOT NULL,
    "nombre_contacto" TEXT NOT NULL,
    "email_contacto" TEXT NOT NULL,

    CONSTRAINT "espacios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados" (
    "id" UUID NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" UUID NOT NULL,
    "nombre_evento" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "lugar_confirmado" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "numero_personas" INTEGER NOT NULL,
    "tipo_evento" TEXT NOT NULL,
    "nota" TEXT NOT NULL,
    "id_presupuesto" UUID,
    "id_cliente" UUID NOT NULL,
    "id_estado" UUID NOT NULL,
    "id_sala" UUID NOT NULL,
    "id_ponencia" UUID NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ponencias" (
    "id" UUID NOT NULL,
    "nombre_hotel" TEXT NOT NULL,
    "nota_transporte" TEXT NOT NULL,
    "horario_ida_transporte" TIMESTAMP(3) NOT NULL,
    "horario_vuelta_transporte" TIMESTAMP(3) NOT NULL,
    "localizacion_hotel" TEXT NOT NULL,
    "horario_ponencia" TIMESTAMP(3) NOT NULL,
    "checkin_horario" TIMESTAMP(3) NOT NULL,
    "ponente_estado" TEXT NOT NULL,
    "presentacion_link" TEXT NOT NULL,
    "billete_ida_link" TEXT NOT NULL,
    "billete_vuelta_link" TEXT NOT NULL,
    "tipo_ponencia" TEXT NOT NULL,
    "id_ponente" UUID NOT NULL,

    CONSTRAINT "ponencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ponentes" (
    "id" UUID NOT NULL,
    "nombre_ponente" TEXT NOT NULL,
    "docu_identificacion" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "foto_link" TEXT NOT NULL,
    "cv_link" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,

    CONSTRAINT "ponentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presupuestos" (
    "id" UUID NOT NULL,
    "estado_presupuesto" BOOLEAN NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "nota_ubicacion" TEXT NOT NULL,
    "precio_ubicacion" DOUBLE PRECISION NOT NULL,
    "catering" BOOLEAN NOT NULL,
    "nota_catering" TEXT NOT NULL,
    "precio_catering" DOUBLE PRECISION NOT NULL,
    "audiovisuales" BOOLEAN NOT NULL,
    "nota_audiovisuales" TEXT NOT NULL,
    "precio_audiovisuales" DOUBLE PRECISION NOT NULL,
    "otros" BOOLEAN NOT NULL,
    "nota_otros" TEXT NOT NULL,
    "precio_otros" DOUBLE PRECISION NOT NULL,
    "observaciones" TEXT NOT NULL,

    CONSTRAINT "presupuestos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salas" (
    "id" UUID NOT NULL,
    "nombre_sala" TEXT NOT NULL,
    "tipo_sala" TEXT NOT NULL,
    "capacidad_max_sala" INTEGER NOT NULL,
    "nota_sala" TEXT NOT NULL,
    "id_espacio" UUID NOT NULL,

    CONSTRAINT "salas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nombre_usuario" TEXT NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "eventos_id_presupuesto_key" ON "eventos"("id_presupuesto");

-- CreateIndex
CREATE UNIQUE INDEX "ponentes_email_key" ON "ponentes"("email");

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_id_presupuesto_fkey" FOREIGN KEY ("id_presupuesto") REFERENCES "presupuestos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_id_sala_fkey" FOREIGN KEY ("id_sala") REFERENCES "salas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_id_ponencia_fkey" FOREIGN KEY ("id_ponencia") REFERENCES "ponencias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ponencias" ADD CONSTRAINT "ponencias_id_ponente_fkey" FOREIGN KEY ("id_ponente") REFERENCES "ponentes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salas" ADD CONSTRAINT "salas_id_espacio_fkey" FOREIGN KEY ("id_espacio") REFERENCES "espacios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
