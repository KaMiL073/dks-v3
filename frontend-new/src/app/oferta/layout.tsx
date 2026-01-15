import type { ReactNode } from "react";
import Breadcrumb from "./components/Breadcrumb";

type OfferLayoutProps = {
  children: ReactNode;
};

export default async function OfferLayout({ children }: OfferLayoutProps) {

  return (
    <div>
      <main>
        <Breadcrumb />
        {children}
      </main>
    </div>
  );
}