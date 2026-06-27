export const differentiators = [
  {
    id: 'goap',
    title: 'GOAP Multi-Agent Planning',
    icon: 'bi-diagram-3',
    description: 'Embabel-integrated Goal-Oriented Action Planning. A* search produces deterministic action sequences with automatic parallelism. Not a chain-of-prompts trick — a real planner.',
  },
  {
    id: 'multi-tenancy',
    title: 'Framework-Level Multi-Tenancy',
    icon: 'bi-building',
    description: 'JWT-based tenant isolation built into the core. Per-tenant sessions, memory, skills, and billing — without bolting it on per service.',
  },
  {
    id: 'mcp-host',
    title: 'MCP Server Hosting',
    icon: 'bi-plug',
    description: 'Expose your tools to Claude Desktop, Cursor, and any MCP client out of the box. Dedicated MCP servers for Discord, Slack, and cross-channel messaging.',
  },
  {
    id: 'channels',
    title: '11 First-Party Channel Adapters',
    icon: 'bi-chat-dots',
    description: 'Telegram, Slack, Discord, Email, SMS, Signal, Teams, WhatsApp, Google Chat, LINE, Matrix — every one with local dev mode and no public endpoint required.',
  },
  {
    id: 'billing',
    title: 'Built-In Subscription Billing',
    icon: 'bi-credit-card',
    description: 'Stripe, PayPal, and Telegram Payments are wired into the framework with subscription lifecycle and feature-grant access control. Ship a SaaS bot, not a demo.',
  },
];

export const comparisons = [
  {
    id: 'spring-ai',
    title: 'JaiClaw vs Spring AI alone',
    summary: 'Spring AI gives you LLM client abstractions and chat memory. JaiClaw is what you build on top of Spring AI to ship a real product.',
    bullets: [
      'Spring AI: chat client, vector store, advisors. No channels, no tools registry, no multi-tenancy, no billing.',
      'JaiClaw: all of Spring AI plus channels, 38+ tools, a bundled skills library, GOAP planning, multi-tenancy, MCP hosting, billing, voice.',
      'You still use Spring AI under the hood — JaiClaw makes Spring AI assistants production-ready.',
    ],
  },
  {
    id: 'langchain4j',
    title: 'JaiClaw vs LangChain4j',
    summary: 'LangChain4j is a port of LangChain primitives to Java. JaiClaw is opinionated Spring Boot infrastructure for shipping AI assistants.',
    bullets: [
      'LangChain4j: low-level primitives — chains, agents, tools. You assemble everything yourself.',
      'JaiClaw: opinionated end-to-end — channels, skills, multi-tenancy, billing, observability, and deployment all wired up.',
      'Choose LangChain4j for maximum flexibility. Choose JaiClaw when you want to ship.',
    ],
  },
  {
    id: 'embabel',
    title: 'JaiClaw vs Embabel alone',
    summary: 'Embabel is a brilliant GOAP planner. JaiClaw embeds it and surrounds it with everything else you need.',
    bullets: [
      'Embabel: the @Agent / @Action / @AchievesGoal model with A* planning.',
      'JaiClaw: bundles Embabel and adds channels, tools, skills, memory, compaction, multi-tenancy, and billing on top.',
      'You can use Embabel directly — JaiClaw makes it productive in a Spring Boot service.',
    ],
  },
  {
    id: 'roll-your-own',
    title: 'JaiClaw vs roll-your-own',
    summary: 'You can build all this from scratch. You probably should not.',
    bullets: [
      'Roll-your-own: 6–12 months wiring channels, tool runtimes, memory, multi-tenancy, billing, observability, and an MCP server before your first feature.',
      'JaiClaw: import a starter and ship a working assistant the same day, then customize what you actually need.',
      'When you do need to swap a layer, the SPIs are explicit and Spring Boot makes substitution clean.',
    ],
  },
];

export const whenNotToChoose = {
  title: 'When to choose something else',
  description: 'JaiClaw is opinionated. Here is when those opinions get in your way:',
  cases: [
    {
      label: 'You are not on the JVM',
      detail: 'JaiClaw is Java 21 + Spring Boot 3.5.15 + Spring AI 1.1.7. If you are committed to Python, Node, or Go, use the native ecosystem.',
    },
    {
      label: 'You need full custom control over LLM orchestration',
      detail: 'LangChain4j or raw Spring AI give you finer-grained primitives. JaiClaw trades some flexibility for productivity.',
    },
    {
      label: 'You only need a single-tenant prototype',
      detail: 'The multi-tenancy and billing layers are valuable for production but overhead for a weekend prototype. Spring AI alone may be enough.',
    },
    {
      label: 'You do not need messaging channels',
      detail: 'If your assistant is purely API-backed, the channel adapter surface is wasted footprint. JaiClaw is still usable but less of an unlock.',
    },
  ],
};
