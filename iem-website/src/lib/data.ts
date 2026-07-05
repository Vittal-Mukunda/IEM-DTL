/** Canonical production URL for this site. Single source of truth for
 *  metadataBase, sitemap, robots, and JSON-LD. Update here when the domain
 *  changes (e.g. a custom domain replaces the Vercel preview URL). */
export const siteUrl = "https://iem-rvce.vercel.app";

export const siteConfig = {
  name: "Department of Industrial Engineering & Management",
  shortName: "IEM",
  institution: "R.V. College of Engineering (RVCE)",
  city: "Bengaluru",
  tagline: "Engineering meets management",
  phone: "+91-80-6717-8021",
  email: "hod.im@rvce.edu.in",
  address:
    "Department of IEM, RVCE, Mysore Road, R.V. Vidyaniketan Post, Bengaluru – 560 059, Karnataka, India",
  /** Official department page on the RVCE site (external reference). */
  website: "https://rvce.edu.in/department/iem/",
  socialLinks: {
    facebook: "https://www.facebook.com/idearvce/",
    linkedin:
      "https://in.linkedin.com/in/industrial-engineering-and-management-rv-college-of-engineering-358538299",
    academia:
      "https://rvce.academia.edu/Departments/Industrial_Engineering_and_Management",
  },
};

export const stats = [
  { label: "UG Intake", value: "60", suffix: "seats/year" },
  { label: "Highest Package", value: "₹22.5", suffix: "LPA" },
  { label: "Placement Rate", value: "70%+", suffix: "3-year avg" },
  { label: "Faculty Strength", value: "14", suffix: "members" },
  { label: "Research Papers", value: "202", suffix: "journal articles" },
  { label: "NBA Accredited", value: "Yes", suffix: "VTU Autonomous" },
];

export interface FacultyMember {
  name: string;
  designation: string;
  specialization: string;
  email: string;
  photo: string;
  publications?: number;
  scholarUrl?: string;
  orcid?: string;
  linkedin?: string;
  researchgate?: string;
  /** Official RVCE department profile page */
  profile?: string;
}

export const faculty: FacultyMember[] = [
  {
    name: "Dr. Rajeswara Rao K V S",
    designation: "Associate Professor & Head of Department",
    specialization: "Manufacturing Management, HRM, Industrial Engineering",
    email: "rajeswararao@rvce.edu.in",
    photo: "/images/faculty/rajeswara-rao.png",
    publications: 79,
    scholarUrl: "https://scholar.google.co.in/citations?user=kTAMzq0AAAAJ",
    orcid: "0000-0003-1592-5578",
    linkedin: "https://www.linkedin.com/in/getkvsrr/",
  },
  {
    name: "Dr. K N Subramanya",
    designation: "Professor & Principal",
    specialization:
      "Supply Chain Management, Lean Manufacturing, e-Enterprise Modeling, Cloud Supply Chain Networks",
    email: "subramanyakn@rvce.edu.in",
    photo: "/images/faculty/subramanya.jpg",
    publications: 87,
    scholarUrl: "https://scholar.google.co.in/citations?user=Q9EYl8wAAAAJ",
    orcid: "0000-0002-1838-5119",
    researchgate: "https://www.researchgate.net/profile/Kn-Subramanya",
    profile: "https://rvce.edu.in/about-k_n_subramanya/",
  },
  {
    name: "Dr. C K Nagendra Gupta",
    designation: "Professor",
    specialization: "Management, Management Information Systems",
    email: "nagendragupta@rvce.edu.in",
    photo: "/images/faculty/nagendra-gupta.jpg",
    publications: 29,
    scholarUrl: "https://scholar.google.co.in/citations?user=xr2n22gAAAAJ",
    orcid: "0000-0002-0217-7972",
    linkedin: "https://in.linkedin.com/in/nagendra-guptha-97a0041b",
    profile: "https://rvce.edu.in/department/iem/dr-c-k-nagendra-gupta/",
  },
  {
    name: "Dr. M N Vijayakumar",
    designation: "Associate Professor",
    specialization: "Software Quality, Statistics",
    email: "vijayakumar@rvce.edu.in",
    photo: "/images/faculty/vijayakumar.jpg",
    publications: 22,
    scholarUrl: "https://scholar.google.co.in/citations?user=pYruzLAAAAAJ",
    orcid: "0000-0001-5547-5677",
    profile: "https://rvce.edu.in/department/iem/dr-m-n-vijaya-kumar/",
  },
  {
    name: "Dr. Ramaa A",
    designation: "Associate Professor",
    specialization: "Supply Chain Management, Quality, Industrial Engineering",
    email: "ramaa@rvce.edu.in",
    photo: "/images/faculty/ramaa.jpg",
    publications: 10,
    orcid: "0000-0002-4762-6583",
    researchgate: "https://www.researchgate.net/profile/Ramaa-A",
    linkedin: "https://www.linkedin.com/in/dr-ramaa-nadig-b3778b16",
    profile: "https://rvce.edu.in/department/iem/dr-ramaa-a/",
  },
  {
    name: "Dr. Shobha N S",
    designation: "Assistant Professor",
    specialization:
      "Operations Management, Production Engineering, Operations Research",
    email: "shobhans@rvce.edu.in",
    photo: "/images/faculty/shobha.jpg",
    publications: 9,
    scholarUrl: "https://scholar.google.com/citations?user=uRzdWdYAAAAJ",
    profile: "https://rvce.edu.in/department/iem/dr-shobha-n-s/",
  },
  {
    name: "Dr. Vivekanand S Gogi",
    designation: "Assistant Professor",
    specialization: "Operations Research, Total Quality Management",
    email: "vivekanands@rvce.edu.in",
    photo: "/images/faculty/vivekanand-gogi.jpg",
    publications: 44,
    scholarUrl: "https://scholar.google.co.in/citations?user=0CAe9h4AAAAJ",
    orcid: "0000-0002-7645-8806",
    profile: "https://rvce.edu.in/department/iem/dr-vivekanand-s-gogi/",
  },
  {
    name: "Dr. Vikram N Bahadurdesai",
    designation: "Assistant Professor",
    specialization:
      "Quality Control & Testing, Software Reliability, Statistics for Decision Making",
    email: "vikramnb@rvce.edu.in",
    photo: "/images/faculty/vikram.jpg",
    publications: 14,
    scholarUrl: "https://scholar.google.co.in/citations?user=yp-DAwEAAAAJ",
    orcid: "0000-0001-7669-4043",
    linkedin: "https://in.linkedin.com/in/dr-vikram-n-bahadurdesai-3b954413",
    profile: "https://rvce.edu.in/department/iem/dr-vikram-n-bahadurdesai/",
  },
  {
    name: "Dr. Chitra B T",
    designation: "Assistant Professor",
    specialization:
      "Intellectual Property Rights, Constitutional Law, Cyber Law",
    email: "chitrabt@rvce.edu.in",
    photo: "/images/faculty/chitra.jpg",
    researchgate: "https://www.researchgate.net/profile/Chitra-Bt",
    profile: "https://rvce.edu.in/department/iem/dr-chitra-b-t/",
  },
  {
    name: "Dr. Bindu Ashwini C",
    designation: "Assistant Professor",
    specialization: "Psychology",
    email: "binduashwini@rvce.edu.in",
    photo: "/images/faculty/bindu-ashwini.jpg",
    publications: 1,
    orcid: "0009-0009-4506-2065",
    profile: "https://rvce.edu.in/department/iem/dr-bindu-ashwini-c/",
  },
  {
    name: "Prof. Shruthi M N",
    designation: "Assistant Professor",
    specialization:
      "Industrial Management, Computer Integrated Manufacturing, Robotics & Automation",
    email: "shruthimn@rvce.edu.in",
    photo: "/images/faculty/shruthi.jpg",
    profile: "https://rvce.edu.in/department/iem/prof-shruthi-m-n/",
  },
  {
    name: "Prof. B Nandini",
    designation: "Assistant Professor",
    specialization:
      "Management & Entrepreneurship, HRM, Marketing Management, Metrology & Measurements",
    email: "nandinibiem@rvce.edu.in",
    photo: "/images/faculty/nandini.jpg",
    publications: 18,
    scholarUrl: "https://scholar.google.co.in/citations?user=E_iHdH8AAAAJ",
    researchgate: "https://www.researchgate.net/profile/Nandini-B",
    profile: "https://rvce.edu.in/department/iem/prof-b-nandini/",
  },
  {
    name: "Prof. Bhaskar M G",
    designation: "Assistant Professor",
    specialization:
      "Management & Entrepreneurship, Organizational Behavior, Operations Management",
    email: "bhaskarmg@rvce.edu.in",
    photo: "/images/faculty/bhaskar.jpg",
    publications: 10,
    scholarUrl: "https://scholar.google.com/citations?user=OzU3wI4AAAAJ",
    linkedin: "https://www.linkedin.com/in/bhaskar-m-g-886444213",
    profile: "https://rvce.edu.in/department/iem/prof-bhaskar-m-g/",
  },
  {
    name: "Dr. N S Narahari",
    designation: "Visiting Professor",
    specialization: "Human Resource Management, Reliability Engineering",
    email: "naraharins@rvce.edu.in",
    photo: "/images/faculty/narahari.jpg",
    publications: 152,
    scholarUrl: "https://scholar.google.co.in/citations?user=uF8xKMEAAAAJ",
    orcid: "0000-0001-9677-3945",
    profile: "https://rvce.edu.in/department/iem/n-s-narahari/",
  },
];

export interface FacultyDetail {
  qualification: string;
  experience: string;
  joined?: string;
  bio?: string;
}

/** Keyed by faculty `name`. Verified from official RVCE profile pages, June 2026. */
export const facultyDetails: Record<string, FacultyDetail> = {
  "Dr. Rajeswara Rao K V S": {
    qualification:
      "Ph.D (Kuvempu University); M.S. Manufacturing Management (BITS Pilani); B.E. Industrial & Production Engineering (RVCE)",
    experience: "26 years teaching · 2 years industry",
    joined: "1999",
    bio: "Head of the Department since January 2025. Before academia he worked as a Quality Engineer in the garment-processing industry. His work spans industrial engineering, applied ergonomics and the functional areas of management.",
  },
  "Dr. K N Subramanya": {
    qualification:
      "Ph.D Supply Chain Management; MBA (HR); M.Tech Industrial Management; B.E. Industrial & Production Engineering",
    experience: "34+ years in teaching, research & administration",
    bio: "Principal of RVCE. He has held key positions including Director (Administration), Head of the IEM Department and Vice Principal, and has guided 100+ UG/PG projects and several research scholars.",
  },
  "Dr. C K Nagendra Gupta": {
    qualification: "Ph.D (VTU — Faculty of Mechanical Engineering Sciences)",
    experience: "28 years teaching · 5 years industry",
    joined: "1997",
  },
  "Dr. M N Vijayakumar": {
    qualification:
      "Ph.D (Avinashilingam University, Coimbatore); M.Tech (VTU)",
    experience: "19 years teaching · 2 years industry",
    joined: "2005",
  },
  "Dr. Ramaa A": {
    qualification:
      "Ph.D (Avinashilingam University for Women, Coimbatore); M.Tech (VTU)",
    experience: "20 years teaching",
    joined: "2006",
    bio: "Associate Professor and Associate Dean — Placement & Training. Her work centres on supply chain management, quality and industrial engineering.",
  },
  "Dr. Shobha N S": {
    qualification: "Ph.D (VTU, Belagavi); M.Tech (VTU)",
    experience: "21 years teaching",
    joined: "2005",
  },
  "Dr. Vivekanand S Gogi": {
    qualification:
      "Ph.D (VTU, Belagavi); M.Tech (Karnataka University, Dharwad)",
    experience: "24 years",
    joined: "2005",
  },
  "Dr. Vikram N Bahadurdesai": {
    qualification:
      "Ph.D (Avinashilingam University, Coimbatore); M.Tech (VTU)",
    experience: "18 years teaching · 1 year industry",
    joined: "2005",
  },
  "Dr. Chitra B T": {
    qualification:
      "Ph.D in Law (University of Mysore); M.Phil; LL.M (University of Mysore)",
    experience: "15 years teaching",
    joined: "2006",
  },
  "Dr. Bindu Ashwini C": {
    qualification:
      "Ph.D (University of Mysore); M.Sc Clinical Psychology (Bangalore University); B.Sc (BMSCE)",
    experience: "24 years",
    joined: "2009",
  },
  "Prof. Shruthi M N": {
    qualification: "M.Tech (VTU); Ph.D (VTU, Belagavi — registered 2015)",
    experience: "17 years",
    joined: "2008",
  },
  "Prof. B Nandini": {
    qualification:
      "M.Tech in Manufacturing Engineering & Management (VTU); Ph.D (registered 2017)",
    experience: "16 years teaching",
    joined: "2011",
  },
  "Prof. Bhaskar M G": {
    qualification: "M.Tech (VTU, 2012)",
    experience: "11 years teaching · 1 year industry",
    joined: "2014",
  },
  "Dr. N S Narahari": {
    qualification:
      "Ph.D (Avinashilingam University, Coimbatore); M.Tech (IIT Bombay)",
    experience: "35 years teaching",
    joined: "1987",
    bio: "With the department since 1987 — a founding-era faculty member, now Visiting Professor. His expertise spans HRM, reliability engineering, quality management and product design & manufacturing.",
  },
};

// Derived from the department's placement records for the last four drives
// (2022–23 → 2025–26). `companies` = distinct recruiters on campus,
// `offers` = total offers made, `selected` = offers accepted (offers minus
// declined, where recorded). `avgLPA`/`maxLPA` are the mean and highest CTC
// across all offers with a disclosed annual package (the 2025–26 average
// reflects the department's official reported figure). 2025–26 is the
// current, still-ongoing drive.
export const placementData = [
  {
    year: "2025–26",
    companies: 23,
    offers: 48,
    selected: 42,
    avgLPA: 12.45,
    maxLPA: 22.5,
    ongoing: true,
  },
  {
    year: "2024–25",
    companies: 28,
    offers: 49,
    selected: 40,
    avgLPA: 9.5,
    maxLPA: 21.45,
  },
  {
    year: "2023–24",
    companies: 31,
    offers: 52,
    selected: 52,
    avgLPA: 9.23,
    maxLPA: 18.0,
  },
  {
    year: "2022–23",
    companies: 35,
    offers: 50,
    selected: 50,
    avgLPA: 9.18,
    maxLPA: 16.76,
  },
];

// Recruiters drawn from the last four placement drives (2022–23 → 2025–26).
export const recruiters = [
  "Skyworks",
  "Micron",
  "GlobalFoundries",
  "Applied Materials",
  "Intel",
  "Cisco",
  "HPE",
  "Amazon",
  "J.P. Morgan",
  "Deloitte",
  "EY",
  "Genpact",
  "Grant Thornton",
  "Airbus",
  "Honda",
  "Bosch",
  "Volvo",
  "Hyundai",
  "Schneider Electric",
  "Honeywell",
  "AkzoNobel",
  "Havells",
  "Titan",
  "Flipkart",
  "Blinkit",
  "Licious",
  "o9 Solutions",
  "Blue Yonder",
  "Tredence",
  "The Math Company",
  "Ingersoll Rand",
  "Tejas Networks",
];

export const professionalSocieties = [
  { abbr: "IIIE", name: "Indian Institution of Industrial Engineering" },
  { abbr: "ORSI", name: "Operational Research Society of India" },
  { abbr: "IIMM", name: "Indian Institute of Materials Management" },
  { abbr: "NIQR", name: "National Institution for Quality & Reliability" },
  { abbr: "QCFI", name: "Quality Circle Forum of India" },
  { abbr: "ISQ", name: "Indian Society for Quality" },
  { abbr: "SIVAM", name: "Society for Industrial Engineering & Management" },
];

export interface DeptEvent {
  day: string;
  monthYear: string;
  title: string;
  text: string;
  upcoming?: boolean;
}

export const events: DeptEvent[] = [
  {
    day: "20–22",
    monthYear: "Nov 2026",
    title: "CSITSS 2026 — 10th International Conference",
    text: "Computational Systems & Information Technology for Sustainable Solutions, hosted at RVCE — featuring Best PhD Thesis and Best Research Paper awards.",
    upcoming: true,
  },
  {
    day: "Sep",
    monthYear: "2025",
    title: "Design Thinking & AI — Faculty Development Programme",
    text: "A five-day FDP on Design Thinking and Artificial Intelligence applied to Civil Engineering and Education, attended by 60 participants. IEM-RVCE faculty led a full-day hands-on session as guest resource persons at Adichunchanagiri Institute of Technology, Chikkamagalur.",
  },
  {
    day: "13–14",
    monthYear: "Jun 2025",
    title: "AI-ML Training for ABFRL (Industry Programme)",
    text: "A two-day intensive AI & ML training programme designed and delivered by IEM-RVCE faculty for the garment-manufacturing division of Aditya Birla Fashion & Retail (ABFRL) at its Chandapura plant — spanning eight sessions of AI-ML concepts and hands-on coding.",
  },
  {
    day: "16–18",
    monthYear: "May 2025",
    title: "EduAIthon 2025",
    text: "“Breaking Barriers: Simplifying Complex Engineering Concepts” — an institute innovation event.",
  },
  {
    day: "Jan",
    monthYear: "2025",
    title: "ISQ Symposium 2025",
    text: "A two-day symposium of the Indian Society for Quality (ISQ) organized by the Department of IEM, RVCE, including an industry visit to Sansera Engineering.",
  },
  {
    day: "Feb",
    monthYear: "2024",
    title: "International Certificate on Smart Manufacturing (with FH Dortmund)",
    text: "A seven-week India–Germany programme with FH Dortmund University — three weeks hosted at RVCE and four at TU Dortmund — bringing RVCE and German students together. IEM faculty led a hands-on Power BI session on “Data Visualization in Smart Manufacturing.”",
  },
  {
    day: "27–28",
    monthYear: "Feb 2024",
    title: "Rosenheim University Academic Visit",
    text: "Prof. Andreas Doleshel and Prof. Peter Zentgraft of Rosenheim University, Germany, visited RVCE — conducting sessions for visiting THWS students and exploring research collaboration with IEM-RVCE faculty.",
  },
  {
    day: "23–24",
    monthYear: "Sep 2022",
    title: "First ISQ Symposium",
    text: "Inaugural symposium of the Indian Society for Quality, hosted at RVCE with department faculty chairing sessions.",
  },
  {
    day: "10",
    monthYear: "Feb 2023",
    title: "Workshop: Entrepreneurship Development — Opportunities & Challenges",
    text: "Organized in collaboration with MSME (Micro, Small & Medium Enterprises).",
  },
  {
    day: "28–29",
    monthYear: "Oct 2021",
    title: "National Conference — Critical Thinking for Gen Z (CTGZMA-2021)",
    text: "An AICTE-sponsored national conference (in association with ISTE) hosted by the department, where IEM faculty and students won multiple Best Paper awards.",
  },
  {
    day: "21–25",
    monthYear: "Jun 2021",
    title: "AICTE-ATAL FDP — Operational Excellence through Digitalisation of Supply Chain",
    text: "A 5-day faculty development programme conducted by the Department of IEM with around 200 participants from across India.",
  },
  {
    day: "Jul",
    monthYear: "2019",
    title: "AICTE FDP — Workplace Ergonomics: Perspectives, Principles & Practices",
    text: "A two-week AICTE-sponsored faculty development programme organised by the Department of IEM.",
  },
  {
    day: "24–25",
    monthYear: "Jul 2017",
    title: "Workshop on Intellectual Property Rights (IPR)",
    text: "A two-day workshop organised by the Department of IEM in association with Djuris.",
  },
  {
    day: "2019",
    monthYear: "Ongoing",
    title: "Indo-German Collaboration with FHWS, Germany",
    text: "Design-thinking workshops and an undergraduate collaboration between RVCE/IEM and THWS — Technical University of Applied Sciences Würzburg-Schweinfurt (formerly FHWS), Germany.",
  },
];

export interface HistoryMilestone {
  year: string;
  title: string;
  text: string;
}

export const departmentHistory: HistoryMilestone[] = [
  {
    year: "1963",
    title: "RVCE is founded",
    text: "R.V. College of Engineering is established under the Rashtreeya Sikshana Samithi Trust (RSST).",
  },
  {
    year: "1980",
    title: "IEM begins",
    text: "The Industrial Engineering and Management programme is introduced at RVCE.",
  },
  {
    year: "1985",
    title: "An independent department",
    text: "IEM becomes a standalone department under Bangalore University.",
  },
  {
    year: "1992",
    title: "Engineering meets management",
    text: "Renamed 'Industrial Engineering and Management' to reflect its combined engineering and management focus.",
  },
  {
    year: "2007",
    title: "Autonomy granted",
    text: "The department is granted autonomous status by VTU, Belagavi and UGC, New Delhi.",
  },
  {
    year: "2008",
    title: "RVCE turns autonomous",
    text: "R.V. College of Engineering itself is granted autonomous status.",
  },
  {
    year: "Present",
    title: "Where it stands today",
    text: "NBA-accredited, a VTU-recognized Research Centre, a 60-seat UG intake, and B.E., M.Sc (Engg.), and Ph.D. programmes.",
  },
];

export interface CurriculumDomain {
  id: string;
  label: string;
  color: string;
}

export const curriculumDomains: CurriculumDomain[] = [
  { id: "ops", label: "Operations & Analytics", color: "#2d5da1" },
  { id: "scm", label: "Supply Chain", color: "#1f9d8f" },
  { id: "quality", label: "Quality", color: "#ff4d4d" },
  { id: "mgmt", label: "Management & HR", color: "#c2751a" },
  { id: "design", label: "Design & Manufacturing", color: "#7048b6" },
  { id: "finance", label: "Finance & Marketing", color: "#2f9e44" },
];

export interface CurriculumCourse {
  code: string;
  name: string;
  /** matches a CurriculumDomain id */
  domain: string;
  description: string;
  /** faculty names — must match entries in `faculty` exactly */
  faculty: string[];
}

export const curriculumCourses: CurriculumCourse[] = [
  {
    code: "IM244AI",
    name: "Operations Research",
    domain: "ops",
    description:
      "Mathematical models for decision making. Covers linear programming, queuing, inventory, and network optimization applied to industrial systems.",
    faculty: ["Dr. Shobha N S", "Dr. Vivekanand S Gogi"],
  },
  {
    code: "IM241AT",
    name: "Statistics for Data Analytics",
    domain: "ops",
    description:
      "Probability, distributions, hypothesis testing, and regression. The statistical foundation for analytics and quality work.",
    faculty: ["Dr. M N Vijayakumar", "Dr. Vikram N Bahadurdesai"],
  },
  {
    code: "21E6F3",
    name: "Systems Engineering",
    domain: "ops",
    description:
      "A whole-system view of designing and managing complex engineered systems across their full life cycle.",
    faculty: ["Dr. Shobha N S"],
  },
  {
    code: "21IM62",
    name: "Global Supply Chain Management",
    domain: "scm",
    description:
      "Sourcing, logistics, and distribution across borders. Inventory strategy, network design, and coordination in global supply networks.",
    faculty: ["Dr. K N Subramanya", "Dr. Ramaa A"],
  },
  {
    code: "21IM65E1",
    name: "Lean Manufacturing System",
    domain: "scm",
    description:
      "Eliminating waste with the Toyota Production System. Value stream mapping, pull systems, kanban, and continuous flow.",
    faculty: ["Dr. K N Subramanya"],
  },
  {
    code: "21IM63",
    name: "Quality Assurance",
    domain: "quality",
    description:
      "Building quality into products and processes. Inspection, statistical process control, reliability, and quality systems.",
    faculty: ["Dr. Ramaa A", "Dr. Vikram N Bahadurdesai"],
  },
  {
    code: "21IM65E2",
    name: "Total Quality Management",
    domain: "quality",
    description:
      "An organization-wide approach to continuous improvement. Six Sigma, customer focus, and a culture of quality.",
    faculty: ["Dr. Vivekanand S Gogi", "Dr. Ramaa A"],
  },
  {
    code: "21IM67",
    name: "Human Resource Management",
    domain: "mgmt",
    description:
      "Recruiting, developing, and retaining people. Organizational behavior, performance, and the human side of operations.",
    faculty: ["Dr. Rajeswara Rao K V S", "Dr. N S Narahari", "Prof. B Nandini"],
  },
  {
    code: "21HSI61B",
    name: "Principles of Management and Economics",
    domain: "mgmt",
    description:
      "Core management functions and microeconomic reasoning for engineers who will lead teams and read markets.",
    faculty: ["Dr. C K Nagendra Gupta", "Prof. Bhaskar M G"],
  },
  {
    code: "18G7H16",
    name: "Advanced Course in Entrepreneurship",
    domain: "mgmt",
    description:
      "From idea to venture. Business models, funding, and the design-thinking-to-startup pipeline the department encourages.",
    faculty: ["Prof. B Nandini", "Prof. Bhaskar M G"],
  },
  {
    code: "IM343AI",
    name: "CAD/CAM & Robotics",
    domain: "design",
    description:
      "Computer-aided design and manufacturing with robotics and automation for digitally integrated factories.",
    faculty: ["Prof. Shruthi M N"],
  },
  {
    code: "18IM47",
    name: "Design Thinking",
    domain: "design",
    description:
      "A structured, user-centered approach to problem solving. Empathize, define, ideate, prototype, and test.",
    faculty: ["Prof. Shruthi M N", "Prof. Bhaskar M G"],
  },
  {
    code: "18IM72",
    name: "Product Design and Development",
    domain: "design",
    description:
      "Turning concepts into manufacturable products. Requirements, design for manufacturing, and development workflows.",
    faculty: ["Prof. Shruthi M N"],
  },
  {
    code: "IM345AT",
    name: "Marketing Management",
    domain: "finance",
    description:
      "Understanding markets and customers. Segmentation, positioning, the marketing mix, and go-to-market strategy.",
    faculty: ["Prof. B Nandini"],
  },
  {
    code: "18IM43",
    name: "Engineering Economy and Costing",
    domain: "finance",
    description:
      "Time value of money, cost analysis, and investment decisions for engineering projects.",
    faculty: ["Prof. Bhaskar M G"],
  },
  {
    code: "21E6F8",
    name: "Elements of Financial Management",
    domain: "finance",
    description:
      "Reading financial statements, managing capital, and making sound money decisions inside an organization.",
    faculty: ["Dr. C K Nagendra Gupta"],
  },
];

export const researchThemes = [
  "Operations Research & Systems Optimization",
  "Manufacturing Systems & Automation",
  "Supply Chain & Logistics Management",
  "Human Factors & Ergonomics",
  "Quality & Reliability Engineering",
  "Data Analytics & Decision Sciences",
  "Sustainability & Circular Economy",
  "Technology Management & Innovation",
];

export const researchMetrics = {
  journalArticles: 202,
  booksChapters: 4,
  otherPublications: 125,
  scopusCitations: 213,
  hIndex: 8,
};

export interface Lab {
  name: string;
  description: string;
  /** Live photo URL from the official RVCE laboratories page */
  photo?: string;
}

export const labs: Lab[] = [
  {
    name: "Nondestructive Testing Laboratory",
    description:
      "Ultrasonic, eddy-current, magnetic-particle and liquid-penetrant testing to inspect materials and components for defects without damage.",
    photo: "/images/labs/nondestructive-testing.jpg",
  },
  {
    name: "Machine Shop",
    description:
      "Hands-on manufacturing — machining, welding and fabrication on conventional machine tools.",
    photo: "/images/labs/machine-shop.jpg",
  },
  {
    name: "Computer Lab",
    description:
      "Workstations running ERP, simulation, CAD and analytics software used across the curriculum.",
    photo: "/images/labs/computer-lab.png",
  },
  {
    name: "Metrology & Inspection Laboratory",
    description:
      "Precision instruments for dimensional metrology, gauging and quality inspection.",
    photo: "/images/labs/metrology.jpg",
  },
  {
    name: "Industrial Engineering Laboratory",
    description:
      "Work study, time-and-motion analysis, plant layout and method engineering.",
    photo: "/images/labs/industrial-engineering.jpg",
  },
  {
    name: "Ergonomics Laboratory",
    description:
      "Human-factors engineering — anthropometry, workplace design and usability assessment.",
    photo: "/images/labs/ergonomics.jpg",
  },
  {
    name: "CNC & Robotics Lab",
    description:
      "CNC machining, robotics and automation for computer-integrated manufacturing.",
    photo: "/images/labs/cnc-robotics.jpg",
  },
  {
    name: "Statistical Quality Control Lab",
    description:
      "Statistical process control, design of experiments and quality-engineering tools.",
    photo: "/images/labs/statistical-qc.jpg",
  },
];

export const faqs = [
  {
    question: "What is Industrial Engineering and Management (IEM)?",
    answer:
      "IEM is a discipline that optimizes integrated systems of people, materials, information, equipment, and energy. It combines core engineering with management (operations, supply chain, quality, finance, HR) and quantitative decision tools (operations research, statistics, simulation). At RVCE, it is a 4-year autonomous B.E. program.",
  },
  {
    question: "How is IEM different from Mechanical Engineering?",
    answer:
      "Mechanical Engineering designs and builds physical machines (CAD, thermodynamics, materials, prototyping). Industrial Engineering optimizes processes and systems (statistics, operations research, supply-chain modeling, systems optimization). Both are technically rigorous; they apply math to different problems.",
  },
  {
    question: "What is the intake and eligibility at RVCE?",
    answer:
      "The UG intake is 60 seats per year. Admission is through KCET or COMEDK (and management/NRI quota). RVCE also offers M.Sc (Engg.) and Ph.D. programs in the department.",
  },
  {
    question: "Is IEM at RVCE accredited?",
    answer:
      "Yes. The B.E. IEM program is NBA-accredited, VTU-autonomous, and the department hosts a VTU-recognized Research Centre for doctoral studies (Ph.D.). RVCE itself is AICTE-approved, NAAC A+ accredited, ranks in NIRF's top engineering band, and is a Centre of Excellence under TEQIP.",
  },
  {
    question: "What are the placement prospects?",
    answer:
      "Official data shows over 70% placement rate over the last 3 years. For the current 2025–26 drive the highest package is ₹22.5 LPA with an average of ₹12.45 LPA. Recruiters include Skyworks, Micron, GlobalFoundries, Applied Materials, Intel, Cisco, Airbus, Amazon, and 80+ more companies across the last four years.",
  },
  {
    question: "What jobs can I get with an IEM degree?",
    answer:
      "Graduates work as Industrial/Manufacturing Engineers, Quality/Six-Sigma Engineers, Operations & Supply-Chain Analysts, Business Analysts, Management Consultants, ERP/SAP Consultants, and PPC Engineers. Career paths span manufacturing, IT, consulting, finance, and analytics.",
  },
  {
    question: "Can I pursue MBA or MS after IEM?",
    answer:
      "Yes. IEM's engineering, management, and analytics base is a strong feeder for MBA (CAT/GMAT), and M.S./M.Tech in Industrial Engineering, Operations Research, Supply Chain, Engineering Management, or Data Science (GRE/GATE).",
  },
  {
    question: "What clubs and associations are in the department?",
    answer:
      "IDEA (InDustrial Engineering Association) is the official department student body. The department also has an IIE student chapter, plus access to institute-wide platforms like E-Cell, IEEE, and ACM chapters.",
  },
  {
    question: "What labs and facilities are available?",
    answer:
      "The department runs eight specialised laboratories — Nondestructive Testing, Machine Shop, Computer (ERP/Simulation), Metrology & Inspection, Industrial Engineering, Ergonomics, CNC & Robotics, and Statistical Quality Control — alongside the first-year IDEA Lab (IoT), a Design Thinking Lab, and four Hi-Tech classrooms with LCD projectors.",
  },
  {
    question: "Are there internship and industry exposure opportunities?",
    answer:
      "Yes. Students intern at industry and R&D organizations (BEL, DRDO, ISRO, BHEL), through Internshala, and at RVCE's 16+ Centres of Excellence. The curriculum includes 2 industry visits per semester, expert lectures, and collaborations with German universities.",
  },
  {
    question:
      "What is the curriculum like? What subjects are taught across the 4 years?",
    answer:
      "The B.E. (IEM) curriculum blends engineering, decision science and management across all four years. Core subjects include Operations Research, Operations Management, Supply Chain Management, Work Systems Design, Statistics for Data Analytics, Statistical Process Control (SPC), Quality Assurance & Total Quality Management, Ergonomics, Manufacturing Processes, CAD/CAM & Robotics, Metrology, Engineering Economics & Costing, Marketing, Human Resource Management, Financial Management and Design Thinking — finishing with a major capstone project. Early years add the IoT-based IDEA Lab and a Design-Thinking lab, and the latest schemes introduce Analytics, AI in Industrial Engineering, Digital Supply Chains and Sustainability Engineering.",
  },
  {
    question:
      "How relevant is the coursework to management, analytics, operations and business roles?",
    answer:
      "Very relevant — it is the branch's core strength. Courses such as Statistics for Data Analytics and Operations Research / Operations Management map directly to analytics and operations roles, while Supply Chain Management, Quality (Lean / Six Sigma), Marketing, Finance and HRM cover the management and business side. That mix is why graduates move comfortably into operations, supply-chain, analytics, consulting and business-analyst roles.",
  },
  {
    question: "What kind of placements do IEM students typically get?",
    answer:
      "Most offers are in operations, supply-chain, data-analytics, quality and consulting roles, across manufacturing, semiconductors, IT/consulting and finance. The department reports 70%+ placement over the last three years, and students note that a strong CGPA (around 8.5+) together with good skills makes placement very likely — though, as in any branch, no placement is guaranteed.",
  },
  {
    question:
      "What are the average, median and highest packages in recent years?",
    answer:
      "For the current 2025–26 drive the department's figures are an average of about ₹12.45 LPA and a highest of ₹22.5 LPA. Recent years: 2024–25 — avg ₹9.5 LPA, highest ₹21.45 LPA; 2023–24 — avg ₹9.23 LPA, highest ₹18 LPA; 2022–23 — avg ₹9.18 LPA, highest ₹16.76 LPA.",
  },
  {
    question: "Which companies recruit from IEM, and for what roles?",
    answer:
      "Regular recruiters include Skyworks, Micron, GlobalFoundries, Applied Materials, Intel, Cisco, HPE, Amazon, J.P. Morgan, Deloitte, EY, Genpact, Airbus, Honda, Bosch and Volvo, alongside operations/lean-consulting firms like Gemba Concepts. Roles are mostly in data analytics, supply-chain management, operations and quality.",
  },
  {
    question:
      "How are internships? Can students get analytics, consulting, operations, supply-chain or product internships?",
    answer:
      "Yes — across all of those areas. Students intern in analytics, operations, supply-chain, consulting and product roles, at industry and R&D organisations (BEL, DRDO, ISRO, BHEL), via platforms like Internshala, and at RVCE's Centres of Excellence, alongside two industry visits per semester.",
  },
  {
    question: "How difficult is it to maintain a high CGPA (8.5–9+) in IEM?",
    answer:
      "Students generally find it quite manageable to score well in IEM relative to the circuit branches, as long as they keep up with the continuous internal assessments, experiential-learning tasks and projects. As always, results come down to consistent effort rather than the branch alone.",
  },
  {
    question:
      "How is the academic workload compared to branches like CSE, ISE or ECE?",
    answer:
      "Students describe the workload as lighter than the theory- and lab-heavy circuit branches such as ECE, and roughly comparable to CSE — with more emphasis on projects, case studies and experiential learning than on dense problem sets. (This is a student perspective; individual experience varies.)",
  },
  {
    question: "How are the professors? Are they supportive and approachable?",
    answer:
      "The faculty are approachable and supportive. A practical tip from students: match the professor to the subject — each has clear specialisations (supply chain, operations research, quality, ergonomics, finance, HR, law, psychology), so approach the right person for the area you're exploring. The Faculty page lists every professor's specialisation, qualifications and contact.",
  },
  {
    question: "Is there a strong peer group in the branch?",
    answer:
      "With a small intake of 60, batches tend to be close-knit. Students report a strong, collaborative peer group, supported by the IDEA student association and plenty of team-based project work. (Peer culture naturally varies from year to year.)",
  },
  {
    question: "Is IEM a good choice for pursuing CAT/MBA after engineering?",
    answer:
      "It is one of the strongest engineering branches for an MBA path. IEM already teaches management, economics, finance, marketing, HR and operations alongside engineering, so moving into CAT/GMAT prep and a B-school curriculum is smoother than from most other branches — and many IEM graduates go on to top B-schools.",
  },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/faculty", label: "Faculty" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/resources", label: "Resources" },
  { href: "/research", label: "Research" },
  { href: "/placements", label: "Placements" },
  { href: "/events", label: "Events" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

// ── Study resources / notes, grouped by semester folder ──────────────
// Notes are attached by adding entries to a folder's `items` array (loose
// files) or grouping them under a named `subfolders` entry (e.g. a subject).
// label = display name, file = path under /public.
export interface ResourceItem {
  label: string;
  file: string;
  size?: string;
}
export interface ResourceSubfolder {
  name: string;
  items: ResourceItem[];
}
export interface ResourceFolder {
  sem: number;
  title: string;
  items: ResourceItem[];
  subfolders: ResourceSubfolder[];
}

// Ordinal helper for folder titles (3rd, 4th, … 8th).
const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

// Per-semester subject subfolders. Keyed by semester number; add subjects
// here as notes are collected.
const semesterSubfolders: Record<number, ResourceSubfolder[]> = {
  4: [
    {
      name: "Statistics for Data Analytics",
      items: [
        {
          label: "Unit 1",
          file: "/notes/sem4/statistics-for-data-analytics/unit-1.pdf",
          size: "590 KB",
        },
        {
          label: "Unit 2",
          file: "/notes/sem4/statistics-for-data-analytics/unit-2.pdf",
          size: "557 KB",
        },
        {
          label: "Unit 3",
          file: "/notes/sem4/statistics-for-data-analytics/unit-3.pdf",
          size: "408 KB",
        },
        {
          label: "Unit 4",
          file: "/notes/sem4/statistics-for-data-analytics/unit-4.pdf",
          size: "459 KB",
        },
        {
          label: "Unit 5",
          file: "/notes/sem4/statistics-for-data-analytics/unit-5.pdf",
          size: "636 KB",
        },
        {
          label: "Master Notes (All Units)",
          file: "/notes/sem4/statistics-for-data-analytics/master-all-units.pdf",
          size: "2.1 MB",
        },
      ],
    },
    {
      name: "CAD/CAM Robotics",
      items: [
        {
          label: "Unit 1",
          file: "/notes/sem4/cad-cam-robotics/unit-1.pdf",
          size: "4.5 MB",
        },
        {
          label: "Unit 2",
          file: "/notes/sem4/cad-cam-robotics/unit-2.pdf",
          size: "2.4 MB",
        },
        {
          label: "Unit 3",
          file: "/notes/sem4/cad-cam-robotics/unit-3.pdf",
          size: "974 KB",
        },
        {
          label: "Unit 4",
          file: "/notes/sem4/cad-cam-robotics/unit-4.pdf",
          size: "3.5 MB",
        },
        {
          label: "Unit 5",
          file: "/notes/sem4/cad-cam-robotics/unit-5.pdf",
          size: "975 KB",
        },
      ],
    },
    {
      name: "Operations Research",
      items: [
        {
          label: "Unit 1",
          file: "/notes/sem4/operations-research/unit-1.pdf",
          size: "2.1 MB",
        },
        {
          label: "Unit 2",
          file: "/notes/sem4/operations-research/unit-2.pdf",
          size: "760 KB",
        },
        {
          label: "Unit 3",
          file: "/notes/sem4/operations-research/unit-3.pdf",
          size: "1.2 MB",
        },
        {
          label: "Unit 4",
          file: "/notes/sem4/operations-research/unit-4.pdf",
          size: "1.7 MB",
        },
        {
          label: "Unit 5",
          file: "/notes/sem4/operations-research/unit-5.pdf",
          size: "818 KB",
        },
      ],
    },
  ],
};

// Semesters 3 → 8. Loose `items` start empty; subject notes live under
// `subfolders`.
export const resourceFolders: ResourceFolder[] = [3, 4, 5, 6, 7, 8].map(
  (sem) => ({
    sem,
    title: `${ordinal(sem)} Semester Resources`,
    items: [],
    subfolders: semesterSubfolders[sem] ?? [],
  }),
);

export interface SyllabusDoc {
  label: string;
  scheme: string;
  file: string;
  size: string;
}

export const syllabusDocs: SyllabusDoc[] = [
  {
    label: "2nd Year · Semesters III–IV",
    scheme: "2022 Scheme (2024 Edition)",
    file: "/syllabus/IEM-2022-2nd-year-III-IV.pdf",
    size: "1.4 MB",
  },
  {
    label: "3rd Year · Semesters V–VI",
    scheme: "2022 Scheme",
    file: "/syllabus/IEM-2022-3rd-year-V-VI.pdf",
    size: "1.9 MB",
  },
  {
    label: "4th Year · Semesters VII–VIII",
    scheme: "2022 Scheme",
    file: "/syllabus/IEM-2022-4th-year-VII-VIII.pdf",
    size: "2.9 MB",
  },
];

export const hodMessage = {
  name: "Dr. Rajeswara Rao K V S",
  title: "Associate Professor & Head of Department",
  photo: "/images/faculty/rajeswara-rao.png",
  credentials:
    "Ph.D. (Kuvempu University) · M.S. Manufacturing Management (BITS Pilani) · B.E. Industrial & Production Engineering (RVCE)",
  paragraphs: [
    "It gives me great pleasure to welcome you to our dynamic and forward-looking department, dedicated to excellence in education, research, and innovation. We strive to nurture creative problem-solvers and future-ready professionals through a learner-centric, outcome-based education (OBE) framework.",
    "The B.E. (IEM) programme emphasizes both theoretical and practical learning through project-based pedagogy, hackathons, tech fests, and student clubs. Our curriculum builds a strong foundation in Operations Research, Supply Chain Management, Quality Engineering, Ergonomics & Human Factors, Systems Engineering and Simulation — extended with cutting-edge modules in Analytics, Artificial Intelligence in Industrial Engineering, Digital Supply Chains, and Sustainability Engineering.",
  ],
};

export interface StudentAchievement {
  tag: string;
  title: string;
  detail: string;
}

export const studentAchievements: StudentAchievement[] = [
  {
    tag: "Innovation",
    title:
      "Project Chimera — India's first indigenous hybrid-electric vehicle prototype",
    detail:
      "Developed by final-year students across Mechanical, Electrical, Computer Science and Industrial Engineering (reported by The Hindu).",
  },
  {
    tag: "Best Paper",
    title: "Warehouse layout design using the CORELAP algorithm",
    detail:
      "Best Paper Award at the 13th International Conference on Science, Management & Engineering (ICSME 2017).",
  },
  {
    tag: "First Prize",
    title:
      "Ergonomic interventions in buses for physically-challenged commuters",
    detail:
      "First Prize at cogNIEscience 2019, The National Institute of Engineering, Mysuru.",
  },
  {
    tag: "Best Paper",
    title:
      "Critical thinking to augment waste management — a design-thinking approach",
    detail:
      "Best Paper (Critical Thinking in Technology) at AICTE/ISTE CTGZMA-2021, RVCE.",
  },
  {
    tag: "Research",
    title: "Capstone projects published as papers",
    detail:
      "Faculty mentor final-year students to convert major projects into journal and conference publications.",
  },
  {
    tag: "Platforms",
    title: "Institute-wide student teams open to IEM",
    detail:
      "Team Antariksh (student satellites), Ashwa Racing (Formula SAE), E-Cell, and IEEE/ACM chapters.",
  },
];
