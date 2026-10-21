"""Generate wsd-qb.tex (Work Systems Design question bank, one file, unit-wise) in the RVCE paper class.
Short-answer (Part A) rows are parsed from the unit-*-mcq text dumps; descriptive (Part B) rows are
hand-keyed for units 2-5 (the source tables are scrambled in text form) and parsed for unit 1."""
import re, sys

SRC = sys.argv[1]  # directory with wsd-uN-{essay,mcq}.txt
OUT = sys.argv[2]


def esc(s):
    s = s.replace("\u2019", "'").replace("\u2018", "`").replace("\u201c", "``").replace("\u201d", "''")
    s = s.replace("\\", "\\textbackslash{}")
    for a, b in (("&", "\\&"), ("%", "\\%"), ("#", "\\#"), ("_", "\\_"), ("$", "\\$")):
        s = s.replace(a, b)
    s = re.sub(r'"([^"]*)"', r"``\1''", s)
    s = s.replace("\u2013", "--").replace("\u2014", "---")
    return s


ROW = re.compile(r"^(\d+)\.?\s+(.*?)\s+(\d+)\s+([LMH])\s+(\d)\s*(\d)\s*$")


def parse(path, topics=True):
    """returns list of items: ('topic', title) or ('q', no, text, marks, dl, bt, co)"""
    items = []
    cur = None
    for raw in open(path, encoding="utf-8"):
        line = raw.rstrip()
        s = line.strip()
        if not s or s.startswith(("IM233AI", "UNIT ", "Q ", "No", "Level")) or "Question" in s and "Marks" in s:
            continue
        if re.match(r"^Topic ID", s):
            if cur:
                items.append(cur); cur = None
            items.append(("topic", re.sub(r"^Topic ID[\s\-]*\d+\s*[:\-]?\s*", "", s)))
            continue
        m = ROW.match(s)
        if m:
            if cur:
                items.append(cur)
            cur = ["q", m.group(1), m.group(2).strip(), m.group(3), m.group(4), m.group(5), m.group(6)]
            continue
        if cur:
            if re.match(r"^\(\w\)", s):
                cur[2] += "\n" + s
            else:
                cur[2] += " " + s
    if cur:
        items.append(cur)
    return [tuple(i) if isinstance(i, list) else i for i in items]


def tab(text, cols):
    return text


def qrow(no, text, m, dl, bt, co):
    parts = text.split("\n")
    body = esc(parts[0])
    for p in parts[1:]:
        body += "\\newline " + esc(p)
    return "\\qbrow{%s}{%s}{%s}{%s}{%s}{%s}\n" % (no, body, m, dl, bt, co)


def raw_row(no, texsrc, m, dl, bt, co):
    return "\\qbrow{%s}{%s}{%s}{%s}{%s}{%s}\n" % (no, texsrc, m, dl, bt, co)


def tbl(spec, hdr):  # element table helper (rows of values)
    cols = "|l|" + "c|" * len(hdr[1:])
    body = "\\hline " + " & ".join(hdr) + "\\\\\\hline "
    for r in spec:
        body += " & ".join(r) + "\\\\\\hline "
    return "\\qtabc{%s}{%s}" % (cols, body)


def elem_table(vals):
    return tbl([["Observed Time (min)"] + vals], ["Element", "a", "b", "c", "d", "e", "f"])


# ---------------------------------------------------------------- Unit 1 (parsed)
u1 = parse(f"{SRC}/wsd-u1-essay.txt")
fixed = []
for it in u1:
    if it[0] == "q" and it[1] == "12":
        it = ("q", "12",
              "A work group of 20 workers in a certain month produced 8600 units of output working 8 hr/day for 21 days.\n"
              "(a) What is the labor productivity ratio for this month?\n"
              "(b) In the next month, the same work group produced 8000 units but there were 22 workdays in the month and the size of the work group was reduced to 14 workers. What is the labor productivity ratio for this second month?\n"
              "(c) What is the productivity index using the first month as a base?",
              it[3], it[4], it[5], it[6])
    fixed.append(it)
u1 = fixed

# ---------------------------------------------------------------- Units 2, 4, 5 (hand-keyed, values read from the PDF tables)
B = "8"
u2 = [
    ("topic", "Introduction to Methods Engineering & Operations Analysis"),
    ("q", "1", "Explain the role of Methods Engineering in improving productivity and work design.", B, "M", "2", "2"),
    ("q", "2", "List and explain the steps in the methods engineering procedure.", B, "M", "2", "2"),
    ("q", "3", "Explain the relationship between methods engineering and automation. How does methods analysis support automation decisions?", B, "M", "4", "2"),
    ("q", "4", "Explain how methods engineering contributes to lean manufacturing and continuous improvement.", B, "M", "4", "2"),
    ("q", "5", "How does the \"USA Principle\" of automation apply to Methods Engineering?", B, "M", "3", "2"),
    ("topic", "Charting and Diagramming Techniques"),
    ("q", "6", "Explain how flow process charts are used in methods engineering. Provide an example of how they help improve a manual task.", B, "M", "3", "2"),
    ("q", "7", "Explain the difference between operation process charts and flow process charts. Provide one example of each.", B, "M", "4", "2"),
    ("q", "8", "Describe how block diagrams are used in methods engineering. What are their advantages in system visualization?", B, "M", "2", "2"),
    ("q", "9", "Discuss the role of traditional IE charting techniques in identifying non-value-added activities. Provide two examples.", B, "M", "4", "2"),
    ("q", "10", "Explain the construction and use of an \"Operation Process Chart.\"", B, "M", "2", "2"),
    ("q", "11", "Describe the \"Flow Diagram\" (Spatial) and its relationship to the Flow Process Chart.", B, "M", "3", "2"),
    ("q", "12", "Explain the use of \"Two-Handed Process Chart\" (Right-hand/Left-hand chart) in the application of Principles of Motion Economy.", B, "M", "3", "2"),
    ("q", "13", "What is a Man-Machine Chart (Multiple Activity Chart), and how is it used to calculate efficiency?", B, "M", "2", "2"),
    ("q", "14", "Discuss \"Check Sheets\" and \"Pareto Analysis\" as data collection tools in Methods Engineering.", B, "M", "2", "2"),
    ("q", "15", "Review any four types of basic Data Collection and Analysis techniques in Methods Engineering.", B, "M", "2", "2"),
    ("q", "16", "Explain and illustrate the three stages of Automation Migration Strategy.", B, "M", "3", "2"),
    ("q", "17", "Explain any four techniques of Methods Engineering.", B, "M", "2", "2"),
    ("topic", "Principles of Motion Economy"),
    ("q", "18", "Discuss how principles of motion economy are applied in methods engineering. Provide two examples.", B, "H", "4", "2"),
    ("q", "19", "Define the principles of motion economy. How do they contribute to efficient work design?", B, "M", "2", "2"),
    ("q", "20", "Explain any six principles of motion economy related to the use of the human body and explain each briefly.", B, "M", "2", "2"),
    ("q", "21", "Explain how workplace layout affects motion economy. Suggest three layout improvements for a manual assembly station.", B, "M", "3", "2"),
    ("q", "22", "Identify and explain three principles of motion economy related to the arrangement of the workplace.", B, "M", "2", "2"),
    ("q", "23", "Discuss the principles of motion economy specifically related to the use of the two hands during a manual task.", B, "M", "3", "2"),
    ("q", "24", "\"The hands should be relieved of work elements that can be performed by other body parts.\" Explain this principle with respect to jigs, fixtures, and foot pedals.", B, "M", "3", "2"),
    ("q", "25", "Describe the concept of \"Normal\" and \"Maximum\" Reach Zones in workstation design.", B, "M", "2", "2"),
]

u4 = [
    ("topic", "Lean and Waste"),
    ("q", "1", "Explain the \"Seven Wastes\" (Muda) in a production system with specific focus on defective parts and overproduction.", B, "M", "2", "2"),
    ("q", "2", "Define \"Muda\" and explain the waste of Overproduction. Why is it considered the most serious waste?", B, "M", "4", "2"),
    ("q", "3", "Compare and contrast \"Waste of Motion\" and \"Waste of Transportation.\" Provide one industrial example for each and evaluate how excessive inventory contributes to both.", B, "H", "4", "2"),
    ("q", "4", "Describe the elements of a typical structure of Lean Manufacturing System. Support your answer with an illustration.", B, "M", "2", "2"),
    ("q", "5", "Define Over-processing as a form of waste. Provide an example from a machining context.", B, "M", "3", "2"),
    ("q", "6", "Explain the waste of Waiting (Idle time). What are typical causes in a manufacturing plant?", B, "M", "2", "2"),
    ("topic", "Just in Time Production"),
    ("q", "7", "Compare and contrast Push vs. Pull systems of production control. Why is Pull preferred in Lean?", B, "H", "4", "2"),
    ("q", "8", "Explain the SMED (Single Minute Exchange of Die) methodology for setup time reduction.", B, "M", "3", "2"),
    ("q", "9", "Why is \"Setup Time Reduction\" a prerequisite for implementing a Pull system?", B, "H", "4", "2"),
    ("q", "10", "Describe the function of a \"Kanban\" card in a dual-card system with an example.", B, "M", "3", "2"),
    ("q", "11", "Explain the Pull System of production control using the Kanban mechanism.", B, "M", "2", "2"),
    ("q", "12", "Analyze the Internal vs. External Setup activities in the context of SMED.", B, "M", "4", "2"),
    ("topic", "Autonomation"),
    ("q", "13", "What is Total Productive Maintenance (TPM)? Explain the goal of \"Zero Breakdowns.\"", B, "M", "2", "2"),
    ("q", "14", "Explain the concept of Poka-Yoke (Error Proofing) with three industrial manufacturing examples.", B, "H", "3", "2"),
    ("q", "15", "What is Jidoka? Explain how \"Stopping the Process\" actually improves long-term efficiency.", B, "H", "4", "2"),
    ("q", "16", "Explain the \"Andon\" system and its role in the Jidoka philosophy.", B, "M", "3", "2"),
    ("q", "17", "What is Total Productive Maintenance (TPM)? List its primary goals regarding machine availability.", B, "M", "2", "2"),
    ("topic", "Worker Involvement"),
    ("q", "18", "Define \"Standardized Work\" and explain its three essential components according to Groover.", B, "M", "2", "2"),
    ("q", "19", "Discuss the role of \"Takt Time\" in aligning production rate with customer demand.", B, "M", "3", "1"),
    ("q", "20", "Explain the 5S System of visual management and its impact on workplace productivity.", B, "M", "3", "1"),
    ("q", "21", "Analyze the organizational requirements for a successful Continuous Improvement culture?", B, "H", "4", "2"),
]

u5 = [
    ("topic", "Introduction to Ergonomics & Human Factors"),
    ("q", "1", "What is meant by the term Ergonomics and discuss its primary objectives.", B, "L", "2", "4"),
    ("q", "2", "Describe the components of a Human-Machine System.", B, "M", "2", "4"),
    ("q", "3", "Discuss the \"Human as a System Component\" including strengths and limitations.", B, "M", "4", "4"),
    ("q", "4", "Explain the three major domains (themes) of Ergonomics. Discuss how each domain contributes to the optimization of human well-being and overall system performance.", B, "M", "4", "4"),
    ("q", "5", "Explain the role of Anthropometry in work system design.", B, "H", "4", "4"),
    ("q", "6", "Describe the Human Information Processing Model.", B, "M", "2", "4"),
    ("q", "7", "Analyze the impact of Illumination on work performance.", B, "M", "4", "4"),
    ("q", "8", "Discuss Noise and its control in the workplace.", B, "M", "4", "4"),
    ("q", "9", "Discuss \"Environmental Stressors\" and their cumulative effect on productivity.", B, "M", "4", "4"),
    ("q", "10", "Discuss the \"Fitting the Task to the Man\" (FTTM) philosophy. Why is this approach superior to \"Fitting the Man to the Task\" (FMTT)?", B, "M", "3", "4"),
    ("topic", "Occupational Safety and Health"),
    ("q", "11", "How can \"Poka-Yoke\" (Error Proofing) be used as an ergonomic strategy to prevent industrial accidents? Give two examples.", B, "M", "3", "4"),
    ("q", "12", "Differentiate between \"Unsafe Acts\" and \"Unsafe Conditions.\" Which is generally more prevalent in industrial accidents, and why?", B, "M", "3", "4"),
    ("q", "13", "What are Work-related Musculoskeletal Disorders (WMSDs)? List the primary risk factors.", B, "M", "2", "4"),
    ("q", "14", "Describe the \"Reach Envelope\" and its importance in workstation layout.", B, "M", "3", "4"),
    ("q", "15", "Define \"Industrial Accident\" and differentiate between \"Accident\" and \"Injury\".", B, "M", "2", "4"),
    ("q", "16", "Analyze the role of \"Unsafe Acts\" as a primary cause of accidents in workplaces.", B, "M", "4", "4"),
    ("q", "17", "Discuss the impact of \"Human Factors\" on accident rates.", B, "M", "3", "4"),
    ("q", "18", "What is meant by \"Occupational Disease\" and how it differs from an \"Industrial Injury.\"", B, "M", "2", "4"),
    ("q", "19", "Develop an \"Ergonomic Checklist\" for an office worker to self-assess their risk for developing Repetitive Strain Injuries (RSI).", B, "H", "5", "4"),
    ("q", "20", "What are \"Near Misses\" and why are they critical for industrial safety management?", B, "M", "2", "4"),
    ("q", "21", "Describe \"Unsafe Conditions\" in the context of workplaces and provide four workplace examples.", B, "M", "3", "4"),
]

# ---------------------------------------------------------------- Unit 3 (hand-keyed; contains problem tables)
def u3_items():
    L = []
    T = lambda s: L.append(("topic", s))
    Q = lambda no, t, dl, bt, co: L.append(("q", no, t, B, dl, bt, co))
    R = lambda no, t, dl, bt, co: L.append(("raw", no, t, B, dl, bt, co))
    T("Work Measurement and Time Study")
    Q("1", "Define a \"Standard Time\" according to Groover and explain the four specific conditions that must be met for a time standard to be valid.", "L", "2", "3")
    Q("2", "Rank the five primary work measurement methods by accuracy and justify the high ranking of Predetermined Motion Time Systems (PMTS).", "M", "2", "3")
    Q("3", "Rank the work measurement methods by \"Relative Application Speed\" (Time to set the standard) and explain why Historical Data is the fastest.", "M", "2", "3")
    T("Allowances and Time Study")
    Q("4", "Distinguish between Personal, Fatigue, and Delay (PFD) allowances. Why are they necessary in determining the final standard time?", "M", "2", "1")
    Q("5", "Explain the difference between \"Constant Fatigue Allowances\" and \"Variable Fatigue Allowances.\" Provide examples of factors that influence variable fatigue.", "M", "3", "1")
    Q("6", "What are \"Contingency Allowances\"? How do they differ from \"Policy Allowances\"?", "M", "2", "1")
    Q("7", "A worker's observed time is 2.0 min, and their performance rating is 110%. The company uses a PFD allowance of 15%. Calculate the Normal Time and the Standard Time.", "M", "3", "1")
    Q("8", "Explain the \"Internal\" vs. \"External\" work elements in a worker-machine system. How do allowances apply differently to these?", "M", "2", "1")
    Q("9", "Outline the step-by-step procedure for determining the Standard Time of a manual task starting from the initial observation.", "M", "2", "3")
    Q("10", "Why is it necessary to break a task into \"Work Elements\" before timing it? Provide ANY six rules for defining these elements.", "M", "2", "3")
    Q("11", "An operator takes an average of 1.20 minutes to complete a cycle. The analyst rates the worker at 115%. If one element in the cycle was a machine-controlled process taking 0.40 minutes, calculate the Normal Time for the manual portion and the total cycle.", "M", "3", "3")
    Q("12", "Discuss the procedure for determining standard time in \"Machine-Paced\" tasks. How do allowances differ for the machine portion vs. the manual portion?", "M", "2", "3")
    snap = lambda r, pfd, t: ("The snap back timing method was used to obtain average times for work elements in one work cycle. The times are given below. Element d is a machine-controlled element and the time is constant. Elements a, b, c, e and f are operator controlled and were performance rated at %s; however elements e and f are performed during the machine controlled element d. The machine allowance is zero and the PFD allowance is %s. Determine the normal time and standard time for the cycle." % (r, pfd))
    cont = lambda r, ma, pfd: ("The continuous timing method in direct time study was used to obtain the elemental times for a worker machine task as indicated. Element c is a machine controlled and the time is constant. Elements a, b, d, e and f are operator controlled and external to machine cycle and they are performance rated at %s. If the machine allowance is %s and worker PFD allowance is %s, determine the normal time and standard time for the work cycle." % (r, ma, pfd))
    def prob(no, txt, vals):
        R(no, esc(txt).replace("\\%", "\\%") + "\\par " + elem_table(vals), "M", "3", "3")
    prob("13", snap("80\\%", "14\\%", None).replace("\\%", "%"), ["0.24", "0.30", "0.17", "0.76", "0.26", "0.14"])
    prob("14", cont("80%", "25%", "15%"), ["0.18", "0.30", "0.88", "1.12", "1.55", "1.80"])
    prob("15", cont("90%", "12%", "8%"), ["0.24", "0.38", "0.88", "1.04", "1.65", "1.90"])
    prob("16", cont("80%", "25%", "15%"), ["0.12", "0.28", "0.78", "1.04", "1.45", "1.80"])
    prob("17", cont("90%", "35%", "25%"), ["0.12", "0.28", "0.78", "1.04", "1.45", "1.80"])
    prob("18", cont("90%", "35%", "25%"), ["0.18", "0.30", "0.88", "1.12", "1.55", "1.80"])
    fly = ("The flyback timing method was used to obtain average times for work elements in one work cycle. The times are given below. Element d is a machine-controlled element and the time is constant. Elements a, b, c, e and f are operator controlled and were performance rated at 90%; however elements e and f are performed during the machine controlled element d. The machine allowance is zero and the PFD allowance is 14%. Determine the normal time and standard time for the cycle.")
    prob("19", fly, ["0.18", "0.24", "0.21", "0.74", "0.26", "0.24"])
    prob("20", snap("90%", "14%", None), ["0.24", "0.30", "0.19", "0.96", "0.26", "0.24"])
    T("Predetermined Motion Time Systems (PMTS)")
    Q("21", "Discuss the advantages of PMTS over direct stopwatch time study as highlighted by Groover.", "L", "2", "3")
    Q("22", "Distinguish between first-level (MTM-1) and higher-level (MTM-2, MTM-3) PMT systems.", "M", "2", "3")
    Q("23", "What is MOST (Maynard Operation Sequence Technique)? Explain its focus on \"Sequence Models\" rather than individual motions.", "M", "2", "3")
    Q("24", "Break down the \"General Move\" sequence model (ABGABPA). Define each parameter.", "M", "2", "3")
    Q("25", "Compare \"General Move\" vs. \"Controlled Move\" in Basic MOST. Give an example for each.", "M", "3", "3")
    Q("26", "Distinguish between Mini-MOST, Basic MOST, and Maxi-MOST based on cycle length and repetitiveness.", "M", "2", "3")
    Q("27", "What is \"Admin MOST\"? Provide three examples of tasks where it would be applied.", "M", "3", "3")
    Q("28", "Discuss \"MOST for Windows\" (Computerized MOST). What are the advantages of using software over manual data cards?", "M", "2", "3")
    Q("29", "Outline the systematic procedure for applying a Predetermined Motion Time System (PMTS) to establish a time standard for a manual task.", "L", "2", "3")
    Q("30", "Describe the \"Tool Use\" sequence model. List four common tool-use actions it covers.", "M", "2", "3")
    return L


UNITS = [
    ("I", "Introduction to Work Systems and Productivity", u1, parse(f"{SRC}/wsd-u1-mcq.txt")),
    ("II", "Methods Engineering and Operations Analysis", u2, parse(f"{SRC}/wsd-u2-mcq.txt")),
    ("III", "Work Measurement and Time Study", u3_items(), parse(f"{SRC}/wsd-u3-mcq.txt")),
    ("IV", "Lean Production, Waste Elimination and Worker Involvement", u4, parse(f"{SRC}/wsd-u4-mcq.txt")),
    ("V", "Ergonomics, Human Factors and Occupational Safety", u5, parse(f"{SRC}/wsd-u5-mcq.txt")),
]

PRE = r"""\documentclass{rvcepaper}
% unit-wise question bank in the RVCE paper class
\newcommand{\qbhead}[2]{%
  \noindent
  \begin{center}{\fontsize{12}{14}\selectfont DEPARTMENT OF}\\[3pt]
  {\bfseries\fontsize{15.5}{18}\selectfont INDUSTRIAL ENGINEERING \& MANAGEMENT}\end{center}\vspace{-3pt}
  \noindent\begingroup\renewcommand{\arraystretch}{1.9}\bfseries\fontsize{11.5}{13}\selectfont
  \begin{tabular}{|p{6.2cm}|C{5.0cm}|p{5.5cm}|}\hline
   Semester \hspace{0.1cm}: \hspace{0.2cm}III & UG & Course Code \hspace{0.1cm}: \hspace{0.2cm}IM233AI\\\hline
   \multicolumn{2}{|p{11.2cm}|}{Course Title: WORK SYSTEMS DESIGN} & Question Bank\\\hline
   \multicolumn{3}{|c|}{UNIT #1 \hspace{0.3cm}--\hspace{0.3cm} #2}\\\hline
  \end{tabular}\endgroup\par\vspace{6pt}}
\newenvironment{qbtable}{%
  \begin{longtable}{|C{1.05cm}|p{10.7cm}|C{0.85cm}|C{0.95cm}|C{0.85cm}|C{0.85cm}|}
  \hline \textbf{Sl.\newline No} & \multicolumn{1}{c|}{\textbf{Questions}} & \textbf{M} & \textbf{DL} & \textbf{BT} & \textbf{CO}\\ \hline
  \endfirsthead
  \hline \textbf{Sl.\newline No} & \multicolumn{1}{c|}{\textbf{Questions}} & \textbf{M} & \textbf{DL} & \textbf{BT} & \textbf{CO}\\ \hline
  \endhead
}{\end{longtable}}
\newcommand{\qbpart}[1]{\multicolumn{6}{|c|}{\bfseries #1}\\ \hline}
\newcommand{\qbtopic}[1]{\multicolumn{6}{|l|}{\itshape #1}\\ \hline}
\newcommand{\qbrow}[6]{#1 & #2 & #3 & #4 & #5 & #6\\ \hline}
\newcommand{\qbkey}{\par\vspace{6pt}\centerline{\small M -- Marks, DL -- Difficulty Level (L: Low, M: Medium, H: High), BT -- Bloom's Taxonomy Level, CO -- Course Outcome}\par}
\begin{document}
"""


def emit_items(items):
    out = []
    for it in items:
        if it[0] == "topic":
            out.append("\\qbtopic{%s}\n" % esc(it[1]))
        elif it[0] == "q":
            out.append(qrow(it[1], it[2], it[3], it[4], it[5], it[6]))
        elif it[0] == "raw":
            out.append(raw_row(it[1], it[2], it[3], it[4], it[5], it[6]))
    return "".join(out)


doc = [PRE]
for no, title, ess, mcq in UNITS:
    nq = sum(1 for i in ess if i[0] != "topic")
    nm = sum(1 for i in mcq if i[0] != "topic")
    doc.append("\n%% ---------------- Unit %s\n\\begin{iempaper}\n" % no)
    doc.append("\\paperinfo{dept={INDUSTRIAL ENGINEERING \\& MANAGEMENT},title={WORK SYSTEMS DESIGN},code={IM233AI}}\n")
    doc.append("\\qbhead{%s}{%s}\n" % (no, esc(title)))
    doc.append("\\begin{qbtable}\n\\qbpart{Part -- A \\hspace{0.5cm} Short-Answer Questions (2 Marks each)}\n")
    doc.append(emit_items(mcq))
    doc.append("\\qbpart{Part -- B \\hspace{0.5cm} Descriptive Questions (8 Marks each)}\n")
    doc.append(emit_items(ess))
    doc.append("\\end{qbtable}\n\\qbkey\n\\end{iempaper}\n")
doc.append("\n\\end{document}\n")
open(OUT, "w", encoding="utf-8", newline="\n").write("".join(doc))
print("units:", [(n, sum(1 for i in e if i[0] != 'topic'), sum(1 for i in m if i[0] != 'topic')) for n, t, e, m in UNITS])
