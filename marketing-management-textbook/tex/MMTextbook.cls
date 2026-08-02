%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%  MMTextbook.cls  --  v1.0
%
%  A professional textbook class for the Marketing Management (IM345AT)
%  Semester IV study-text series, Department of Industrial Engineering and
%  Management, RV College of Engineering.
%
%  Visual design derived from "The Legrand Orange Book" LaTeX template by
%  Mathias Legrand, with modifications by Vel, distributed through
%  LaTeXTemplates.com under a CC BY-NC-SA 4.0 licence.  The design language
%  (ocre accent colour, hanging section numbers, mdframed-style rule boxes,
%  titletoc contents styling) is re-implemented here directly on standard
%  CTAN packages so that the series compiles with an unmodified TeX
%  distribution and no vendored template files.
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{MMTextbook}[2026/07/30 v1.0 Marketing Management textbook class]

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{book}}
\ProcessOptions\relax
\LoadClass[11pt,twoside,openright]{book}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% ENCODING, FONTS, MICROTYPOGRAPHY
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage[utf8]{inputenc}
\RequirePackage[T1]{fontenc}
\RequirePackage{textcomp}
\RequirePackage{mathptmx}                  % Times body text + matching maths
\RequirePackage{avant}                     % AvantGarde headings (Legrand)
\RequirePackage[protrusion=true,expansion=true]{microtype}
% NOTE: do not load lmodern here -- it would silently override the
% Times/AvantGarde pairing established above.

% The rupee sign is unavailable in the T1 encoding; use the unambiguous
% written form rather than a synthesised glyph that collides at small sizes.
\newcommand{\rupee}{Rs.\kern0.18em}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% CORE PACKAGES
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage[usenames,svgnames,table]{xcolor}
\RequirePackage{graphicx}
\RequirePackage{float}
\RequirePackage{calc}
\RequirePackage{etoolbox}
\RequirePackage{changepage}
\RequirePackage{array}
\RequirePackage{booktabs}
\RequirePackage{longtable}
\RequirePackage{multirow}
\RequirePackage{tabularx}
\RequirePackage{ragged2e}
\RequirePackage{enumitem}
\RequirePackage{amsmath,amsfonts,amssymb}
\RequirePackage{needspace}
\RequirePackage{emptypage}
\RequirePackage{fancyhdr}
\RequirePackage{titlesec}
\RequirePackage{titletoc}
\RequirePackage{tikz}
\RequirePackage{pgfplots}
\RequirePackage[most]{tcolorbox}
\RequirePackage{imakeidx}
\RequirePackage{caption}

\usetikzlibrary{calc,positioning,arrows.meta,shapes.geometric,shapes.symbols,
                shapes.misc,shapes.multipart,shapes.arrows,
                fit,backgrounds,decorations.pathreplacing,patterns,shadows.blur,
                shadings,matrix,chains,scopes,intersections}
\pgfplotsset{compat=1.18}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% PAGE GEOMETRY
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage[
  a4paper,
  top=2.7cm,
  bottom=2.8cm,
  inner=2.4cm,
  outer=3.4cm,
  headsep=12pt,
  headheight=15pt,
  footskip=1.2cm,
  marginparwidth=2.1cm,
  marginparsep=0.35cm
]{geometry}

\setlength{\parskip}{0pt}
\setlength{\parindent}{1.2em}
\linespread{1.06}
\setlength{\emergencystretch}{2em}
\clubpenalty=6000
\widowpenalty=6000
\brokenpenalty=6000

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% COLOUR PALETTE  (Legrand "ocre" accent + supporting neutrals)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\definecolor{ocre}{RGB}{243,102,25}        % primary accent -- Legrand orange
\definecolor{ocredark}{RGB}{176,68,10}     % darker accent for small text
\definecolor{ocrepale}{RGB}{253,240,230}   % accent tint for box fills
\definecolor{slate}{RGB}{45,52,62}         % heading / body dark
\definecolor{slatelight}{RGB}{110,120,133} % secondary text
\definecolor{rulegrey}{RGB}{205,210,216}   % hairlines
\definecolor{tablehead}{RGB}{237,239,242}  % table header band
\definecolor{tablealt}{RGB}{240,242,245}   % zebra stripe
\definecolor{warnred}{RGB}{178,34,34}      % cautions
\definecolor{warnpale}{RGB}{253,238,238}
\definecolor{deepblue}{RGB}{31,71,120}     % examination material
\definecolor{deepbluepale}{RGB}{236,241,248}
\definecolor{greenok}{RGB}{27,110,72}
\definecolor{greenpale}{RGB}{235,245,239}

\colorlet{chapterbandcolour}{ocre}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% HYPERLINKS  (loaded late, before bookmark)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\RequirePackage{hyperref}
\hypersetup{
  colorlinks=true,
  linkcolor=ocredark,
  citecolor=deepblue,
  urlcolor=deepblue,
  breaklinks=true,
  bookmarksnumbered=true,
  bookmarksopen=true,
  bookmarksopenlevel=1,
  pdfstartview={FitH},
  pdfpagemode=UseOutlines
}
\RequirePackage{bookmark}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% BOOK METADATA  (set by the document)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\newcommand{\@unitnumber}{}
\newcommand{\@unittitle}{}
\newcommand{\@unitsubtitle}{}
\newcommand{\@unithours}{}
\newcommand{\@volumeno}{}
\newcommand{\unitnumber}[1]{\renewcommand{\@unitnumber}{#1}}
\newcommand{\unittitle}[1]{\renewcommand{\@unittitle}{#1}}
\newcommand{\unitsubtitle}[1]{\renewcommand{\@unitsubtitle}{#1}}
\newcommand{\unithours}[1]{\renewcommand{\@unithours}{#1}}
\newcommand{\volumeno}[1]{\renewcommand{\@volumeno}{#1}}

\newcommand{\coursetitle}{Marketing Management}
\newcommand{\coursecode}{IM345AT}
\newcommand{\courseinstitute}{RV College of Engineering, Bengaluru\,--\,59}
\newcommand{\coursedept}{Department of Industrial Engineering and Management}
\newcommand{\courseseries}{The Marketing Management Study Text}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% RUNNING HEADS AND FEET
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\renewcommand{\chaptermark}[1]{\markboth{\thechapter.\ #1}{}}
\renewcommand{\sectionmark}[1]{\markright{\thesection\ \ #1}}

\fancypagestyle{mmmain}{%
  \fancyhf{}%
  \renewcommand{\headrulewidth}{0.5pt}%
  \renewcommand{\footrulewidth}{0pt}%
  \fancyhead[LE]{\sffamily\footnotesize\color{slatelight}\leftmark}%
  \fancyhead[RO]{\sffamily\footnotesize\color{slatelight}\rightmark}%
  \fancyhead[RE,LO]{\sffamily\footnotesize\bfseries\color{ocre}\thepage}%
  \fancyfoot[C]{\sffamily\scriptsize\color{slatelight}%
     \coursetitle\ \textbullet\ \coursecode\ \textbullet\ Unit~\@unitnumber}%
}

\fancypagestyle{mmfront}{%
  \fancyhf{}%
  \renewcommand{\headrulewidth}{0pt}%
  \renewcommand{\footrulewidth}{0pt}%
  \fancyfoot[C]{\sffamily\footnotesize\bfseries\color{ocre}\thepage}%
}

\fancypagestyle{plain}{%
  \fancyhf{}%
  \renewcommand{\headrulewidth}{0pt}%
  \renewcommand{\footrulewidth}{0pt}%
  \fancyfoot[C]{\sffamily\footnotesize\bfseries\color{ocre}\thepage}%
}

\pagestyle{mmmain}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% SECTIONING  --  Legrand-style hanging ocre numbers, AvantGarde headings
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Numbering stops at subsection: chapter.section.subsection gives the familiar
% three-part textbook reference (1.2.3) and avoids a fourth level.
\setcounter{secnumdepth}{2}
\setcounter{tocdepth}{2}

% ---- Chapter opener: ocre "CHAPTER n" pill, right-ranged title, double rule
\titleformat{\chapter}[display]
  {\normalfont\sffamily\bfseries\color{slate}}
  {\vspace*{-1.6cm}\raggedleft
   \begin{tikzpicture}[baseline=0pt]
     \node[fill=ocre,text=white,rounded corners=5pt,
           inner xsep=13pt,inner ysep=7pt,
           font=\sffamily\bfseries\large]
       {CHAPTER\ \ \thechapter};
   \end{tikzpicture}}
  {14pt}
  {\raggedleft\fontsize{27}{31}\selectfont}
  [\vspace{9pt}{\color{ocre}\hrule height 1.6pt}\vspace{3pt}%
   {\color{ocre!35}\hrule height 0.6pt}\vspace{2pt}]

\titleformat{name=\chapter,numberless}[display]
  {\normalfont\sffamily\bfseries\color{slate}}
  {\vspace*{-1.6cm}}
  {0pt}
  {\raggedleft\fontsize{27}{31}\selectfont}
  [\vspace{9pt}{\color{ocre}\hrule height 1.6pt}\vspace{3pt}%
   {\color{ocre!35}\hrule height 0.6pt}\vspace{2pt}]

\titlespacing*{\chapter}{0pt}{28pt}{34pt}
\titlespacing*{name=\chapter,numberless}{0pt}{28pt}{34pt}

% ---- Sections: number hangs into the margin (\llap), as in Legrand
\titleformat{\section}
  {\normalfont\sffamily\Large\bfseries\color{slate}}
  {\llap{\color{ocre}\thesection\hspace{0.55em}}}{0pt}{}
\titlespacing*{\section}{0pt}{2.4ex plus 1ex minus .2ex}{1.2ex plus .2ex}

\titleformat{\subsection}
  {\normalfont\sffamily\large\bfseries\color{slate}}
  {\llap{\color{ocre}\thesubsection\hspace{0.55em}}}{0pt}{}
\titlespacing*{\subsection}{0pt}{2.1ex plus 1ex minus .2ex}{1.0ex plus .2ex}

\titleformat{\subsubsection}
  {\normalfont\sffamily\normalsize\bfseries\color{ocredark}}
  {\thesubsubsection\hspace{0.5em}}{0pt}{}
\titlespacing*{\subsubsection}{0pt}{1.9ex plus 1ex minus .2ex}{0.8ex plus .2ex}

\titleformat{\paragraph}[runin]
  {\normalfont\sffamily\bfseries\color{slate}}
  {}{0pt}{}[\,---\,]
\titlespacing*{\paragraph}{0pt}{1.4ex plus 1ex minus .2ex}{0.6em}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% TABLE OF CONTENTS  (titletoc, Legrand-flavoured)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\contentsmargin{0cm}

\titlecontents{chapter}[2.6em]
  {\addvspace{1.1em}\sffamily\bfseries\color{ocre}}
  {\contentslabel[\thecontentslabel]{2.6em}}
  {\hspace*{-2.6em}}
  {\hfill\color{ocre}\normalfont\sffamily\bfseries\thecontentspage}
  [\vspace{0.15em}{\color{ocre!25}\hrule height 0.5pt}\vspace{0.35em}]

\titlecontents{section}[3.4em]
  {\sffamily\small\color{slate}}
  {\contentslabel[\thecontentslabel]{2.5em}}
  {\hspace*{-2.5em}}
  {\titlerule*[0.6pc]{\color{rulegrey}.}\;\color{slate}\small\thecontentspage}

\titlecontents{subsection}[5.4em]
  {\sffamily\footnotesize\color{slatelight}}
  {\contentslabel[\thecontentslabel]{3.0em}}
  {\hspace*{-3.0em}}
  {\titlerule*[0.6pc]{\color{rulegrey}.}\;\color{slatelight}\footnotesize\thecontentspage}

\titlecontents{figure}[2.6em]
  {\sffamily\small\color{slate}}
  {\contentslabel{2.6em}}
  {\hspace*{-2.6em}}
  {\titlerule*[0.6pc]{\color{rulegrey}.}\;\small\thecontentspage}

\titlecontents{table}[2.6em]
  {\sffamily\small\color{slate}}
  {\contentslabel{2.6em}}
  {\hspace*{-2.6em}}
  {\titlerule*[0.6pc]{\color{rulegrey}.}\;\small\thecontentspage}

% Contents / LoF / LoT headings share the numberless chapter style
\renewcommand{\contentsname}{Contents}
\renewcommand{\listfigurename}{List of Figures}
\renewcommand{\listtablename}{List of Tables}
\renewcommand{\bibname}{References and Further Reading}
\renewcommand{\indexname}{Index}
\renewcommand{\appendixname}{Appendix}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% CAPTIONS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\captionsetup{
  font={sf,small},
  labelfont={sf,bf,color=ocre},
  labelsep=period,
  textfont={sf,small,color=slate},
  justification=justified,
  singlelinecheck=false,
  skip=7pt
}
\captionsetup[table]{skip=5pt,position=top}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% LISTS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\setlist{topsep=0.5ex,itemsep=0.35ex,parsep=0pt,leftmargin=1.5em}
\setlist[itemize,1]{label=\textcolor{ocre}{\footnotesize$\blacksquare$}}
\setlist[itemize,2]{label=\textcolor{ocre!60}{\scriptsize$\square$}}
\setlist[itemize,3]{label=\textcolor{slatelight}{\tiny$\bullet$}}
\setlist[enumerate,1]{label=\textcolor{ocre}{\sffamily\bfseries\arabic*.},leftmargin=1.9em}
\setlist[enumerate,2]{label=\textcolor{ocredark}{\sffamily(\alph*)},leftmargin=1.9em}
\setlist[description]{font=\sffamily\bfseries\color{slate}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% TABLE STYLING HELPERS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Ragged-right paragraph column.  Narrow table cells set justified produce
% either stretched word spaces or mid-word hyphenation ("Production con-cept");
% ragged right avoids both and is the standard choice for tabular matter.
\newcolumntype{P}[1]{>{\raggedright\arraybackslash}p{#1}}

\renewcommand{\arraystretch}{1.22}
\setlength{\tabcolsep}{6pt}
\setlength{\aboverulesep}{0pt}
\setlength{\belowrulesep}{0pt}
\setlength{\heavyrulewidth}{1.1pt}
\setlength{\lightrulewidth}{0.5pt}
\arrayrulecolor{rulegrey}

% Header cell: white sans bold on the ocre band
\newcommand{\thd}[1]{\textcolor{white}{\sffamily\bfseries\small #1}}
% Row-label cell: slate sans bold
\newcommand{\rlab}[1]{\textsf{\bfseries\small #1}}

% \begin{mmtable}{caption}{label}{colspec} ... \end{mmtable}
\newenvironment{mmtable}[3]
  {\begin{table}[htbp]\centering\small\sffamily
   \caption{#1}\label{#2}%
   \begin{tabular}{#3}\toprule[1.1pt]\rowcolor{ocre}}
  {\bottomrule[1.1pt]\end{tabular}\end{table}}

% Long, page-breaking variant
\newenvironment{mmlongtable}[3]
  {\small\sffamily\begin{longtable}{#3}
   \caption{#1}\label{#2}\\[-0.4ex]
   \toprule[1.1pt]}
  {\bottomrule[1.1pt]\end{longtable}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% PEDAGOGICAL BOXES
% Visual grammar follows Legrand's tBox / dBox / eBox / cBox family:
%   dBox  -> definition       : left ocre rule, no fill
%   tBox  -> key point        : ocre frame, pale ocre fill
%   eBox  -> examination      : deep-blue left rule, pale blue fill
%   cBox  -> example / case   : grey left rule, neutral fill
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Boxed matter is set flush left with open paragraph spacing: an indented
% first line reads as a continuation of the body text rather than as a
% distinct panel.  This must ride on fontupper (which tcolorbox applies to
% the whole upper part) rather than on before upper, which is bypassed when
% a title is attached to the upper part.
\newcommand{\mmboxreset}{%
  \setlength{\parindent}{0pt}%
  \setlength{\parskip}{4pt}}

\tcbset{
  mmbase/.style={
    breakable, enhanced, sharp corners,
    boxrule=0pt, left=10pt, right=10pt, top=7pt, bottom=7pt,
    before skip=9pt, after skip=9pt,
    fontupper=\small\mmboxreset,
    parbox=false
  }
}

% ---- Definition: hanging left rule, unfilled (dBox)
\newtcolorbox{definitionbox}[1][]{%
  mmbase,
  colback=white, colframe=white,
  borderline west={2.6pt}{0pt}{ocre},
  left=12pt,
  fonttitle=\sffamily\bfseries\footnotesize\color{ocre},
  title={\MakeUppercase{Definition}\ifstrempty{#1}{}{\ \textnormal{\color{slatelight}\textbullet\ #1}}},
  attach title to upper={\par\vspace{3pt}}
}

% ---- Key point / high-yield (tBox)
\newtcolorbox{keybox}[1][Key Point]{%
  mmbase,
  colback=ocrepale, colframe=ocre,
  boxrule=0.8pt,
  fonttitle=\sffamily\bfseries\footnotesize\color{ocredark},
  title={\MakeUppercase{#1}},
  attach title to upper={\par\vspace{3pt}}
}

% ---- Examination material (eBox)
\newtcolorbox{exambox}[1][Examination Focus]{%
  mmbase,
  colback=deepbluepale, colframe=deepbluepale,
  borderline west={2.6pt}{0pt}{deepblue},
  left=12pt,
  fonttitle=\sffamily\bfseries\footnotesize\color{deepblue},
  title={\MakeUppercase{#1}},
  attach title to upper={\par\vspace{3pt}}
}

% ---- Worked example / case (cBox)
\newtcolorbox{examplebox}[1][Example]{%
  mmbase,
  colback=tablealt, colframe=tablealt,
  borderline west={2.6pt}{0pt}{slatelight},
  left=12pt,
  fonttitle=\sffamily\bfseries\footnotesize\color{slate},
  title={\MakeUppercase{#1}},
  attach title to upper={\par\vspace{3pt}}
}

% ---- Caution
\newtcolorbox{warnbox}[1][Caution]{%
  mmbase,
  colback=warnpale, colframe=warnpale,
  borderline west={2.6pt}{0pt}{warnred},
  left=12pt,
  fonttitle=\sffamily\bfseries\footnotesize\color{warnred},
  title={\MakeUppercase{#1}},
  attach title to upper={\par\vspace{3pt}}
}

% ---- Framework / process summary
\newtcolorbox{frameworkbox}[1][Framework]{%
  mmbase,
  colback=greenpale, colframe=greenpale,
  borderline west={2.6pt}{0pt}{greenok},
  left=12pt,
  fonttitle=\sffamily\bfseries\footnotesize\color{greenok},
  title={\MakeUppercase{#1}},
  attach title to upper={\par\vspace{3pt}}
}

% ---- Pull quote
\newtcolorbox{quotebox}[1][]{%
  mmbase,
  colback=white, colframe=white,
  borderline west={2.6pt}{0pt}{rulegrey},
  left=14pt,
  fontupper=\small\itshape\color{slate}\mmboxreset,
  after upper={\ifstrempty{#1}{}{\par\vspace{4pt}%
     \hfill\normalfont\sffamily\footnotesize\color{slatelight}--- #1}}
}

% ---- Chapter-closing summary panel
\newtcolorbox{summarybox}[1][Chapter Summary]{%
  mmbase,
  colback=white, colframe=ocre,
  boxrule=0.8pt, sharp corners,
  fonttitle=\sffamily\bfseries\small\color{white},
  coltitle=white,
  colbacktitle=ocre,
  title={\MakeUppercase{#1}},
  attach boxed title to top left={xshift=0pt,yshift=-\tcboxedtitleheight/2},
  boxed title style={sharp corners, boxrule=0pt, colback=ocre},
  top=14pt
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% PREVIOUS-YEAR-QUESTION TAGS
% House rule for this series: a past-paper appearance is recorded as a
% bracketed source tag, never as narrative prose.
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Inline bracket tag, e.g. \pyq{CIE-I, 3 Apr 2025, 10 M}
\newcommand{\pyq}[1]{%
  \,{\sffamily\footnotesize\color{ocredark}[#1]}}

% Right-ranged tag for use at the end of a question line
\newcommand{\pyqr}[1]{%
  \hfill{\sffamily\footnotesize\color{ocredark}[#1]}}

% Margin flag marking a paragraph as past-paper material
\newcommand{\pyqmargin}[1]{%
  \marginpar{\raggedright\sffamily\scriptsize\color{ocredark}[#1]}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% INDEXING HELPERS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% \keyterm{buyer persona}  -> bold-italic in text, indexed
\newcommand{\keyterm}[1]{\textbf{\textit{#1}}\index{#1}}
% \keytermas{displayed}{index entry}
\newcommand{\keytermas}[2]{\textbf{\textit{#1}}\index{#2}}
% Index without changing the text
\newcommand{\ix}[1]{\index{#1}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% TITLE PAGE, HALF TITLE, COLOPHON
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\newcommand{\halftitlepage}{%
  \thispagestyle{empty}
  \begingroup
  \raggedright\sffamily
  \vspace*{5cm}
  {\color{slatelight}\footnotesize\MakeUppercase{\courseseries}\par}
  \vspace{4pt}{\color{ocre}\hrule height 1.4pt}\vspace{16pt}
  {\fontsize{30}{34}\selectfont\bfseries\color{slate}\coursetitle\par}
  \vspace{10pt}
  {\Large\color{ocre}\bfseries Unit \@unitnumber\ \textbullet\ \@unittitle\par}
  \vfill
  {\footnotesize\color{slatelight}\coursecode\ \textbullet\ Semester IV \textbullet\
   Volume \@volumeno\ of 5\par}
  \endgroup
  \cleardoublepage}

% Everything on the title page is placed absolutely inside one tikzpicture:
% no element position depends on the flow of any other, so the masthead
% cannot collide with the title block however long the unit title runs.
\newcommand{\maintitlepage}{%
  \begin{titlepage}
  \thispagestyle{empty}
  \null
  \begin{tikzpicture}[remember picture,overlay]

    % ---- masthead band ------------------------------------------------
    \fill[ocre]  (current page.north west) rectangle
                 ($(current page.north east)+(0,-3.55cm)$);
    \fill[slate] ($(current page.north west)+(0,-3.55cm)$) rectangle
                 ($(current page.north east)+(0,-3.78cm)$);

    % ---- foot band ---------------------------------------------------
    \fill[ocre] (current page.south west) rectangle
                ($(current page.south east)+(0,1.15cm)$);

    % ---- oversized ghost volume numeral ------------------------------
    \node[anchor=south east, text=ocre!12, inner sep=0pt,
          font=\sffamily\bfseries\fontsize{200}{200}\selectfont]
      at ($(current page.south east)+(-1.5cm,1.7cm)$) {\@volumeno};

    % ---- institutional masthead --------------------------------------
    \node[anchor=north west, inner sep=0pt]
      at ($(current page.north west)+(2.4cm,-0.95cm)$)
      {\begin{minipage}{14cm}\raggedright\sffamily\color{white}
         {\fontsize{14}{17}\selectfont\bfseries \courseinstitute\par}
         \vspace{4pt}
         {\fontsize{10.5}{13}\selectfont \coursedept\par}
         \vspace{3pt}
         {\fontsize{9}{11}\selectfont An Autonomous Institution Affiliated to VTU\par}
       \end{minipage}};

    % ---- series line, rule, course title -----------------------------
    \node[anchor=north west, inner sep=0pt]
      at ($(current page.north west)+(2.4cm,-6.2cm)$)
      {\begin{minipage}{14.2cm}\raggedright\sffamily
         {\color{slatelight}\small\MakeUppercase{\courseseries}\par}
         \vspace{7pt}{\color{ocre}\hrule height 2pt}\vspace{24pt}
         {\fontsize{42}{46}\selectfont\bfseries\color{slate}\coursetitle\par}
         \vspace{18pt}
         {\fontsize{12.5}{17}\selectfont\color{slatelight}%
          Course Code \coursecode\ \ \textbullet\ \ Semester IV\\
          L:T:P 3:0:0 \ \textbullet\ \ 45 Hours \ \textbullet\ \ Professional Core Course\par}
       \end{minipage}};

    % ---- unit block ---------------------------------------------------
    \node[anchor=north west, inner sep=0pt]
      at ($(current page.north west)+(2.4cm,-15.4cm)$)
      {\begin{minipage}{14.2cm}\raggedright\sffamily
         {\color{ocre}\hrule height 0.9pt width 4.5cm}\vspace{17pt}
         {\fontsize{16}{20}\selectfont\bfseries\color{ocre}UNIT \@unitnumber\par}
         \vspace{11pt}
         {\fontsize{24}{29}\selectfont\bfseries\color{slate}\@unittitle\par}
         \ifstrempty{\@unitsubtitle}{}{%
           \vspace{11pt}
           {\fontsize{12}{16}\selectfont\color{slatelight}\@unitsubtitle\par}}
         \vspace{11pt}
         {\small\color{slatelight}Syllabus allocation: \@unithours\par}
       \end{minipage}};

    % ---- imprint line -------------------------------------------------
    \node[anchor=south west, inner sep=0pt]
      at ($(current page.south west)+(2.4cm,1.75cm)$)
      {\begin{minipage}{14.2cm}\raggedright\sffamily
         {\footnotesize\color{slatelight}%
          Volume \@volumeno\ of 5 \ \textbullet\ \ Unofficial student study
          text \ \textbullet\ \ 2026 edition\par}
       \end{minipage}};

  \end{tikzpicture}%
  \end{titlepage}}

\newcommand{\colophonpage}[1]{%
  \thispagestyle{empty}
  \vspace*{\fill}
  {\footnotesize\sffamily\color{slate}\raggedright #1\par}
  \vspace*{\fill}
  \cleardoublepage}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% FRONT-MATTER SECTION HEADING (for Preface, Syllabus, etc.)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\newcommand{\frontchapter}[1]{%
  \cleardoublepage
  \phantomsection
  \addcontentsline{toc}{chapter}{#1}%
  \chapter*{#1}%
  \markboth{#1}{#1}}

% Same, but kept out of the table of contents
\newcommand{\frontchapternotoc}[1]{%
  \cleardoublepage
  \chapter*{#1}%
  \markboth{#1}{#1}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% APPENDIX SUPPORT
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\newcommand{\startappendices}{%
  \cleardoublepage
  \appendix
  \renewcommand{\thechapter}{\Alph{chapter}}
  \titleformat{\chapter}[display]
    {\normalfont\sffamily\bfseries\color{slate}}
    {\vspace*{-1.6cm}\raggedleft
     \begin{tikzpicture}[baseline=0pt]
       \node[fill=slate,text=white,rounded corners=5pt,
             inner xsep=13pt,inner ysep=7pt,
             font=\sffamily\bfseries\large]
         {APPENDIX\ \ \thechapter};
     \end{tikzpicture}}
    {14pt}
    {\raggedleft\fontsize{27}{31}\selectfont}
    [\vspace{9pt}{\color{slate}\hrule height 1.6pt}\vspace{3pt}%
     {\color{slate!35}\hrule height 0.6pt}\vspace{2pt}]
  \renewcommand{\chaptermark}[1]{\markboth{Appendix \thechapter.\ ##1}{}}%
  \addtocontents{toc}{\protect\addvspace{1.4em}}%
  \addtocontents{toc}{\noindent{\protect\sffamily\protect\bfseries
     \protect\color{slate}APPENDICES}\protect\par
     \protect\vspace{0.2em}{\protect\color{slate!30}\protect\hrule height 0.8pt}%
     \protect\vspace{0.3em}}%
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% SMALL UTILITIES
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\newcommand{\TikZ}{Ti\textit{k}Z}
\newcommand{\ra}{\ensuremath{\rightarrow}}
\newcommand{\x}{\ensuremath{\times}}
\newcommand{\sfb}[1]{\textsf{\bfseries #1}}
\newcommand{\ocretext}[1]{\textcolor{ocre}{#1}}

% A slim horizontal separator used between topic blocks
\newcommand{\topicrule}{%
  \par\vspace{7pt}{\color{ocre!30}\hrule height 0.6pt}\vspace{7pt}\par}

% Learning-outcome opener for each chapter
\newenvironment{learningoutcomes}
  {\begin{tcolorbox}[mmbase, colback=white, colframe=slate!22, boxrule=0.7pt,
      sharp corners, fontupper=\small\mmboxreset,
      fonttitle=\sffamily\bfseries\footnotesize\color{slate},
      title={\MakeUppercase{What this chapter covers}},
      attach title to upper={\par\vspace{3pt}}]}
  {\end{tcolorbox}}

% Syllabus-extract strip, printed at the head of every chapter
\newcommand{\syllabusstrip}[1]{%
  \begin{tcolorbox}[mmbase, colback=ocrepale, colframe=ocre!55, boxrule=0.7pt,
      sharp corners, fontupper=\small\itshape\color{slate}\mmboxreset,
      fonttitle=\sffamily\bfseries\footnotesize\color{ocredark},
      title={SYLLABUS EXTRACT},
      attach title to upper={\par\vspace{3pt}}]
    #1
  \end{tcolorbox}}

\endinput
