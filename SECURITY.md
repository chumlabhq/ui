# Security policy

## Reporting a vulnerability

Email **hello@chumlab.com**. Please do not open a public issue for a security report.

Include what you need to describe the problem — the affected version, what an attacker can
do, and the smallest reproduction you have. A proof of concept is welcome but not required.

You should get an acknowledgement within a few days. If you do not hear back, assume the
mail went astray and send it again rather than assuming it was ignored.

## Supported versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |

`@chumlab/ui` is pre-1.0 and there is one release line. Fixes land on the latest version;
there are no backports.

## Scope

This is a browser component library. It has no server, no network calls of its own, and
stores nothing. The realistic issue classes are:

- **Injection through a prop.** Anywhere a caller-supplied string reaches the DOM as
  markup rather than text.
- **A dependency advisory** reaching consumers through this package's dependency tree
  (`clsx`, `tailwind-merge`, `libphonenumber-js`).
- **Focus or overlay behaviour** that lets an element outside a modal be reached or
  activated while it is open — a clickjacking-shaped problem rather than a memory-safety
  one.

Reports about how a consuming application uses the library, rather than about the library
itself, are better sent to that application's maintainers.
