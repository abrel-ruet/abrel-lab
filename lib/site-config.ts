/**
 * Central lab identity & contact details.
 * Edit these values once and they update the navbar, footer, contact page and metadata.
 */
export const siteConfig = {
  name: "Advanced Bio-Resources Engineering Lab",
  shortName: "ABREL",
  tagline: "Engineering biology for a sustainable future",
  description:
    "ABREL advances research in bioprocess engineering, biomass valorization, environmental biotechnology, and sustainable bio-resources, turning living systems into solutions for energy, food, health, and the environment.",
  logo: "/abrel-logo.jpeg",
  email: "contact@abrel-lab.org",
  phone: "+880 1XXX-XXXXXX",
  address: "Department of Bio-Resources Engineering, University Campus",
  officeHours: "Sunday – Thursday, 9:00 AM – 5:00 PM",
  socials: {
    facebook: "",
    github: "",
    linkedin: "",
    researchgate: "",
  },
  certificatePrefix: "ABREL",
};

export const researchAreas = [
  {
    key: "bioprocess",
    title: "Bioprocess & Fermentation Engineering",
    short: "Bioprocess Engineering",
    description:
      "Design, scale-up, and optimization of microbial and enzymatic processes for high-value bio-products.",
  },
  {
    key: "bioenergy",
    title: "Biomass Valorization & Bioenergy",
    short: "Bioenergy",
    description:
      "Converting agricultural residues and waste biomass into biofuels, biogas, and platform chemicals.",
  },
  {
    key: "environmental",
    title: "Environmental Biotechnology",
    short: "Environmental Biotech",
    description:
      "Bioremediation, wastewater treatment, and microbial solutions for pollution and climate challenges.",
  },
  {
    key: "agrifood",
    title: "Agricultural & Food Bio-resources",
    short: "Agri-Food Bio-resources",
    description:
      "Biofertilizers, biopesticides, functional foods, and value-addition of indigenous bio-resources.",
  },
  {
    key: "microbial",
    title: "Microbial & Enzyme Engineering",
    short: "Microbial Engineering",
    description:
      "Strain improvement, metabolic engineering, and enzyme discovery for industrial biocatalysis.",
  },
  {
    key: "computational",
    title: "Bioinformatics & Systems Biology",
    short: "Bioinformatics",
    description:
      "Computational modelling, omics data analysis, and machine learning for biological system design.",
  },
] as const;
