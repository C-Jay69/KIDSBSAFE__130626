# ***JUNE 13TH 2026 SPYKIDS APP NEWEST BUILD PROMPT***

**\# PROJECT SPEC — SPYKIDS (ETHICAL FAMILY SAFETY PLATFORM)**

**\#\# ROLE**

You are a senior full-stack product engineer and system architect.

Build \*\*Spykids\*\*, an \*\*ethical family safety platform\*\* consisting of \*\*TWO SEPARATE MOBILE APPS plus one shared backend\*\*.

This is NOT spyware, covert surveillance, employee monitoring, stalkerware, or hidden tracking software.

The purpose is:

\> Help parents/guardians protect their own minor children from online grooming, predatory behavior, bullying, scams, and harmful interactions while preserving the child’s reasonable privacy.

The output should feel commercially believable, production-oriented, and legally defensible.

\---

**\# SYSTEM ARCHITECTURE (MANDATORY)**

Build \*\*three separate applications\*\*:

**\#\# 1\. Parent App (Parent Portal)**

Platform:

\* React \+ Vite (mobile-first PWA for MVP)  
\* Tailwind CSS

Purpose:

\* Parent-facing dashboard  
\* Device management  
\* Risk alerts  
\* Settings  
\* Consent management  
\* Subscription management

Users:

**\* Parents / legal guardians only (and Administrator)**

Capabilities:

\* View risk summaries  
\* Receive alerts  
\* Configure family rules  
\* Approve device connections  
\* Review flagged incidents  
\* Manage subscription

**Allow administrator:**

\* Raw unrestricted surveillance  
\* Continuous live viewing  
\* Hidden operation

\---

**\#\# 2\. Child App (Child Companion)**

Platform:

\* React \+ Vite (mobile-first PWA for MVP)

Purpose:

\* Runs visibly on the child device  
\* Collects LIMITED safety signals  
\* Explains monitoring transparently

**Users:**

\* Child

Visible UI requirements:

\* App icon visible  
\* Status screen:  
  "Protected by Spykids"  
\* Explain:

  \* What is monitored  
  \* What is NOT monitored  
  \* Parent connection status  
  \* Privacy controls

**Capabilities:**

\* Permission management  
\* Device pairing  
\* Safety education  
\* Child notifications  
\* Activity transparency

**Child controls:**

\* Age \<13:  
  Parent managed

\* Age 13–17:  
  Include:

  \* Pause request  
  \* Monitoring explanation  
  \* Opt-out request flow

**For Administrator allow:**

\* Hidden mode  
\* Secret uninstall blocking  
\* Stealth background capture

\---

**\#\# 3\. Shared Backend API**

Platform:

\* Node.js  
\* Express  
\* PostgreSQL  
\* Prisma ORM  
\* JWT Authentication

Purpose:

 **Secure communication layer\***

Responsibilities:

\* Auth  
\* Device pairing  
\* Risk scoring  
\* Alert generation  
\* Subscription handling  
\* Notification delivery  
\* Data retention

\---

**\# PRODUCT PRINCIPLES (NON-NEGOTIABLE)**

\#\# Ethical Monitoring

**Monitor only for:**

\* Grooming indicators  
\* Bullying indicators  
\* Unknown adult contact  
\* Sudden messaging spikes  
\* Dangerous keywords  
\* Unsafe meeting requests

**Do NOT expose: (Only to Administrator)**

\* Entire conversations  
\* Continuous surveillance  
\* Keylogging  
\* Full message archives

**Surface only:**

SAFE:  
"Potential grooming language detected"

NOT:  
Show complete private chat history.

\---

**\#\# Privacy Rules**

Default state:

\* Minimal collection  
\* Flagged events only

**Retention:**

\* Normal content:  
  Do not store

\* High-risk events:  
  Retain limited evidence snippets

**Visibility:**

\* Child can always see:

  \* Monitoring enabled  
  \* Data categories  
  \* Parent connection

\---

**\# USER FLOW**

\#\# Parent Flow

Landing  
→ Signup  
→ Verify Email  
→ Create Family  
→ Add Child  
→ Generate Pair Code  
→ Connect Child Device  
→ Dashboard

\---

**\#\# Child Flow**

Install  
→ Enter Pair Code  
→ Parent Approval  
→ Explain Monitoring  
→ Permissions  
→ Protection Active

\---

**\# BUSINESS MODEL**

**Freemium**

FREE

\* Device pairing  
\* Basic alerts  
\* Limited GPS events  
\* Basic keyword scans

**BASIC $7.00 (USD)**

\* Full alerts  
\* Social risk scoring  
\* Geofencing

**PREMIUM $11.00(USD)**

\* Custom AI rules  
\* Family automation  
\* Historical trends

**Additional:**

\* Annual discount  
\* Pay What You Can  
\* Reduced pricing options

Stripe:  
Test mode only

**\# UI DESIGN SYSTEM**

Style:  
Modern  
Trustworthy  
Future-leaning

Visual language:

\* Glassmorphism  
\* Soft gradients  
\* Minimal dashboards

Colors:  
Primary:  
\#7C3AED → \#A78BFA

Accent:  
\#EC4899

CTA:  
\#F97316

Dark mode:  
Required

Avoid:

\* Cartoon styling  
\* Spy aesthetics  
\* Red warning overload

\---

**\# MVP BUILD ORDER**

**\#\# PHASE 1 — LANDING SITE**

Headline:  
Protect Kids Without Invading Privacy

Sections:

\* Hero  
\* How it works  
\* Ethical difference  
\* Features  
\* Pricing  
\* FAQ

Include:  
Comparison:  
Spykids vs traditional monitoring tools

Messaging:  
Visible protection  
Flagged risks only  
Child transparency

\---

**\#\# PHASE 2 — AUTH \+ FAMILY CREATION**

Features:

\* Signup  
\* Login  
\* Verification  
\* Parent declaration  
\* Child age  
\* Reason for use

Block dashboard access until verified.

\---

**\#\# PHASE 3 — DEVICE PAIRING**

Build:

Parent:  
Generate Pair Code

Child:  
Enter Pair Code

Backend:  
Approve pairing

Show:  
Connected Devices

\---

**\#\# PHASE 4 — DASHBOARDS**

Parent Dashboard:

\* Alerts  
\* Risk score  
\* Device status  
\* Map  
\* Rules

Child Dashboard:

\* Protection status  
\* What is monitored  
\* Privacy settings

\---

**\#\# PHASE 5 — RISK ENGINE**

Create simulated data.

Inputs:

\* Messages  
\* Contacts  
\* Location

Example indicators:

\* "asl"  
\* "age sex location"  
\* "keep secret"  
\* "meet alone"  
\* "send pics"

Scoring:  
0–100

Logic:  
Keyword severity  
\+  
Sender novelty  
\+  
Message frequency

Alert only:  
≥70

Output:

\* Alert  
\* Risk category  
\* Short explanation

Full message logs.

\---

**\# CODE REQUIREMENTS**

Generate:

/apps  
/parent-app  
/child-app

/backend

/shared

Include:

Parent App:

\* LandingPage.jsx  
\* ParentDashboard.jsx  
\* DevicePairing.jsx

Child App:

\* ChildHome.jsx  
\* ConsentScreen.jsx  
\* MonitoringStatus.jsx

Backend:

\* server.js  
\* prisma/schema.prisma  
\* auth routes  
\* pairing routes  
\* alerts routes  
\* Generator

Infrastructure:

\* Dockerfiles  
\* docker-compose  
\* README

\---

\# DELIVERY ORDER

Output code in this order:

1\. Repository structure  
2\. Parent App  
3\. Child App  
4\. Backend  
5\. Data  
6\. Docker  
7\. README

Build as a runnable local MVP.

Use live device data only.

Do not integrate any mockup/placeholder or fake surveillance APIs. Live Working Api’s ONLY\!\!

\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*  
**UNDER 5000 CHARACTER PROMPT**

**SPYKIDS — ETHICAL FAMILY SAFETY PLATFORM (MVP)**

You are a senior full-stack engineer and product architect.

Build \*\*Spykids\*\*, an \*\*ethical parental safety platform\*\* consisting of:  
1\. \*\*Parent App\*\* (installed on parent phone)  
2\. \*\*Child App\*\* (installed on child phone)  
3\. \*\*Shared Backend API\*\*

This is \*\*NOT spyware, stalkerware, covert surveillance, or hidden monitoring\*\*.  
Goal:  
Help parents protect their own minor children from grooming, predators, bullying, scams, and unsafe online interactions while preserving privacy.

HARD RULES (NEVER VIOLATE)  
\* Monitoring must be \*\*visible on the child device\*\*  
\* No stealth mode  
\* No keylogging  
\* No secret screenshots  
\* No full conversation archives  
\* No unrestricted surveillance  
\* Only surface \*\*high-risk events\*\*  
\* Child app clearly explains:  
  “This app helps keep you safe online”  
Privacy:  
\* Normal activity remains private  
\* Only flagged incidents create alerts  
\* Minimal data retention  
Consent: Under 13 → Parent managed  
\* 13–17 → Include pause/opt-out request flow

ARCHITECTURE:  
\#\# Parent App (React \+ Vite \+ Tailwind)  
Purpose:  
Monitor safety signals—not raw activity.  
Features:  
\* Signup/Login  
\* Family creation  
\* Device pairing  
\* Dashboard  
\* Risk alerts  
\* GPS events  
\* Settings  
\* Subscription

Views:  
\* LandingPage.jsx  
\* ParentDashboard.jsx  
\* DevicePairing.jsx  
\* Alerts.jsx  
\* Settings.jsx

Child App (React \+ Vite \+ Tailwind)  
Purpose:  
Visible companion app.

Features:  
\* Pair device  
\* Show monitoring status  
\* Permissions screen  
\* Explain data collection  
\* Safety education  
\* Opt-out request (13+)  
Views:  
\* ChildHome.jsx  
\* ConsentScreen.jsx  
\* MonitoringStatus.jsx

Display:  
Protected by Spykids

Show:  
\* Connected parent  
\* What is monitored  
\* Privacy controls

Backend  
Stack:  
 Node.js  
\* Express  
\* PostgreSQL  
\* Prisma  
\* JWT

Responsibilities:  
\* Auth  
\* Pairing  
\* Risk engine  
\* Alerts  
\* Notifications  
\* Billing

Structure:  
/apps  
/parent-app  
/child-app  
/backend  
/shared

Include Docker.  
UI SYSTEM

Style:  
Modern \+ trustworthy  
Design:  
\* Glassmorphism  
\* Clean dashboards  
\* Mobile-first  
\* Dark mode

Colors:  
Primary:  
\#7C3AED → \#A78BFA  
Accent:  
\#EC4899  
CTA:  
\#F97316  
Avoid:  
Spy aesthetics  
Fear tactics  
Cartoon UI

\# CORE FEATURE — RISK DETECTION  
Generate LIVE data only.  
Inputs:  
\* Messages  
\* Contacts  
\* GPS  
\* Sender patterns

Example indicators:  
\* “asl”  
\* “age sex location”  
\* “send pics”  
\* “meet alone”  
\* “keep this secret”  
\* “trade pics”  
\* “you’re cute for your age”

Risk Score:  
0–100

Formula:  
Keyword severity  
\* Sender novelty  
\* Frequency anomalies

Only alert:  
≥70  
Alert example:  
High Risk:  
Unknown contact repeatedly requesting private photos.  
Never show full chat logs. ( ONLY ADMIN CAN ACTIVATE THAT OPTION)

\# BUSINESS MODEL

Free:  
\* Pairing  
\* Basic alerts  
\* Limited scans

Basic (£4.99):  
\* Full alerts  
\* Risk scoring  
\* Geofencing

Premium (£7.99):  
\* Custom rules  
\* Trends  
\* Family automation

Stripe:  
LIVE mode only.

\# BUILD ORDER (STRICT)  
1\. Repository structure  
2\. Landing page  
3\. Auth \+ verification  
4\. Family creation  
5\. Parent dashboard  
6\. Child app  
7\. Device pairing  
8\. Mock backend  
9\. Risk scoring  
10\. Docker \+ README

\# OUTPUT REQUIREMENTS  
Generate runnable MVP code.

Deliver:  
\* Folder structure  
\* Key files  
\* Core components  
\* Prisma schema  
\* Mock data  
\* Docker  
\* README

Use LIVE data only.  
Prioritize:  
Fast setup, local execution, production-quality structure.  
Do NOT integrate fake placeholder api’s only LIVE surveillance APIs.  
