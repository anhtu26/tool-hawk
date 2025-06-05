-- RenameForeignKey
ALTER TABLE "DocumentAttachment" RENAME CONSTRAINT "DocumentAttachment_entityId_fkey" TO "fk_document_attachment_purchase_order";

-- RenameForeignKey
ALTER TABLE "DocumentAttachment" RENAME CONSTRAINT "DocumentAttachment_entityId_fkey1" TO "fk_document_attachment_tool";
