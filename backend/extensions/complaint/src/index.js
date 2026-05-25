import path from "path";

var index = ({ action }, { services }) => {
  const { MailService, ItemsService } = services;

  action("items.create", async ({ collection, key, payload }, context) => {
    if (collection !== "complaint") return;

    const { schema } = context;

    const mailService = new MailService({ schema });

    try {
      /* ---------------------------------------
         LOAD COMPLAINT WITH FILE RELATIONS
      --------------------------------------- */

      const complaintService = new ItemsService("complaint", {
        schema,
      });

      const complaint = await complaintService.readOne(key, {
        fields: [
          "*",
          "files.*",
          "files.directus_files_id.*",
        ],
      });

      /* ---------------------------------------
         LOCAL STORAGE PATH
      --------------------------------------- */

      const uploadsPath =
        process.env.STORAGE_LOCAL_ROOT || "/directus/uploads";

      /* ---------------------------------------
         PREPARE ATTACHMENTS
      --------------------------------------- */

      const attachments =
        complaint?.files
          ?.map((relation) => relation?.directus_files_id)
          ?.filter(Boolean)
          ?.map((file) => ({
            filename: file.filename_download,
            path: path.join(uploadsPath, file.filename_disk),
            contentType: file.type,
          })) || [];

      console.log("[Complaint] Attachments:", attachments);

      /* ---------------------------------------
         MAIL DO KLIENTA
      --------------------------------------- */

      if (payload.email) {
        await mailService.send({
          to: payload.email,
          from: "www@dks.pl",
          subject:
            "Potwierdzenie przyjęcia zgłoszenia reklamacyjnego",
          template: {
            name: "ComplaintClient",
            data: {
              data: complaint,
            },
          },
          attachments,
        });
      }

      /* ---------------------------------------
         MAIL DO DZIAŁU REKLAMACJI
      --------------------------------------- */

      const complaintTitle = payload.title
        ? `Reklamacja dealerska – ${payload.title}`
        : "Reklamacja dealerska";

      await mailService.send({
        to: "reklamacje@dks.pl",
        from: "www@dks.pl",
        subject: complaintTitle,
        template: {
          name: "Complaint",
          data: {
            data: complaint,
          },
        },
        attachments,
      });

      console.log("[Complaint] Emails sent");
    } catch (error) {
      console.error("[Complaint] Mail error:", error);

      throw error;
    }
  });
};

export { index as default };