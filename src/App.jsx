import { useState, useMemo, useCallback } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ─── Constants ───────────────────────────────────────────────────────────────

const LEVELS = ["ASE", "SEI", "SEII", "SSEI", "SSEII", "Staff"];

const LEVEL_LABELS = {
  ASE: "Associate Software Engineer",
  SEI: "Software Engineer I",
  SEII: "Software Engineer II",
  SSEI: "Senior Software Engineer I",
  SSEII: "Senior Software Engineer II",
  Staff: "Staff Engineer",
};

const LEVEL_INDEX = Object.fromEntries(LEVELS.map((l, i) => [l, i]));

const SKILL_NAMES = [
  "Depth",
  "Breadth",
  "Execution",
  "Communication",
  "Architecture",
  "Operations",
];

const SKILL_ICONS = {
  Depth: "🔬",
  Breadth: "🌐",
  Execution: "⚡",
  Communication: "💬",
  Architecture: "🏗️",
  Operations: "🔧",
};

const SKILL_COLORS = {
  Depth: "#3b82f6",
  Breadth: "#10b981",
  Execution: "#f59e0b",
  Communication: "#8b5cf6",
  Architecture: "#ef4444",
  Operations: "#06b6d4",
};

// ─── Data ────────────────────────────────────────────────────────────────────

const SKILLS_DATA = {
  Depth: {
    description:
      "Technical expertise in specific areas: language/framework/tool, product code domain, business domain, and overall technical judgment across dimensions of code quality.",
    levels: {
      ASE: {
        summary:
          "Has developed technical skills through education but has little practical experience.",
        expectations: [
          "Has facility in at least one programming language",
          "Shows understanding of basic engineering principles (variables, data structures, control structures, components, testing, deployment, etc)",
          "Is not expected to demonstrate depth of knowledge in any one technical area, but is looking to grow their skills and identify different areas of interest",
        ],
        indicators: [
          "Participates in peer-to-peer learning",
          "Pairs with others who complement their skills; trades skills and knowledge",
          "Derives a basic understanding of relevant tools and technologies from documentation and experimentation",
          "Asks questions that help others understand and address the ASE's knowledge gaps",
        ],
      },
      SEI: {
        summary:
          "Looking for something to be an expert at, even if they're not there yet. Might have some depth but it's not necessarily cultivated.",
        expectations: [
          "Demonstrates growing expertise in a relevant technology stack",
          "In one or two areas of interest, is starting to develop the notion of practices that are broadly effective or ineffective",
          "Looking to continue growth in their skill area and identify related areas of interest to explore",
        ],
        indicators: [
          "Works to gain more in-depth knowledge in their primary technical skill area",
          "Identifies areas they are strong in and areas for development, and works to pair with others that complement their skills, to trade knowledge",
          "Learning the dimensions of code quality and related tradeoffs",
        ],
      },
      SEII: {
        summary:
          "Has been around long enough to know where their interests lie. Starting to develop depth in some areas.",
        expectations: [
          "Has picked something to specialize in and is actively pursuing it",
          "Pursues specialized knowledge outside the standard delivery work",
          "Has advanced in their main areas of interest beyond design 'best practices' and into 'tradeoffs'",
          "Understands and applies all the dimensions of code quality appropriately",
          "Thoughtfully instruments code for observability without direction",
        ],
        indicators: [
          "Gives an occasional peer-to-peer and uses it as an opportunity not only to teach, but to learn",
          "Is working with someone on the business side to deliver value and gain greater knowledge of the business",
          "Represents their areas of expertise in team meetings",
          "Reliably creates alerts that are useful and not too noisy (avoids the 'cry wolf' problem)",
        ],
      },
      SSEI: {
        summary:
          "Should have an area or two in which they have more depth than their peers.",
        expectations: [
          "Knows more than anyone else on the team about a few approaches or technologies",
          "Continues to increase depth and nuance in areas in which they already have depth",
          "Understands the business contribution of the capabilities they work on",
        ],
        indicators: [
          "Regularly shares knowledge via Confluence pages or peer-to-peer presentations",
          "Mentors team members in areas of expertise",
          "A couple times a quarter writes a blog post or confluence article about a different approach we can take toward a technical or business problem",
          "Has gotten additional certifications, taken additional classes, or participated in an external working group related to our domain or technology space",
          "People seek out the SSEI to represent areas of expertise in cross-team consultations",
        ],
      },
      SSEII: {
        summary:
          "Should have areas of applied expertise with more depth than their peers. Should be able to take ownership of a new domain and provide the expertise required by the rest of the team.",
        expectations: [
          "Within the engineering organization, is a recognized expert in at least one substantial area",
          "Is considered a leader in the creation of high quality code",
        ],
        indicators: [
          "Mentors junior engineers on code quality and general design practices",
          "Leads the creation of best practices and patterns for use across the organization for a particular technology or domain",
          "Contributes to internal or external common component / open source projects",
          "People seek out the SSEII to represent areas of expertise in cross-team consultations",
        ],
      },
      Staff: {
        summary:
          "Recognized areas of applied expertise. Has at least one area where people inside and outside the org would see them as a leader in the field.",
        expectations: [
          "Has contributed innovative solutions that enhance the state of the art in some software development disciplines",
          "Continues to stay current on trends within that discipline and can distinguish between fads and game changers",
          "Participates in the technical community, providing thought leadership and enhancing the org's technical reputation",
        ],
        indicators: [
          "Gives a series of peer-to-peer presentations that build on each other over the course of a year",
          "Has written an article or book in the last few years",
          "Is a major contributor to an org-sponsored open source project",
          "Regularly presents at or leads a technology-focused meetup",
        ],
      },
    },
  },
  Breadth: {
    description:
      "Breadth of knowledge, technical agility, handling ambiguity, and ability to effectively employ new or unfamiliar technology and patterns.",
    levels: {
      ASE: {
        summary: "",
        expectations: [
          "Can complete simple tasks in languages they are not familiar with, e.g., adding simple automation tests",
          "Is an interested learner",
          "Willingness to expand areas of expertise",
          "Willingness to learn new tools (Jira, Datadog, etc.)",
        ],
        indicators: [
          "Shares knowledge gained through onboarding activities with other new employees",
          "Demonstrates knowledge of JIRA by creating and updating stories or tasks",
          "Demonstrates willingness to expand areas of expertise by taking on tasks in areas not in their core skill set",
        ],
      },
      SEI: {
        summary:
          "Also trying to understand what all the things out there are and why they matter to do good work.",
        expectations: [
          "Understands the value of many or most of the technologies we work with",
          "Given some time, can independently write functioning, if not idiomatic, code in a language that uses a familiar programming paradigm",
          "Can complete assigned story/tasks with some assistance from senior engineers",
          "Understands the core value proposition and could do an elevator pitch that summarizes what we do",
          "Can speak at a high level to technologies related to their primary skill area",
        ],
        indicators: [
          "Takes on stories or tasks in a language outside of core competency and fights through it to deliver working code",
          "Keeps up on what's happening in areas of relevance such as building management software, environmental policy, streaming technology, or containerization",
          "Instruments code for observability and user activity as directed",
        ],
      },
      SEII: {
        summary:
          "Hasn't seen quite as much variety of situations, but has been paying attention enough that they have insight about approaches we could take.",
        expectations: [
          "Is a polyglot and can be at least somewhat effective in a new language quickly if it's a familiar programming paradigm",
          "May not know the entire stack, but can jump in at several points and be effective",
          "May not have incredible depth in the domain but knows enough to coherently talk to stakeholders and turn basic business needs into technical requirements",
          "Thoughtfully instruments code for observability without direction",
        ],
        indicators: [
          "Ramps up on new technologies when they are introduced and does a presentation to help others learn",
          "Builds a full vertical slice of application from UI to data store",
          "Serves as an informal business analyst for a project, building out stories for the band",
        ],
      },
      SSEI: {
        summary:
          "Should be able to perform a wide range of tasks — beyond areas of expertise.",
        expectations: [
          "Has significant experience in most of the following: UI/UX, REST services, database, architectural design, infrastructure automation",
          "Is relatively well informed about the parts of the stack in which they don't have substantial experience",
        ],
        indicators: [
          "Contributes to parts of the stack outside of area of expertise",
          "Actively researches potential improvements in technique, architectural pattern, tooling, and process",
          "Programs comfortably in at least two languages; can hack their way through several more",
        ],
      },
      SSEII: {
        summary:
          "Ability to address relevant issues in a variety of technical areas and apply lessons from different domains makes them a go-to person for difficult tasks. Broad experience makes everyone they work with more effective.",
        expectations: [
          "Has significant and growing knowledge of the business domain that extends beyond the capabilities they're currently working on",
          "Understands the relative benefits and drawbacks of different techniques, tools, and technologies that can be used to address similar concerns",
        ],
        indicators: [
          "Broadly aware of engineering standards and best practices and shares with others",
          "Pivots from imperative to declarative, or OO to functional as appropriate, and knows what kinds of problems are best suited to which",
          "Spots and devises mitigation for business risks that extend from their work to other domains",
        ],
      },
      Staff: {
        summary:
          "Been there. Done that. They don't know all the tech, haven't done everything, but have enough experience to manage execution of a project even if it's not in an area of depth.",
        expectations: [
          "Can help manage a technical production roadmap composed of a wide range of technologies and experiences whether it's in their area of expertise or not",
          "Can turn that roadmap into shovel-ready actionable work",
          "Understands the role of a wide range of relevant technologies and their value proposition, whether in their area of expertise or not",
          "Either has some understanding of our domain or can pick up the basics very quickly",
        ],
        indicators: [
          "Does at least a little bit of development, architecture, pedagogy, operations, and technical product management every quarter",
          "Works with peers and stakeholders to translate the product roadmap into a technical roadmap that helps the product organization make better informed choices",
          "Provides a peer-to-peer session that provides nuanced comparison of two valid technical approaches and explains when each one is more suitable",
        ],
      },
    },
  },
  Execution: {
    description:
      "Creativity, problem solving, effective delivery, ownership, testing, estimation, managing scope, managing risk, and support.",
    levels: {
      ASE: {
        summary: "",
        expectations: [
          "Given a set of clear story constraints, can participate in the estimates process",
          "With assistance from more experienced engineers, can write solid, secure and well tested code",
          "Can work with the team to move a task in a story forward to completion",
          "Can build, tear down, and reinstall their development environment and add code to their domain",
          "Understands when to start work, and when an increment of work is done",
        ],
        indicators: [
          "Regularly and fully completes small increments of work (tasks, stories, bugs, etc.), with and without guidance",
          "Participates in code reviews, expected to catch simple mistakes, mostly learning by reading, listening, and questioning",
          "Creates tests that fit or improve on the norm for their team",
          "Helps develop documentation",
          "Effectively refactors a portion of a legacy project provided software pattern, extending capabilities and/or improving dimensions of code quality",
        ],
      },
      SEI: {
        summary:
          "Delivery focused. Might anchor a smaller project but most expectations are on being able to get the job done with sufficient guardrails in place.",
        expectations: [
          "Given a familiar development environment, tooling, and established patterns, can efficiently write solid, secure, well-tested code",
          "Given existing infra automation, can generalize it or clone it and safely add new infrastructure to the system",
          "Can focus on a single task with multiple steps continuously to completion",
          "Takes ownership of assigned projects",
          "Can understand, and safely make interdependent changes to complex systems of legacy code",
          "Consistently delivers on their own commitments",
        ],
        indicators: [
          "Spins up a new database to support a service that has a structure similar to one we already have",
          "Demonstrates ability to create functional code with minimal oversight",
          "Ships functional code to production most weeks",
          "Participates in code reviews and PR reviews, providing appropriate feedback and asking questions to understand design patterns used",
          "Learns the ins and outs of legacy code systems and can offer insight into interdependencies and idiosyncrasies",
          "Code submitted largely conforms to established approaches and best practices",
        ],
      },
      SEII: {
        summary:
          "We don't expect them to be leading a team, but we should be able to give them something to do and have it delivered within a reasonable time, with high quality, and conformant to standards and principles.",
        expectations: [
          "Given time, can provide reasonably good LOE estimates for autonomously executable stories",
          "Knows when they're in over their head and should ask for help",
          "Given a clear mandate for balancing quality with delivery time, can execute against the need",
          "Probably have some gaps in the stack, but can handle most of it comfortably",
        ],
        indicators: [
          "Ships high quality code to production multiple times a week",
          "Writes both infra and product code",
          "Estimates are generally within 20% of actual delivery time at story level",
          "Designs and implements significant improvements to legacy systems, consolidating multiple instances into a shared instance and advancing dimensions of code quality",
          "Takes initiative to suggest significant improvements to legacy code",
        ],
      },
      SSEI: {
        summary:
          "Expected to produce in addition to mentor and lead.",
        expectations: [
          "Given time, can provide reasonably good LOEs for delivery",
          "Stays focused on the most important tasks at hand",
          "Gets the work done efficiently balancing demands for quality and delivery time",
          "Can write solid code in one or more areas of the application and infrastructure stack",
        ],
        indicators: [
          "Provides expedient designs and implementations to problems",
          "Frequently helps the team deliver on major functionality",
          "Consistently delivers on their own commitments",
          "Estimates at the project level are generally within 20% of actual delivery time",
        ],
      },
      SSEII: {
        summary:
          "Expected to produce in addition to mentor and lead.",
        expectations: [
          "Exercises good judgment in selecting methods, techniques and evaluation criteria for obtaining solutions",
          "Able to lead the most complex projects. There is nothing the team works on that this person can't lead an effort on or at least make a major contribution on",
        ],
        indicators: [
          "Provides expedient designs and implementations to problems",
          "Frequently helps the team deliver on major functionality",
          "Estimates are generally within 20% of actual delivery time",
          "Go-to person who works on challenging features, bug fixes, and components",
          "Works on issues that can be complex in scope, where analysis of situations and/or data may require an evaluation of variable factors",
        ],
      },
      Staff: {
        summary:
          "Improve delivery with every deliverable. Unlike a Senior Engineer whose delivery is structured largely around established practices and scoped to a deliverable, Staff Engineer is a more strategic role.",
        expectations: [
          "Given sufficient inputs, provides good LOE estimates for delivery of major functionality with options that balance scope and effort",
          "Can identify high value, low cost scope reduction opportunities and effectively negotiate it with stakeholders",
          "Keeps the team focused on projects that push the company mission forward",
        ],
        indicators: [
          "The technical practices they promote improve overall delivery quality and speed continually over time",
          "Introduces compromises that meet and exceed desired outcomes through delivery of smaller than proposed scope",
          "Finds areas of inefficiency in approaches and technical choices and reduces overall delivery cost via process improvements",
        ],
      },
    },
  },
  Communication: {
    description:
      "Collaboration, leadership, sharing expertise, ability to work across teams, relationships, attitude, presentations, recruiting, mentoring, and managing expectations.",
    levels: {
      ASE: {
        summary: "",
        expectations: [
          "Learn to recognize leadership skills and how they apply to individuals and the team",
          "Practice communication skills in team stand up meetings, sprint reviews, and other team meetings",
          "Participate in generally expected corporate activities",
        ],
        indicators: [
          "Accepts coaching and constructive criticism in the spirit it's given",
          "Collaborates well with the rest of the team",
          "Can ask clarifying questions to test understanding of a story definition or business logic",
          "Effectively uses the internal tools for expense reporting, time management, communications, documentation, and performance management",
          "Participates in Engineering Presentations — mostly watching and learning, but possibly presenting a portion of a presentation",
        ],
      },
      SEI: {
        summary:
          "Not yet expected to be technical leaders, but starting to experiment with what leadership means to them.",
        expectations: [
          "Ready to jump in and lead an effort when asked",
          "Can effectively collaborate with a peer to execute a small to medium sized project",
          "Weighs in on technical and organizational solutions when they have insight and conforms to group and leadership decisions at all times",
          "Practices communication skills by leading some discussions in team stand up meetings, sprint reviews, and other meetings",
          "Asks for help in a timely manner",
        ],
        indicators: [
          "Accepts coaching and constructive criticism in the spirit it's given",
          "Collaborates well with the rest of the team",
          "Anchors a project or two a year of small to moderate size",
          "Takes on a personal or collaborative effort outside of daily development that could help the team and reports findings to the team regularly",
          "Can participate in candidate interviews and provide constructive feedback to the hiring process",
          "Participates in Engineering Presentations — presenting a portion or entirety of a presentation",
        ],
      },
      SEII: {
        summary:
          "Leads by example and coaches less experienced co-workers. The leadership is less formal and less core to the job, but it's real and it's expected.",
        expectations: [
          "Willing to help out when a less experienced SE needs it, but aware of when their work has to take priority",
          "Can effectively anchor a small to moderately-sized work stream",
          "Thinks critically about content presented and is forthcoming with suggestions and ideas",
          "Demonstrates effective mentoring skills within the team",
        ],
        indicators: [
          "Anchors a project multiple times a year",
          "Pulls teammates out of the weeds when they're spinning",
          "Coaches or mentors a junior engineer within the org or the tech community",
          "Respectfully questions assumptions",
        ],
      },
      SSEI: {
        summary:
          "Helps teammates make good choices. Helps them not only succeed in producing but succeed autonomously. Helps the team deliver on goals.",
        expectations: [
          "Supports team and leadership decisions whether agreed or not",
          "Willing to be accountable for oneself and work led. Regardless.",
          "Provides feedback and challenges prevailing opinions in a constructive manner",
          "Helps teammates learn new skills",
        ],
        indicators: [
          "Commits time to helping team members succeed",
          "Helps the team explore alternative designs and approaches",
          "Contributions have a wide reach beyond immediate team",
          "Teammates say they feel enabled and supported by this person",
          "Creates new, innovative approaches to common problems",
          "Mentors engineers either inside the org or outside",
          "Offers solutions with their critiques",
        ],
      },
      SSEII: {
        summary:
          "Viewed as leaders, having earned respect through demonstrable results and sound judgment. Effective in large and small groups, or working on their own. Comfortable leading a development effort or contributing as one of many.",
        expectations: [
          "Supports team and leadership decisions whether agreed or not",
          "Willing to be accountable for oneself and work led. Regardless.",
          "Provides feedback and challenges prevailing opinions in a constructive manner",
          "Helps teammates learn new skills",
        ],
        indicators: [
          "Recognized as a technical leader on their team and within their group",
          "Builds engineering bench strength by improving the skills of those around them via mentorship, teaching, or informal guidance",
          "Mentors engineers either inside the org or outside",
          "Helps the team explore alternative designs and approaches",
          "Contributions have a wide reach beyond immediate team",
          "Teammates say they feel enabled and supported by this person committing time to help them succeed",
          "Code submitted largely conforms to established approaches and best practices",
          "Creates new, innovative approaches to common problems",
        ],
      },
      Staff: {
        summary:
          "Uses delivery as a vehicle to train the next generation of Senior and Staff engineers.",
        expectations: [
          "As the organization grows, they scale leadership approaches through others",
          "Applies strategies that allow team members to make mistakes but limit their impact when they occur",
          "Willing to be accountable for oneself and team performance. Regardless.",
          "Helps teammates develop new strategies",
        ],
        indicators: [
          "Team shifts to more collaborative decision making process that results in equal or greater effectiveness",
          "A couple times a year provides a novel approach to a common organizational challenge",
          "Mentors experienced engineers both inside and outside the org",
          "Willing to work a few extra hours to ensure the success of a customer presentation or project kickoff",
        ],
      },
    },
  },
  Architecture: {
    description:
      "Understanding organizational and architectural interdependence (Conway's law), technical systemic dependencies, system design patterns, strategic planning, articulating strategic technical and business risk.",
    levels: {
      ASE: {
        summary: "",
        expectations: [
          "Can understand technical patterns and practices in place",
          "Not expected to contribute meaningfully to architectural patterns",
          "Shows understanding of basic engineering principles",
        ],
        indicators: [
          "Is able to sketch an architecture diagram of their stack covering major boxes & lines (e.g. FE => ... => Database)",
          "Can describe the high level architecture of systems to a new employee",
        ],
      },
      SEI: {
        summary:
          "Isn't spending a ton of time establishing patterns, but follows them well and can interpolate them to new scenarios.",
        expectations: [
          "Follows the established pattern when one exists",
          "Can take an established pattern and massage it to fit a new situation and call out when there is tension between the pattern and the problem space",
          "Understands the role and function of the majority of tools and technologies in their product ecosystem",
        ],
        indicators: [
          "Puts together an architecture diagram with the major boxes and lines and annotates with subsystem function",
          "Proposes a tweak to an established pattern or library to make it better suited to more situations, makes the change, and socializes the results",
        ],
      },
      SEII: {
        summary:
          "Doesn't necessarily need to make decisions about major infrastructure elements. Should write code that does what it says and says what it does — self-documenting and without unintended side effects.",
        expectations: [
          "Can put together a credible API, build a reusable component, and put together coherent IaC",
          "Writes code in their core languages that not only works, but is idiomatically sound and well structured",
          "Understands the basic workflow of our systems and could draw them out at a high level",
          "Understands architectural design patterns and uses them appropriately",
        ],
        indicators: [
          "Has built at least one component or service that is used compositionally by multiple consumers",
          "Has demonstrated on multiple occasions that they know how to prevent circular transitive or reciprocal dependencies with design patterns like subscribe/notify",
          "Has built some fit-for-purpose terraform to spin up some infra fast. Has refactored it to be clear, safe, and extensible",
          "Suggests new patterns or improvements to existing ones",
        ],
      },
      SSEI: {
        summary:
          "Whether in delivering infrastructure, UI, service tier, or across multiple layers, should make smart choices about structure and organization that leave room for evolution.",
        expectations: [
          "Can choose the right tool or pattern for the job",
          "Understands when a decision is an expensive one or cheap one to change",
          "Designs systems that are simple but scale to meet an expanding customer base",
          "Creates extensible software that meets the changing needs of the product",
          "Understands when research is sufficient or when conversations are required",
        ],
        indicators: [
          "Understands and can describe how the system functions at a high level and how multiple major architecture components work at a detail level",
          "Can redesign and refactor key portions of the stack",
          "Can propose new pragmatic designs and defend those with senior peers",
          "Can describe how major system components could be built differently and explain tradeoffs",
          "Creates a new sub-system from the ground up, making decisions about major components, infrastructure, and third party services",
        ],
      },
      SSEII: {
        summary: "",
        expectations: [
          "Can lead a team in handling major changes to a system with minimal disruption",
          "Knows when to make architectural decisions (for example, to maintain project momentum) and when to delay to gather information",
        ],
        indicators: [
          "Understands and can describe how the system functions at a high level and how multiple major architecture components work at a detail level",
          "Can redesign and refactor key portions of the stack",
          "Can propose new pragmatic designs and defend those with senior peers",
          "Can describe how major system components could be built differently and explain tradeoffs",
          "Creates a new sub-system from the ground up, making decisions about major components, infrastructure, and third party services",
        ],
      },
      Staff: {
        summary:
          "Beyond best practices. Beyond 'last responsible moment.' Can identify when that moment is, or at least knows how to de-risk a decision before it is made.",
        expectations: [
          "Can comfortably architect solutions across most if not all of the application and infrastructure stack",
          "Can choose the right tool or pattern for today's concrete needs that de-risks tomorrow's less well understood decisions",
          "Has developed a good set of heuristics for making choices despite imperfect information",
          "Can design a system that provides well considered layers of abstraction so each component can be easily understood, even if the system is too complex to understand in detail as a whole",
        ],
        indicators: [
          "Evaluates and introduces a broadly impactful technical approach or piece of infrastructure that the team feels comfortable operating",
          "Makes a smart, but potentially counter-intuitive choice to go with an expensive SaaS product based on a sound evaluation of engineering cost of the alternatives",
          "Designs a major service that, when the underlying technology changes, has minimal impact on other parts of the system",
        ],
      },
    },
  },
  Operations: {
    description:
      "Incident Commander skill, Technical Lead skill, operational technology (Docker, Linux, Terraform, etc.), deployment pipeline, AuthN/AuthZ technology, observability tools (Datadog, Sentry, Grafana, etc.).",
    levels: {
      ASE: {
        summary: "",
        expectations: [
          "Not expected to display any expertise in network or system operations",
          "Can start and stop their docker environment",
          "Can find their log files and read them; needs help from more senior engineers to fully understand/troubleshoot",
          "Is able to read and understand monitoring and error logging tools such as DataDog and Sentry",
        ],
        indicators: [
          "Updates bug tickets with pertinent information gathered from monitoring tools like Datadog and Sentry",
          "Knows when and how to restart their local Docker development environment (if applicable)",
          "Can effectively pair with a more senior developer to help solve a problem, and not rely completely on the senior developers for resolution",
          "Can determine when a story or task has met the definition of done",
          "Can successfully write unit tests as well as functional code",
        ],
      },
      SEI: {
        summary:
          "On the way in the door, might not have much operational experience but they're willing to take it on and have at least basic knowledge of standard runtime components.",
        expectations: [
          "Can find their way around a linux box",
          "Have at least some knowledge of using containerized development environments",
          "Can put together a simple script to automate a simple task",
          "Able and willing to participate in on-call activities and can handle simple incident scenarios",
          "Familiar with and can explain the development lifecycle from PR into Github through deployment",
          "Can jump in and IC or TL an incident when called upon to do so",
          "When instrumenting code, knows when to use different kinds of telemetry (eg, logs, traces, metrics, alerts, etc.)",
        ],
        indicators: [
          "Regularly jumps into a container running locally or on staging to see what's going on",
          "Quickly diagnoses a problem using APM or log management",
          "Handles an incident caused by a bad commit and reverts it, mitigating the incident quickly",
          "Can triage a reported bug and provide a suggested solution for review by the team",
          "Automates common support tasks to reduce toil",
        ],
      },
      SEII: {
        summary:
          "Knows the basics of being on-call and running an incident, both as an IC and a TL. May be more Dev than Ops, but can handle themselves.",
        expectations: [
          "Can put together a dashboard and an alert based on standard engineering approaches",
          "Has TL'd and IC'd for a number of incidents. Is clear and efficient under incident conditions",
          "Has reached a level of comfort, if not expertise, with basic IT tools and techniques",
        ],
        indicators: [
          "On multiple occasions creates and maintains basic infrastructure using Terraform, Python, and other typical infra automation tools",
          "Has facilitated an incident training session or gameday",
          "Delivers a service to production with sufficient instrumentation (Datadog, Sentry, etc.) to understand when it's failing",
          "Achieves a balance with alerts, making them useful but not overly noisy",
          "Uses instrumentation to analyze and address code quality issues",
        ],
      },
      SSEI: {
        summary:
          "Should have an expert understanding of monitoring, alerting and diagnosing.",
        expectations: [
          "Understands and can operate the components of an observability stack in general and our platform in particular",
          "Can handle on-call rotation along with the rest of engineering and is able to efficiently diagnose and mitigate problems that arise",
          "Is generally comfortable with how to instrument systems and create dashboards and alerts to make that instrumentation informative",
        ],
        indicators: [
          "Volunteers to take on-call duty when a teammate is overwhelmed",
          "Is relied upon for troubleshooting and quick solutioning when incidents occur",
          "Spearheads tool automation efforts at least a couple times a year to reduce toil and risk",
          "Provides insights when there is an incident or recurring operational problem that leads to resolution",
          "Contributes to Engineering's on-call process to make the system less burdensome and more efficient",
          "Introduces new techniques and capabilities in instrumenting and monitoring",
        ],
      },
      SSEII: {
        summary:
          "Should have the fundamentals of monitoring, alerting, diagnosing, and mitigating problems in the field.",
        expectations: [
          "Understands and can operate the components of an observability stack in general and our platform in particular",
          "Can handle on-call rotation along with the rest of engineering and is able to efficiently diagnose and mitigate problems that arise",
          "Is generally comfortable with how to instrument systems and create dashboards and alerts to make that instrumentation informative",
        ],
        indicators: [
          "Volunteers to take on-call duty when a teammate is overwhelmed",
          "Is relied upon for troubleshooting and quick solutioning when incidents occur",
          "Spearheads tool automation efforts at least a couple times a year to reduce toil and risk",
          "Provides insights when there is an incident or recurring operational problem that leads to resolution",
          "Contributes to Engineering's on-call process to make the system less burdensome and more efficient",
        ],
      },
      Staff: {
        summary:
          "Understands that while nothing is certain, there are good investments that can reduce operational risk. When bad things do happen, they keep a level head and a steady hand.",
        expectations: [
          "Leads engineering to new patterns of monitoring and alerting that make demonstrable impact on reliability and toil reduction",
          "Knows a range of approaches to running software and can articulate the right one (or combination) for an organization in various stages of maturity",
          "Can serve as an Incident Response coordinator even if they don't understand the technical details",
          "Can teach others how to do the same",
        ],
        indicators: [
          "Runs a gameday that identifies gaps in alerting and IR process",
          "During an incident, provides structure to a struggling IR effort that leads to its efficient resolution by the team",
          "Improves the Engineering operational strategy and contributes to its evolution as the product scales and team grows",
          "Runs a blameless retro that results in improvement of the product and the IC process",
        ],
      },
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcAssessedLevel(checked, skillName) {
  const skillData = SKILLS_DATA[skillName];
  let assessedIdx = -1;
  for (let i = 0; i < LEVELS.length; i++) {
    const level = LEVELS[i];
    const indicators = skillData.levels[level].indicators;
    if (indicators.length === 0) continue;
    const key = `${skillName}::${level}`;
    const checkedSet = checked[key] || {};
    const checkedCount = Object.values(checkedSet).filter(Boolean).length;
    const ratio = checkedCount / indicators.length;
    if (ratio >= 0.5) {
      assessedIdx = i;
    }
  }
  return assessedIdx >= 0 ? LEVELS[assessedIdx] : null;
}

function getProgress(checked, skillName, level) {
  const indicators = SKILLS_DATA[skillName].levels[level].indicators;
  const key = `${skillName}::${level}`;
  const checkedSet = checked[key] || {};
  const count = Object.values(checkedSet).filter(Boolean).length;
  return { count, total: indicators.length };
}

// ─── Components ──────────────────────────────────────────────────────────────

function RadarOverview({ assessedLevels }) {
  const data = SKILL_NAMES.map((skill) => ({
    skill,
    level: assessedLevels[skill] ? LEVEL_INDEX[assessedLevels[skill]] + 1 : 0,
    fullMark: 6,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const levelName = d.level > 0 ? LEVELS[d.level - 1] : "Not assessed";
      return (
        <div className="bg-white border border-gray-200 shadow-sm rounded px-3 py-2 text-sm">
          <p className="font-medium text-gray-900">{d.skill}</p>
          <p className="text-gray-600">{levelName}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: 420, height: 300 }}>
        <ResponsiveContainer>
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "#374151", fontSize: 13, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 6]}
              tickCount={7}
              tick={false}
              axisLine={false}
            />
            <Radar
              dataKey="level"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ r: 4, fill: "#2563eb" }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {SKILL_NAMES.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm"
            style={{
              borderColor: assessedLevels[skill]
                ? SKILL_COLORS[skill]
                : "#d1d5db",
              background: assessedLevels[skill]
                ? `${SKILL_COLORS[skill]}08`
                : "#f9fafb",
            }}
          >
            <span>{SKILL_ICONS[skill]}</span>
            <span className="font-medium text-gray-700">{skill}:</span>
            <span
              className="font-semibold"
              style={{
                color: assessedLevels[skill] ? SKILL_COLORS[skill] : "#9ca3af",
              }}
            >
              {assessedLevels[skill] || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillTabs({ selected, onSelect }) {
  return (
    <div className="flex border-b border-gray-200 overflow-x-auto">
      {SKILL_NAMES.map((skill) => (
        <button
          key={skill}
          onClick={() => onSelect(skill)}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
            selected === skill
              ? "border-current text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          style={selected === skill ? { color: SKILL_COLORS[skill] } : {}}
        >
          <span className="mr-1.5">{SKILL_ICONS[skill]}</span>
          {skill}
        </button>
      ))}
    </div>
  );
}

function LevelCard({
  skillName,
  level,
  checked,
  onToggle,
  isAssessed,
  progress,
  expanded,
  onToggleExpand,
}) {
  const data = SKILLS_DATA[skillName].levels[level];
  const pct =
    progress.total > 0
      ? Math.round((progress.count / progress.total) * 100)
      : 0;

  return (
    <div
      className={`border rounded-lg transition-all ${
        isAssessed
          ? "border-blue-300 bg-blue-50/30 shadow-sm"
          : "border-gray-200 bg-white"
      }`}
    >
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded text-xs font-bold ${
              isAssessed
                ? "bg-blue-600 text-white"
                : progress.count > 0
                ? "bg-gray-200 text-gray-700"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {LEVEL_INDEX[level] + 1}
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-sm">
              {level}
            </span>
            <span className="text-gray-500 text-sm ml-2">
              {LEVEL_LABELS[level]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isAssessed ? "#2563eb" : "#9ca3af",
                }}
              />
            </div>
            <span className="text-xs text-gray-500 w-16 text-right">
              {progress.count}/{progress.total} met
            </span>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {data.summary && (
            <p className="text-sm text-gray-600 italic mt-3 mb-3 leading-relaxed">
              {data.summary}
            </p>
          )}

          {data.expectations.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Expectations
              </h4>
              <ul className="space-y-1.5">
                {data.expectations.map((exp, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-700 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-400"
                  >
                    {exp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.indicators.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Indicators — check the ones you're meeting
              </h4>
              <ul className="space-y-1">
                {data.indicators.map((ind, i) => {
                  const key = `${skillName}::${level}`;
                  const isChecked = !!(checked[key] && checked[key][i]);
                  return (
                    <li key={i}>
                      <label className="flex items-start gap-2.5 py-1.5 px-2 rounded hover:bg-gray-50 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggle(skillName, level, i)}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span
                          className={`text-sm leading-relaxed transition-colors ${
                            isChecked
                              ? "text-gray-900"
                              : "text-gray-600 group-hover:text-gray-800"
                          }`}
                        >
                          {ind}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SkillDetail({ skillName, checked, onToggle }) {
  const [expandedLevels, setExpandedLevels] = useState(() => {
    const initial = {};
    LEVELS.forEach((l) => (initial[l] = true));
    return initial;
  });

  const toggleExpand = useCallback(
    (level) => {
      setExpandedLevels((prev) => ({ ...prev, [level]: !prev[level] }));
    },
    []
  );

  const assessedLevel = calcAssessedLevel(checked, skillName);

  return (
    <div className="py-4 px-1">
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        {SKILLS_DATA[skillName].description}
      </p>
      <div className="space-y-2">
        {LEVELS.map((level) => {
          const progress = getProgress(checked, skillName, level);
          return (
            <LevelCard
              key={level}
              skillName={skillName}
              level={level}
              checked={checked}
              onToggle={onToggle}
              isAssessed={level === assessedLevel}
              progress={progress}
              expanded={!!expandedLevels[level]}
              onToggleExpand={() => toggleExpand(level)}
            />
          );
        })}
      </div>
    </div>
  );
}

function PrintSummary({ assessedLevels, checked, engineerName }) {
  return (
    <div className="hidden print:block p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Engineering Self-Assessment
      </h1>
      {engineerName && (
        <p className="text-lg text-gray-700 mb-4">{engineerName}</p>
      )}
      <p className="text-sm text-gray-500 mb-6">
        Generated {new Date().toLocaleDateString()}
      </p>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Summary</h2>
        <div className="grid grid-cols-3 gap-3">
          {SKILL_NAMES.map((skill) => (
            <div key={skill} className="border rounded p-3">
              <div className="text-sm text-gray-500">{skill}</div>
              <div className="text-lg font-bold">
                {assessedLevels[skill] || "—"}
              </div>
              {assessedLevels[skill] && (
                <div className="text-xs text-gray-400">
                  {LEVEL_LABELS[assessedLevels[skill]]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {SKILL_NAMES.map((skill) => (
        <div key={skill} className="mb-6 break-inside-avoid">
          <h2 className="text-base font-semibold mb-2 text-gray-800">
            {SKILL_ICONS[skill]} {skill}
            {assessedLevels[skill] && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                — Assessed at {assessedLevels[skill]}
              </span>
            )}
          </h2>
          {LEVELS.map((level) => {
            const prog = getProgress(checked, skill, level);
            if (prog.count === 0) return null;
            return (
              <div key={level} className="ml-4 mb-2">
                <div className="text-sm font-medium text-gray-700">
                  {level}{" "}
                  <span className="text-gray-400">
                    ({prog.count}/{prog.total})
                  </span>
                </div>
                <ul className="ml-4 text-sm text-gray-600">
                  {SKILLS_DATA[skill].levels[level].indicators.map((ind, i) => {
                    const key = `${skill}::${level}`;
                    if (checked[key] && checked[key][i]) {
                      return (
                        <li key={i} className="flex gap-1">
                          <span>✓</span> {ind}
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [checked, setChecked] = useState({});
  const [selectedSkill, setSelectedSkill] = useState("Depth");
  const [engineerName, setEngineerName] = useState("");
  const [showPrintHint, setShowPrintHint] = useState(false);

  const handleToggle = useCallback((skillName, level, indicatorIdx) => {
    setChecked((prev) => {
      const key = `${skillName}::${level}`;
      const existing = prev[key] || {};
      return {
        ...prev,
        [key]: {
          ...existing,
          [indicatorIdx]: !existing[indicatorIdx],
        },
      };
    });
  }, []);

  const assessedLevels = useMemo(() => {
    const result = {};
    SKILL_NAMES.forEach((skill) => {
      result[skill] = calcAssessedLevel(checked, skill);
    });
    return result;
  }, [checked]);

  const handlePrint = () => {
    setShowPrintHint(true);
    setTimeout(() => {
      window.print();
      setShowPrintHint(false);
    }, 100);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all checked indicators? This cannot be undone."
      )
    ) {
      setChecked({});
    }
  };

  const totalChecked = Object.values(checked).reduce(
    (sum, levelChecked) =>
      sum + Object.values(levelChecked).filter(Boolean).length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print view */}
      <PrintSummary
        assessedLevels={assessedLevels}
        checked={checked}
        engineerName={engineerName}
      />

      {/* Screen view */}
      <div className="print:hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Engineering Expectations & Indicators
                </h1>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">
                  Review each skill area, check indicators you're meeting, and see your
                  assessed level. Your level is the highest where you meet at
                  least half the indicators.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Your name"
                  value={engineerName}
                  onChange={(e) => setEngineerName(e.target.value)}
                  className="text-sm border border-gray-200 rounded px-3 py-1.5 w-40 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handlePrint}
                  className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-800 transition-colors"
                >
                  Export PDF
                </button>
                {totalChecked > 0 && (
                  <button
                    onClick={handleReset}
                    className="text-sm text-gray-400 hover:text-red-500 px-2 py-1.5 transition-colors"
                    title="Reset all"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Radar */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          <RadarOverview assessedLevels={assessedLevels} />
        </div>

        {/* Skill tabs + detail */}
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <SkillTabs selected={selectedSkill} onSelect={setSelectedSkill} />
            <div className="px-4">
              <SkillDetail
                key={selectedSkill}
                skillName={selectedSkill}
                checked={checked}
                onToggle={handleToggle}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-5xl mx-auto px-4 pb-8 text-center">
          <p className="text-xs text-gray-400">
            Based on the Expectations & Indicators framework. State is held in memory only — nothing is saved externally.
          </p>
        </div>
      </div>
    </div>
  );
}
