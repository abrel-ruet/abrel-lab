export type MemberType = "professor" | "researcher" | "student" | "alumni";

export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  memberType: MemberType;
  designation: string;
  order: number;
  image?: string;
  bio: string;
  email?: string;
  github?: string;
  linkedin?: string;
  googleScholar?: string;
  researchGate?: string;
  researchInterests?: string[];
  /** ID of the research domain (`domains` collection) this member works in. */
  domainId?: string;
  /** ID of the team member who directly supervises/mentors this member. */
  supervisorId?: string;
}

export interface ResearchDomain {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
}

export type PublicationType = "journal" | "conference" | "book-chapter" | "patent" | "thesis";

export interface Publication {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  type: PublicationType;
  venue: string;
  year: number;
  abstract: string;
  keywords: string[];
  doi?: string;
  pdfUrl?: string;
  citations?: number;
}

export type ProjectStatus = "active" | "completed" | "ongoing";
export type ProjectType = "research" | "student" | "industry";

export interface Project {
  id: string;
  slug: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  description: string;
  fullDescription: string;
  technologies: string[];
  team: string[];
  startDate: string;
  endDate?: string;
  funding?: string;
  liveUrl?: string;
  featured: boolean;
  researchArea: string;
  coverImage?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
  tags: string[];
  featured: boolean;
  coverImage?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  link?: string;
}

export type ResourceType = "dataset" | "protocol" | "tool" | "code" | "paper";

export interface Resource {
  id: string;
  slug: string;
  title: string;
  resourceType: ResourceType;
  description: string;
  content?: string;
  category: string;
  tags: string[];
  fileUrl?: string;
  externalUrl?: string;
  coverImage?: string;
  featured: boolean;
}

export interface Certificate {
  id: string;
  certId: string;
  name: string;
  date: string;
  achievement: string;
}

export type RecruitmentStatus = "pending" | "reviewed" | "accepted" | "rejected";

export interface RecruitmentApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  degree: string;
  cgpa: string;
  batch: string;
  researchTrack: string;
  interests: string;
  experience: string;
  proposalTitle: string;
  proposalDesc: string;
  sop: string;
  cvUrl?: string;
  status: RecruitmentStatus;
  submittedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  submittedAt?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt?: string;
}

/**
 * Sorts by `order` ascending. Firestore's server-side `orderBy` silently
 * drops documents missing the field, so sort client-side and fall back to name.
 */
export function sortByHierarchy<T extends { order?: number; name: string }>(members: T[]): T[] {
  return [...members].sort((a, b) => {
    if (a.order != null && b.order != null) return a.order - b.order;
    if (a.order != null) return -1;
    if (b.order != null) return 1;
    return a.name.localeCompare(b.name);
  });
}
