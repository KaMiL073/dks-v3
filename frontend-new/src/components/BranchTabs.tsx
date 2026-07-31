"use client";

import React, { useState } from "react";

type Props = {
  offerTab: string;
  leaseTab: string;
  photocopiersTab: string;
  serviceTab: string;
};

const BranchTabs: React.FC<Props> = ({
  offerTab,
  leaseTab,
  photocopiersTab,
  serviceTab,
}) => {
  // Aktywny tab (używany na desktopie)
  const [activeTab, setActiveTab] = useState<
    "offer" | "lease" | "photocopiers" | "service"
  >("offer");
  // Stany otwarcia na urządzeniach mobilnych
  const [open, setOpen] = useState<{
    offer: boolean;
    lease: boolean;
    photocopiers: boolean;
    service: boolean;
  }>({
    offer: false,
    lease: false,
    photocopiers: false,
    service: false,
  });

  const tabs = [
    { key: "offer", label: "Oferta" },
    { key: "lease", label: "Dzierżawa" },
    { key: "photocopiers", label: "Kserokopiarki" },
    { key: "service", label: "Serwis urządzeń" },
  ] as const;

  const tabContent = {
    offer: offerTab,
    lease: leaseTab,
    photocopiers: photocopiersTab,
    service: serviceTab,
  };

  return (
    <div className="py-6 flex flex-col lg:flex-row gap-6 lg:gap-12">
      {/* Akordeon mobilny */}
      <div className="w-full lg:hidden">
        {tabs.map((tab) => {
          const isOpen = open[tab.key as keyof typeof open];
          return (
            <div key={tab.key}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`mobile-panel-${tab.key}`}
                onClick={() => {
                  setOpen((prev) => ({
                    ...prev,
                    [tab.key]: !prev[tab.key as keyof typeof prev],
                  }));
                }}
                className={`w-full px-6 py-4 border-b-2 border-border-primary flex justify-between bg-gray-300`}
              >
                <span className="text-xl lg:text-2xl font-semibold text-Text-headings">
                  {tab.label}
                </span>
                {/* Strzałka rotuje na mobile, na desktopie nie jest widoczna */}
                <span
                  className={`w-6 h-6 transition-transform duration-300 lg:hidden ${
                    isOpen ? "rotate-180" : "rotate-0"
                  } bg-icon-primary`}
                ></span>
              </button>
              {/* Treść na mobile: widoczna tylko po rozwinięciu */}
              <div
                id={`mobile-panel-${tab.key}`}
                className={`overflow-hidden transition-all ${
                  isOpen ? "max-h-[1000px] py-4" : "max-h-0"
                }`}
              >
                <div
                  className="text-base text-Text-body leading-6 px-6"
                  dangerouslySetInnerHTML={{ __html: tabContent[tab.key] }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Zakładki desktopowe */}
      <div
        role="tablist"
        aria-label="Informacje o oddziale"
        className="hidden lg:block w-full lg:w-1/3"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={activeTab === tab.key}
            aria-controls={`panel-${tab.key}`}
            tabIndex={activeTab === tab.key ? 0 : -1}
            onClick={() => setActiveTab(tab.key)}
            className="w-full px-6 py-4 border-b-2 border-border-primary flex justify-between bg-gray-300"
          >
            <span className="text-xl lg:text-2xl font-semibold text-Text-headings">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Panel aktywnej zakładki desktopowej */}
      <div className="hidden lg:block w-full lg:w-2/3  2xl:pl-8 bg-surface-page">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            role="tabpanel"
            id={`panel-${tab.key}`}
            aria-labelledby={`tab-${tab.key}`}
            hidden={activeTab !== tab.key}
            className="text-xl text-Text-body leading-6"
            dangerouslySetInnerHTML={{ __html: tabContent[tab.key] }}
          />
        ))}
      </div>
    </div>
  );
};

export default BranchTabs;
