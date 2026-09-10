PULSE — Design System & UI Specification

1. Product Overview

PULSE is a modern campus event discovery and engagement platform.

Tagline

The heartbeat of campus.

PULSE allows students to:

Discover upcoming college events

Watch event videos in a Reels-style feed

Explore clubs and communities

Register for events directly through the website

Receive registration confirmation

Use QR codes for event check-in

Track their campus activity

Clubs and administrators can:

Create and manage events

Upload event reels

Manage registrations

Track attendance

View event and reel analytics

Manage club members

The central product loop is:

DISCOVER → WATCH → REGISTER → ATTEND → ENGAGE

2. Design Philosophy

PULSE should not look like a traditional college website.

It should feel like:

A social discovery platform for campus life.

The visual experience should communicate:

Energy

Youth

Movement

Creativity

Community

Premium digital design

The homepage should create curiosity within the first few seconds.

The design should feel closer to a modern creative studio or high-end startup product than an academic portal.

3. Visual Reference

Primary visual inspiration:

SLATE — Digital Marketing AI Animation

https://dribbble.com/shots/27672217-SLATE-Digital-Marketing-AI-Animation

The reference informs:

Editorial composition

Oversized typography

Vibrant yellow background

Chrome 3D object

Experimental layouts

Collage-style elements

Fluid animation

Strong visual hierarchy

PULSE should take inspiration from this visual language while maintaining its own identity and content.

Do not directly copy the reference.

4. Color System

Primary Colors

Color

Hex

Usage

Electric Yellow

#F5C400

Primary hero background

Deep Black

#0A0A0A

Main typography and dark sections

Warm White

#F7F4EA

Light surfaces and secondary backgrounds

Chrome Silver

#C7CBD1

3D metallic elements

Soft Gray

#8B8F98

Secondary text

Accent Colors

Use accents sparingly:

Color

Hex

Usage

Electric Purple

#7C3AED

Interactive accents

Pink

#EC4899

Occasional highlight

Blue

#3B82F6

Status/information

The primary visual identity should remain:

YELLOW + BLACK + CHROME

Do not turn the website into a rainbow-gradient interface.

5. Typography

Use a modern geometric or neo-grotesk sans-serif.

Typography should have a strong editorial character.

Display

Used for:

Hero headings

Major section headings

Large statements

Characteristics:

Very large

Bold

Tight line height

Slightly condensed where appropriate

Strong contrast

Example:

THE
HEARTBEAT
OF CAMPUS.

Heading

Used for:

Event names

Section titles

Dashboard headings

Body

Used for:

Descriptions

Event information

Forms

Supporting text

Metadata

Use smaller uppercase text for:

Dates

Categories

Venues

Club names

Registration status

Example:

28 AUG  •  06:00 PM
INNOVATION LAB
TECHNOLOGY

6. Homepage Structure

The homepage should follow this structure:

NAVBAR
   ↓
HERO
   ↓
REELS
   ↓
UPCOMING EVENTS
   ↓
CLUBS
   ↓
CAMPUS ACTIVITY / CTA
   ↓
FOOTER

The first viewport should be highly visual and minimal.

7. Navigation

The navbar should be minimal and editorial.

Left

PULSE

Right

EVENTS
REELS
CLUBS
ABOUT
LOGIN

Additional:

Search

User avatar when authenticated

Behavior

Initial state:

Transparent

Black typography

Minimal visual weight

On scroll:

Subtle background

Backdrop blur

Thin border

Smooth transition

On mobile:

PULSE logo

Menu button

Optional compact login/avatar

8. Hero Section

The hero should occupy approximately one full viewport.

Main heading

THE
HEARTBEAT
OF CAMPUS.

Supporting copy:

Discover what’s happening around you.

Primary CTA:

EXPLORE EVENTS →

Secondary CTA:

WATCH REELS ↓

9. Hero Composition

The hero should use an asymmetric editorial composition.

Main elements

Typography

Oversized black typography placed prominently on the yellow canvas.

Some words may:

Extend beyond the normal grid

Overlap slightly

Shift vertically

Interact with the 3D object

Chrome Object

Place a large fluid chrome sphere or metallic blob near the center/right side.

The object should have:

Realistic reflections

Liquid-metal appearance

Soft environment lighting

Subtle deformation

Slow rotation

Floating movement

The chrome object is the primary visual anchor.

10. Chrome Object Concept

The chrome object should subtly reflect the campus environment.

Possible reflections:

Campus architecture

Event stages

Lighting

Crowds

Posters

Student silhouettes

These elements should remain abstract and subtle.

The object should not look like a literal campus sculpture.

It should feel futuristic and symbolic.

11. Hero Animation

The hero animation is a major part of the identity.

On Page Load

Animate:

Background fades in

Main typography enters with stagger

Chrome object appears and settles into position

Decorative elements enter subtly

Use smooth easing.

Chrome Animation

The chrome object should:

Float slowly

Rotate gently

Deform subtly

Change reflections naturally

React slightly to cursor movement

Avoid:

Fast spinning

Excessive bouncing

Constant deformation

Distracting movement

12. Cursor Interaction

Desktop users should get subtle interactive feedback.

When the cursor moves:

Chrome reflection shifts

Object follows slightly with inertia

Floating elements react subtly

Event card can have slight parallax

Interaction should feel physical.

Do not overdo cursor effects.

13. Scroll Animation

The homepage should feel like one continuous visual sequence.

As the user scrolls:

Hero typography moves subtly

Chrome object rotates/moves

Decorative elements transition

Hero gradually exits

Next section enters naturally

Avoid abrupt section changes.

Use scroll-linked motion sparingly.

14. Reels Section

Heading

CAMPUS,
IN MOTION.

Supporting text:

See what happened. Find what’s next.

The Reels section is the primary product differentiator.

15. Reel Cards

Use a vertical 9:16 format.

Each reel contains:

Video

Event title

Club

Date

Category

Like

Share

Save

Register CTA

Example:

AI HACK NIGHT

BML TECH CLUB
28 AUG • 06:00 PM

[ REGISTER → ]

Desktop

Use an editorial horizontal arrangement with several reels visible.

Cards may be slightly different sizes or positions.

Mobile

Use a full-width vertical feed.

Allow:

Vertical swiping

Snap scrolling

Autoplay

Mute/unmute

Pause/play

16. Reel Interactions

On hover:

Slight scale

Subtle tilt

Video metadata becomes more visible

CTA appears

Overlay gradient changes

On mobile:

Tap to pause/play

Tap sound icon for audio

Swipe to next reel

Keep interactions responsive and smooth.

17. Upcoming Events

Section heading:

WHAT’S NEXT?

Filters:

ALL
TECH
CULTURAL
SPORTS
WORKSHOP
COMPETITION
SOCIAL

Filters should be horizontally scrollable on mobile.

18. Event Cards

Event cards should include:

Event image/video

Event name

Club

Date

Time

Venue

Category

Registration status

CTA

Example:

AI HACK NIGHT

28 AUG
06:00 PM
INNOVATION LAB

127 / 200 SPOTS

REGISTER →

Avoid making every event card identical.

Use an editorial/asymmetric layout for featured events.

19. Event Card Animation

On hover:

Card moves upward slightly

Image zooms subtly

CTA appears

Arrow moves

Border/shadow changes

Optional slight rotation

Animation duration:

200–400ms

Use smooth easing.

20. Event Detail Page

Structure:

EVENT HERO
EVENT INFORMATION
ABOUT
SCHEDULE
SPEAKERS
PRIZES
RULES
VENUE
ORGANIZER
REGISTRATION

Hero information:

AI HACK NIGHT

28 AUGUST 2026
06:00 PM – 10:00 PM
INNOVATION LAB

Show:

127 / 200 SPOTS FILLED

CTA:

REGISTER NOW

21. Countdown

For upcoming events, optionally display:

02 DAYS
14 HOURS
32 MIN

Use animated number transitions.

Do not make the countdown visually overpower the event information.

22. Registration Flow

Use a clean multi-step flow.

Step 1 — Details

NAME
EMAIL
PHONE
COURSE
YEAR

Step 2 — Event Fields

Fields depend on the event.

Examples:

TEAM NAME
TEAM SIZE
GITHUB
PORTFOLIO
EXPERIENCE

Step 3 — Confirmation

Show:

Event

Date

Venue

Registration details

Registration ID

Final message:

YOU’RE IN.

23. Registration Success

Show:

YOU’RE IN.

AI HACK NIGHT
28 AUGUST
06:00 PM

REGISTRATION ID
#PULSE-48291

Include:

QR code

Add to Calendar

Share

View event

Use a subtle success animation.

24. Clubs Section

Heading:

FIND YOUR PEOPLE.

Club cards should include:

Logo

Club name

Description

Category

Event count

Follow/view button

Categories:

Technology

Cultural

Sports

Entrepreneurship

Arts

Social

Club profiles should show:

About

Upcoming events

Past events

Reels

Members

25. Student Dashboard

Authenticated users should see:

WELCOME BACK 👋

Sections:

Upcoming

Registered upcoming events.

My Events

Past and upcoming events.

Saved

Bookmarked events.

Activity

Show:

Events attended

Workshops

Competitions

Other participation

Keep the dashboard clean and data-driven.

26. Admin Dashboard

The admin interface should use a more functional design language while retaining PULSE branding.

Metrics:

TOTAL EVENTS
REGISTRATIONS
ATTENDANCE
REEL VIEWS
ACTIVE USERS

Charts:

Registration trends

Attendance

Event popularity

Reel engagement

Navigation:

DASHBOARD
EVENTS
REGISTRATIONS
REELS
ATTENDANCE
ANALYTICS
MEMBERS
SETTINGS

Primary action:

+ CREATE EVENT

27. Create Event

Admin form:

EVENT NAME
DESCRIPTION
CATEGORY
DATE
START TIME
END TIME
VENUE
CAPACITY
BANNER
REEL / VIDEO

Registration settings:

ENABLE REGISTRATION
REQUIRE COLLEGE EMAIL
TEAM REGISTRATION

Dynamic registration fields:

+ ADD FIELD

28. QR Attendance

Registered students receive a QR code.

Admin scanner result:

REGISTRATION VERIFIED ✓

STUDENT NAME
EVENT NAME
REGISTRATION ID

ATTENDANCE CONFIRMED

Use clear success/error states.

29. Motion System

PULSE's motion language should be:

Fluid + Physical + Precise

Primary motion

Slow floating

Parallax

Inertia

Scroll-linked movement

3D rotation

Smooth transforms

Secondary motion

Fast hover response

CTA movement

Icon transitions

State changes

Easing

Prefer smooth cinematic easing rather than linear movement.

Avoid:

Excessive bouncing

Flashing

Random animations

Constant movement

Animation on every element

Motion should enhance hierarchy, not distract from it.

30. Micro-interactions

Use subtle feedback for:

Buttons

Links

Like

Save

Share

Form fields

Registration

Navigation

Filters

Examples:

Button

Arrow moves slightly right on hover.

Save

Icon transitions between outlined and filled state.

Like

Small scale animation.

Registration

CTA changes state:

REGISTER
     ↓
REGISTERING...
     ↓
REGISTERED ✓

31. Responsive Design

The website must support:

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

Do not simply shrink desktop layouts.

Layouts should be intentionally recomposed for smaller screens.

32. Mobile Design

Mobile should prioritize:

Discoverability

Reels

Events

Registration

Profile

Recommended bottom navigation:

HOME
EVENTS
REELS
SAVED
PROFILE

The Reels experience should feel natural on a phone.

33. Accessibility

Ensure:

Sufficient color contrast

Keyboard navigation

Visible focus states

Accessible buttons

Proper form labels

Alt text for images

Captions or accessible alternatives for important videos

Reduced-motion support

If the user prefers reduced motion, significantly reduce non-essential animations.

34. Loading States

Use polished skeleton loaders.

Examples:

Event card skeleton

Reel skeleton

Profile skeleton

Dashboard skeleton

Avoid blank screens.

35. Empty States

Examples:

No upcoming events

NOTHING HERE YET.

New events are coming soon.

No saved events

SAVE SOMETHING FOR LATER.

Explore events and bookmark your favorites.

No registrations

YOUR CAMPUS STORY STARTS HERE.

Find an event and join in.

36. Error States

Errors should be clear but visually consistent.

Example:

SOMETHING WENT OFF BEAT.

We couldn’t load this event.

TRY AGAIN

Avoid technical error messages for normal users.

37. Component System

Create reusable components rather than page-specific implementations.

Core components:

Navbar
Button
EventCard
FeaturedEvent
ReelCard
ReelFeed
ClubCard
FilterPill
Countdown
RegistrationForm
RegistrationSuccess
QRCodeCard
Modal
Toast
LoadingSkeleton
EmptyState
ErrorState
Footer

Admin components:

Sidebar
MetricCard
DataTable
ChartCard
EventForm
RegistrationTable
AttendanceScanner

38. Design Principles

Every design decision should follow these principles:

1. Visual First

Important information should be visually discoverable.

2. Motion With Purpose

Animation should communicate state, hierarchy, or interaction.

3. Editorial Layouts

Avoid repetitive grid-heavy layouts.

4. Strong Typography

Typography should carry a large part of the visual identity.

5. Controlled Color

Use yellow, black, and chrome as the main identity.

6. Mobile First for Reels

The Reels experience must feel native on mobile.

7. Premium Simplicity

Avoid unnecessary UI elements.

39. Product Identity

PULSE should feel like:

SEE IT
   ↓
FEEL IT
   ↓
JOIN IT

The user should never feel like they are browsing a boring event directory.

The emotional goal is:

Something is happening. I want to be there.

40. Technical Direction

Recommended frontend stack:

Next.js
TypeScript
Tailwind CSS
Framer Motion

Potential supporting libraries:

Lucide Icons
React Hook Form
Zod
Recharts

For video/media:

Cloudinary
Cloudflare R2
or S3

The design should be implemented with reusable components and responsive layouts.

41. Performance

Despite the animation-heavy design, performance must remain a priority.

Use:

Lazy-loaded videos

Optimized images

Responsive image sizes

Poster images for videos

Intersection Observer for reels

Reduced motion support

Code splitting

Minimal unnecessary JavaScript

Do not load every reel video simultaneously.

Only autoplay videos that are currently visible.

42. Final Art Direction

The final PULSE experience should combine:

Experimental editorial design



Fluid chrome 3D motion



Campus energy



Reels-style discovery



Premium startup UI

The first viewport should immediately communicate:

PULSE IS ALIVE.

The website should feel:

BOLD.
FAST.
SOCIAL.
CINEMATIC.
INTERACTIVE.
PREMIUM.

PULSE is not just a website for events.

It is:

The digital heartbeat of campus life.
