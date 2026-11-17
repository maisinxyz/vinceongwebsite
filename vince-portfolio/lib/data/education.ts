import type { CourseCode, ProjectSlug } from "@/lib/data/projects/types";

export interface Program {
  id: "sfu" | "ib";
  institution: string;
  credential: string;
  field?: string;
  start: string;
  end: string;
  expected?: string;
  logo: string;
}

export interface Course {
  code: CourseCode;
  /** Only when the title is already in the repo. */
  title?: string;
  topics: string[];
  relatedProjects?: ProjectSlug[];
}

export interface Recognition {
  name: string;
  date: string;
  /** Local file, or omit for a monogram (no remote logos, hard rule 5). */
  logo?: string;
}

// Seeded from app/education/EducationPageClient.tsx and SPEC C. No grades.
export const PROGRAMS: Program[] = [
  {
    id: "sfu",
    institution: "Simon Fraser University",
    credential: "Bachelor of Applied Science",
    field: "Mechatronic Systems Engineering",
    start: "Sept 2025",
    end: "Aug 2029",
    expected: "2029",
    logo: "/logos/sfu.png",
  },
  {
    id: "ib",
    institution: "International Baccalaureate",
    credential: "IB Diploma Programme",
    start: "Sept 2023",
    end: "Jul 2025",
    logo: "/logos/ib.png",
  },
];

// Topics are exactly SPEC C's. Titles exist in the repo for four courses only.
export const COURSES: Course[] = [
  {
    code: "MSE 112",
    title: "Python, Sensors, Actuators, and Data Acquisition Techniques",
    topics: ["Python", "Raspberry Pi", "Computer vision"],
    relatedProjects: ["shape-sorting", "yolox-sorting"],
  },
  {
    code: "ENSC 151",
    title: "C++ Programming for Engineers",
    topics: ["C++ programming", "Version control"],
  },
  {
    code: "ENSC 100",
    title: "Design Process & Design Lab",
    topics: ["Design project", "Engineering workflow"],
    relatedProjects: ["spice"],
  },
  {
    code: "MSE 281",
    topics: ["ODEs for circuits", "Mass-spring-damper (MSD) systems"],
  },
  {
    code: "MSE 250",
    topics: ["Circuits"],
  },
  {
    code: "ENSC 120",
    title: "Electronics Laboratory Instruments Operation and Measurement Techniques",
    topics: ["Laboratory instrumentation"],
    relatedProjects: ["dice"],
  },
];

// Remote Wikimedia logos are dropped; these render as monograms until local files exist.
export const RECOGNITIONS: Recognition[] = [
  { name: "BC Achievement Scholarship", date: "Oct 2025" },
  { name: "Rotary Club of Langley Scholarship", date: "2025" },
  { name: "Greg and Brad Follett Memorial Scholarship", date: "2025" },
];
