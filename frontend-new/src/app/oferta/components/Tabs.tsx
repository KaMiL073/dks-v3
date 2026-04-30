"use client";

import { useMemo, useState } from "react";
import DirectusRenderer from "@/components/bloxs/DirectusRenderer";
import "@/styles/rich-content.scss";

/** 🔹 Typ pojedynczego pliku z Directusa */
interface DirectusFile {
  id?: string;
  directus_files_id?: { id?: string; filename_download?: string } | string;
  filename_download?: string;
}

/** 🔹 Typ komponentu z relacji M2A */
interface DirectusComponent {
  collection: string;
  item: unknown;
}

/** 🔹 Minimalny typ produktu do Tabs */
interface Product {
  id: string | number;
  description?: string;
  files?: DirectusFile[];
  components?: DirectusComponent[];
}

/** 🔹 Shape zgodny z DirectusRenderer */
type DirectusItemWithId = { id: string | number } & Record<string, unknown>;
type DirectusBlock = { collection: string; item: DirectusItemWithId };

function isDirectusBlock(x: unknown): x is DirectusBlock {
  if (!x || typeof x !== "object") return false;

  const obj = x as Record<string, unknown>;
  if (typeof obj.collection !== "string") return false;

  const item = obj.item;
  if (!item || typeof item !== "object") return false;

  const itemObj = item as Record<string, unknown>;
  const id = itemObj.id;

  return typeof id === "string" || typeof id === "number";
}

export default function Tabs({
  product,
  files: passedFiles,
}: {
  product: Product;
  files?: DirectusFile[];
}) {
  const [activeTab, setActiveTab] =
    useState<"description" | "files">("description");

  const backend =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8055";

  // 🔹 Pliki
  const files: DirectusFile[] = Array.isArray(passedFiles)
    ? passedFiles
    : Array.isArray(product?.files)
    ? product.files
    : [];

  // 🔹 Komponenty
  const componentsRaw: DirectusComponent[] = Array.isArray(product?.components)
    ? product.components
    : [];

  const components = useMemo(
    () => componentsRaw.filter(isDirectusBlock),
    [componentsRaw]
  );

  return (
    <div className="mx-auto">
      {/* 🔹 Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("description")}
          className={`px-6 py-3 text-lg font-medium font-['Montserrat'] transition ${
            activeTab === "description"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Opis
        </button>

        <button
          onClick={() => setActiveTab("files")}
          className={`px-6 py-3 text-lg font-medium font-['Montserrat'] transition ${
            activeTab === "files"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Do pobrania
        </button>
      </div>

      {/* 🔸 Content */}
      <div className="bg-white py-6 px-2 md:px-6">
        {activeTab === "description" ? (
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {components.length > 0 ? (
              <DirectusRenderer components={components as never} />
            ) : product?.description ? (
              <div
                className="rich-content"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-gray-500 text-lg">
                Brak opisu dla tego produktu.
              </p>
            )}
          </div>
        ) : files.length > 0 ? (
          <div className="flex flex-col gap-4">
            {files.map((file, index) => {
              const fileId =
                typeof file === "string"
                  ? file
                  : file?.directus_files_id &&
                    typeof file.directus_files_id === "object"
                  ? file.directus_files_id.id
                  : typeof file?.directus_files_id === "string"
                  ? file.directus_files_id
                  : file?.id;

              if (!fileId) return null;

              const fileUrl = `${backend}/assets/${fileId}`;

              const fileName =
                typeof file?.directus_files_id === "object"
                  ? file.directus_files_id.filename_download
                  : file?.filename_download || `Plik_${index + 1}`;

              return (
                <a
                  key={String(fileId)}
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex self-stretch justify-start text-xl font-normal font-['Montserrat'] underline leading-6 items-center"
                >
                  {fileName}
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-lg">
            Brak plików do pobrania.
          </p>
        )}
      </div>
    </div>
  );
}