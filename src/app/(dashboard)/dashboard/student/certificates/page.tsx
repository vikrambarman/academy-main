"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  Award, ExternalLink, Clock, CheckCircle2,
  Shield, BookOpen, LogIn, Search, AlertCircle,
  GraduationCap, BadgeCheck
} from "lucide-react";

/* ── Types ── */
interface FranchiseData {
  _id: string;
  name: string;
  code: string;
  registeredBodies: string[];
  portalUrl?: string;
  portalLoginRequired: boolean;
  isOwn: boolean;
}

interface CertTypeData {
  _id: string;
  name: string;
  code: string;
  issuingBody: string;
  verificationMethod: string;
  verificationUrl?: string;
  portalVerificationSteps: string[];
  benefits: string[];
}

interface Course {
  name?: string;
  authority?: string;
  verification?: string;
  externalPortalUrl?: string;
  externalLoginRequired?: boolean;
  certificate?: string;
  duration?: string;
}

interface Enrollment {
  _id: string;
  course: Course;
  certificateStatus: string;
  franchise?: FranchiseData | null;
  certType?: CertTypeData | null;
  externalStudentId?: string | null;
}

interface CertData {
  student: { name: string; studentId: string };
  enrollments: Enrollment[];
}

/* ── Legacy fallback ── */
function getLegacyAuthorityInfo(authority?: string) {
  const a = authority?.toLowerCase() ?? "";

  if (a.includes("drishti"))
    return {
      name: "Drishti Computer Education",
      shortName: "DCE",
      color: "var(--sp-accent)",
      portalUrl: "https://drishticomputer.com",
      steps: [
        "Visit drishticce.com",
        "Enter your certificate number",
        "Download verified certificate",
      ],
      verificationUrl: "https://drishticomputer.com",
    };

  if (a.includes("gsdm") || a.includes("gramin"))
    return {
      name: "Gramin Skill Development Mission",
      shortName: "GSDM",
      color: "var(--sp-success)",
      portalUrl: "https://graminskill.in",
      steps: [
        "Visit graminskill.in",
        "Login with credentials",
        "Download certificate",
      ],
      verificationUrl: "https://graminskill.in",
    };

  return {
    name: authority ?? "Issuing Authority",
    shortName: "CERT",
    color: "var(--sp-subtext)",
    portalUrl: "",
    steps: ["Contact academy for verification"],
    verificationUrl: "",
  };
}

/* ── Status Badge ── */
function CertStatusBadge({ status }: { status: string }) {
  const issued = status?.toLowerCase() === "certificate generated";
  return (
    <span className={`sc-badge ${issued ? "sc-badge--issued" : "sc-badge--pending"}`}>
      {issued ? <CheckCircle2 size={12} /> : <Clock size={12} />}
      {issued ? "Issued" : status}
    </span>
  );
}

/* ── Franchise Certificate Card ── */
function FranchiseCertCard({ enrollment }: { enrollment: Enrollment }) {
  const franchise = enrollment.franchise!;
  const certType  = enrollment.certType!;
  const issued    = enrollment.certificateStatus === "Certificate Generated";

  return (
    <div className="sc-cert-card">
      {/* Header band */}
      <div className={`sc-cert-band ${franchise.isOwn ? "sc-cert-band--own" : "sc-cert-band--franchise"}`}>
        <div className="sc-cert-band-left">
          <div className={`sc-auth-icon ${franchise.isOwn ? "sc-auth-icon--own" : "sc-auth-icon--franchise"}`}>
            {franchise.code.slice(0, 4)}
          </div>
          <div>
            <div className="sc-cert-band-title">{enrollment.course?.name}</div>
            <div className="sc-cert-band-auth">{franchise.name}</div>
          </div>
        </div>
        <CertStatusBadge status={enrollment.certificateStatus} />
      </div>

      {/* Body */}
      <div className="sc-cert-body">
        {/* Pending notice */}
        {!issued && (
          <div className="sc-pending-notice">
            <AlertCircle size={15} className="sc-pending-notice__icon" />
            <div>
              <strong>Certificate not yet issued.</strong>{" "}
              Yeh certificate {certType.issuingBody} ke dwara issue hoga
              jab course complete aur verify ho jaayega.
            </div>
          </div>
        )}

        {/* Registered body pills */}
        <div className="sc-reg-bodies">
          {franchise.registeredBodies.map((body) => (
            <span key={body} className="sc-reg-pill sc-reg-pill--body">
              <BadgeCheck size={9} />
              {body}
            </span>
          ))}
          {franchise.isOwn && (
            <span className="sc-reg-pill sc-reg-pill--institute">
              Institute Certificate
            </span>
          )}
        </div>

        {/* Info grid */}
        <div className="sc-info-grid">
          <div className="sc-info-cell">
            <div className="sc-info-cell__label">Certificate Name</div>
            <div className="sc-info-cell__value">{certType.name}</div>
          </div>
          <div className="sc-info-cell">
            <div className="sc-info-cell__label">Issuing Body</div>
            <div className="sc-info-cell__value">{certType.issuingBody}</div>
          </div>
          <div className="sc-info-cell">
            <div className="sc-info-cell__label">Verification Method</div>
            <div className="sc-info-cell__value">
              {certType.verificationMethod || "Contact academy"}
            </div>
          </div>
          {enrollment.externalStudentId && (
            <div className="sc-info-cell">
              <div className="sc-info-cell__label">
                {franchise.name} Student ID
              </div>
              <div className="sc-info-cell__value sc-info-cell__value--mono">
                {enrollment.externalStudentId}
              </div>
            </div>
          )}
        </div>

        {/* Benefits */}
        {certType.benefits.length > 0 && (
          <>
            <div className="sc-sub-label">Certificate Benefits</div>
            <div className="sc-benefits">
              {certType.benefits.map((b, i) => (
                <div key={i} className="sc-benefit-item">
                  <CheckCircle2 size={13} className="sc-benefit-item__icon" />
                  {b}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Verification steps */}
        {issued && certType.portalVerificationSteps.length > 0 && (
          <>
            <div className="sc-sub-label">Certificate kaise verify karein</div>
            <div className="sc-steps">
              {certType.portalVerificationSteps.map((step, i) => (
                <div key={i} className="sc-step">
                  <div className="sc-step__num">{i + 1}</div>
                  {step}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="sc-actions">
          {issued && certType.verificationUrl && (
            <a
              href={certType.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sc-btn-primary"
            >
              <Search size={13} />
              Verify Certificate
              <ExternalLink size={11} />
            </a>
          )}
          {franchise.portalLoginRequired && franchise.portalUrl && (
            <a
              href={franchise.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sc-btn-secondary"
            >
              <LogIn size={13} />
              {franchise.name} Portal
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Legacy Card (old enrollments) ── */
function LegacyCertCard({ enrollment }: { enrollment: Enrollment }) {
  const auth   = getLegacyAuthorityInfo(enrollment.course?.authority);
  const issued = enrollment.certificateStatus === "Certificate Generated";

  return (
    <div className="sc-cert-card">
      <div className="sc-cert-band sc-cert-band--legacy">
        <div className="sc-cert-band-left">
          <div
            className="sc-auth-icon"
            style={{ background: auth.color }}
          >
            {auth.shortName}
          </div>
          <div>
            <div className="sc-cert-band-title">{enrollment.course?.name}</div>
            <div className="sc-cert-band-auth">{auth.name}</div>
          </div>
        </div>
        <CertStatusBadge status={enrollment.certificateStatus} />
      </div>

      <div className="sc-cert-body">
        {!issued ? (
          <div className="sc-pending-notice">
            <AlertCircle size={15} className="sc-pending-notice__icon" />
            <div>
              Certificate abhi issue nahi hua hai.
              Academy se contact karein status ke liye.
            </div>
          </div>
        ) : (
          <>
            <div className="sc-steps">
              {auth.steps.map((step, i) => (
                <div key={i} className="sc-step">
                  <div className="sc-step__num">{i + 1}</div>
                  {step}
                </div>
              ))}
            </div>
            <div className="sc-actions">
              {auth.verificationUrl && (
                <a
                  href={auth.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sc-btn-primary"
                >
                  <Search size={13} />
                  Verify
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function StudentCertificates() {
  const [data, setData]       = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth("/api/student/profile")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Loading */
  if (loading) {
    return (
      <div className="sc-loader">
        <div className="sc-spinner" />
        <span className="sc-loader__text">Loading certificates…</span>
      </div>
    );
  }

  /* Error */
  if (!data) {
    return (
      <div className="sc-loader">
        <AlertCircle size={22} style={{ color: "var(--sp-danger)" }} />
        <span className="sc-loader__text" style={{ color: "var(--sp-danger)" }}>
          Failed to load. Please refresh.
        </span>
      </div>
    );
  }

  const { enrollments } = data;
  const issuedCount  = enrollments.filter(
    (e) => e.certificateStatus === "Certificate Generated"
  ).length;
  const pendingCount = enrollments.length - issuedCount;

  return (
    <div className="sc-root">
      {/* Page header */}
      <div className="sc-page-header">
        <div className="sc-page-title">
          <GraduationCap size={22} style={{ color: "var(--sp-accent)" }} />
          My Certificates
        </div>
        <p className="sc-page-sub">
          Aapke sab courses ke certificates — franchise aur
          verification details ke saath.
        </p>
      </div>

      {/* Summary cards */}
      <div className="sc-summary">
        <div className="sc-stat sc-stat--blue">
          <div className="sc-stat__icon sc-stat__icon--blue">
            <BookOpen size={15} />
          </div>
          <div className="sc-stat__label">Total Courses</div>
          <div className="sc-stat__value">{enrollments.length}</div>
        </div>

        <div className="sc-stat sc-stat--green">
          <div className="sc-stat__icon sc-stat__icon--green">
            <CheckCircle2 size={15} />
          </div>
          <div className="sc-stat__label">Issued</div>
          <div className="sc-stat__value sc-stat__value--green">
            {issuedCount}
          </div>
        </div>

        <div className="sc-stat sc-stat--amber">
          <div className="sc-stat__icon sc-stat__icon--amber">
            <Clock size={15} />
          </div>
          <div className="sc-stat__label">Pending</div>
          <div className="sc-stat__value sc-stat__value--amber">
            {pendingCount}
          </div>
        </div>
      </div>

      {/* Section label */}
      <div className="sc-section-label">
        <Award size={13} />
        Course Certificates
      </div>

      {/* Cards or empty state */}
      {enrollments.length === 0 ? (
        <div className="sc-empty">
          <div className="sc-empty__icon">
            <GraduationCap size={22} />
          </div>
          <div className="sc-empty__title">No enrollments found</div>
          <p className="sc-empty__sub">
            Certificates yahan dikhenge jab aap enroll honge.
          </p>
        </div>
      ) : (
        enrollments.map((e) =>
          e.franchise && e.certType ? (
            <FranchiseCertCard key={e._id} enrollment={e} />
          ) : (
            <LegacyCertCard key={e._id} enrollment={e} />
          )
        )
      )}
    </div>
  );
}