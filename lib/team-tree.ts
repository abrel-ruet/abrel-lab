import { sortByHierarchy, type ResearchDomain, type TeamMember } from "@/lib/types";

export interface TreeNode {
  member: TeamMember;
  children: TreeNode[];
}

export interface DomainGroup {
  domain: ResearchDomain | null;
  /** Faculty assigned to this domain, shown as domain leads. */
  leads: TeamMember[];
  /** Top-level researchers/students of the domain, each with their mentees nested below. */
  roots: TreeNode[];
  /** Total number of researchers/students in the domain's trees. */
  size: number;
}

/** Faculty and alumni sit outside the student research trees. */
export const isTreeMember = (m: TeamMember) => m.memberType === "researcher" || m.memberType === "student";

/** IDs of a member and everyone below them, used to stop admins creating supervision cycles. */
export function descendantIds(members: TeamMember[], rootId: string): Set<string> {
  const ids = new Set<string>([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const m of members) {
      if (m.supervisorId && ids.has(m.supervisorId) && !ids.has(m.id)) {
        ids.add(m.id);
        grew = true;
      }
    }
  }
  return ids;
}

/**
 * Groups researchers/students into per-domain trees.
 * A member is nested under their supervisor when the supervisor is also a researcher/student;
 * otherwise (no supervisor, or supervised by faculty) they become a root in their own domain.
 */
export function buildDomainTrees(members: TeamMember[], domains: ResearchDomain[]): DomainGroup[] {
  const nodes = sortByHierarchy(members.filter(isTreeMember));
  const byId = new Map(nodes.map((m) => [m.id, m]));

  const childrenOf = new Map<string, TeamMember[]>();
  for (const m of nodes) {
    if (m.supervisorId && byId.has(m.supervisorId) && m.supervisorId !== m.id) {
      childrenOf.set(m.supervisorId, [...(childrenOf.get(m.supervisorId) ?? []), m]);
    }
  }

  const placed = new Set<string>();
  const build = (m: TeamMember): TreeNode => {
    placed.add(m.id);
    const kids = (childrenOf.get(m.id) ?? []).filter((k) => !placed.has(k.id));
    return { member: m, children: kids.map(build) };
  };
  const count = (n: TreeNode): number => 1 + n.children.reduce((s, c) => s + count(c), 0);

  const isRoot = (m: TeamMember) => !m.supervisorId || !byId.has(m.supervisorId);
  const domainIds = new Set(domains.map((d) => d.id));

  const groups: DomainGroup[] = sortByHierarchy(domains).map((domain) => {
    const roots = nodes.filter((m) => isRoot(m) && m.domainId === domain.id).map(build);
    return {
      domain,
      leads: sortByHierarchy(members.filter((m) => m.memberType === "professor" && m.domainId === domain.id)),
      roots,
      size: roots.reduce((s, r) => s + count(r), 0),
    };
  });

  // Roots without a valid domain, then anything a supervision cycle left unplaced.
  const unassigned: TreeNode[] = [];
  for (const m of nodes) {
    if (!placed.has(m.id) && isRoot(m) && !domainIds.has(m.domainId ?? "")) unassigned.push(build(m));
  }
  for (const m of nodes) {
    if (!placed.has(m.id)) unassigned.push(build(m));
  }
  if (unassigned.length) {
    groups.push({ domain: null, leads: [], roots: unassigned, size: unassigned.reduce((s, r) => s + count(r), 0) });
  }

  return groups;
}
