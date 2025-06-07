-- CreateTable
CREATE TABLE "OrdenVenta" (
    "NroOrdenVta" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL,
    "Motivo" TEXT,
    "Situacion" TEXT,

    CONSTRAINT "OrdenVenta_pkey" PRIMARY KEY ("NroOrdenVta")
);

-- CreateTable
CREATE TABLE "DetalleOrdenVta" (
    "id" TEXT NOT NULL,
    "NroOrdenVta" TEXT NOT NULL,
    "CodMedicamento" TEXT NOT NULL,
    "descripcionMed" TEXT NOT NULL,
    "cantidadRequerida" INTEGER NOT NULL,

    CONSTRAINT "DetalleOrdenVta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrdenVenta_NroOrdenVta_key" ON "OrdenVenta"("NroOrdenVta");

-- CreateIndex
CREATE UNIQUE INDEX "DetalleOrdenVta_NroOrdenVta_CodMedicamento_key" ON "DetalleOrdenVta"("NroOrdenVta", "CodMedicamento");

-- AddForeignKey
ALTER TABLE "DetalleOrdenVta" ADD CONSTRAINT "DetalleOrdenVta_NroOrdenVta_fkey" FOREIGN KEY ("NroOrdenVta") REFERENCES "OrdenVenta"("NroOrdenVta") ON DELETE RESTRICT ON UPDATE CASCADE;
