-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "clienteId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_correo_key" ON "clientes"("correo");

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
