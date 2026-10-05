% rvcepaper.cls -- RV College of Engineering CIE / SEE question paper template
% Build with XeLaTeX:  xelatex <file>.tex
%
% Paper environments (each starts on a fresh page)
%   iempaper   IEM CIE, logo header on every page, DEPARTMENT OF .. box (\iemhead)
%   iempaperB  IEM CIE, running header = logo + tagline + [USN boxes] + "Academic year ..." + double rule (\iemheadB)
%   mathpaper  Department of Mathematics CIE (\mathead, matable)
%   seepaper   Semester End Examination (\seehead, seeA / seeB)
% Question tables
%   cietable (Sl.No | Questions | M | BT | CO)     \qpart \q
%   matable  (Sl.No | Instructions | M | CO | BT)  \qpartm \q
%   seeA / seeB                                    \qa \qb
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{rvcepaper}[2026/10/05 RVCE question paper template]
\LoadClass[11pt,a4paper]{article}

\RequirePackage[a4paper,left=1.7cm,right=1.7cm,top=0.9cm,headheight=2.55cm,headsep=0.35cm,includehead,bottom=1.5cm,footskip=0.7cm]{geometry}
\RequirePackage{fontspec}
\RequirePackage{amsmath,amssymb}
\RequirePackage{graphicx}
\RequirePackage{xcolor}
\RequirePackage{array}
\RequirePackage{longtable}
\RequirePackage{multirow}
\RequirePackage{enumitem}
\RequirePackage{fancyhdr}
\RequirePackage{pgfkeys}
\RequirePackage{tikz}
\usetikzlibrary{arrows.meta,calc,positioning}
\RequirePackage{etoolbox}
\RequirePackage{textcomp}

\setmainfont{Times New Roman}
\newfontfamily\sansfont{Arial}

\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}
\setlength{\tabcolsep}{4pt}
\renewcommand{\arraystretch}{1.3}
\setlength{\LTpre}{0pt}
\setlength{\LTpost}{0pt}
\setlength{\LTleft}{0pt}
\setlength{\LTright}{0pt}
\sloppy
\hyphenpenalty=10000 \exhyphenpenalty=10000 \tolerance=9999 \emergencystretch=3em

% ---------------------------------------------------------------- generic helpers
\newcommand{\blank}[1][2cm]{\underline{\hspace{#1}}}
\newcommand{\bl}{\underline{\hspace{2.2cm}}}
\newcommand{\rupee}{{\fontspec{Arial}\symbol{"20B9}}}
\newcolumntype{C}[1]{>{\centering\arraybackslash}p{#1}}

\newenvironment{abc}{\begin{enumerate}[label=\alph*),leftmargin=1.5em,itemsep=0pt,topsep=1pt,parsep=0pt,partopsep=0pt]}{\end{enumerate}}
\newenvironment{ABC}{\begin{enumerate}[label=\Alph*),leftmargin=1.5em,itemsep=0pt,topsep=1pt,parsep=0pt,partopsep=0pt]}{\end{enumerate}}
\newenvironment{rom}{\begin{enumerate}[label=(\roman*),leftmargin=1.8em,itemsep=0pt,topsep=1pt,parsep=0pt,partopsep=0pt]}{\end{enumerate}}
\newenvironment{romi}{\begin{enumerate}[label=\roman*.,leftmargin=1.8em,itemsep=0pt,topsep=1pt,parsep=0pt,partopsep=0pt]}{\end{enumerate}}
\newenvironment{num}{\begin{enumerate}[label=\arabic*.,leftmargin=1.5em,itemsep=0pt,topsep=1pt,parsep=0pt,partopsep=0pt]}{\end{enumerate}}
\newenvironment{bul}{\begin{itemize}[leftmargin=1.5em,itemsep=0pt,topsep=1pt,parsep=0pt,partopsep=0pt]}{\end{itemize}}
% a small inline table inside a question: \qtab{lcc}{...}
\newcommand{\qtab}[2]{\par\vspace{2pt}\begin{tabular}{#1}#2\end{tabular}\par\vspace{2pt}}
\newcommand{\qtabc}[2]{\par\vspace{2pt}\centerline{\begin{tabular}{#1}#2\end{tabular}}\par\vspace{2pt}}

% ---------------------------------------------------------------- USN boxes
\newcommand{\usnboxes}{%
  \begingroup\renewcommand{\arraystretch}{1}\setlength{\tabcolsep}{0pt}%
  \begin{tabular}{|*{10}{p{0.62cm}|}}\hline \rule{0pt}{0.52cm}&&&&&&&&&\\ \hline\end{tabular}\endgroup}

% ---------------------------------------------------------------- RVCE logo blocks
\newcommand{\rvcelogo}[1][2.45cm]{\includegraphics[height=#1]{rvce-emblem.png}}
\newcommand{\rvcename}{%
  \sansfont\fontsize{14.5}{16}\selectfont RV College of Engineering\textsuperscript{\tiny\textregistered}}
\newcommand{\rvceaddr}{%
  \sansfont\fontsize{6.8}{8.6}\selectfont\begin{tabular}[t]{@{}l@{}}Mysore Road, RV Vidyaniketan Post,\\Bengaluru - 560059, Karnataka, India\end{tabular}}
\newcommand{\rvcelogoblock}[1][2.45cm]{%
  \begin{minipage}[c]{#1}\rvcelogo[#1]\end{minipage}\hspace{0.1cm}%
  \begin{minipage}[c]{9.5cm}\rvcename\\[3pt]\rvceaddr\end{minipage}}
% "Bengaluru - 59" variant of the logo block
\newcommand{\rvcelogoblockb}[1][2.2cm]{%
  \begin{minipage}[c]{#1}\rvcelogo[#1]\end{minipage}\hspace{0.3cm}%
  \begin{minipage}[c]{11cm}{\fontsize{12.5}{15}\selectfont RV College of Engineering\textsuperscript{\tiny\textregistered}, Bengaluru -- 59}\\[2pt]{\itshape\fontsize{11}{13}\selectfont (Autonomous Institution affiliated to VTU, Belagavi )}\end{minipage}}

% ---------------------------------------------------------------- paper metadata keys
\pgfkeys{/rvce/.is family, /rvce,
  dept/.initial={INDUSTRIAL ENGINEERING \& MANAGEMENT},
  date/.initial={}, exam/.initial={}, maxmarks/.initial={}, sem/.initial={},
  prog/.initial={UG}, duration/.initial={}, title/.initial={}, code/.initial={},
  ayear/.initial={}, time/.initial={}, test/.initial={}, programs/.initial={},
  instr/.initial={Answer all questions.}, note/.initial={Answer all the Questions.},
  examline/.initial={}, usn/.initial={1}, hdr/.initial={1}, yearword/.initial={year},
  rule/.initial={1}, shownote/.initial={1}, deptline/.initial={},
  program/.initial={}, ggroup/.initial={}, month/.initial={}, mtime/.initial={},
  gdate/.initial={}, duration2/.initial={}
}
\newcommand{\paperinfo}[1]{\pgfkeys{/rvce/.cd,#1}}
\newcommand{\getkey}[1]{\pgfkeysvalueof{/rvce/#1}}

% ---------------------------------------------------------------- page styles
\newcommand{\rvcefooter}{\fancyfoot[C]{\rule{\textwidth}{0.4pt}\\[-2pt]\hfill{\itshape\small Go, change the world\textsuperscript{\tiny\textregistered}}\hspace{0.1cm}}}
\newcommand{\rvcetagline}{{\itshape\fontsize{12}{14}\selectfont Go, change the world\textsuperscript{\tiny\textregistered}}}
\fancypagestyle{rvce}{\fancyhf{}\renewcommand{\headrulewidth}{0pt}\renewcommand{\footrulewidth}{0pt}%
  \fancyhead[L]{\rvcelogoblock}\rvcefooter}
% running header of the "Academic year" style
\newcommand{\rvceBheader}{%
  \noindent\begin{minipage}[t]{\textwidth}
  \noindent\begin{minipage}[c]{0.62\textwidth}\ifnum\getkey{hdr}=1 \rvcelogoblock[2.3cm]\else\rvcelogoblockb\fi\end{minipage}%
  \begin{minipage}[c]{0.38\textwidth}\raggedleft\rvcetagline\par\vspace{4pt}%
    \ifnum\getkey{usn}=1 {\bfseries\small USN}\hspace{0.1cm}\usnboxes\fi\end{minipage}\par\vspace{3pt}
  \centerline{\bfseries\fontsize{13.5}{16}\selectfont Academic \getkey{yearword} \getkey{ayear}}\par\vspace{2pt}
  \ifnum\getkey{rule}=1 \rule{\textwidth}{1.4pt}\par\nointerlineskip\vspace{1.3pt}\rule{\textwidth}{0.4pt}\fi
  \end{minipage}}
\fancypagestyle{rvceB}{\fancyhf{}\renewcommand{\headrulewidth}{0pt}\renewcommand{\footrulewidth}{0pt}%
  \fancyhead[L]{\rvceBheader}\rvcefooter}
\fancypagestyle{rvcefirstM}{\fancyhf{}\renewcommand{\headrulewidth}{0pt}\renewcommand{\footrulewidth}{0pt}\rvcefooter}
\fancypagestyle{rvcesee}{\fancyhf{}\renewcommand{\headrulewidth}{0pt}\renewcommand{\footrulewidth}{0pt}}
\pagestyle{rvce}

% ---------------------------------------------------------------- paper environments
\newenvironment{iempaper}{\clearpage\paperinfo{shownote=1,deptline={},note={Answer all the Questions.}}\pagestyle{rvce}}{}
\newenvironment{iempaperB}{\clearpage\paperinfo{usn=1,hdr=1,rule=1,yearword=year,shownote=1,deptline={},note={Answer all the Questions.}}\newgeometry{left=1.7cm,right=1.7cm,top=0.5cm,headheight=3.75cm,headsep=0.3cm,includehead,bottom=1.5cm,footskip=0.7cm}\pagestyle{rvceB}}{\clearpage\restoregeometry\pagestyle{rvce}}
\newenvironment{mathpaper}{\clearpage\pagestyle{rvce}\thispagestyle{rvcefirstM}}{\clearpage}
\newenvironment{seepaper}{\clearpage\newgeometry{left=1.7cm,right=1.7cm,top=0.9cm,bottom=1.5cm}\pagestyle{rvcesee}}{\clearpage\restoregeometry\pagestyle{rvce}}

% ================================================================ IEM CIE header (logo in running header)
\newcommand{\iemnote}{\ifnum\getkey{shownote}=1 {\small Note:}\\[-1pt]\hspace*{0.5cm}{\footnotesize 1. \hspace{0.1cm}\getkey{note}}\par\vspace{3pt}\fi}
\newcommand{\iemnotep}{{\small Note:}\hspace{0.2cm}{\small\getkey{note}}\par\vspace{3pt}}
\newcommand{\iemhead}{%
  \noindent
  \begin{center}{\fontsize{12}{14}\selectfont DEPARTMENT OF}\\[3pt]
  {\bfseries\fontsize{15.5}{18}\selectfont \getkey{dept}}\end{center}\vspace{-3pt}
  \noindent\begingroup\renewcommand{\arraystretch}{2.0}\bfseries\fontsize{11.5}{13}\selectfont
  \begin{tabular}{|p{6.2cm}|C{5.0cm}|p{5.5cm}|}\hline
   Date \hspace{0.5cm}: \hspace{0.2cm}\getkey{date} & \getkey{exam} & Max. Marks \hspace{0.3cm}: \hspace{0.2cm}\getkey{maxmarks}\\\hline
   Semester \hspace{0.1cm}: \hspace{0.2cm}\getkey{sem} & \getkey{prog} & Duration \hspace{0.55cm}: \hspace{0.2cm}\getkey{duration}\\\hline
   \multicolumn{2}{|p{11.2cm}|}{Course Title: \getkey{title}} & Course Code \hspace{0.1cm}: \hspace{0.2cm}\getkey{code}\\\hline
  \end{tabular}\endgroup\par\vspace{4pt}
  \iemnote}

% "Academic year" style (header is in the running page header)
\newcommand{\iemheadB}{%
  \edef\tmpd{\getkey{deptline}}\ifx\tmpd\empty
  \begin{center}{\fontsize{12}{14}\selectfont DEPARTMENT OF}\\[3pt]
  {\bfseries\fontsize{12.5}{14}\selectfont \getkey{dept}}\end{center}\vspace{-4pt}\else
  \par\vspace{4pt}\centerline{\small \tmpd}\par\vspace{6pt}\fi
  \noindent\begingroup\renewcommand{\arraystretch}{1.5}\bfseries\fontsize{11.5}{13}\selectfont
  \begin{tabular}{|p{4.2cm}|p{5.0cm}|p{3.7cm}|p{3.6cm}|}\hline
   Date & \getkey{date} & Maximum Marks & \getkey{maxmarks}\\\hline
   Course Code & \getkey{code} & Duration & \getkey{duration}\\\hline
   Sem & \getkey{sem} & \multicolumn{2}{l|}{\getkey{exam}}\\\hline
   \multicolumn{4}{|c|}{\getkey{title}}\\\hline
  \end{tabular}\endgroup\par\vspace{4pt}
  \iemnote}

% ================================================================ Mathematics CIE header (Sem 3)
\newcommand{\mathead}{%
  \vspace*{-2.9cm}\noindent\rvcelogo[2.3cm]\hspace{0.3cm}\begin{minipage}[c]{12.5cm}\centering
   {\bfseries\fontsize{15}{18}\selectfont RV College of Engineering}\\[3pt]
   {\bfseries\fontsize{10.5}{12}\selectfont DEPARTMENT OF \getkey{dept}}\end{minipage}\par\vspace{2pt}
  \noindent\rule{\textwidth}{0.8pt}\\[1pt]
  \centerline{\fontsize{11.5}{13}\selectfont Academic year \getkey{ayear}}\par\vspace{4pt}
  \noindent\begingroup\renewcommand{\arraystretch}{1.35}\bfseries\fontsize{10}{12}\selectfont
  \begin{tabular}{|C{2.2cm}|C{6.6cm}|C{3.0cm}|C{3.9cm}|}\hline
   Date & \getkey{date} & Time & \getkey{time}\\\hline
   TEST & \getkey{test} & Maximum Marks & \getkey{maxmarks}\\\hline
   Course Title & \getkey{title} & Course Code & \getkey{code}\\\hline
   Semester & \getkey{sem} & Programs & \getkey{programs}\\\hline
  \end{tabular}\endgroup\par\vspace{8pt}}

% ================================================================ questions table (CIE)
\newenvironment{cietable}[3]{%
  \def\cieA{#1}\def\cieB{#2}\def\cieC{#3}%
  \begin{longtable}{|C{1.05cm}|p{12.2cm}|C{0.95cm}|C{0.95cm}|C{0.95cm}|}
  \hline
  \textbf{Sl.\newline No} & \multicolumn{1}{c|}{\textbf{Questions}} & \textbf{\cieA} & \textbf{\cieB} & \textbf{\cieC}\\ \hline
  \endfirsthead
  \endhead
}{\end{longtable}}
\newcommand{\qpart}[1]{\multicolumn{5}{|c|}{\bfseries #1}\\ \hline}
\newcommand{\q}[5]{#1 & #2 & #3 & #4 & #5\\ \hline}
% centered heading placed above a table:  \ptitle{PART -- A}
\newcommand{\ptitle}[1]{\par\vspace{3pt}\centerline{\bfseries #1}\par\vspace{2pt}}


% heading above a table with a right-hand caption:  \ptitlem{PART -- A}{Max Marks: 10}
\newcommand{\ptitlem}[2]{\par\vspace{3pt}\noindent\hbox to \textwidth{\hfil\textbf{#1}\hfil}\llap{\textbf{#2}\hspace{0.1cm}}\par\vspace{2pt}}

% Mathematics CIE table: header carries the instruction line
\newenvironment{matable}[3]{%
  \def\cieA{#1}\def\cieB{#2}\def\cieC{#3}%
  \begin{longtable}{|C{1.05cm}|p{12.2cm}|C{0.95cm}|C{0.95cm}|C{0.95cm}|}
  \hline
  \fontsize{10}{12}\selectfont Sl.\newline No & \centering\fontsize{10}{12}\selectfont Instructions: \hspace{0.2cm} \getkey{instr}\newline Part - A & \fontsize{10}{12}\selectfont\cieA & \fontsize{10}{12}\selectfont\cieB & \fontsize{10}{12}\selectfont\cieC\tabularnewline
  \hline
  \endfirsthead
  \endhead
}{\end{longtable}}
\newcommand{\qpartm}[1]{& \centering #1 & & & \tabularnewline \hline}

% BT / CO footer table:  \btfoot{<column spec>}{<table body>}
\newcommand{\btfoot}[2]{\par\vspace{8pt}\centerline{\small BT-Blooms Taxonomy, CO-Course Outcomes, M-Marks}\par\vspace{2pt}
  \centerline{\begin{tabular}{#1}#2\end{tabular}}\par\vspace{2pt}}
\newcommand{\stars}[1]{\par\centerline{#1}}
\newcommand{\matfoot}[1]{\btfoot{|l|l|*{10}{C{0.85cm}|}}{\hline #1}}

% ================================================================ SEE style
\newcommand{\seehead}{%
  \hfill{\bfseries\fontsize{11}{13}\selectfont \getkey{code}}\par\vspace{2pt}
  \noindent\hspace{0.22\textwidth}{\bfseries USN}\hspace{0.9cm}\usnboxes\par\vspace{10pt}
  \begin{center}
  {\bfseries\fontsize{12.5}{14}\selectfont RV COLLEGE OF ENGINEERING\textsuperscript{\tiny\textregistered}}\\
  {\bfseries\small (An Autonomous Institution affiliated to VTU)}\\
  {\bfseries\small \getkey{examline}}\\
  {\bfseries\fontsize{11.5}{13}\selectfont \getkey{dept}}\\
  {\bfseries\fontsize{13.5}{15}\selectfont \getkey{title}}
  \end{center}\vspace{-2pt}
  \noindent{\bfseries\itshape\small Time: \getkey{time}}\hfill{\bfseries\itshape\small Maximum Marks: \getkey{maxmarks}}\par
  {\bfseries\itshape\small Instructions to candidates:}\par}
\newenvironment{seeinstr}{\begin{enumerate}[label=\arabic*.,leftmargin=1.7em,itemsep=0pt,topsep=1pt,parsep=0pt]}{\end{enumerate}\vspace{2pt}}
% PART-A heading with M BT CO captions over the marks columns
\newcommand{\seepartA}{\par\vspace{6pt}\noindent\hbox to \textwidth{\hfil\textbf{PART-A}\hfil\hbox to 3.3cm{\hbox to 1.1cm{\hfil\textbf{M}\hfil}\hbox to 1.1cm{\hfil\textbf{BT}\hfil}\hbox to 1.1cm{\hfil\textbf{CO}\hfil}}\hspace{0.15cm}}\par\vspace{3pt}}
\newcommand{\seepart}[1]{\par\vspace{6pt}\centerline{\bfseries #1}\par\vspace{3pt}}
% Part A table : number | sub | question | M | BT | CO  (no horizontal rules between rows)
\newenvironment{seeA}{\renewcommand{\arraystretch}{1.15}%
  \begin{longtable}{|C{0.7cm}C{0.9cm}|p{11.0cm}|C{0.9cm}|C{0.9cm}|C{0.9cm}|}\hline}{\hline\end{longtable}}
\newcommand{\qa}[5]{& #1 & #2 & #3 & #4 & #5\\}
\newcommand{\qaq}[6]{#1 & #2 & #3 & #4 & #5 & #6\\}
% Part B table : qno | sub | question | M | BT | CO
\newenvironment{seeB}{\renewcommand{\arraystretch}{1.15}%
  \begin{longtable}{|C{0.7cm}C{0.9cm}|p{11.0cm}|C{0.9cm}|C{0.9cm}|C{0.9cm}|}\hline}{\end{longtable}}
\newcommand{\qb}[6]{#1 & #2 & #3 & #4 & #5 & #6\\ \hline}

\input{rvcege.def}
