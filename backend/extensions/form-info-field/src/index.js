import { defineInterface } from "@directus/extensions-sdk";
import InterfaceComponent from "./interface.vue";

export default defineInterface({
  id: "form-info-field",
  name: "Informacja formularza",
  icon: "info",
  description: "Pole prezentacyjne do rozszerzonych informacji w formularzach.",
  component: InterfaceComponent,
  types: ["alias"],
  localTypes: ["presentation"],
  group: "presentation",
  options: [
    {
      field: "label",
      name: "Nazwa pola",
      type: "string",
      meta: {
        width: "full",
        interface: "system-input-translated-string",
        options: {
          placeholder: "np. Moduł do rozwiania",
        },
      },
    },
    {
      field: "icon",
      name: "Ikona",
      type: "string",
      meta: {
        width: "half",
        interface: "select-icon",
        options: {
          placeholder: "info",
        },
      },
    },
    {
      field: "text",
      name: "Treść",
      type: "text",
      meta: {
        width: "full",
        interface: "input-rich-text-html",
        options: {
          toolbar: [
            "undo",
            "redo",
            "bold",
            "italic",
            "underline",
            "alignleft",
            "aligncenter",
            "alignright",
            "alignjustify",
            "bullist",
            "numlist",
            "link",
            "code",
          ],
        },
      },
    },
  ],
});
