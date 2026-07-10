import type { Identity } from "../schema/identity.js";
import type { Career } from "../schema/career.js";
import type { Skills } from "../schema/skills.js";

/**
 * `CvIR` is the canonical, engine-agnostic representation of a *curriculum vitae*. Every render engine (`latex`, `typst`, `pandoc`) consumes this single structure, so a profile is assembled once and rendered four times, rather than four independent assemblies drifting apart
 */
export interface CvIR {
  readonly locale: string;
  readonly fullName: string;
  readonly firstName: string;
  readonly familyName: string;
  readonly headline?: string;
  readonly summary?: string;
  readonly location?: string;
  readonly country?: string;
  readonly contact: CvContact;
  readonly experience: readonly CvExperienceEntry[];
  readonly education: readonly CvEducationEntry[];
  readonly certifications: readonly CvCertificationEntry[];
  readonly skills: CvSkillsGrouped;
  readonly languages: readonly CvLanguageEntry[];
}

export interface CvContact {
  readonly email?: string;
  readonly website?: string;
  readonly social: readonly { readonly platform: string; readonly url: string }[];
}

export interface CvExperienceEntry {
  readonly title: string;
  readonly company: string;
  readonly location?: string;
  readonly startDate: string;
  readonly endDate?: string;
  readonly current: boolean;
  readonly description?: string;
  readonly highlights: readonly string[];
  readonly technologies: readonly string[];
}

export interface CvEducationEntry {
  readonly institution: string;
  readonly degree: string;
  readonly field?: string;
  readonly startDate: string;
  readonly endDate?: string;
  readonly current: boolean;
}

export interface CvCertificationEntry {
  readonly name: string;
  readonly issuer: string;
  readonly date: string;
}

export interface CvSkillsGrouped {
  readonly technical: readonly string[];
  readonly tools: readonly string[];
  readonly soft: readonly string[];
}

export interface CvLanguageEntry {
  readonly language: string;
  readonly proficiency: string;
}

/**
 * Building a `CvIR` from the three profile schemas that already exist in this repository. The render module reads what `career.yaml`, `skills.yaml`, and `identity.yaml` already contain
 */
export function buildCvIR(input: {
  identity: Identity;
  career?: Career;
  skills?: Skills;
  locale?: string;
}): CvIR {
  const { identity, career, skills, locale = "en" } = input;

  const experience: CvExperienceEntry[] = (career?.experience ?? []).map(
    (entry) => ({
      title: entry.title,
      company: entry.company,
      location: entry.location,
      startDate: entry.start_date,
      endDate: entry.end_date,
      current: entry.current ?? false,
      description: entry.description,
      highlights: entry.highlights ?? [],
      technologies: entry.technologies ?? [],
    }),
  );

  const education: CvEducationEntry[] = (career?.education ?? []).map((entry) => ({
    institution: entry.institution,
    degree: entry.degree,
    field: entry.field,
    startDate: entry.start_date,
    endDate: entry.end_date,
    current: entry.current ?? false,
  }));

  const certifications: CvCertificationEntry[] = (career?.certifications ?? []).map(
    (entry) => ({
      name: entry.name,
      issuer: entry.issuer,
      date: entry.date,
    }),
  );

  return {
    locale,
    fullName: identity.name,
    firstName: identity.name.split(/\s+/).slice(0, -1).join(" ") || identity.name,
    familyName: identity.name.split(/\s+/).slice(-1)[0] ?? "",
    headline: identity.nickname,
    summary: identity.bio,
    location: identity.location
      ? [identity.location.city, identity.location.state, identity.location.country]
          .filter(Boolean)
          .join(", ")
      : undefined,
    country: identity.location?.country,
    contact: {
      email: identity.contact?.email,
      website: identity.contact?.website,
      social: (identity.contact?.social ?? [])
        .filter((s): s is { platform: string; url: string } => Boolean(s.platform && s.url))
        .map((s) => ({ platform: s.platform, url: s.url })),
    },
    experience,
    education,
    certifications,
    skills: {
      technical: (skills?.technical ?? []).map((s) => s.name),
      tools: (skills?.tools ?? []).map((s) => s.name),
      soft: (skills?.soft ?? []).map((s) => s.name),
    },
    languages: (identity.languages ?? []).map((l) => ({
      language: l.language,
      proficiency: l.proficiency,
    })),
  };
}
