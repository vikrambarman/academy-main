"use client";

import { useState } from "react";

const PORTALS = [
  {
    name: "Drishti Computer Education",
    match: /DRISHTI|DCE/i,
    url: "https://drishticomputer.com/check-certificate-marksheet",
    note: "Certificate issued & verified by Drishti Computer Education",
  },
  {
    name: "Gramin Skill Development Mission (GSDM)",
    match: /GSDM|GSM/i,
    url: "https://graminskill.in/condidate_Verify.aspx",
    note: "Authorized Training Center – Certificate verified on GSDM portal",
  },
  {
    name: "NSDC / Skill India",
    match: /NSDC|SKILL/i,
    url: "https://www.nsdcindia.org",
    note: "Skill India aligned certificate",
  },
  {
    name: "DigiLocker (Medhavi Skill University)",
    match: /DIPLOMA|MSU/i,
    url: "https://www.digilocker.gov.in",
    note: "University diploma available on DigiLocker",
  },
];

export default function VerificationForm() {
  const [certificateNo, setCertificateNo] = useState("");
  const [result, setResult] = useState<any>(null);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const cert = certificateNo.trim();

    if (!cert) return;

    const authority = PORTALS.find((p) => p.match.test(cert));

    if (!authority) {
      setResult({
        error:
          "Unable to identify certificate authority. Please contact the institute.",
      });
      return;
    }

    setResult(authority);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-10">

      <h2 className="text-2xl font-semibold text-gray-900">
        Verify Certificate
      </h2>

      <p className="mt-3 text-gray-500 text-sm">
        Enter your certificate number to proceed to the official verification portal.
      </p>

      <form onSubmit={submitHandler} className="mt-8 space-y-6">

        <div>
          <label
            htmlFor="certificateNo"
            className="block text-sm font-medium text-gray-700"
          >
            Certificate Number / Registration ID
          </label>

          <input
            type="text"
            id="certificateNo"
            required
            value={certificateNo}
            onChange={(e) => setCertificateNo(e.target.value)}
            placeholder="Eg: DCE/23/00002345 / GSDM-NSDC-88921"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition"
        >
          Proceed to Verification
        </button>

      </form>

      {/* RESULT */}
      {result?.error && (
        <div className="mt-8 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
          {result.error}
        </div>
      )}

      {result?.name && (
        <div className="mt-8 p-6 rounded-2xl bg-gray-50 border border-gray-100">
          <h3 className="font-semibold text-gray-900">
            {result.name}
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            {result.note}
          </p>

          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-medium text-black underline"
          >
            Go to Official Verification Portal →
          </a>
        </div>
      )}

      <p className="mt-8 text-xs text-gray-400">
        Certificates are issued and verified by respective authorities.
        Shivshakti Computer Academy acts only as an authorized training partner.
      </p>

    </div>
  );
}