import type { CvIR } from "./ir.js";

/**
 * This module maps `CvIR` onto Affinda’s own resume (*curriculum vitae*) schema, as supplied directly rather than reconstructed from documentation. 
 * The field names below are taken verbatim from `schema.json`’s (`assets/global/samples/schema.json`) `camelCase` wire format (`workExperienceJobTitle`, `candidateName.firstName`, and so forth), not invented in parallel to it
 */

export interface AffindaCandidateName {
  readonly firstName: string | null;
  readonly familyName: string | null;
}

export interface AffindaLocation {
  readonly formatted: string | null;
  readonly city: string | null;
  readonly state: string | null;
  readonly country: string | null;
  readonly rawInput: string | null;
}

export interface AffindaWorkExperienceItem {
  readonly workExperienceJobTitle: string | null;
  readonly workExperienceOrganization: string | null;
  readonly workExperienceLocation: AffindaLocation | null;
  readonly workExperienceDescription: string | null;
}

export interface AffindaEducationLevel {
  readonly value: string;
}

export interface AffindaEducationItem {
  readonly educationOrganization: string | null;
  readonly educationAccreditation: string | null;
  readonly educationLevel: AffindaEducationLevel | null;
}

export interface AffindaProjectItem {
  readonly projectTitle: string | null;
  readonly projectDescription: string | null;
  readonly projectOrganization: string | null;
}

export interface AffindaSkillItem {
  readonly name: string;
  readonly type: string;
}

export interface AffindaLanguageItem {
  readonly languageName: { readonly value: string; readonly label: string };
}

export interface AffindaResume {
  readonly candidateName: AffindaCandidateName;
  readonly location: AffindaLocation | null;
  readonly email: readonly string[];
  readonly objective: string | null;
  readonly summary: string | null;
  readonly workExperience: readonly AffindaWorkExperienceItem[];
  readonly education: readonly AffindaEducationItem[];
  readonly project: readonly AffindaProjectItem[];
  readonly achievement: readonly string[];
  readonly association: readonly string[];
  readonly hobby: readonly string[];
  readonly skill: readonly AffindaSkillItem[];
  readonly language: readonly AffindaLanguageItem[];
}

function buildLocation(formatted: string | undefined, country: string | undefined): AffindaLocation | null {
  if (!formatted && !country) return null;
  return {
    formatted: formatted ?? null,
    city: null,
    state: null,
    country: country ?? null,
    rawInput: formatted ?? null,
  };
}

/**
 * Building an Affinda-based schema export from `CvIR`, filling only the fields `CvIR` actually carries and leaving the remainder `null`, rather than fabricating values Affinda’s schema permits but our own profile schema does not collect
 */
export function buildAffindaExport(ir: CvIR): AffindaResume {
  return {
    candidateName: {
      firstName: ir.firstName || null,
      familyName: ir.familyName || null,
    },
    location: buildLocation(ir.location, ir.country),
    email: ir.contact.email ? [ir.contact.email] : [],
    objective: null,
    summary: ir.summary ?? null,
    workExperience: ir.experience.map((entry) => ({
      workExperienceJobTitle: entry.title,
      workExperienceOrganization: entry.company,
      workExperienceLocation: buildLocation(entry.location, undefined),
      workExperienceDescription: entry.description ?? null,
    })),
    education: ir.certifications.map((entry) => ({
      educationOrganization: entry.issuer,
      educationAccreditation: entry.name,
      educationLevel: { value: "Certification" },
    })),
    project: ir.projects.map((entry) => ({
      projectTitle: entry.name,
      projectDescription: entry.description,
      projectOrganization: entry.role ?? null,
    })),
    achievement: ir.achievements,
    association: ir.associations,
    hobby: ir.additionalInformation,
    skill: [
      ...ir.skills.technical.map((name) => ({ name, type: "hard skill" })),
      ...ir.skills.tools.map((name) => ({ name, type: "hard skill" })),
      ...ir.skills.soft.map((name) => ({ name, type: "soft skill" })),
    ],
    language: ir.languages.map((l) => ({
      languageName: { value: l.language.toLowerCase(), label: l.language },
    })),
  };
}

export interface AffindaPhraseEntry {
  readonly phrase: string;
  readonly affindaField: string;
}

/**
 * Deriving the comparison labelled by the specific Affinda-based schema field each one corresponds to, so the dashboard’s comparison table can state plainly which real field a given row is standing in for, rather than an unlabelled phrase whose provenance the reader must infer
 */
export function deriveAffindaPhrases(ir: CvIR): AffindaPhraseEntry[] {
  const entries: AffindaPhraseEntry[] = [];

  if (ir.firstName) entries.push({ phrase: ir.firstName, affindaField: "candidateName.firstName" });
  if (ir.familyName) entries.push({ phrase: ir.familyName, affindaField: "candidateName.familyName" });
  if (ir.headline) entries.push({ phrase: ir.headline, affindaField: "objective" });
  if (ir.location) entries.push({ phrase: ir.location, affindaField: "location.formatted" });
  if (ir.country) entries.push({ phrase: ir.country, affindaField: "location.country" });

  for (const entry of ir.experience) {
    entries.push({ phrase: entry.title, affindaField: "workExperience[].workExperienceJobTitle" });
    entries.push({ phrase: entry.company, affindaField: "workExperience[].workExperienceOrganization" });
  }

  for (const entry of ir.certifications) {
    entries.push({ phrase: entry.name, affindaField: "education[].educationAccreditation" });
    entries.push({ phrase: entry.issuer, affindaField: "education[].educationOrganization" });
  }

  for (const entry of ir.projects) {
    entries.push({ phrase: entry.name, affindaField: "project[].projectTitle" });
  }

  for (const achievement of ir.achievements) {
    entries.push({ phrase: achievement, affindaField: "achievement[]" });
  }

  for (const association of ir.associations) {
    entries.push({ phrase: association, affindaField: "association[]" });
  }

  for (const name of [...ir.skills.technical, ...ir.skills.tools, ...ir.skills.soft]) {
    entries.push({ phrase: name, affindaField: "skill[].name" });
  }

  for (const l of ir.languages) {
    entries.push({ phrase: l.language, affindaField: "language[].languageName.label" });
  }

  // Deduplicating by element text, keeping the first field label encountered, since the comparison table keys rows by phrase alone
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = entry.phrase.trim().toLowerCase();
    if (key.length === 0 || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
