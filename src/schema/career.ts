import { z } from "zod";

export const experienceSchema = z.object({
  title: z.string().describe("Job title"),
  company: z.string().describe("Company or organization name"),
  location: z.string().optional().describe("Work location"),
  start_date: z.string().describe("Start date (YYYY-MM or YYYY-MM-DD)"),
  end_date: z.string().optional().describe("End date, omit if current"),
  current: z.boolean().optional().default(false).describe("Whether this is the current position"),
  description: z.string().optional().describe("Role description"),
  highlights: z.array(z.string()).optional().describe("Key achievements or responsibilities"),
  technologies: z.array(z.string()).optional().describe("Technologies used in this role"),
});

export const educationSchema = z.object({
  institution: z.string().describe("School or university name"),
  degree: z.string().describe("Degree obtained or pursued"),
  field: z.string().optional().describe("Field of study"),
  start_date: z.string().describe("Start date (YYYY or YYYY-MM)"),
  end_date: z.string().optional().describe("End date, omit if ongoing"),
  current: z.boolean().optional().default(false),
  description: z.string().optional(),
  gpa: z.string().optional().describe("GPA or equivalent"),
});

export const certificationSchema = z.object({
  name: z.string().describe("Certification name"),
  issuer: z.string().describe("Issuing organization"),
  date: z.string().describe("Date obtained (YYYY-MM or YYYY-MM-DD)"),
  expiry: z.string().optional().describe("Expiration date"),
  url: z.string().url().optional().describe("Verification URL"),
  credential_id: z.string().optional(),
});

export const careerSchema = z.object({
  experience: z.array(experienceSchema).optional().describe("Work experience, most recent first"),
  education: z.array(educationSchema).optional().describe("Education history"),
  certifications: z.array(certificationSchema).optional().describe("Professional certifications"),
  achievements: z
    .array(z.string())
    .optional()
    .describe(
      "Key expertise and core accomplishments, as flat statements, corresponding to Affinda’s " +
        "own top-level “achievement” *résumé* field, distinct from a given role’s own " +
        "'highlights', which stay scoped to that one `experienceSchema` entry",
    ),
  associations: z
    .array(z.string())
    .optional()
    .describe(
      "Extracurricular activities, professional associations, and memberships, corresponding " +
        "to Affinda’s own top-level “association” *résumé* field",
    ),
  additional_information: z
    .array(z.string())
    .optional()
    .describe(
      "Free-text catch-all for whatever does not fit any other career section" +
        "has no single «additional information» field, spreading this across «hobby», " +
        "«rightToWork», «availability», and «expectedSalary» instead; this field is deliberately " +
        "a flat list rather than that four-way split, since none of those four are otherwise " +
        "collected by this profile schema",
    ),
});

export type Career = z.infer<typeof careerSchema>;
