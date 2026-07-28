-- CreateEnum
CREATE TYPE "InterestType" AS ENUM ('SERVICIO', 'CAPACITACION', 'GENERAL');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NUEVO', 'CONTACTADO', 'COTIZADO', 'GANADO', 'PERDIDO');

-- CreateEnum
CREATE TYPE "CredentialType" AS ENUM ('INFORME_SERVICIO', 'DIPLOMA_CAPACITACION');

-- CreateEnum
CREATE TYPE "ApprovalType" AS ENUM ('PARTICIPACION', 'APROBACION');

-- CreateEnum
CREATE TYPE "CredentialStatus" AS ENUM ('VIGENTE', 'EXPIRADO', 'REVOCADO');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('INICIADA', 'APROBADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "Modality" AS ENUM ('PRESENCIAL', 'ONLINE_VIVO', 'IN_COMPANY');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ABIERTA', 'CUPOS_LIMITADOS', 'CERRADA', 'FINALIZADA');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "interestType" "InterestType" NOT NULL,
    "interestSlug" TEXT,
    "message" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NUEVO',
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holder" (
    "id" TEXT NOT NULL,
    "rut" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "holderId" TEXT NOT NULL,
    "type" "CredentialType" NOT NULL,
    "serviceSlug" TEXT,
    "clientCompany" TEXT,
    "equipmentTag" TEXT,
    "reportTitle" TEXT,
    "findingsSummary" TEXT,
    "courseSlug" TEXT,
    "courseSessionId" TEXT,
    "approvalType" "ApprovalType",
    "scorePercent" INTEGER,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "validationCode" TEXT NOT NULL,
    "status" "CredentialStatus" NOT NULL DEFAULT 'VIGENTE',
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CredentialRecoveryPayment" (
    "id" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "webpayToken" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'INICIADA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CredentialRecoveryPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseSession" (
    "id" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "modality" "Modality" NOT NULL,
    "location" TEXT,
    "seatsTotal" INTEGER NOT NULL,
    "seatsTaken" INTEGER NOT NULL DEFAULT 0,
    "status" "SessionStatus" NOT NULL DEFAULT 'ABIERTA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "contactEmail" TEXT NOT NULL DEFAULT 'contacto@fydingenieros.cl',
    "whatsappNumber" TEXT NOT NULL DEFAULT '+56990153483',
    "businessHoursOpen" TEXT NOT NULL DEFAULT '09:00',
    "businessHoursClose" TEXT NOT NULL DEFAULT '18:30',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_interestSlug_idx" ON "Lead"("interestSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Holder_rut_key" ON "Holder"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_validationCode_key" ON "Credential"("validationCode");

-- CreateIndex
CREATE INDEX "Credential_validationCode_idx" ON "Credential"("validationCode");

-- CreateIndex
CREATE INDEX "Credential_type_status_idx" ON "Credential"("type", "status");

-- CreateIndex
CREATE INDEX "CourseSession_courseSlug_status_idx" ON "CourseSession"("courseSlug", "status");

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Holder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_courseSessionId_fkey" FOREIGN KEY ("courseSessionId") REFERENCES "CourseSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredentialRecoveryPayment" ADD CONSTRAINT "CredentialRecoveryPayment_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
