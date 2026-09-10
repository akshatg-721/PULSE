PULSE

The heartbeat of campus.

PULSE is a modern campus event discovery and engagement platform designed to bring college clubs, events, students, and campus activities together in one place.

Instead of functioning like a traditional college event directory, PULSE combines event discovery, short-form video, online registration, attendance, and club management into one interactive platform.

✨ What is PULSE?

PULSE is built around a simple idea:

SEE IT → FEEL IT → JOIN IT

Students should be able to discover what's happening on campus through engaging visual content, explore event details, register directly, and participate in events without jumping between different platforms.

Clubs and organizers get the tools they need to create events, manage registrations, publish event reels, track attendance, and understand engagement.

🎯 Why PULSE?

Traditional college event websites are often focused on static information:

Event lists

Club descriptions

Basic announcements

External registration links

PULSE takes a more interactive approach.

Instead of:

Find event
    ↓
Open external form
    ↓
Register somewhere else

PULSE aims for:

WATCH
  ↓
DISCOVER
  ↓
EXPLORE
  ↓
REGISTER
  ↓
GET QR
  ↓
ATTEND
  ↓
ENGAGE

The goal is to make campus events feel like something students discover and experience, rather than something they have to search for.

🚀 Core Features

🎥 Reels-Style Event Discovery

A vertical short-form video experience for campus events.

Students can:

Watch event highlights

Discover upcoming events

Explore clubs

Like/save/share content

Open the associated event

Register directly

The Reels feed is the primary differentiator of PULSE.

📅 Event Discovery

Students can browse:

Upcoming events

Past events

Workshops

Competitions

Cultural events

Sports

Social events

Technical events

Events can be filtered by category and date.

📝 Direct Registration

Students can register for events directly through PULSE.

Registration can include:

Name

College email

Phone

Course

Year

Team details

Event-specific questions

Registration forms are designed to be dynamic so different events can request different information.

🎟️ Digital Registration Pass

After registering, students receive:

Registration ID

Event details

QR code

Calendar option

Event status

Example:

YOU'RE IN.

AI HACK NIGHT
28 AUGUST
06:00 PM

REGISTRATION ID
#PULSE-48291

[ QR CODE ]

[ ADD TO CALENDAR ]

📱 QR-Based Attendance

Event organizers can scan a student's QR code at the venue.

The system can verify:

QR CODE
   ↓
REGISTRATION
   ↓
EVENT
   ↓
VALIDATION
   ↓
ATTENDANCE

This removes the need for manual attendance lists.

🏫 Club Profiles

Each club can have its own profile containing:

Club information

Logo

Description

Upcoming events

Past events

Reels

Members

Event statistics

👤 Student Profiles

Students can view:

Registered events

Upcoming events

Past events

Saved events

Attendance history

Campus activity

Example:

MY ACTIVITY

Events Attended     14
Workshops            6
Competitions         3

🛠️ Admin Features

Club administrators can manage their events from a dedicated dashboard.

Dashboard

View:

Total events

Registrations

Attendance

Reel views

Active users

Event Management

Admins can:

Create events

Edit events

Delete events

Set capacity

Add event details

Upload banners

Upload reels

Enable/disable registration

Registration Management

Admins can:

View registrations

Filter registrations

View participant information

Manage registration status

Export registration data

Attendance

Admins can:

Scan QR codes

Verify registrations

Mark attendance

View attendance statistics

Analytics

Potential analytics include:

Event views

Registrations

Attendance

Registration conversion

Reel views

Reel engagement

👥 User Roles

PULSE is designed around role-based access.

Role

Responsibilities

Student

Discover, register, save, attend

Club Member

Help manage club content/events

Event Manager

Create and manage assigned events

Club Admin

Manage club events, members and analytics

Super Admin

Manage the entire platform

Permissions should be handled using role-based access control rather than hardcoded UI restrictions.

🧱 System Architecture

High-level architecture:

                         PULSE
                           │
             ┌─────────────┼─────────────┐
             │             │             │
          STUDENTS        CLUBS        ADMINS
             │             │             │
             └─────────────┼─────────────┘
                           │
                       FRONTEND
                           │
                      Next.js App
                           │
             ┌─────────────┼─────────────┐
             │             │             │
            AUTH           API        MEDIA
             │             │             │
             │             │       Cloud Storage
             │             │
             └─────────────┼─────────────┘
                           │
                       DATABASE
                       PostgreSQL

💻 Tech Stack

The recommended technology stack is:

Frontend

Next.js

TypeScript

Tailwind CSS

Framer Motion

Backend

Next.js API / Route Handlers

Server Actions where appropriate

Database

PostgreSQL

Prisma ORM

Authentication

Potential options:

Auth.js

Clerk

Authentication should support role-based permissions and, if required, college email restrictions.

Media

Potential storage:

Cloudinary

Cloudflare R2

Amazon S3

Videos should not be stored directly inside PostgreSQL.

The database should store media URLs and metadata.

Supporting Libraries

React Hook Form

Zod

Lucide React

Recharts

QR code generation/scanning library

Deployment

Recommended:

Vercel for application hosting

Supabase or Neon for PostgreSQL

Cloudinary/R2/S3 for media

📂 Suggested Project Structure

pulse/
│
├── app/
│   ├── page.tsx
│   ├── events/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── reels/
│   │   └── page.tsx
│   │
│   ├── clubs/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── profile/
│   │   └── page.tsx
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── events/
│   │   ├── registrations/
│   │   ├── reels/
│   │   ├── attendance/
│   │   └── analytics/
│   │
│   └── api/
│       ├── events/
│       ├── registrations/
│       ├── reels/
│       └── users/
│
├── components/
│   ├── Navbar.tsx
│   ├── EventCard.tsx
│   ├── ReelCard.tsx
│   ├── ClubCard.tsx
│   ├── Button.tsx
│   ├── Countdown.tsx
│   └── ...
│
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── images/
│   └── icons/
│
├── styles/
│
├── design.md
├── README.md
├── package.json
└── ...

🗄️ Database Overview

The main entities are expected to include:

Users
Clubs
ClubMembers
Events
Reels
Registrations
RegistrationFields
RegistrationResponses
Attendance
Notifications

Relationship overview:

USER
 │
 ├──── REGISTRATIONS ──── EVENT
 │                          │
 │                          └──── CLUB
 │
 └──── CLUB MEMBER ─────── CLUB
                              │
                              └──── REELS

The complete database schema can evolve as the platform grows.

🎨 Design System

PULSE uses a bold editorial visual identity.

Primary Identity

YELLOW
BLACK
CHROME

Primary background:

#F5C400

Primary dark:

#0A0A0A

Warm white:

#F7F4EA

Supporting accents:

#7C3AED
#EC4899
#3B82F6

The interface should remain primarily yellow, black, and chrome, with secondary colors used sparingly.

For the complete visual specification, see:

design.md

🎬 Motion & Interaction

Motion is an important part of the PULSE identity.

The homepage takes inspiration from modern editorial/creative websites and uses:

Fluid chrome 3D motion

Smooth page transitions

Scroll-linked animations

Parallax

Staggered typography

Hover interactions

Subtle card movement

Magnetic CTA interactions

Inertia-based movement

Motion should feel:

Fluid + Physical + Precise

Avoid unnecessary animations.

Performance should always take priority over visual effects.

📱 Responsive Design

PULSE is designed for:

Mobile

360px
390px
430px

Tablet

768px
1024px

Desktop

1280px
1440px
1920px

The mobile experience is especially important because the Reels feature is designed around vertical, mobile-first content.

On mobile:

Reels become full-width

Filters become horizontally scrollable

Event layouts become stacked

Navigation can use a bottom navigation bar

Important CTAs remain easily reachable

🔐 Authentication

Authentication should support:

Student login

Admin login

Role-based access

Protected dashboard routes

College email verification if required

For a college-specific deployment, registration can optionally be restricted to an approved email domain such as:

@student-college.edu

The allowed domain should ideally be configurable rather than hardcoded.

📈 Future Roadmap

Phase 1 — MVP

Landing page

Events

Reels

Event details

Authentication

Registration

Student profile

Admin dashboard

Event management

Registration management

Phase 2

Dynamic registration forms

QR attendance

CSV export

Email confirmation

Event reminders

Saved events

Search and advanced filtering

Phase 3

Event analytics

Reel analytics

Club profiles

Multiple clubs

Multiple administrators

Notifications

Calendar integration

Phase 4

Transform PULSE from a club platform into a complete campus platform.

                    PULSE
                      │
        ┌─────────────┼─────────────┐
        │             │             │
     STUDENTS       CLUBS         ADMIN
        │             │             │
     Discover       Create        Manage
     Register       Events        Users
     Attend         Reels         Analytics
     Save           Members       Reports

🌟 What Makes PULSE Different?

The primary difference is the event discovery experience.

A traditional event website asks:

"Which event do you want to attend?"

PULSE asks:

"What do you want to experience?"

Instead of relying only on static event cards, PULSE uses short-form video to create a visual discovery layer.

Traditional Event Platform

EVENT LIST
    ↓
EVENT DETAILS
    ↓
REGISTRATION

PULSE

REEL
  ↓
DISCOVER
  ↓
EVENT
  ↓
REGISTER
  ↓
QR
  ↓
ATTEND
  ↓
ACTIVITY HISTORY

This creates a more complete event lifecycle.

📊 Long-Term Vision

The long-term goal is for PULSE to become the digital layer for campus life.

Students use it to discover what's happening.

Clubs use it to build communities.

Organizers use it to manage events.

Administrators use it to understand campus engagement.

Ultimately:

PULSE is not just an event website.

It is the digital heartbeat of campus life.

🤝 Contributing

Contributions are welcome.

Before submitting changes:

Create a feature branch.

Keep components reusable.

Follow the existing design system.

Test responsive layouts.

Test authentication and permissions.

Make sure animations do not negatively affect performance.

Keep commits focused and descriptive.

Example:

git checkout -b feature/reels-feed
git add .
git commit -m "Add reels feed"
git push origin feature/reels-feed

📄 Documentation

Project documentation:

README.md — Project overview and setup

design.md — Complete UI/UX and design system

📜 License

Choose an appropriate license before making the repository public.

PULSE

SEE IT. FEEL IT. JOIN IT.

The heartbeat of campus.
