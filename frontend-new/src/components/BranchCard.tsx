import Image from "next/image";
import Link from "next/link";
import type { Branch } from "@/content/Branch";

type Props = {
  branch: Branch;
};

export default function BranchCard({ branch }: Props) {
  return (
    <Link href={branch.href} className="block">
      <div className="w-[464px] h-[590px] p-12 bg-gray-300 flex flex-col gap-8">
        {/* IMAGE */}
        <div className="w-full h-52 relative">
          {branch.image && (
            <Image
              src={branch.image}
              alt={branch.title}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* TITLE */}
        <h3 className="text-Text-headings text-3xl font-semibold font-['Montserrat'] leading-10">
          {branch.fullName}
        </h3>

        {/* CONTENT */}
        <div className="text-Text-body font-['Montserrat'] text-xl leading-6 space-y-2">
          <p>
            <span className="font-semibold">Adres:</span>{" "}
            <span className="font-normal">{branch.address}</span>
          </p>

          {branch.address2 && (
            <p className="font-normal">{branch.address2}</p>
          )}

          <p>
            <span className="font-semibold">Tel.:</span>{" "}
            <span className="font-normal">{branch.phone}</span>
          </p>

          <p>
            <span className="font-semibold">E-mail:</span>{" "}
            <span className="font-normal underline">{branch.email}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}