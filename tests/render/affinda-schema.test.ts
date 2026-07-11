import { describe, expect, it } from "vitest";
import { buildCvIR } from "../../src/render/ir.js";
import { buildAffindaExport, deriveAffindaPhrases } from "../../src/render/affinda-schema.js";

const identity = {
  name: "Gustavo Papi",
  bio: "Full-stack developer and genealogist",
  location: { city: "Aparecida", state: "SP", country: "Brazil" },
};

describe("buildAffindaExport", () => {
  it("decomposing the full name into `firstName` and `familyName`", () => {
    const ir = buildCvIR({ identity });
    const resume = buildAffindaExport(ir);
    expect(resume.candidateName.firstName).toBe("Gustavo");
    expect(resume.candidateName.familyName).toBe("Papi");
  });

  it("carrying location.country separately from the formatted location string", () => {
    const ir = buildCvIR({ identity });
    const resume = buildAffindaExport(ir);
    expect(resume.location?.country).toBe("Brazil");
    expect(resume.location?.formatted).toBe("Aparecida, SP, Brazil");
  });

  it("mapping experience entries onto `workExperienceJobTitle` and `workExperienceOrganization`", () => {
    const ir = buildCvIR({
      identity,
      career: {
        experience: [
          { title: "Developer", company: "Euromoov", start_date: "2025-07", current: true },
        ],
      },
    });
    const resume = buildAffindaExport(ir);
    expect(resume.workExperience[0]?.workExperienceJobTitle).toBe("Developer");
    expect(resume.workExperience[0]?.workExperienceOrganization).toBe("Euromoov");
  });
});

describe("deriveAffindaPhrases", () => {
  it("labelling each phrase with its corresponding real Affinda schema field", () => {
    const ir = buildCvIR({ identity });
    const entries = deriveAffindaPhrases(ir);
    const country = entries.find((e) => e.phrase === "Brazil");
    expect(country?.affindaField).toBe("location.country");
    const firstName = entries.find((e) => e.phrase === "Gustavo");
    expect(firstName?.affindaField).toBe("candidateName.firstName");
  });

  it("deduplicating phrases that repeat across fields", () => {
    const ir = buildCvIR({ identity });
    const entries = deriveAffindaPhrases(ir);
    const keys = entries.map((e) => e.phrase.trim().toLowerCase());
    expect(new Set(keys).size).toBe(keys.length);
  });
});
