/** Canonical production URL for this site. Single source of truth for
 *  metadataBase, sitemap, robots, and JSON-LD. Update here when the domain
 *  changes (e.g. a custom domain replaces the Vercel preview URL). */
export const siteUrl = "https://iemrvce.vercel.app";

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
  website:
    "https://rvce.edu.in/department/iem/department_of_industrial_engineering_and_management/",
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

export interface RecruiterOffer {
  company: string;
  /** Annual CTC as recorded in the placement sheet, e.g. "₹22.5 LPA".
   *  A range ("₹8–17.5 LPA") means multiple roles/offers at that company. */
  ctc: string;
  role: string;
}

// Company-wise offers from the current 2025–26 drive — package and role as
// recorded in the department's placement sheet, highest package first.
export const recruiterOffers: RecruiterOffer[] = [
  { company: "Skyworks", ctc: "₹22.5 LPA", role: "Foundry Operations Intern / Supply Chain Analyst Intern" },
  { company: "HPE", ctc: "₹8–17.5 LPA", role: "Supply Chain Analyst / Digital Transformation Analyst" },
  { company: "Applied Materials", ctc: "₹15–17.5 LPA", role: "Supplier Engineer / Buyer" },
  { company: "Blinkit (Eternal)", ctc: "₹17 LPA", role: "Associate Program Manager" },
  { company: "Micron", ctc: "₹13.17 LPA", role: "Manufacturing Engineer" },
  { company: "Schneider Electric", ctc: "₹12 LPA", role: "Industrialization Quality / R&D" },
  { company: "GlobalFoundries", ctc: "₹12 LPA", role: "Supply Chain Intern" },
  { company: "Hyperface", ctc: "₹11 LPA", role: "Product Manager Intern" },
  { company: "Bosch", ctc: "₹11 LPA", role: "Technical Graduate Trainee" },
  { company: "Honda", ctc: "₹10 LPA", role: "Graduate Engineer Trainee" },
  { company: "Airbus", ctc: "₹10 LPA", role: "SAP QM Functional Analyst" },
  { company: "Stackbox", ctc: "₹10 LPA", role: "Supply Chain & Operations Analyst" },
  { company: "EY", ctc: "₹9.19 LPA", role: "Associate Consultant – PAS" },
  { company: "AkzoNobel", ctc: "₹9 LPA", role: "Graduate Engineer Trainee" },
  { company: "Havells", ctc: "₹8.5 LPA", role: "Young Engineers Program" },
  { company: "Tejas Networks", ctc: "₹7.5 LPA", role: "Industrial Engineer / Supply Chain & Operations Analyst" },
  { company: "SBM Offshore", ctc: "₹7.4 LPA", role: "Supply Chain Trainee" },
  { company: "Gemba Concepts", ctc: "₹6 LPA", role: "Lean Consultant" },
  { company: "The Math Company", ctc: "₹5.5 LPA", role: "Trainee Analyst" },
  { company: "TTK Prestige", ctc: "₹5.5 LPA", role: "Graduate Engineer Trainee" },
  { company: "GEA", ctc: "₹5 LPA", role: "Graduate Engineer Trainee" },
  { company: "Mahindra Aerospace", ctc: "₹4.5 LPA", role: "Industrial Engineer" },
  { company: "Hachidori Robotics", ctc: "₹3.6 LPA", role: "Solution Engineer (Technical)" },
];

// Notable recruiters from the preceding drives (2022–23 → 2024–25) whose
// current-year package isn't listed above.
export const otherRecruiters = [
  "Amazon",
  "J.P. Morgan",
  "Cisco",
  "Intel",
  "Deloitte",
  "Genpact",
  "Grant Thornton",
  "Volvo",
  "Hyundai",
  "Honeywell",
  "Titan",
  "Flipkart",
  "Licious",
  "o9 Solutions",
  "Blue Yonder",
  "Tredence",
  "Ingersoll Rand",
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
    day: "28",
    monthYear: "Apr 2026",
    title: "Expert Talk — Electronics Manufacturing Industry in India & Globally",
    text: "Dr. Ing. Sirous Etemadi on India's semiconductor ecosystem under the PLI scheme and global trends in automotive electronics, IoT and smart manufacturing. Organised by the Placement Department (coordinator Dr. Ramaa A).",
  },
  {
    day: "27",
    monthYear: "Apr 2026",
    title: "Seminar — Business Culture of Japanese Companies",
    text: "Kazumitsu Kuroda (Japan Productivity Center) on Kaizen, Monozukuri and Omotenashi — the cultural roots of Japanese quality. 250 participants; coordinated by Dr. Ramaa A.",
  },
  {
    day: "24",
    monthYear: "Apr 2026",
    title: "Industrial Visit — Amazon Fulfilment Centre (BLR8), Bengaluru",
    text: "24 students explored large-scale warehouse operations — Warehouse Management System (WMS), barcode scanning, conveyor systems and automated dimensioning. Coordinator: Prof. Bhaskar M G.",
  },
  {
    day: "22",
    monthYear: "Apr 2026",
    title: "“Study in Europe” Awareness Event",
    text: "RVCE–INDOGERMAN Collaborative Cell hosted delegates from leading European universities on scholarships, visas and admissions, at the Design Thinking Huddle. 100 students; coordinator Dr. Vikram N B.",
  },
  {
    day: "30 Mar – 3 Apr",
    monthYear: "2026",
    title: "AMISE 5.0 — Conference Paper Presentations",
    text: "Students and faculty presented three papers on AI in manufacturing (video summarization, screw-presence detection, assembly-line balancing) at AMISE 5.0, Dayananda Sagar Academy of Technology & Management.",
  },
  {
    day: "24–26",
    monthYear: "Mar 2026",
    title: "AUKOM 1 — Metrology Training & Certification",
    text: "A 3-day AUKOM Level 1 course with Carl Zeiss India on coordinate measuring machines (CMMs), precision measurement and quality assurance. 70 students certified. Coordinator: Prof. Nandini B.",
  },
  {
    day: "Jan–Feb",
    monthYear: "2026",
    title: "Turing Award Laureate Prof. Jeffrey D. Ullman visits RVCE",
    text: "The Turing Award-winning computer scientist spoke on the impact of AI in education — that AI aids coding but strong fundamentals remain essential, and AI is a collaborator, not a replacement.",
  },
  {
    day: "23.02 – 13.03",
    monthYear: "2026",
    title: "International Certificate Course — Smart Manufacturing (Batch 3)",
    text: "Jointly offered by RVCE and Fachhochschule Dortmund (Germany); 26 RVCE and 7 FH Dortmund participants. Batch 3 inaugurated 23 Feb; FH Dortmund delegates also visited the VTU Regional Office.",
  },
  {
    day: "18",
    monthYear: "Feb 2026",
    title: "MoU — Fintech Center of Excellence × Cettlx (VealthX)",
    text: "A Memorandum of Understanding for training and software development in the fintech domain, valid until 2030, to build industry-relevant student skills.",
  },
  {
    day: "20–22",
    monthYear: "Nov 2025",
    title: "CSITSS-2025 — 9th IEEE International Conference",
    text: "Computational Systems & Information Technology for Sustainable Solutions, hosted at RVCE in association with Florida International University and FH Dortmund; technically co-sponsored by IEEE Bangalore Section.",
  },
  {
    day: "24",
    monthYear: "Nov 2025",
    title: "MoU — MSGP Infra Tech (Sustainable Waste Management & Circular Economy)",
    text: "RVCE signed an MoU with MSGP Infra Tech Pvt. Ltd. for training and capacity building in sustainable waste management and circular economy, spanning the IEM, CSE, ECE and ET departments.",
  },
  {
    day: "13",
    monthYear: "Dec 2025",
    title: "BeeHive 2.0 — Case-let Competition",
    text: "An IDEA case-study contest facilitated by Dr. M. A. Narasimha Murthy (Senior Director, Infineon Technologies), sharpening students' analytical reasoning and industry mindset.",
  },
  {
    day: "3–5",
    monthYear: "Nov 2025",
    title: "ICEAMST-2025 — 3rd International Conference",
    text: "Emerging Applications of Material Science and Technology, conducted at RVCE, with department faculty as local-arrangement, web and conference chairs.",
  },
  {
    day: "3–7",
    monthYear: "Nov 2025",
    title: "23rd Asian Network for Quality (ANQ) Congress",
    text: "Department faculty served as organisers and contributors at the ANQ Congress, MS Ramaiah University of Applied Sciences — strengthening international collaboration in quality management.",
  },
  {
    day: "25",
    monthYear: "Aug 2025",
    title: "Graduation Ceremony 2025 — Chief Guest ISRO Chairman",
    text: "RVCE's convocation at Poornima Palace, with Dr. V. Narayanan, Chairman of ISRO, as chief guest. The department graduated 49 students; Diya K Mutha won the Gold Medal for first rank.",
  },
  {
    day: "22",
    monthYear: "Sep 2025",
    title: "MoU — HOF University of Applied Sciences, Germany",
    text: "RVCE's sixth German partner institution. A visiting HOF delegation toured the MG and WIRIN Labs, complementing existing ties with THWS, THR and HTW Dresden.",
  },
  {
    day: "8",
    monthYear: "Jul 2025",
    title: "RVCE–Berlin Talent Event",
    text: "Hosted with E-Cell and the Indo-German Collaborative Cell; chief guest Senator Franziska Giffey (Berlin) with a delegation of German CEOs. Keynote on Berlin's startup ecosystem and a “Bengaluru to Berlin” panel.",
  },
  {
    day: "16",
    monthYear: "Sep 2025",
    title: "MANTHAN 2025 — “Green Pay” wins at FKCCI",
    text: "An IEM team (Nihal, Chinmaya, Disha, Devdeekshith) placed 4th of 537 teams with a ₹75,000 cash award at the FKCCI business-plan competition. Mentor: Dr. Ramaa A.",
  },
  {
    day: "23–24",
    monthYear: "Jan 2025",
    title: "Symposium — Digital Transformation through Quality 4.0",
    text: "Organised by the ISQ Bangalore Chapter and RVCE, with an industry visit to Carl Zeiss and Sansera Engineering as part of the Quality 4.0 track.",
  },
  {
    day: "Mar",
    monthYear: "2025",
    title: "MoU — Tata Technologies CIIIT (₹50 crore)",
    text: "RVCE and Tata Technologies established the Center for Invention, Innovation, Incubation & Training on campus — a first-of-its-kind southern-India initiative in smart manufacturing and Industry 4.0.",
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
  /** semester (3–8) in which the course is offered (2022 scheme) */
  sem: number;
  /** matches a CurriculumDomain id */
  domain: string;
  description: string;
  /** faculty names — must match entries in `faculty` exactly; empty when
   * the allocation varies year to year or the course is taught by another
   * department */
  faculty: string[];
}

// Core (non-elective) courses of the 2022 scheme, semesters 3–8, as listed
// in the official scheme & syllabus booklets. Elective groups (Basket
// courses, Professional Core Electives, Institutional Electives, NPTEL,
// Ability Enhancement) and audit/bridge courses are intentionally excluded.
// Semester 8 carries only the Major Project (IM481P).
export const curriculumCourses: CurriculumCourse[] = [
  // ── Semester 3 ──
  {
    code: "MA231TB",
    name: "Statistics, Laplace Transform and Numerical Methods",
    sem: 3,
    domain: "ops",
    description:
      "Statistics, curve fitting, Laplace transforms, complex analysis, and numerical methods for PDEs — the mathematical toolkit behind the analytics-heavy semesters that follow.",
    faculty: [],
  },
  {
    code: "IM233AI",
    name: "Work Systems Design",
    sem: 3,
    domain: "ops",
    description:
      "Work study, method and time study, work measurement, and workplace design to improve productivity and design efficient, human-centred work systems. Theory with integrated lab.",
    faculty: ["Dr. Rajeswara Rao K V S", "Dr. Vikram N Bahadurdesai"],
  },
  {
    code: "IM234AI",
    name: "Manufacturing Processes",
    sem: 3,
    domain: "design",
    description:
      "How raw material becomes finished product — metal forming, welding, cutting tool technology, drilling, and machine tools. Theory with integrated lab.",
    faculty: [],
  },
  {
    code: "IM235AI",
    name: "Digital Metrology",
    sem: 3,
    domain: "quality",
    description:
      "Measurement systems, sensors and transducers, limits, fits and tolerances, laser interferometry, and coordinate measuring machines. Theory with integrated lab.",
    faculty: ["Prof. B Nandini"],
  },

  // ── Semester 4 ──
  {
    code: "IM241AT",
    name: "Statistics for Data Analytics",
    sem: 4,
    domain: "ops",
    description:
      "Probability, distributions, hypothesis testing, and regression. The statistical foundation for analytics and quality work.",
    faculty: ["Dr. M N Vijayakumar", "Dr. Vikram N Bahadurdesai"],
  },
  {
    code: "IM343AI",
    name: "CAD/CAM & Robotics",
    sem: 4,
    domain: "design",
    description:
      "Computer-aided design and manufacturing with robotics and automation for digitally integrated factories. Theory with integrated lab.",
    faculty: ["Prof. Shruthi M N"],
  },
  {
    code: "IM244AI",
    name: "Operations Research",
    sem: 4,
    domain: "ops",
    description:
      "Mathematical models for decision making. Covers linear programming, queuing, inventory, and network optimization applied to industrial systems. Theory with integrated lab.",
    faculty: ["Dr. Shobha N S", "Dr. Vivekanand S Gogi"],
  },
  {
    code: "IM345AT",
    name: "Marketing Management",
    sem: 4,
    domain: "finance",
    description:
      "Understanding markets and customers. Segmentation, positioning, the marketing mix, and go-to-market strategy.",
    faculty: ["Prof. B Nandini"],
  },
  {
    code: "HS248AT",
    name: "Universal Human Values",
    sem: 4,
    domain: "mgmt",
    description:
      "Harmony in the self, in relationships, in society, and with nature — the ethics and values foundation for professional life.",
    faculty: [],
  },

  // ── Semester 5 ──
  {
    code: "HS351TA",
    name: "Entrepreneurship and Intellectual Property Rights",
    sem: 5,
    domain: "mgmt",
    description:
      "From idea to venture — opportunity recognition, business models, and funding — plus patents, copyrights, and trademarks to protect what you create.",
    faculty: ["Dr. Chitra B T", "Prof. B Nandini", "Prof. Bhaskar M G"],
  },
  {
    code: "IM352IA",
    name: "Operations Management",
    sem: 5,
    domain: "ops",
    description:
      "Planning and running production systems — forecasting, capacity, aggregate planning, scheduling, and inventory. Theory and practice.",
    faculty: ["Dr. Shobha N S", "Prof. Bhaskar M G"],
  },
  {
    code: "IM353IA",
    name: "Quality Assurance",
    sem: 5,
    domain: "quality",
    description:
      "Building quality into products and processes. Inspection, statistical process control, reliability, and quality systems. Theory and practice.",
    faculty: ["Dr. Ramaa A", "Dr. Vikram N Bahadurdesai"],
  },
  {
    code: "IM254TA",
    name: "Finance Accounting and Costing",
    sem: 5,
    domain: "finance",
    description:
      "Financial statements, cost accounting, budgeting, and engineering economics — reading the numbers behind management decisions.",
    faculty: ["Dr. C K Nagendra Gupta", "Prof. Bhaskar M G"],
  },

  // ── Semester 6 ──
  {
    code: "HS261TA",
    name: "Principles of Management and Economics",
    sem: 6,
    domain: "mgmt",
    description:
      "Core management functions and microeconomic reasoning for engineers who will lead teams and read markets.",
    faculty: ["Dr. C K Nagendra Gupta", "Prof. Bhaskar M G"],
  },
  {
    code: "IM362IA",
    name: "Supply Chain Management",
    sem: 6,
    domain: "scm",
    description:
      "Sourcing, logistics, and distribution. Inventory strategy, network design, and coordination across supply networks. Theory and practice.",
    faculty: ["Dr. K N Subramanya", "Dr. Ramaa A"],
  },
  {
    code: "IM363IA",
    name: "Ergonomics",
    sem: 6,
    domain: "ops",
    description:
      "Human factors engineering — anthropometry, workplace and equipment design fitted to human capabilities and limitations. Theory and practice.",
    faculty: ["Dr. Rajeswara Rao K V S"],
  },
  {
    code: "IM364TA",
    name: "Human Resource Management & Analytics",
    sem: 6,
    domain: "mgmt",
    description:
      "Recruiting, developing, and retaining people — organizational behavior and performance, with analytics applied to workforce decisions.",
    faculty: ["Dr. Rajeswara Rao K V S", "Dr. N S Narahari", "Prof. B Nandini"],
  },

  // ── Semester 7 ──
  {
    code: "HS271TA",
    name: "Indian Knowledge System",
    sem: 7,
    domain: "mgmt",
    description:
      "India's traditional knowledge systems — science, technology, philosophy, and governance — and their relevance to modern engineering practice.",
    faculty: [],
  },
  {
    code: "IM372IA",
    name: "Product Design & Development",
    sem: 7,
    domain: "design",
    description:
      "Turning concepts into manufacturable products. Requirements, design for manufacturing, and development workflows. Theory with integrated lab.",
    faculty: ["Prof. Shruthi M N"],
  },
  {
    code: "IM373TA",
    name: "Total Quality Management",
    sem: 7,
    domain: "quality",
    description:
      "An organization-wide approach to continuous improvement. Six Sigma, customer focus, and a culture of quality.",
    faculty: ["Dr. Vivekanand S Gogi", "Dr. Ramaa A"],
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
  { href: "/placements", label: "Placements" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/faculty", label: "Faculty" },
  { href: "/resources", label: "Resources" },
  { href: "/events", label: "Events" },
  { href: "/research", label: "Research" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
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
  3: [
    {
      name: "Work Systems Design",
      items: [
        {
          label: "Course Notes (All Units)",
          file: "/notes/sem3/work-systems-design/course-notes-all-units.pdf",
          size: "1.4 MB",
        },
        {
          label: "Handwritten Notes (All Units)",
          file: "/notes/sem3/work-systems-design/handwritten-notes-all-units.pdf",
          size: "27 MB",
        },
        {
          label: "Unit 1 – Nature of Work (Notes)",
          file: "/notes/sem3/work-systems-design/unit-1-nature-of-work-notes.pdf",
          size: "3.5 MB",
        },
        {
          label: "Unit 1 – Worker-Machine Systems (Handwritten)",
          file: "/notes/sem3/work-systems-design/unit-1-worker-machine-systems-handwritten.pdf",
          size: "6.3 MB",
        },
        {
          label: "Unit 2 – Automation Strategies",
          file: "/notes/sem3/work-systems-design/unit-2-automation-strategies.pdf",
          size: "56 KB",
        },
        {
          label: "Unit 3 – Work Measurement",
          file: "/notes/sem3/work-systems-design/unit-3-work-measurement.pdf",
          size: "228 KB",
        },
        {
          label: "Unit 5 – Ergonomics (Handwritten)",
          file: "/notes/sem3/work-systems-design/unit-5-ergonomics-handwritten.pdf",
          size: "2.1 MB",
        },
        {
          label: "Unit 5 – Industrial Accidents & Injuries",
          file: "/notes/sem3/work-systems-design/unit-5-industrial-accidents-and-injuries.pdf",
          size: "88 KB",
        },
        {
          label: "Unit 1 – Essay Question Bank",
          file: "/notes/sem3/work-systems-design/unit-1-essay-question-bank.pdf",
          size: "284 KB",
        },
        {
          label: "Unit 2 – Essay Question Bank",
          file: "/notes/sem3/work-systems-design/unit-2-essay-question-bank.pdf",
          size: "304 KB",
        },
        {
          label: "Unit 3 – Essay Question Bank",
          file: "/notes/sem3/work-systems-design/unit-3-essay-question-bank.pdf",
          size: "372 KB",
        },
        {
          label: "Unit 4 – Essay Question Bank",
          file: "/notes/sem3/work-systems-design/unit-4-essay-question-bank.pdf",
          size: "316 KB",
        },
        {
          label: "Unit 5 – Essay Question Bank",
          file: "/notes/sem3/work-systems-design/unit-5-essay-question-bank.pdf",
          size: "300 KB",
        },
        {
          label: "Unit 1 – MCQ Question Bank",
          file: "/notes/sem3/work-systems-design/unit-1-mcq-question-bank.pdf",
          size: "256 KB",
        },
        {
          label: "Unit 2 – MCQ Question Bank",
          file: "/notes/sem3/work-systems-design/unit-2-mcq-question-bank.pdf",
          size: "248 KB",
        },
        {
          label: "Unit 3 – MCQ Question Bank",
          file: "/notes/sem3/work-systems-design/unit-3-mcq-question-bank.pdf",
          size: "272 KB",
        },
        {
          label: "Unit 4 – MCQ Question Bank",
          file: "/notes/sem3/work-systems-design/unit-4-mcq-question-bank.pdf",
          size: "256 KB",
        },
        {
          label: "Unit 5 – MCQ Question Bank",
          file: "/notes/sem3/work-systems-design/unit-5-mcq-question-bank.pdf",
          size: "252 KB",
        },
        {
          label: "CIE Question Papers (2022-23)",
          file: "/notes/sem3/work-systems-design/cie-question-papers-2022-23.pdf",
          size: "1.6 MB",
        },
        {
          label: "SEE Question Paper (April 2024)",
          file: "/notes/sem3/work-systems-design/see-question-paper-april-2024.pdf",
          size: "100 KB",
        },
        {
          label: "SEE Question Papers (Collection)",
          file: "/notes/sem3/work-systems-design/see-question-papers-collection.pdf",
          size: "552 KB",
        },
        {
          label: "Textbook",
          file: "/notes/sem3/work-systems-design/work-systems-design-textbook.pdf",
          size: "4.0 MB",
        },
      ],
    },
    {
      name: "Manufacturing Processes",
      items: [
        {
          label: "Unit 1 – Introduction to Manufacturing",
          file: "/notes/sem3/manufacturing-processes/unit-1-introduction-to-manufacturing.pdf",
          size: "2.0 MB",
        },
        {
          label: "Unit 2 – Metal Forming Processes",
          file: "/notes/sem3/manufacturing-processes/unit-2-metal-forming-processes.pdf",
          size: "1.6 MB",
        },
        {
          label: "Unit 3 – Welding Processes",
          file: "/notes/sem3/manufacturing-processes/unit-3-welding-processes.pdf",
          size: "1.5 MB",
        },
        {
          label: "Unit 4 – Cutting Tool Technology",
          file: "/notes/sem3/manufacturing-processes/unit-4-cutting-tool-technology.pdf",
          size: "2.4 MB",
        },
        {
          label: "Unit 5 – Drilling & Machine Tools",
          file: "/notes/sem3/manufacturing-processes/unit-5-drilling-and-machine-tools.pdf",
          size: "1.7 MB",
        },
        {
          label: "CIE 1 Notes",
          file: "/notes/sem3/manufacturing-processes/cie-1-notes.pdf",
          size: "328 KB",
        },
        {
          label: "Unit 1 – Class Notes",
          file: "/notes/sem3/manufacturing-processes/unit-1.pdf",
          size: "2.7 MB",
        },
        {
          label: "Unit 3 – Class Notes",
          file: "/notes/sem3/manufacturing-processes/unit-3.pdf",
          size: "891 KB",
        },
        {
          label: "Unit 4 – Class Notes",
          file: "/notes/sem3/manufacturing-processes/unit-4.pdf",
          size: "2.5 MB",
        },
        {
          label: "Unit 5 – Class Notes",
          file: "/notes/sem3/manufacturing-processes/unit-5.pdf",
          size: "3.5 MB",
        },
      ],
    },
    {
      name: "Digital Metrology",
      items: [
        {
          label: "Unit 1 – Generalized Measurement System",
          file: "/notes/sem3/digital-metrology/unit-1-generalized-measurement-system.pdf",
          size: "1.2 MB",
        },
        {
          label: "Unit 1 – Characteristics & Errors",
          file: "/notes/sem3/digital-metrology/unit-1-characteristics-and-errors.pdf",
          size: "1.5 MB",
        },
        {
          label: "Unit 1 – Transducers",
          file: "/notes/sem3/digital-metrology/unit-1-transducers.pdf",
          size: "452 KB",
        },
        {
          label: "Unit 2 – Sensors",
          file: "/notes/sem3/digital-metrology/unit-2-sensors.pdf",
          size: "676 KB",
        },
        {
          label: "Unit 3 – Limits, Fits & Tolerances",
          file: "/notes/sem3/digital-metrology/unit-3-limits-fits-and-tolerances.pdf",
          size: "4.6 MB",
        },
        {
          label: "Unit 4 – Optical Interferometry & Form Measurements",
          file: "/notes/sem3/digital-metrology/unit-4-optical-interferometry-and-form-measurements.pdf",
          size: "11 MB",
        },
        {
          label: "Unit 4 – Laser Metrology",
          file: "/notes/sem3/digital-metrology/unit-4-laser-metrology.pdf",
          size: "668 KB",
        },
        {
          label: "Unit 5 – Coordinate Measuring Machines",
          file: "/notes/sem3/digital-metrology/unit-5-coordinate-measuring-machines.pdf",
          size: "2.1 MB",
        },
        {
          label: "Unit 5 – CMM (Reading Material)",
          file: "/notes/sem3/digital-metrology/unit-5-cmm-reading-material.pdf",
          size: "424 KB",
        },
        {
          label: "CIE 1 Notes",
          file: "/notes/sem3/digital-metrology/cie-1-notes.pdf",
          size: "352 KB",
        },
        {
          label: "Model Question Paper (IM235AI)",
          file: "/notes/sem3/digital-metrology/model-question-paper-im235ai.pdf",
          size: "252 KB",
        },
        {
          label: "Model Question Paper (2021 Scheme)",
          file: "/notes/sem3/digital-metrology/model-question-paper-2021-scheme.pdf",
          size: "120 KB",
        },
      ],
    },
    {
      name: "Mathematics III (MA231TB)",
      items: [
        {
          label: "Syllabus",
          file: "/notes/sem3/mathematics-iii/syllabus-ma231tb.pdf",
          size: "404 KB",
        },
        {
          label: "Unit 1 – Statistics",
          file: "/notes/sem3/mathematics-iii/unit-1-statistics.pdf",
          size: "1.2 MB",
        },
        {
          label: "Unit 1 – Statistics (Written Notes)",
          file: "/notes/sem3/mathematics-iii/unit-1-statistics-written-notes.pdf",
          size: "7.3 MB",
        },
        {
          label: "Statistics – Supplementary Notes",
          file: "/notes/sem3/mathematics-iii/statistics-supplementary-notes.pdf",
          size: "608 KB",
        },
        {
          label: "Curve Fitting & Correlation",
          file: "/notes/sem3/mathematics-iii/curve-fitting-and-correlation.pdf",
          size: "980 KB",
        },
        {
          label: "Curve Fitting – Solved Examples",
          file: "/notes/sem3/mathematics-iii/curve-fitting-solved-examples.pdf",
          size: "428 KB",
        },
        {
          label: "Laplace Transforms – Notes",
          file: "/notes/sem3/mathematics-iii/laplace-transforms-notes.pdf",
          size: "1.1 MB",
        },
        {
          label: "Complex Analysis – Notes",
          file: "/notes/sem3/mathematics-iii/complex-analysis-notes.pdf",
          size: "536 KB",
        },
        {
          label: "Unit 5 – Numerical Methods for PDE",
          file: "/notes/sem3/mathematics-iii/unit-5-numerical-methods-for-pde.pdf",
          size: "380 KB",
        },
        {
          label: "Assignment – Laplace Transforms",
          file: "/notes/sem3/mathematics-iii/assignment-laplace-transforms.pdf",
          size: "172 KB",
        },
        {
          label: "Assignment – Inverse Laplace Transforms",
          file: "/notes/sem3/mathematics-iii/assignment-inverse-laplace-transforms.pdf",
          size: "136 KB",
        },
        {
          label: "Assignment 2 – Numerical Methods for PDE",
          file: "/notes/sem3/mathematics-iii/assignment-2-numerical-methods-for-pde.pdf",
          size: "452 KB",
        },
        {
          label: "Tutorial Sheets – Statistics",
          file: "/notes/sem3/mathematics-iii/tutorial-sheets-statistics.pdf",
          size: "320 KB",
        },
        {
          label: "MATLAB Manual (Experiential Learning)",
          file: "/notes/sem3/mathematics-iii/matlab-manual-experiential-learning.pdf",
          size: "760 KB",
        },
        {
          label: "Model Question Paper",
          file: "/notes/sem3/mathematics-iii/model-question-paper.pdf",
          size: "228 KB",
        },
        {
          label: "SEE Question Paper (April 2024)",
          file: "/notes/sem3/mathematics-iii/see-question-paper-april-2024.pdf",
          size: "296 KB",
        },
        {
          label: "Unit 4 – Notes",
          file: "/notes/sem3/mathematics-iii/unit-4-notes.pdf",
          size: "1.8 MB",
        },
        {
          label: "Unit 4 – Inverse Laplace Transform",
          file: "/notes/sem3/mathematics-iii/unit-4-inverse-laplace-transform.pdf",
          size: "900 KB",
        },
        {
          label: "Unit 3 – Laplace Transform Tutorial Sheets",
          file: "/notes/sem3/mathematics-iii/unit-3-laplace-transform-tutorial-sheets.pdf",
          size: "658 KB",
        },
        {
          label: "Laplace Equation",
          file: "/notes/sem3/mathematics-iii/laplace-equation.pdf",
          size: "5.5 MB",
        },
      ],
    },
    {
      name: "Lab Manuals",
      items: [
        {
          label: "Digital Metrology Lab Manual",
          file: "/notes/sem3/lab-manuals/digital-metrology-lab-manual.pdf",
          size: "11 MB",
        },
        {
          label: "Manufacturing Processes Lab Manual",
          file: "/notes/sem3/lab-manuals/manufacturing-processes-lab-manual.pdf",
          size: "5.8 MB",
        },
        {
          label: "Work Systems Design Lab Manual",
          file: "/notes/sem3/lab-manuals/work-systems-design-lab-manual.pdf",
          size: "5.6 MB",
        },
      ],
    },
    {
      name: "Question Papers (CIE & SEE)",
      items: [
        {
          label: "CIE 1 Question Papers (2024-25)",
          file: "/notes/sem3/question-papers/cie-1-question-papers-2024-25.pdf",
          size: "3.8 MB",
        },
        {
          label: "CIE 2 Question Papers (2024-25)",
          file: "/notes/sem3/question-papers/cie-2-question-papers-2024-25.pdf",
          size: "2.6 MB",
        },
        {
          label: "CIE 3 Question Papers (2024-25)",
          file: "/notes/sem3/question-papers/cie-3-question-papers-2024-25.pdf",
          size: "3.0 MB",
        },
        {
          label: "SEE Question Papers (Collection)",
          file: "/notes/sem3/question-papers/see-question-papers-collection.pdf",
          size: "4.1 MB",
        },
        {
          label: "CIE 2 (Additional Set)",
          file: "/notes/sem3/question-papers/cie-2.pdf",
          size: "11 MB",
        },
        {
          label: "CIE 3 (Additional Set)",
          file: "/notes/sem3/question-papers/cie-3.pdf",
          size: "11 MB",
        },
        {
          label: "Mathematics III – Question Paper (MAT231TB)",
          file: "/notes/sem3/question-papers/mat231tb-question-paper.pdf",
          size: "5.7 MB",
        },
      ],
    },
  ],
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
        {
          label: "Unit 1 – Detailed Notes",
          file: "/notes/sem4/statistics-for-data-analytics/unit-1-notes.pdf",
          size: "21 MB",
        },
        {
          label: "Unit 2 – Detailed Notes",
          file: "/notes/sem4/statistics-for-data-analytics/unit-2-notes.pdf",
          size: "13 MB",
        },
        {
          label: "Unit 3 – Estimation Notes",
          file: "/notes/sem4/statistics-for-data-analytics/unit-3-estimation-notes.pdf",
          size: "34 MB",
        },
        {
          label: "Unit 4 – Detailed Notes",
          file: "/notes/sem4/statistics-for-data-analytics/unit-4-notes.pdf",
          size: "3.0 MB",
        },
        {
          label: "Unit 5 – Detailed Notes",
          file: "/notes/sem4/statistics-for-data-analytics/unit-5-notes.pdf",
          size: "28 MB",
        },
        {
          label: "Question Bank with Solutions (Unitwise)",
          file: "/notes/sem4/statistics-for-data-analytics/question-bank-with-solutions-unitwise.pdf",
          size: "447 KB",
        },
        {
          label: "Question Bank – All Units (Part B)",
          file: "/notes/sem4/statistics-for-data-analytics/question-bank-all-units-part-b.docx",
          size: "635 KB",
        },
        {
          label: "Question Bank – Units 2 & 3",
          file: "/notes/sem4/statistics-for-data-analytics/question-bank-units-2-and-3.docx",
          size: "175 KB",
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
    {
      name: "Question Papers (CIE & SEE)",
      items: [
        {
          label: "CIE 1",
          file: "/notes/sem4/question-papers/cie-1.pdf",
          size: "19 MB",
        },
        {
          label: "CIE 2",
          file: "/notes/sem4/question-papers/cie-2.pdf",
          size: "8.9 MB",
        },
        {
          label: "CIE 3",
          file: "/notes/sem4/question-papers/cie-3.pdf",
          size: "9.7 MB",
        },
        {
          label: "IM241AT – Question Paper",
          file: "/notes/sem4/question-papers/im241at-question-paper.pdf",
          size: "169 KB",
        },
        {
          label: "Supplementary Examinations",
          file: "/notes/sem4/question-papers/supplementary-examinations.pdf",
          size: "556 KB",
        },
        {
          label: "SEE – Past Year Question Papers",
          file: "/notes/sem4/question-papers/see-past-year-question-papers.pdf",
          size: "4.4 MB",
        },
      ],
    },
    {
      name: "Marketing Management",
      items: [
        {
          label: "Digital Marketing – Master Notes",
          file: "/notes/sem4/marketing-management/digital-marketing-master-notes.pdf",
          size: "2.9 MB",
        },
        {
          label: "Modern Marketing Blueprint",
          file: "/notes/sem4/marketing-management/modern-marketing-blueprint.pdf",
          size: "16 MB",
        },
        {
          label: "The Digital Strategy Blueprint",
          file: "/notes/sem4/marketing-management/the-digital-strategy-blueprint.pdf",
          size: "14 MB",
        },
        {
          label: "Product Lifecycle Playbook",
          file: "/notes/sem4/marketing-management/product-lifecycle-playbook.pdf",
          size: "14 MB",
        },
        {
          label: "The Content Marketing Engine",
          file: "/notes/sem4/marketing-management/the-content-marketing-engine.pdf",
          size: "13 MB",
        },
        {
          label: "Content Engineering Blueprint",
          file: "/notes/sem4/marketing-management/content-engineering-blueprint.pdf",
          size: "14 MB",
        },
        {
          label: "SEO & Digital Visibility Blueprint",
          file: "/notes/sem4/marketing-management/seo-digital-visibility-blueprint.pdf",
          size: "14 MB",
        },
        {
          label: "Search Everywhere Optimization",
          file: "/notes/sem4/marketing-management/search-everywhere-optimization.pdf",
          size: "9.6 MB",
        },
        {
          label: "The Social Strategy Stack",
          file: "/notes/sem4/marketing-management/the-social-strategy-stack.pdf",
          size: "15 MB",
        },
        {
          label: "Modern Email Playbook",
          file: "/notes/sem4/marketing-management/modern-email-playbook.pdf",
          size: "11 MB",
        },
        {
          label: "CIE 1 – Scheme of Valuation (April 2026)",
          file: "/notes/sem4/marketing-management/cie-1-scheme-of-valuation-april-2026.pdf",
          size: "220 KB",
        },
        {
          label: "CIE 2 – Scheme & Solution (May 2026)",
          file: "/notes/sem4/marketing-management/cie-2-scheme-and-solution-may-2026.pdf",
          size: "398 KB",
        },
        {
          label: "CIE 3 – Scheme & Solution (June 2026)",
          file: "/notes/sem4/marketing-management/cie-3-scheme-and-solution-june-2026.pdf",
          size: "204 KB",
        },
      ],
    },
    // Core courses still awaiting notes — placeholders, empty until uploaded.
    { name: "Universal Human Values", items: [] },
  ],
  // Sems 5–7: one folder per core course (2022 scheme). Where question
  // papers are available they live under a shared "Question Papers"
  // subfolder; subject folders fill in as notes are collected. Sem 8 has no
  // taught courses (Major Project only), so it stays without subfolders.
  5: [
    {
      name: "Question Papers (CIE)",
      items: [
        {
          label: "CIE 1 (2024-25)",
          file: "/notes/sem5/question-papers/cie-1-2024-25.pdf",
          size: "5.0 MB",
        },
        {
          label: "CIE 1",
          file: "/notes/sem5/question-papers/cie-1.pdf",
          size: "4.9 MB",
        },
        {
          label: "CIE 2 (2024-25)",
          file: "/notes/sem5/question-papers/cie-2-2024-25.pdf",
          size: "4.4 MB",
        },
        {
          label: "CIE 2",
          file: "/notes/sem5/question-papers/cie-2.pdf",
          size: "4.0 MB",
        },
        {
          label: "CIE 3",
          file: "/notes/sem5/question-papers/cie-3.pdf",
          size: "2.5 MB",
        },
        {
          label: "Scanned Paper (June 2026)",
          file: "/notes/sem5/question-papers/scanned-paper-jun-2026.pdf",
          size: "4.5 MB",
        },
      ],
    },
    { name: "Entrepreneurship & Intellectual Property Rights", items: [] },
    { name: "Operations Management", items: [] },
    { name: "Quality Assurance", items: [] },
    { name: "Finance Accounting and Costing", items: [] },
  ],
  6: [
    {
      name: "Question Papers (CIE)",
      items: [
        {
          label: "CIE 1 (2024-25)",
          file: "/notes/sem6/question-papers/cie-1-2024-25.pdf",
          size: "12 MB",
        },
        {
          label: "CIE 2 (2024-25)",
          file: "/notes/sem6/question-papers/cie-2-2024-25.pdf",
          size: "11 MB",
        },
        {
          label: "CIE 2 (2025-26)",
          file: "/notes/sem6/question-papers/cie-2-2025-26.pdf",
          size: "5.9 MB",
        },
        {
          label: "CIE 2",
          file: "/notes/sem6/question-papers/cie-2.pdf",
          size: "7.2 MB",
        },
        {
          label: "CIE 3 (2024-25)",
          file: "/notes/sem6/question-papers/cie-3-2024-25.pdf",
          size: "7.5 MB",
        },
        {
          label: "CIE 3 (2025-26)",
          file: "/notes/sem6/question-papers/cie-3-2025-26.pdf",
          size: "11 MB",
        },
      ],
    },
    { name: "Principles of Management and Economics", items: [] },
    { name: "Supply Chain Management", items: [] },
    { name: "Ergonomics", items: [] },
    { name: "Human Resource Management & Analytics", items: [] },
  ],
  7: [
    {
      name: "Question Papers (CIE)",
      items: [
        {
          label: "CIE 1 (2024-25)",
          file: "/notes/sem7/question-papers/cie-1-2024-25.pdf",
          size: "12 MB",
        },
        {
          label: "CIE 1 (2025-26)",
          file: "/notes/sem7/question-papers/cie-1-2025-26.pdf",
          size: "4.5 MB",
        },
        {
          label: "CIE 2 (2024-25)",
          file: "/notes/sem7/question-papers/cie-2-2024-25.pdf",
          size: "13 MB",
        },
        {
          label: "CIE 2 (2025-26)",
          file: "/notes/sem7/question-papers/cie-2-2025-26.pdf",
          size: "11 MB",
        },
        {
          label: "CIE 3 (2024-25)",
          file: "/notes/sem7/question-papers/cie-3-2024-25.pdf",
          size: "13 MB",
        },
        {
          label: "CIE 3 (2025-26)",
          file: "/notes/sem7/question-papers/cie-3-2025-26.pdf",
          size: "12 MB",
        },
      ],
    },
    { name: "Indian Knowledge System", items: [] },
    { name: "Product Design & Development", items: [] },
    { name: "Total Quality Management", items: [] },
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

// ── Department newsletters ───────────────────────────────────────────
// PDFs render inline (embedded viewer) on the About page — readers scroll
// through them on-site without downloading. Drop the PDF into
// `public/newsletters/` and add an entry here; the About page picks it up
// automatically. Leave the array empty to show the "coming soon" placeholder.
export interface Newsletter {
  /** Display title, e.g. "IEM Newsletter — Spring 2026" */
  title: string;
  /** Path under /public, e.g. "/newsletters/spring-2026.pdf" */
  file: string;
  /** Optional edition label, e.g. "Spring 2026" */
  edition?: string;
}

// "THE INSIGHT" — the IDEA student-association newsletter. Ordered most
// recent first: the top entry renders inline on the About page; the rest are
// offered as downloads.
export const newsletters: Newsletter[] = [
  {
    title: "The Insight — March–April 2026",
    file: "/newsletters/idea-newsletter-mar-apr-2026.pdf",
    edition: "March–April 2026",
  },
  {
    title: "The Insight — January–February 2026",
    file: "/newsletters/idea-newsletter-jan-feb-2026.pdf",
    edition: "January–February 2026",
  },
  {
    title: "The Insight — November–December 2025",
    file: "/newsletters/idea-newsletter-nov-dec-2025.pdf",
    edition: "November–December 2025",
  },
  {
    title: "The Insight — September–October 2025",
    file: "/newsletters/idea-newsletter-sep-oct-2025.pdf",
    edition: "September–October 2025",
  },
  {
    title: "The Insight — July–August 2025",
    file: "/newsletters/idea-newsletter-jul-aug-2025.pdf",
    edition: "July–August 2025",
  },
  {
    title: "The Insight — May–June 2025",
    file: "/newsletters/idea-newsletter-may-jun-2025.pdf",
    edition: "May–June 2025",
  },
  {
    title: "The Insight — March–April 2025",
    file: "/newsletters/idea-newsletter-mar-apr-2025.pdf",
    edition: "March–April 2025",
  },
  {
    title: "The Insight — January–February 2025",
    file: "/newsletters/idea-newsletter-jan-feb-2025.pdf",
    edition: "January–February 2025",
  },
];

export interface AlumniSpeak {
  name: string;
  /** Batch / years at RVCE, e.g. "2007–2011" */
  batch: string;
  /** Current role & organisation */
  role: string;
  /** Short pull-quote or summary drawn from their newsletter feature */
  quote: string;
  /** Newsletter edition the feature appeared in */
  edition: string;
}

// Alumni featured in "Alumni Speaks" across newsletter editions.
export const alumniSpeaks: AlumniSpeak[] = [
  {
    name: "Sainath Jain",
    batch: "2007–2011",
    role: "Founder, HIVADO",
    quote:
      "IEM is the only course I know that hands you both halves of the world — the analytical mind of an engineer and the strategic eye of a manager — and trusts you to put them together.",
    edition: "March–April 2026",
  },
  {
    name: "Veena Anantchandran Madhur",
    batch: "2004–2008",
    role: "Director, Product Management, Palo Alto Networks",
    quote:
      "Industrial Engineering is fundamentally about systems thinking — understanding how technology, people and processes interact. That mindset shaped every stage of my career, from Intel and Nintendo to Microsoft.",
    edition: "January–February 2026",
  },
  {
    name: "Sunder Madaakshira",
    batch: "1990–1994",
    role: "Chief Marketing Officer, Sinch India",
    quote:
      "What I learnt at RVCE, and specifically in the Industrial & Production Engineering department, has served me very well over the years. When I see RVCE today, I say 'Those ARE the days' instead of 'Those WERE the days.'",
    edition: "November–December 2025",
  },
];

export interface NotableAlumnus {
  name: string;
  role: string;
  batch?: string;
}

// Alumni who returned to mentor, judge projects, or partner with the
// department (from newsletter features).
export const notableAlumni: NotableAlumnus[] = [
  { name: "Mahidar Jayaram", role: "Director, Wyzmindz", batch: "1998" },
  { name: "Nishith Raj", role: "Director, Product Management, Zepto" },
  {
    name: "Manoj K Y",
    role: "Planning Analyst (formerly Aditya Birla Fashion & Retail)",
  },
  { name: "Revathi J", role: "Business Transformation Manager, Accenture" },
  { name: "Harshita U Kumar", role: "Product Manager, Target" },
];

export interface Patent {
  title: string;
  applicationNo?: string;
  status: string;
  date?: string;
  inventors: string;
}

// Patents filed / granted with department faculty (from newsletters).
export const patents: Patent[] = [
  {
    title: "GENESIS: Automated Urban Layout Planning System and Method Thereof",
    applicationNo: "202641030239 A",
    status: "Published",
    date: "Published 27 March 2026",
    inventors: "Rajeswara Rao K V S (IEM), Somesh Nandi (AIML), et al.",
  },
  {
    title:
      "Real-Time Robotic Ecosystem for Multi-Class Segregation and Monitoring of Electronic Waste",
    applicationNo: "202541099530",
    status: "Filed",
    date: "Filed 15 October 2025",
    inventors:
      "Ramakanth Kumar P, Hemavathy R, Dr. K N Subramanya, H R Aneesh Tejas, Hitesh S P",
  },
  {
    title:
      "A Multi-Layered Mask with Hydrophobic Nanofibers as a Functional Layer with a Smart Valve for Protection against Aerosol Transmission of COVID-19",
    applicationNo: "202041019902",
    status: "Granted",
    date: "04 February 2025",
    inventors:
      "Dr. Shireesha G, Prof. Sudha R Karbari, Dr. Uttara Kumari M, Dr. Subramanya K N",
  },
  {
    title: "Laser Marking Machine",
    applicationNo: "444771-001",
    status: "Applied",
    date: "Filed 20 January 2025",
    inventors: "Dr. Bharatish A, Muhammad Anas, Dr. Vijaya Kumar M N, Vineeth Rao",
  },
  {
    title: "Flat Plate Solar Collector with Wavy Shaped Riser Tubes",
    status: "Granted (Design)",
    date: "Filed 08 August 2023",
    inventors:
      "Lakshmikant Shivanayak, Gowreesh Subramanya S, Sreenivasalu Reddy N, Vijaya Kumar M N, Channaveerayya, Kailash",
  },
];

export interface FundedProject {
  title: string;
  faculty: string;
  agency: string;
  amount: string;
}

// Sponsored / consultancy projects (from newsletters).
export const fundedProjects: FundedProject[] = [
  {
    title:
      "AI-based Automated Threat Detection and Incident Response System",
    faculty: "Dr. Ramakanth Kumar, Dr. Minal, Dr. Pavithra, Dr. Ramaa A, Dr. Shilpa",
    agency: "Secureinteli Technologies Pvt Ltd",
    amount: "₹20,00,000",
  },
  {
    title:
      "Impact Damage Assessment of 3D-Woven Composites Using Fiber Bragg Grating (FBG) Sensors for Aerospace Applications",
    faculty: "Dr. Ramesh S Sharma, Dr. Vijayakumar M N, Dr. Somesh Nandi",
    agency: "RSST Seed Grant under FIRF (Prototype Development, TRL 4)",
    amount: "₹4,00,000",
  },
];

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  scope?: "International" | "National";
}

// A selection of recent student–faculty publications reported in the IDEA
// newsletters (2025–2026). Not exhaustive — see the newsletters for the full
// record.
export const publications: Publication[] = [
  {
    title:
      "Domain-Adaptive Transfer Learning for Privacy-Preserving Scam Call Detection",
    authors: "Ibrahim Bagwan, Adheesh Mudgal, B. Nandini",
    venue: "IEEE Access, Vol. 14, pp. 39391–39399 (2026)",
    scope: "International",
  },
  {
    title:
      "Imparting System-Development Skills and Project Based Learning to First-Year Engineering Students",
    authors:
      "C. P. Ravikumar, S. Kendaganna Swamy, K. N. Subramanya, P. M. Rajashree, P. Shruthi",
    venue: "IETE Journal of Education (Taylor & Francis), 2026",
    scope: "International",
  },
  {
    title:
      "A Digital Twin Framework for Dual-Path Estimation of Battery State of Charge and State of Health Using Hybrid Physics-Informed Machine Learning",
    authors:
      "Andhe Dharani, Siva Subbarao Patange, M. Krishna, Raja Vidya, R. Bindu, K. N. Subramanya",
    venue: "IEEE Access (Scopus)",
    scope: "International",
  },
  {
    title:
      "Forecast Accuracy Improvement and Purchase Order Automation Using a Multi-Model Approach in Semiconductor Supply Chain: A Case Study",
    authors:
      "J. Gohitha Maheshwari, N. Tanushri, Ramana Gowda, Vatsal Singh Bhutiyal, K. V. S. Rajeswara Rao",
    venue: "IEEE Access, Vol. 14 (Scopus)",
    scope: "International",
  },
  {
    title:
      "A Comprehensive Review of Temperature Monitoring and Cold-Chain Integrity Across IoT in Vaccine Storage",
    authors: "Yashwanth L, Sneha S. Shrigiri, Sinchana Chetan, Ritika S. Ghattad",
    venue: "IJESE, Vol. 14, Issue 3",
    scope: "International",
  },
  {
    title:
      "Psychological Profiling of Digital Dependency Using Machine Learning and Behavioral Clustering Techniques",
    authors: "C. Bindu Ashwini, C. S. Harsha, B. M. Sreekar, Harshith K. Murthy",
    venue: "IEEE Access, Vol. 14 (Scopus)",
    scope: "International",
  },
  {
    title:
      "A Comparative Study and Review of Optimization Methods for Strategic Allocation of EV Charging Stations",
    authors:
      "Dr. C. K. Nagendra Gupta, Rishabh Patawri, Samadrito Mukherjee, Satyam Kumar",
    venue: "Industrial Engineering Journal, Vol. XIX, Issue 01",
    scope: "National",
  },
  {
    title:
      "Plasmonics-Driven Graphene Electronics for Beyond-5G and 6G Communication Systems",
    authors: "Dr. Vikram N. Bahadurdesai",
    venue: "Journal of Material Science",
    scope: "International",
  },
  {
    title:
      "Competitiveness Enablers in Handicraft Toy Manufacturing Industries Based on ISM-Fuzzy MICMAC Analysis",
    authors: "V. Meghasree, Dr. C. K. Nagendra Guptha",
    venue: "IEEE Access, Vol. 13 (June 2025)",
    scope: "International",
  },
  {
    title:
      "Technology-Driven Methodology for Wind Resource Assessment and Energy Yield Optimization in Wind Farm Development",
    authors: "Inchara N Aradhya, Suraj R S, R Chandra Kumar, Prof. Nandini B",
    venue: "14th ICRCET (IFERP), Scopus-indexed",
    scope: "International",
  },
  {
    title:
      "Stochastic Profit Optimization in Agile Supply Chains Using Monte Carlo Simulations and Markov Decision Processes",
    authors:
      "Siddhanth N Kagganty, Tulasi Ram K Naik, Inchara N Aradhya, Nishaanth S, Nivya Muchikel, Y Sailaja",
    venue: "IEEE Conference",
    scope: "International",
  },
  {
    title:
      "Quality 4.0 in Higher Education Institutions: A Framework for Digital Transformation (Best Paper Award)",
    authors: "Dr. Ramaa A, Dr. Subramanya K N",
    venue: "Symposium on Digital Transformation through Quality 4.0 (ISQ × RVCE)",
    scope: "National",
  },
  {
    title:
      "AI-Driven Quality Management: Transforming Operational Excellence in the Digital Era",
    authors:
      "N. S. Narahari, K. N. Subramanya, C. K. Nagendraguptha, M. N. Vijayakumar",
    venue: "23rd Asian Network for Quality (ANQ) Congress 2025",
    scope: "International",
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
  {
    tag: "First Place",
    title: "Ashwa Racing — Formula Bharat 2026",
    detail:
      "Srividya Sriraman, Pranav Ramakrishnan and Syed Nadeem secured 2nd place in the Business Plan Presentation and P6 overall at Kari Motor Speedway, Coimbatore.",
  },
  {
    tag: "Hackathon",
    title: "1st Place — “The Lazarus Missions: Nuclear Winter”",
    detail:
      "Adhar Chaudhari (2nd sem) won the UG Batch 2029 category at the hackathon by IEEE CIS, NIT Karnataka.",
  },
  {
    tag: "Best Paper",
    title: "Electrostatic Foam Suppression Module",
    detail:
      "Shreni C Shetty and R Shradha (with peers) published in IJRASET and won Best Paper — First Prize at Jain (Deemed-to-be University), School of Sciences.",
  },
  {
    tag: "Case Comp",
    title: "1st Place — Case Alchemy, BITS Goa",
    detail:
      "Team Equilibrium (Ningraju M, Sriram Hegde) topped 444 teams with a five-year strategic roadmap for an EV-battery-components manufacturer.",
  },
  {
    tag: "Business Plan",
    title: "MANTHAN 2025 — “Green Pay” (FKCCI)",
    detail:
      "An IEM team placed 4th out of 537 teams with a ₹75,000 cash award at the FKCCI business-plan competition.",
  },
  {
    tag: "Dance",
    title: "Team Enigma — intercollegiate champions",
    detail:
      "Saptarshi Mandal helped Team Enigma secure 1st place in Western dance across St. Xavier's, BMSCE, IIT Bangalore, Mount Carmel, NMIT, JSS, SJB and more.",
  },
  {
    tag: "Sports",
    title: "Women's Football — VTU champions",
    detail:
      "The RVCE Women's Football Team (the college's first-ever) won the VTU Tournament 2026 and the CMRIT tournament, with IEM students Poorvi Girish and Disha Agarwal on the team.",
  },
  {
    tag: "Sports",
    title: "Cricket, Kho-Kho, Hockey & Basketball at the state and national level",
    detail:
      "Pavan R. Sheshagiri won the VTU Inter-Collegiate State-Level Cricket Tournament; the Kho-Kho team won the VTU Interzone and South Zone titles; Sai Samyam V took bronze at the U-23 National Basketball Championship; and the Men's Basketball team were VTU South Division champions.",
  },
  {
    tag: "Sports",
    title: "Archery — VTU State-Level runner-up",
    detail:
      "Hemavathi A secured 2nd place in the Indian Women Category (30 m) at the VTU State-Level Archery Championship.",
  },
  {
    tag: "Debate",
    title: "Vimarsha BMSCE Debating Tournament — Runner-Up",
    detail:
      "Maanav Talwar reached the runner-up position, showcasing strong public speaking and critical thinking.",
  },
  {
    tag: "Design Thinking",
    title: "IASF Design Thinking — Runner-Up (“Caffeine Trap”)",
    detail:
      "Shiksha Pandey, Anvitha R, Satvik Paliwal and Shaurya Kesarwani were runners-up at the IUCEE Annual Student Forum, Hyderabad.",
  },
  {
    tag: "Chapter Award",
    title: "IUCEE — Best Student Chapter Award",
    detail:
      "RVCE received the Best Student Chapter Award at the IUCEE Annual Student Forum (IASF) 2025.",
  },
  {
    tag: "Quiz",
    title: "IIMM Materials Management Day — 1st & 2nd places",
    detail:
      "IEM teams took first (Abhishek S, Chinmaya Nadig) and second (Eshwar R, T Ankshith Shetty) place in the IIMM quiz; Gohitha Maheshwari J won the Technical Essay Competition.",
  },
  {
    tag: "Innovation",
    title: "Technex'25, IIT Varanasi — IoT Competition",
    detail:
      "Nikhitha Sunil and team advanced with “Smart Home Automation Using RFID and Solar PV,” after winning the zonal round at RVCE.",
  },
  {
    tag: "Gold Medal",
    title: "Diya K Mutha — Department topper, Class of 2025",
    detail:
      "First rank (CGPA 9.36) with the 'Sri A Chamaraju' Gold Medal and the 'Sri M Prahalada Rao Award' for best performance in the Industrial Engineering stream.",
  },
  {
    tag: "Global",
    title: "The Dortmund Project — Circular Economy research",
    detail:
      "Dhanush A P worked with FH Dortmund students on a Circular Economy Readiness Index (CERI) spanning India, Germany and Colombia, under an ASA-Programme-funded project.",
  },
];
