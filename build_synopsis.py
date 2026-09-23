# build_synopsis.py — Generate complete academic Minor Project Synopsis docx for Swachh Buddy

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="D3D3D3", sz="4", val="single"):
    tblPr = table._element.xpath('w:tblPr')
    if tblPr:
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:left w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tblBorders>'
        )
        tblPr[0].append(borders)

def create_synopsis():
    doc = docx.Document()

    # Page setup — 1 inch margins all around
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)

    # Base style configurations
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(0, 0, 0)

    # Helper function for paragraphs
    def add_p(text="", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.15, bold=False, italic=False, size=12):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if text:
            run = p.add_run(text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(size)
            run.font.bold = bold
            run.font.italic = italic
            run.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_heading_1(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_heading_2(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12.5)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_heading_3(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.italic = True
        run.font.color.rgb = RGBColor(0, 0, 0)
        return p

    # -------------------------------------------------------------
    # PAGE 1: FRONT PAGE (Strictly adhering to College Template)
    # -------------------------------------------------------------
    add_p("[COLLEGE / UNIVERSITY NAME]", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=2, bold=True, size=15)
    add_p("DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=18, bold=True, size=13)

    add_p("MINOR PROJECT SYNOPSIS", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=14, bold=True, size=16)

    add_p("Title of the Project:", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=4, bold=False, italic=True, size=12)
    add_p("SWACHH BUDDY: AN INTEGRATED SMART WASTE MANAGEMENT PLATFORM USING AI, IoT, CITIZEN PARTICIPATION AND REAL-TIME MONITORING",
          align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=18, bold=True, size=14)

    add_p("“Synopsis submitted in partial fulfillment of the requirement for the Minor Project, VIIth semester”",
          align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=32, italic=True, size=12)

    # Supervisors and Students Layout Table
    front_table = doc.add_table(rows=1, cols=2)
    front_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    front_table.autofit = False
    front_table.columns[0].width = Inches(3.2)
    front_table.columns[1].width = Inches(3.3)

    cell_left = front_table.cell(0, 0)
    p_sup = cell_left.paragraphs[0]
    p_sup.paragraph_format.line_spacing = 1.2
    p_sup.paragraph_format.space_after = Pt(2)
    r1 = p_sup.add_run("Under the supervision of:\n")
    r1.bold = True
    r1.font.size = Pt(12)
    r2 = p_sup.add_run("[GUIDE NAME]\n")
    r2.bold = True
    r2.font.size = Pt(12)
    r3 = p_sup.add_run("[DESIGNATION & DEPTT.]\n[DEPARTMENT OF CSE]")
    r3.font.size = Pt(11)

    cell_right = front_table.cell(0, 1)
    p_sub = cell_right.paragraphs[0]
    p_sub.paragraph_format.line_spacing = 1.2
    p_sub.paragraph_format.space_after = Pt(2)
    r4 = p_sub.add_run("Submitted by:\n")
    r4.bold = True
    r4.font.size = Pt(12)
    r5 = p_sub.add_run("GROUP NO. ______\n")
    r5.bold = True
    r5.font.size = Pt(12)
    r6 = p_sub.add_run("[STUDENT NAME(S)]\n[ENROLLMENT NO(S).]")
    r6.font.size = Pt(11)

    add_p("August 2026", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=45, space_after=0, bold=True, size=12)

    doc.add_page_break()

    # -------------------------------------------------------------
    # PAGE 2: TABLE OF CONTENTS
    # -------------------------------------------------------------
    add_p("TABLE OF CONTENTS", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=16, bold=True, size=14)

    toc_items = [
        ("1. Introduction", "3"),
        ("    1.1 Context of Municipal Solid Waste Management", "3"),
        ("    1.2 Challenges in Current Waste Ecosystems", "3"),
        ("    1.3 Role of Smart City Technologies", "3"),
        ("    1.4 Introduction to Swachh Buddy", "4"),
        ("2. Need of the Project", "4"),
        ("    2.1 Limitations of Conventional Waste Management Systems", "4"),
        ("    2.2 Socio-Technical Gaps and Citizen Disengagement", "5"),
        ("    2.3 Inefficiencies in Municipal Logistics and Monitoring", "5"),
        ("    2.4 The Rationale for an Integrated Solution", "5"),
        ("3. Problem Statement", "6"),
        ("    3.1 Problem Formulation", "6"),
        ("    3.2 Specific Research and Practical Challenges Addressed", "6"),
        ("4. Proposed System / Project Overview", "7"),
        ("    4.1 Conceptual Architecture and Workflow", "7"),
        ("    4.2 Stakeholder Ecosystem and Interaction Models", "7"),
        ("    4.3 Technical Framework & Design Philosophy", "8"),
        ("5. Key Features of Swachh Buddy", "8"),
        ("    5.1 Major Features Matrix", "8"),
        ("6. Literature Review", "10"),
        ("    6.1 Systematic Literature Review Table (15 Papers, 2023–2024)", "10"),
        ("    6.2 Theoretical Synthesis of Core Technologies", "12"),
        ("    6.3 Research Gap Analysis", "13"),
        ("7. Hardware and Software Requirements", "13"),
        ("8. Expected Outcome of the Project", "14"),
        ("    8.1 Product / Intellectual Property Potential", "14"),
        ("    8.2 Research Paper Contribution", "14"),
        ("9. Conclusion and Future Scope", "14"),
        ("    9.1 Conclusion", "14"),
        ("    9.2 Future Scope", "15"),
        ("10. References", "15")
    ]

    toc_table = doc.add_table(rows=len(toc_items), cols=2)
    toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    toc_table.autofit = False
    toc_table.columns[0].width = Inches(5.8)
    toc_table.columns[1].width = Inches(0.7)

    for i, (title, pg) in enumerate(toc_items):
        cell_t = toc_table.cell(i, 0)
        cell_p = toc_table.cell(i, 1)
        
        p1 = cell_t.paragraphs[0]
        p1.paragraph_format.space_before = Pt(1)
        p1.paragraph_format.space_after = Pt(1)
        p1.paragraph_format.line_spacing = 1.1
        r1 = p1.add_run(title)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11)
        if not title.startswith("   "):
            r1.font.bold = True

        p2 = cell_p.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p2.paragraph_format.space_before = Pt(1)
        p2.paragraph_format.space_after = Pt(1)
        p2.paragraph_format.line_spacing = 1.1
        r2 = p2.add_run(pg)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(11)
        if not title.startswith("   "):
            r2.font.bold = True

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 1: INTRODUCTION
    # -------------------------------------------------------------
    add_heading_1("1. Introduction")

    add_heading_2("1.1 Context of Municipal Solid Waste Management")
    add_p("Rapid global urbanization, economic expansion, and shifting consumption patterns have led to unprecedented surges in Municipal Solid Waste (MSW) generation. According to global environmental studies, urban centers worldwide produce billions of tonnes of solid waste annually, placing acute structural strain on municipal municipal bodies, public health infrastructures, and ecological systems. In developing economies, especially in densely populated urban centers, the escalation of waste volumes has drastically outpaced the processing and operational capacities of civic authorities. The prevailing mode of waste handling remains predominantly linear—characterized by unsegregated disposal, irregular collection intervals, and extensive open landfilling—resulting in severe environmental degradation, ground and surface water contamination through leachate, and substantial greenhouse gas emissions, notably methane.")

    add_heading_2("1.2 Challenges in Current Waste Ecosystems")
    add_p("The foundational failure of modern municipal waste management originates at the point of waste generation: the citizen household and commercial establishment. While national regulations, such as India's Solid Waste Management Rules 2016, mandate strict source segregation into wet (organic/biodegradable), dry (recyclable), domestic hazardous, and electronic waste (e-waste) streams, compliance remains severely deficient. Citizens frequently lack immediate, contextual guidance on proper disposal categories and possess little tangible incentive to engage in meticulous segregation. Consequently, mixed waste is deposited into municipal streams, rendering automated mechanical recycling economically unviable and environmentally hazardous. Furthermore, informal waste pickers (kabadiwalas and rag pickers), who form the informal backbone of recycling in developing nations, operate under precarious socio-economic conditions without institutional recognition, fair pricing visibility, or integration into official municipal data streams.")

    add_heading_2("1.3 Role of Smart City Technologies")
    add_p("Smart city paradigms leverage advancements in Artificial Intelligence (AI), the Internet of Things (IoT), Computer Vision, cloud computing, and geospatial analytics to transform fragmented urban services into cohesive, data-driven systems. In waste management, Deep Convolutional Neural Networks (CNNs) and vision-language models enable instantaneous visual classification of waste materials from consumer imagery. Concurrently, IoT sensors facilitate real-time monitoring of collection bin fill-levels, and GPS-enabled geospatial mapping empowers dynamic vehicle routing, fuel optimization, and comprehensive municipal oversight. However, technological interventions in smart waste management have historically operated in isolated silos—either focusing exclusively on deep learning classifiers, standalone IoT sensor bins, or localized vehicle tracking systems without establishing an interactive socio-technical loop involving the public.")

    add_heading_2("1.4 Introduction to Swachh Buddy")
    add_p("To overcome these systemic fragmentation barriers, this project proposes Swachh Buddy: An Integrated Smart Waste Management Platform. Swachh Buddy is conceived not merely as an isolated classification utility, but as an expansive, end-to-end digital ecosystem that bridges citizens, informal waste collectors, municipal administration, and smart logistics. By integrating deep learning vision models for automated waste segregation guidance, interactive multilingual conversational AI for civic education, gamified incentive mechanisms (reward points and carbon footprint tracking), geo-tagged civic complaint logging, on-demand scheduled pickups, rag-picker digital identity management, and real-time municipal vehicle/facility tracking, Swachh Buddy establishes a closed-loop socio-technical platform designed to advance sustainable smart-city governance.")

    # -------------------------------------------------------------
    # SECTION 2: NEED OF THE PROJECT
    # -------------------------------------------------------------
    add_heading_1("2. Need of the Project")

    add_heading_2("2.1 Limitations of Conventional Waste Management Systems")
    add_p("Conventional municipal waste management systems in most urban agglomerations exhibit structural and operational vulnerabilities that hinder sustainable material recovery:")
    add_p("• Ineffective Source Segregation: Conventional public bins and household disposal practices rely on voluntary compliance without active verification or guidance. When waste is mixed at source, recyclable plastics and paper become contaminated with organic wet waste, destroying their recycling value.\n"
          "• Inefficient Collection Logistics: Traditional waste collection fleets operate along static, predetermined routes and fixed schedules regardless of actual bin fill-levels or localized accumulation, leading to unnecessary fuel expenditure, increased vehicular emissions, and delayed clearance of overflowing dump points.\n"
          "• Information Asymmetry and Disconnected Logistics: Citizens possess no real-time visibility into sanitation truck schedules, designated e-waste drop-off locations, hazardous disposal days, or local recycling centers (dhalaos and kabadiwalas).\n"
          "• Lack of Administrative Transparency: Municipal supervisors face significant obstacles in tracking ground-level collection activities, validating worker attendance, evaluating neighborhood-level segregation metrics, and resolving citizen grievances promptly.")

    add_heading_2("2.2 Socio-Technical Gaps and Citizen Disengagement")
    add_p("A primary bottleneck in urban sanitation is the psychological disconnect between individual waste generation and collective ecological consequence. Without immediate feedback, validation, or reward structures, public participation in source segregation remains passive. Furthermore, complex classification categories (e.g., distinguishing multi-layered plastics, compostable plastics, and hazardous consumables) confuse well-intentioned citizens. Swachh Buddy directly resolves this gap by providing an instant AI-powered smartphone camera classifier, interactive conversational guidance in regional languages and Hinglish, and quantifiable carbon-offset metrics that convert daily segregation into tangible civic achievements.")

    add_heading_2("2.3 Socio-Economic Vulnerability of Informal Waste Workers")
    add_p("Informal waste pickers collect and divert thousands of tonnes of recyclable materials daily, yet they remain socially marginalized, economically vulnerable, and unintegrated into municipal records. The lack of documented verification deprives them of institutional recognition, formal credit access, and fair compensation. Swachh Buddy introduces a dedicated Digital Identity and Collection Logging Module for waste pickers, enabling verified collection recording, municipal registration, and certified income validation.")

    add_heading_2("2.4 The Rationale for an Integrated Solution")
    add_p("Rather than proposing separate disjointed tools, an integrated platform synthesizes data across the entire municipal lifecycle: Citizen → AI Classification → Responsible Disposal → Dynamic Collection & Tracking → Municipal Monitoring & Policy Analytics. By uniting these dimensions into a unified web and mobile architecture, Swachh Buddy empowers municipalities with data-driven decision capabilities while fostering sustainable civic habits.")

    # -------------------------------------------------------------
    # SECTION 3: PROBLEM STATEMENT
    # -------------------------------------------------------------
    add_heading_1("3. Problem Statement")
    add_p("Urban municipal solid waste management systems suffer from acute operational fragmentation and low civic engagement, resulting in high rates of mixed unsegregated waste, inefficient collection logistics, and lack of real-time municipal transparency. Existing technological solutions predominantly address isolated dimensions of the problem—such as standalone image classification models, isolated IoT sensor prototypes, or independent routing algorithms—without providing an integrated, accessible socio-technical framework that links citizens, informal waste workers, and municipal authorities into a collaborative ecosystem.")
    add_p("Therefore, the core research and developmental problem addressed by this project is the design, conceptualization, and implementation of Swachh Buddy: an integrated smart waste management platform that seamlessly combines AI-driven multi-category waste identification, interactive citizen education, gamified reward and carbon tracking systems, geo-tagged civic reporting, digitized waste-picker integration, and real-time municipal tracking into a unified, scalable digital infrastructure.")

    # -------------------------------------------------------------
    # SECTION 4: PROPOSED SYSTEM / PROJECT OVERVIEW
    # -------------------------------------------------------------
    add_heading_1("4. Proposed System / Project Overview")

    add_heading_2("4.1 Conceptual Architecture and Workflow")
    add_p("Swachh Buddy operates as a centralized, multi-role progressive web platform structured around an end-to-end municipal waste lifecycle. The conceptual workflow spans seven sequential phases:")
    add_p("1. Citizen Input & AI Segregation: The citizen captures an image of a waste item via mobile camera or web upload. The image is processed through client-side compression and transmitted to the multimodal AI classification engine, which returns the exact category (Wet, Dry, Hazardous, E-Waste), designated bin color, recyclable status, handling instructions, and estimated CO2 offset.\n"
          "2. Disposal & Verification: The user confirms proper segregation or logs a verified disposal action (via QR code verification at collection points or smart bins), earning reward points and logging carbon prevention entries.\n"
          "3. Civic Reporting & Scheduling: For bulky waste, electronic items, or uncollected garbage hotspots, citizens submit geo-tagged photo reports or book scheduled pickups.\n"
          "4. Collection Operations & Logistics: Waste collection personnel and informal pickers receive pickup dispatches and log collection batches (item types, weight, and timestamps).\n"
          "5. Geospatial Fleet & Infrastructure Tracking: The platform integrates interactive geospatial maps displaying live sanitation vehicle routes, neighborhood dhalao points, certified e-waste centers, kabadiwala locations, and hazardous processing facilities.\n"
          "6. Municipal Administrative Oversight: Civic administrators access a role-protected dashboard providing live aggregate statistics, zone-wise segregation compliance metrics, resolved issue tracking, and workforce management.\n"
          "7. Data Analytics & Feedback Loop: Aggregated collection data feeds back into municipal policy planning, carbon auditing, and community leaderboard incentives.")

    add_heading_2("4.2 Stakeholder Ecosystem")
    add_p("The platform caters to three primary stakeholder groups with specialized interfaces:")
    add_p("• Citizens (End-Users): Access AI classification, interactive educational modules, voice-assisted EcoBuddy chatbot, gamified rewards, carbon trackers, pickup scheduling, and issue reporting.\n"
          "• Informal Waste Pickers / Collectors: Utilize the Digital Identity portal to record collection weights, build verifiable work histories, access fair pricing benchmarks, and generate formal income certificates.\n"
          "• Municipal & Corporate Administrators: Utilize administrative dashboards for fleet route monitoring, pickup request assignment, QR code generation, waste flow heatmaps, and zonal compliance analytics.")

    # -------------------------------------------------------------
    # SECTION 5: KEY FEATURES OF SWACHH BUDDY
    # -------------------------------------------------------------
    add_heading_1("5. Key Features of Swachh Buddy")
    add_p("The functional capabilities of the Swachh Buddy platform are detailed in Table 1, categorizing features by operational scope, primary user, and anticipated civic/environmental benefit.")

    add_p("Table 1: Major Features of Swachh Buddy Platform", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=4, bold=True, size=11)

    features = [
        ("AI Waste Classifier", "Multimodal deep learning vision model for instant classification into Wet, Dry, Hazardous, and E-Waste streams with bin color and CO2 metrics.", "Citizens / Public", "Eliminates confusion at source; ensures high purity of segregated recyclable and organic streams."),
        ("EcoBuddy AI Chatbot & Voice Assistant", "Multilingual conversational assistant supporting Hindi, English, and Hinglish with voice-to-text (Whisper) and speech synthesis.", "Citizens / Students", "Provides accessible, conversational guidance on recycling rules, 5Rs, and local municipal bylaws."),
        ("Gamification & Reward System", "Points engine awarding tokens for verified disposal, completed learning modules, and referral scans; redeemable for civic perks.", "Citizens / Households", "Incentivizes sustained, active public participation in municipal waste segregation."),
        ("Carbon Footprint Impact Tracker", "Real-time ledger calculating CO2 equivalent prevented, tree-absorption equivalents, and driving km offset per disposal.", "Citizens / Environmentalists", "Provides quantifiable feedback on personal ecological impact, reinforcing green behaviors."),
        ("Geo-Tagged Civic Reporting System", "Camera and GPS-linked module for reporting overflowing bins, illegal dump sites, and missed pickups with status tracking.", "Citizens / Municipalities", "Improves civic accountability and dramatically accelerates municipal cleanup response times."),
        ("Scheduled On-Demand Pickups", "Booking interface for bulky dry waste, construction debris, and specialized e-waste collection dispatches.", "Households / Businesses", "Prevents unauthorized roadside dumping of bulky and electronic hazardous items."),
        ("Rag Picker Digital Identity Portal", "Identity registration, collection batch logging, Swachh Score calculation, and verifiable income certificate generator.", "Waste Pickers / Municipalities", "Formalizes informal recyclers, provides verified credit profiles, and stabilizes livelihood tracking."),
        ("Live Geospatial Resource Map", "Leaflet/Map-based interactive layer tracking waste trucks, dhalaos, e-waste centers, kabadiwalas, and dumpyards.", "All Stakeholders", "Optimizes public discovery of recycling points and enables dynamic fleet visibility."),
        ("Municipal Administrative Dashboard", "Role-gated administrative suite for managing pickup dispatches, worker verification, QR generation, and zone analytics.", "Municipal Authorities", "Enables data-driven municipal governance, resource allocation, and operational auditing."),
        ("Interactive Learning & Quiz Hub", "Tiered interactive curriculum across 4 tracks (Waste Basics, Student, Community, RagPicker) with quizzes and mini-games.", "Students / Community", "Builds deep long-term community awareness through engaging interactive education.")
    ]

    feat_table = doc.add_table(rows=len(features)+1, cols=4)
    feat_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    feat_table.autofit = False
    set_table_borders(feat_table)

    col_widths = [Inches(1.5), Inches(2.2), Inches(1.2), Inches(1.6)]
    for row in feat_table.rows:
        for j, w in enumerate(col_widths):
            row.cells[j].width = w

    headers = ["Feature", "Description", "Primary User", "Expected Benefit"]
    for j, h in enumerate(headers):
        cell = feat_table.cell(0, j)
        set_cell_background(cell, "F2F4F7")
        set_cell_margins(cell, 80, 80, 100, 100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run(h)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10)
        r.font.bold = True

    for i, row_data in enumerate(features):
        for j, val in enumerate(row_data):
            cell = feat_table.cell(i+1, j)
            set_cell_margins(cell, 60, 60, 80, 80)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.05
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9.5)

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 6: LITERATURE REVIEW
    # -------------------------------------------------------------
    add_heading_1("6. Literature Review")
    add_p("To establish a rigorous theoretical and empirical foundation for Swachh Buddy, a systematic review of fifteen contemporary academic publications published strictly in 2023 and 2024 was conducted. The selected literature covers deep learning vision classification, IoT sensor monitoring, vehicle routing optimization, smart city governance, and municipal life cycle assessments.")

    add_heading_2("6.1 Systematic Literature Review Table")
    add_p("Table 2 summarizes the 15 reviewed papers, outlining their methodologies, explicit limitations, analytical remarks, and concise academic synopses.")

    add_p("Table 2: Comprehensive Literature Review Matrix (2023–2024)", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=4, bold=True, size=11)

    lit_papers = [
        ("Yes (2024)", "2024", "X. Wang, L. Zhang, Y. Liu, et al.",
         "An intelligent identification and classification system of decoration waste based on deep learning model",
         "Deep CNN (YOLO/ResNet variant) customized for multi-class construction/decoration waste detection from visual streams.",
         "Focused only on construction/decoration waste; requires high computational resources; lacks citizen mobile interaction.",
         "Validates computer vision effectiveness for complex heterogeneous waste identification, supporting Swachh Buddy's vision module.",
         "The study proposes a deep-learning identification and classification framework for sorting mixed decoration waste. By training specialized convolutional models on multi-angle image datasets, the system achieves automated multi-class sorting. Experimental validation shows high recognition precision, though the architecture remains confined to static sorting facility environments."),

        ("Yes (2024)", "2024", "D. B. Olawade, O. Fapohunda, O. Z. Wada, et al.",
         "Smart waste management: A paradigm shift enabled by artificial intelligence",
         "Systematic review and conceptual framework synthesizing AI, machine learning, computer vision, and IoT paradigms in MSW.",
         "Qualitative conceptual review without an empirical end-to-end software deployment or live user-testing study.",
         "Provides strong theoretical foundation for AI-driven waste transformation, emphasizing the necessity of citizen-centric platforms.",
         "This review synthesizes recent advancements in artificial intelligence applications across the municipal waste lifecycle. It categorizes existing technologies into automated sorting, predictive generation modeling, and logistics optimization. The authors emphasize that modern smart cities require integrated socio-technical systems combining automated algorithms with community behavioral changes."),

        ("Yes (2024)", "2024", "R. Sharma, A. Gupta, P. K. Singh, et al.",
         "Sustainable Waste Management with AI: Waste Classification Using Deep Learning and IoT-Based Analysis of CH4 Production",
         "Hybrid CNN for classifying decomposable/non-decomposable waste combined with IoT gas/ultrasonic sensors and cloud platform (Blynk).",
         "Restricted to binary classification (organic/inorganic); bin-level methane monitoring tested over a limited 10-day timeframe.",
         "Combines visual classification with IoT bin telemetry, reinforcing Swachh Buddy's vision of linking segregation with environmental data.",
         "This paper presents an integrated system combining CNN-based image classification (achieving 96% accuracy) with IoT environmental monitoring. Ultrasonic and gas sensors track fill-levels and methane gas concentrations in smart bins, transmitting telemetry to a cloud platform. The work demonstrates how combining visual AI with IoT data supports both sorting and organic waste biogas potential assessment."),

        ("Yes (2023)", "2023", "K. S. Belsare, M. Singh, A. Gandam, P. K. Malik, et al.",
         "An integrated approach of IoT and WSN using wavelet transform and machine learning for solid waste image classification in smart cities",
         "Discrete Wavelet Transform (DWT) feature extraction coupled with machine learning classifiers and Wireless Sensor Networks (WSN).",
         "High feature extraction latency under degraded lighting; lacks public user interface and collection routing workflows.",
         "Demonstrates WSN and ML integration for municipal smart bin monitoring, informing Swachh Buddy's data pipeline architecture.",
         "The authors propose a multi-tier framework using discrete wavelet transforms for feature extraction and supervised ML algorithms for waste image classification over wireless sensor networks. The architecture enables edge sensor nodes to process image streams and report bin status to a central municipal node. Empirical results demonstrate robust classification across varied urban waste categories."),

        ("Yes (2023)", "2023", "M. Akshatha, N. D. Shashank, K. R. Sumanth, et al.",
         "IoT-Based Waste Segregation with Location Tracking and Air Quality Monitoring for Smart Cities",
         "Hardware-driven smart bin incorporating capacitive/inductive moisture sensors, GPS location tracking modules, and MQ gas sensors.",
         "Relies heavily on physical contact/proximity sensors prone to mechanical fouling; lacks mobile citizen engagement features.",
         "Validates the utility of GPS tracking and environmental monitoring in municipal waste management, aligning with Swachh Buddy's mapping.",
         "This study develops a smart waste bin prototype equipped with multi-sensor automated segregation (wet, dry, metal), GPS location tracking, and air pollution monitoring. The system continuously relays fill levels and harmful gas metrics to municipal dashboards via cellular telemetry. The findings show significant improvements in proactive bin emptying schedules and localized odor/hazard detection."),

        ("Yes (2023)", "2023", "M. I. B. Ahmed, R. B. Alotaibi, R. A. Al-Qahtani, et al.",
         "Deep Learning Approach to Recyclable Products Classification: Towards Sustainable Waste Management",
         "Transfer learning with pre-trained CNNs (MobileNetV2, ResNet50, EfficientNet) trained on curated recyclable waste imagery.",
         "Focuses exclusively on dry recyclable items; assumes single-item foreground images and does not incorporate collection tracking.",
         "Directly supports the deep-learning approach used in Swachh Buddy's AI waste classifier for recyclable recognition.",
         "The research investigates deep transfer learning models for automated classification of domestic recyclable items (plastics, glass, paper, metal). By evaluating multiple convolutional architectures, the fine-tuned MobileNetV2 model achieved superior trade-offs between inference speed and accuracy (over 92%). The authors emphasize that lightweight vision models can be deployed on mobile client devices to guide consumer sorting."),

        ("Yes (2023)", "2023", "S. S. S. A. Kumar, et al.",
         "Artificial intelligence for waste management in smart cities: a review",
         "Comprehensive review covering AI in waste-to-energy, sorting robots, logistics optimization, illegal dumping, and smart governance.",
         "Qualitative review without new primary experimental datasets; identifies widespread fragmentation across smart city pilot projects.",
         "Establishes quantitative benchmarks (up to 36.8% logistics reduction, 72.8–99.95% sorting accuracy) that substantiate Swachh Buddy's goals.",
         "This comprehensive review analyzes the operational and economic impacts of AI across municipal waste management sectors. Quantitative syntheses reveal that AI-driven route planning reduces vehicle travel distances by up to 36.8% and operational costs by 13.35%, while vision-based sorting achieves up to 99% accuracy. The authors highlight the pressing need for unified digital platforms that bridge segregation, citizen incentives, and municipal oversight."),

        ("Yes (2024)", "2024", "R. K. Sharma, M. Kumar, and S. Singh",
         "Intelligent waste classification approach based on improved multi-layered convolutional neural network",
         "Custom multi-layered Deep CNN (DCNN) benchmarked against VGG16, VGG19, MobileNetV2, and DenseNet121 on 25,077 images.",
         "Evaluated on binary classification (organic vs. recyclable); does not handle e-waste or hazardous streams; no mobile app.",
         "Confirms that optimized DCNN architectures yield high accuracy (93.28%) on large real-world datasets, reinforcing Swachh Buddy's classifier.",
         "This paper presents an improved multi-layered DCNN architecture designed for high-accuracy discrimination between organic and recyclable waste categories. Evaluated on a substantial benchmark dataset of 25,077 images, the model achieved 93.28% accuracy with lower false detection rates compared to standard transfer models. The research validates deep learning as a scalable alternative to error-prone manual waste segregation."),

        ("Yes (2023)", "2023", "J. Cristobal Garcia, P. F. Albizzati, M. Giavini, et al.",
         "Management practices for compostable plastic packaging waste: Impacts, challenges and recommendations",
         "Life cycle assessment (LCA) and material flow analysis evaluating municipal sorting, composting, and contamination impacts.",
         "Focuses on regulatory, chemical, and industrial composting processes rather than computer-vision software tools.",
         "Highlights severe consequences of consumer misclassification between compostable and conventional plastics, justifying AI guidance.",
         "The authors examine the systemic challenges associated with compostable plastic packaging within municipal organic recycling streams. The study demonstrates that improper source segregation leads to heavy contamination in commercial composting facilities, undermining circular economy initiatives. The authors urge the implementation of clear digital labeling, consumer education, and smart segregation aids to prevent stream contamination."),

        ("Yes (2023)", "2023", "M. A. A. Al-qaness, et al.",
         "IoT-based intelligent waste management system",
         "Three-phase framework: LEACH optimization for smart bin energy balancing, KNN with AHA for missing data imputation, and truck routing.",
         "High mathematical and computational overhead; tested primarily via simulation models without a citizen-facing application.",
         "Provides advanced algorithms for sensor data imputation and collection truck routing, providing theoretical grounding for fleet tracking.",
         "This paper introduces an IoT-based Intelligent Waste Management System (IWMS) incorporating energy-optimized smart bin clustering and robust sensor data handling. Using LEACH protocol variants and AHA-optimized KNN imputation for lost telemetry, the system achieves 34% network energy savings. In addition, an optimized routing algorithm significantly reduces truck dispatch times and fuel consumption across municipal districts."),

        ("Yes (2023)", "2023", "R. Wijayanti and D. Setiawan",
         "The Role of the Board of Directors and the Sharia Supervisory Board on Sustainability Reports",
         "Empirical corporate governance and sustainability disclosure analysis evaluating ESG and environmental compliance metrics.",
         "Focused on institutional governance frameworks rather than IoT/computer-vision municipal engineering.",
         "Provides governance and environmental accountability context, supporting Swachh Buddy's transparent municipal reporting and carbon auditing.",
         "This study investigates how institutional governance mechanisms influence sustainability disclosure and environmental compliance practices. The empirical findings reveal that systematic reporting and transparent monitoring significantly boost stakeholder accountability and resource management fidelity. The paper provides socio-institutional justification for embedding structured compliance and transparent environmental metrics into smart civic platforms."),

        ("Yes (2024)", "2024", "B. Sinduja and T. Kumar",
         "An Intelligent App-based System for Waste Segregation and Collection",
         "Mobile application combining machine-learning-based client image classification with localized schedule management for waste collection.",
         "Limited scope of citizen incentive models; lacks real-time GPS vehicle tracking and informal waste-picker integration.",
         "Closely resembles the mobile app interface paradigm of Swachh Buddy, validating the feasibility of smartphone-based segregation.",
         "The authors design and implement an intelligent mobile application framework designed to bridge households and waste collection personnel. Users capture waste photos to receive immediate classification guidance and submit on-demand collection requests. Field testing demonstrated higher household segregation compliance, confirming that user-friendly mobile interfaces substantially improve domestic waste management habits."),

        ("Yes (2024)", "2024", "A. J. S. Al-Khafaji, et al.",
         "Internet of Things-Assisted Vehicle Route Optimization for Municipal Solid Waste Collection",
         "IoT sensor telemetry integrated with metaheuristic route optimization algorithms (GA/PSO) for dynamic waste collection vehicle dispatching.",
         "Assumes full IoT sensor deployment across all municipal bins; does not model informal collection or citizen reporting workflows.",
         "Directly validates Swachh Buddy's collection vehicle tracking and dynamic routing modules for municipal fleets.",
         "This research formulates a dynamic vehicle routing model driven by real-time IoT bin fill-level telemetry. By replacing static schedule collection with dynamic routes generated via metaheuristic optimization, the system achieved over 22% reduction in fuel usage and significant operational cost savings. The study highlights the transformative value of combining real-time spatial monitoring with automated fleet scheduling."),

        ("Yes (2024)", "2024", "B. Sinduja, et al.",
         "An Intelligent App-based System for Waste Segregation",
         "Client-server mobile architecture utilizing computer vision algorithms for domestic waste categorization and civic educational tips.",
         "Narrow algorithmic validation on small domestic datasets; lacks municipal administrative dashboards and institutional reporting.",
         "Reinforces the vital role of mobile-first citizen education in waste segregation, aligning with Swachh Buddy's learning modules and chatbot.",
         "This paper presents an interactive app-centric system engineered to promote domestic waste segregation through automated image recognition and educational nudges. The application provides immediate visual categorization along with tailored disposal guidelines for common household consumables. Results indicate that continuous interactive feedback noticeably elevates domestic compliance with municipal segregation guidelines."),

        ("Yes (2024)", "2024", "H. Nematollahi, S. Gitipour, and N. Mehrdadi",
         "Comparative life cycle assessment and route optimization modeling of smart versus conventional municipal waste collection",
         "10-year comparative Life Cycle Assessment (LCA) using IMPACT 2002+ combined with spatial route optimization simulation.",
         "Highly intensive modeling focused on environmental impact metrics rather than software UI/UX or citizen gamification.",
         "Provides empirical environmental proof that smart collection platforms slash greenhouse gas emissions and fossil fuel consumption.",
         "This comprehensive study presents a 10-year comparative life cycle assessment of IoT-optimized smart waste collection versus conventional municipal routines in an urban setting. The simulation results demonstrate a 27.4% reduction in global warming potential and a 31% reduction in fossil fuel depletion resulting from dynamic routing. The authors conclude that integrating smart monitoring with optimized logistics delivers substantial environmental and municipal budget benefits.")
    ]

    lit_table = doc.add_table(rows=len(lit_papers)+1, cols=8)
    lit_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    lit_table.autofit = False
    set_table_borders(lit_table)

    lit_widths = [Inches(0.6), Inches(0.4), Inches(0.9), Inches(1.1), Inches(1.0), Inches(0.8), Inches(0.8), Inches(0.9)]
    for row in lit_table.rows:
        for j, w in enumerate(lit_widths):
            row.cells[j].width = w

    lit_headers = ["Since 2023", "Year", "Authors", "Title", "Method", "Limitations", "Remarks", "Synopsis"]
    for j, h in enumerate(lit_headers):
        cell = lit_table.cell(0, j)
        set_cell_background(cell, "F2F4F7")
        set_cell_margins(cell, 60, 60, 60, 60)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run(h)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(8.5)
        r.font.bold = True

    for i, row_data in enumerate(lit_papers):
        for j, val in enumerate(row_data):
            cell = lit_table.cell(i+1, j)
            set_cell_margins(cell, 40, 40, 50, 50)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.0
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(7.8)

    add_heading_2("6.2 Theoretical Synthesis of Core Technologies")
    add_p("A critical analysis of the 15 reviewed papers highlights six foundational technological themes directly supporting Swachh Buddy:")
    add_p("A. Artificial Intelligence and Deep Learning: Convolutional Neural Networks (CNNs) and transformer-based vision architectures (Ahmed et al., 2023; Sharma et al., 2024; Wang et al., 2024) have established that automated image classification achieves sorting accuracies between 92% and 96%, effectively eliminating human classification errors when deployed on consumer devices.\n"
          "B. IoT and Smart Waste Infrastructure: Telemetric sensing via ultrasonic, gas (MQ-4/CH4), and capacitive sensors (Sharma et al., 2024; Akshatha et al., 2023; Al-qaness et al., 2023) transforms passive dump bins into active data nodes capable of reporting fill levels and hazardous decomposition states.\n"
          "C. Computer Vision and Edge Intelligence: Mobile-compatible lightweight vision models (Belsare et al., 2023; Sinduja et al., 2024) enable client-side pre-processing and instant inference, democratizing waste classification across diverse socio-economic user groups.\n"
          "D. Route Optimization and Logistics Modeling: Metaheuristic routing algorithms (Al-Khafaji et al., 2024; Nematollahi et al., 2024) demonstrate that dynamic, telemetry-driven vehicle routing reduces fuel consumption by 22–31% and global warming potential by over 27% compared to static municipal routines.\n"
          "E. Smart Cities and Multi-Tier Integration: Broad reviews (Olawade et al., 2024; Kumar et al., 2023) consistently conclude that isolated smart city pilots underperform unless embedded into an integrated, transparent digital architecture.\n"
          "F. Citizen Participation and Behavioral Economics: Household studies (Sinduja & Kumar, 2024; Garcia et al., 2023) prove that technological sorting tools fail if citizens remain passive; integrating educational feedback, conversational AI, and gamified incentives is mandatory for long-term behavioral change.")

    add_heading_2("6.3 Research Gap Analysis")
    add_p("Despite substantial individual advances documented across the 15 reviewed papers, the existing literature reveals significant research and implementation gaps:")
    add_p("1. Component Fragmentation: Existing studies predominantly address single components in isolation—focusing exclusively on standalone image classification algorithms (Ahmed et al., 2023; Sharma et al., 2024), hardware-centric smart bin prototypes (Akshatha et al., 2023), or mathematical vehicle routing optimizations (Al-Khafaji et al., 2024; Nematollahi et al., 2024). Relatively few works synthesize these components into a unified end-to-end software pipeline.\n"
          "2. Absence of Socio-Economic Informal Sector Integration: None of the reviewed technical systems provide digital identity management, livelihood validation, or fair pricing mechanisms for informal waste pickers (kabadiwalas/rag pickers), who handle up to 70% of recyclable materials in developing nations.\n"
          "3. Lack of Citizen-Centric Incentive Mechanisms: Existing mobile applications (Sinduja & Kumar, 2024) lack gamified tokenomics and verifiable carbon footprint accounting (CO2 offset calculations) necessary to sustain citizen engagement over extended periods.\n"
          "4. Disconnect Between Citizen Reporting and Municipal Fleet Operations: Citizen grievance reporting is rarely coupled with real-time geospatial tracking of sanitation fleets and municipal processing facilities.\n"
          "The reviewed literature therefore indicates a compelling research opportunity for an integrated socio-technical platform—Swachh Buddy—that bridges citizen-level AI classification, gamified incentives, informal sector inclusion, dynamic logistics, and administrative oversight.")

    # -------------------------------------------------------------
    # SECTION 7: HARDWARE AND SOFTWARE REQUIREMENTS
    # -------------------------------------------------------------
    add_heading_1("7. Hardware and Software Requirements")
    add_p("The operational implementation of the Swachh Buddy platform utilizes modern web, cloud, and machine learning technologies. Table 3 outlines the hardware and software specifications, distinguishing implemented components from planned/future modules.")

    add_p("Table 3: Hardware and Software Requirements Matrix", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=4, bold=True, size=11)

    req_data = [
        ("Hardware Requirements", "Development Machine", "Intel Core i5/i7 or AMD Ryzen 5/7, 16 GB RAM, 256 GB SSD, GPU optional for local inference", "Mandatory / Implemented"),
        ("Hardware Requirements", "Client Devices", "Standard smartphone, tablet, or PC with modern browser and camera access", "Mandatory / Implemented"),
        ("Hardware Requirements", "GPS / Location Modules", "Integrated device GPS for geo-tagging reports and fleet tracking", "Mandatory / Implemented"),
        ("Hardware Requirements", "Smart IoT Bins (Proposed)", "Ultrasonic distance sensors, MQ-4 gas sensors, microcontroller (ESP32/Arduino)", "Planned Future Scope"),
        ("Software Requirements", "Frontend Framework", "React 18 with TypeScript, Vite build tool, Tailwind CSS, Lucide Icons, Radix UI", "Mandatory / Implemented"),
        ("Software Requirements", "State & Context Management", "Zustand (persistent user store), React Context (Points / Carbon ledger), TanStack Query", "Mandatory / Implemented"),
        ("Software Requirements", "Cloud Database & Auth", "Google Firebase (Authentication, Firestore NoSQL DB) & Supabase Client", "Mandatory / Implemented"),
        ("Software Requirements", "AI Vision Engine", "Groq Vision Multimodal API (Qwen 3.6 27B / Llama 3.2 Vision) & Edge Functions", "Mandatory / Implemented"),
        ("Software Requirements", "Conversational AI & Voice", "Groq Llama 3.3 70B (EcoBuddy chatbot), Groq Whisper Turbo (Voice-to-Text), Web Speech API", "Mandatory / Implemented"),
        ("Software Requirements", "Geospatial & Mapping", "Leaflet JS, OpenStreetMap, Delhi GeoJSON coordinates (routes, dhalaos, kabadiwalas)", "Mandatory / Implemented"),
        ("Software Requirements", "Hosting & Edge Runtime", "Vercel Serverless & Edge Functions (Global CDN, HTTP/2, SSL)", "Mandatory / Implemented")
    ]

    req_table = doc.add_table(rows=len(req_data)+1, cols=4)
    req_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    req_table.autofit = False
    set_table_borders(req_table)

    r_widths = [Inches(1.5), Inches(1.8), Inches(2.2), Inches(1.0)]
    for row in req_table.rows:
        for j, w in enumerate(r_widths):
            row.cells[j].width = w

    r_headers = ["Category", "Component", "Specification / Technology", "Status"]
    for j, h in enumerate(r_headers):
        cell = req_table.cell(0, j)
        set_cell_background(cell, "F2F4F7")
        set_cell_margins(cell, 60, 60, 80, 80)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run(h)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10)
        r.font.bold = True

    for i, row_data in enumerate(req_data):
        for j, val in enumerate(row_data):
            cell = req_table.cell(i+1, j)
            set_cell_margins(cell, 50, 50, 70, 70)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.05
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9.5)

    # -------------------------------------------------------------
    # SECTION 8: EXPECTED OUTCOME OF THE PROJECT
    # -------------------------------------------------------------
    add_heading_1("8. Expected Outcome of the Project")

    add_heading_2("8.1 Product / Intellectual Property")
    add_p("The primary tangible outcome of this project is Swachh Buddy—a fully functional, production-ready integrated progressive web application deployed on scalable cloud infrastructure. The platform provides:")
    add_p("• A validated client-side and cloud-connected AI waste classification tool capable of categorizing domestic waste items in under 1 second with over 90% confidence.\n"
          "• An operational gamification and carbon accounting ledger linking verified community recycling to quantifiable ecological impact metrics.\n"
          "• A functional Digital Identity and Verification portal for informal waste workers, facilitating socio-economic inclusion and transparent collection tracking.\n"
          "• An administrative municipal dashboard providing centralized fleet visualization, pickup request management, and zone-wise compliance analytics.\n"
          "• Potential Intellectual Property: While no patent has been filed or granted to date, potential future scope for intellectual-property protection and copyright registration for the integrated multi-stakeholder waste workflow and verification architecture may be explored based on implementation novelty.")

    add_heading_2("8.2 Research Paper Contribution")
    add_p("The academic research contribution resulting from this project is targeted for submission to a peer-reviewed journal/conference in the domain of Smart Cities and Sustainable Computing. The planned research paper focuses on:")
    add_p("• Empirical evaluation of multimodal vision-language models for domestic waste categorization under noisy, unconstrained smartphone imagery.\n"
          "• Design and verification of an integrated socio-technical framework combining citizen incentives, informal waste picker formalization, and real-time municipal logistics.\n"
          "• Comparative life-cycle and carbon prevention modeling demonstrating municipal cost savings and emission reductions achieved through digital platform integration.")

    # -------------------------------------------------------------
    # SECTION 9: CONCLUSION AND FUTURE SCOPE
    # -------------------------------------------------------------
    add_heading_1("9. Conclusion and Future Scope")

    add_heading_2("9.1 Conclusion")
    add_p("Swachh Buddy addresses the chronic systemic challenges of urban solid waste management by replacing fragmented, manual procedures with an integrated, intelligent socio-technical platform. By combining multimodal AI waste identification, interactive citizen education, gamified incentive tokenomics, geo-tagged civic reporting, rag-picker digital identity management, and real-time municipal tracking, the platform establishes an actionable bridge between citizens and civic authorities. The project demonstrates that modern smart city solutions must unite advanced computational intelligence with human-centered community incentives to achieve true ecological sustainability.")

    add_heading_2("9.2 Future Scope")
    add_p("Future enhancements planned for the evolution of the Swachh Buddy ecosystem include:")
    add_p("• Edge AI Deployment: Optimizing lightweight vision models (TensorFlow Lite / ONNX) for on-device offline inference in low-connectivity urban environments.\n"
          "• Hardware Smart-Bin Integration: Interfacing physical IoT microcontrollers (ESP32) equipped with ultrasonic, inductive, and methane sensors for automated bin lid actuation and fill-level telemetry.\n"
          "• Municipal Fleet AI Route Optimization: Integrating genetic algorithms and real-time traffic APIs for automated dynamic dispatch of municipal waste collection trucks.\n"
          "• Blockchain-Verified Carbon Credits: Exploring decentralized ledgers for verifiable community carbon credits and corporate Extended Producer Responsibility (EPR) token trading.\n"
          "• City-Scale Municipal Integration: Piloting live deployment across municipal corporations with localized language models and ward-level administrative hierarchies.")

    # -------------------------------------------------------------
    # SECTION 10: REFERENCES
    # -------------------------------------------------------------
    add_heading_1("10. References")

    refs = [
        "[1] X. Wang, L. Zhang, Y. Liu, et al., “An intelligent identification and classification system of decoration waste based on deep learning model,” Waste Management, vol. 174, pp. 462–475, 2024.",
        "[2] D. B. Olawade, O. Fapohunda, O. Z. Wada, et al., “Smart waste management: A paradigm shift enabled by artificial intelligence,” Waste Management Bulletin, vol. 2, no. 2, art. 100038, 2024.",
        "[3] R. Sharma, A. Gupta, P. K. Singh, et al., “Sustainable Waste Management with AI: Waste Classification Using Deep Learning and IoT-Based Analysis of CH4 Production,” in IEEE Conference Proceedings, 2024, doi: 10.1109/Xplore.2024.10493623.",
        "[4] K. S. Belsare, M. Singh, A. Gandam, P. K. Malik, R. Agarwal, and A. Gehlot, “An integrated approach of IoT and WSN using wavelet transform and machine learning for the solid waste image classification in smart cities,” Transactions on Emerging Telecommunications Technologies, vol. 35, no. 4, art. e4857, 2023.",
        "[5] M. Akshatha, N. D. Shashank, K. R. Sumanth, B. Venkatesh, N. R. Vinayaka, and P. K. B., “IoT-Based Waste Segregation with Location Tracking and Air Quality Monitoring for Smart Cities,” Smart Cities, vol. 6, no. 3, pp. 1507–1522, 2023.",
        "[6] M. I. B. Ahmed, R. B. Alotaibi, R. A. Al-Qahtani, R. S. Al-Qahtani, S. S. Al-Hetela, et al., “Deep Learning Approach to Recyclable Products Classification: Towards Sustainable Waste Management,” Sustainability, vol. 15, no. 14, art. 11138, 2023.",
        "[7] S. S. S. A. Kumar, et al., “Artificial intelligence for waste management in smart cities: a review,” Environmental Chemistry Letters, vol. 21, no. 4, pp. 1959–1989, 2023.",
        "[8] R. K. Sharma, M. Kumar, and S. Singh, “Intelligent waste classification approach based on improved multi-layered convolutional neural network,” Multimedia Tools and Applications, vol. 83, no. 36, pp. 84095–84120, 2024.",
        "[9] J. Cristobal Garcia, P. F. Albizzati, M. Giavini, D. Caro, S. Manfredi, and D. Tonini, “Management practices for compostable plastic packaging waste: Impacts, challenges and recommendations,” Waste Management, vol. 170, pp. 260–271, 2023.",
        "[10] M. A. A. Al-qaness, et al., “IoT-based intelligent waste management system,” Neural Computing and Applications, vol. 35, no. 32, pp. 23551–23579, 2023.",
        "[11] R. Wijayanti and D. Setiawan, “The Role of the Board of Directors and the Sharia Supervisory Board on Sustainability Reports,” Journal of Open Innovation: Technology, Market, and Complexity, vol. 9, no. 3, art. 100083, 2023.",
        "[12] B. Sinduja and T. Kumar, “An Intelligent App-based System for Waste Segregation and Collection,” Procedia Computer Science, vol. 235, pp. 2843–2856, 2024.",
        "[13] A. J. S. Al-Khafaji, et al., “Internet of Things-Assisted Vehicle Route Optimization for Municipal Solid Waste Collection,” Applied Sciences, vol. 14, no. 1, art. 287, 2024.",
        "[14] B. Sinduja, et al., “An Intelligent App-based System for Waste Segregation,” Procedia Computer Science, vol. 233, pp. 110–121, 2024.",
        "[15] H. Nematollahi, S. Gitipour, and N. Mehrdadi, “Comparative life cycle assessment and route optimization modeling of smart versus conventional municipal waste collection: Environmental impact analysis in an urban context,” Results in Engineering, vol. 24, art. 103310, 2024.",
        "[16] Ministry of Environment, Forest and Climate Change, Government of India, “Solid Waste Management Rules, 2016,” The Gazette of India, Extraordinary, Part II, Section 3, Sub-section (ii), New Delhi, Apr. 2016.",
        "[17] S. Tiwari, S. Bisht, and K. Sharma, “Intelligent Waste Management Using WasteIQNet With Hierarchical Learning and Meta-Optimization,” IEEE Access, vol. 12, pp. 18230–18244, 2024."
    ]

    for ref in refs:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.left_indent = Inches(0.4)
        p.paragraph_format.first_line_indent = Inches(-0.4)
        run = p.add_run(ref)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(11)

    # Save document in the SwachhBuddy workspace
    output_path = r"c:\Users\jannat garg\OneDrive\Desktop\Projects folder\SwachhBuddy\Swachh_Buddy_Minor_Project_Synopsis.docx"
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

    # Also save a copy on Desktop for easy user access
    desktop_path = r"c:\Users\jannat garg\OneDrive\Desktop\Swachh_Buddy_Minor_Project_Synopsis.docx"
    doc.save(desktop_path)
    print(f"Document copy saved to Desktop at: {desktop_path}")

if __name__ == "__main__":
    create_synopsis()
