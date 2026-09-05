# Versioning policy

`@chumlab/ui` follows [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).
This document says what counts as public API here, because the answer is wider than the
list of exported components — a `classes` key and a `data-` attribute are both things a
consumer writes CSS against, and breaking either breaks their build just as surely as
removing a prop would.

The `classes` half of this policy is [ADR 002][adr002] R7, published here rather than left
in an architecture record a consumer has no reason to read.

## What is public

- Every export from the package root and from a subpath (`@chumlab/ui/button`).
- Every prop on an exported component, and its type.
- Every key in a component's `classes` map.
- Every `data-` attribute a component renders.
- Every `--cl-*` design token, and the class names in `styles.css`.
- The `exports` map: which subpaths exist and what conditions they answer.

A sub-component the root does not export is not public, whatever its file layout suggests.
That is the test ADR 002's closeout used to settle which shimmers earned their own
documentation, and it is the same test here.

## Major

- Removing or renaming an export, a prop, or a `classes` key.
- **Renaming or removing a `classes` key** ([ADR 002][adr002] R7). A key is a CSS handle a
  consumer has already written against; changing its name breaks them silently, with no
  type error, because the map is not exhaustive.
- **Changing which element a `classes` key applies to** (R7). The name still resolves, so
  nothing fails — the styling just lands somewhere else, which is worse than a break.
- Removing a `data-` attribute or changing what state it represents.
- Removing a `--cl-*` token, or changing a token's name.
- Narrowing a prop's accepted type, or making an optional prop required.
- Raising the minimum React or Node version.
- Changing a component's default rendered element or its ARIA role.

## Minor

- **Adding a `classes` key** (R7). Additive by construction: the map is partial, so a new
  key changes nothing for a consumer who does not use it.
- Adding a component, an export, a prop, or a `data-` attribute.
- Adding a `--cl-*` token.
- Widening a prop's accepted type, or making a required prop optional.
- A visual change to a default that does not alter the DOM or the anatomy.

## Patch

- A fix that brings behaviour into line with the documented behaviour.
- A change with no effect on the rendered DOM, the anatomy, or the types.

## Before 1.0

[ADR 002][adr002] R7 sets the pre-1.0 rule and it still holds: **keys are renamed and
deleted freely, with no deprecation cycle.** Every key not present in an anatomy at 1.0 is
deleted rather than deprecated. The list above describes what happens from 1.0 onward.

In practice this means 0.x minor releases may contain any of the "major" changes above.
Pin an exact version if that matters to you.

## What holds the policy up

The vocabulary is not maintained by convention. `src/__tests__/contracts/` renders every
key in every anatomy (`fixtures.contract`), asserts one key per element
(`key-uniqueness.contract`), checks each key against its recorded source
(`key-source.contract`), and gates the `data-` attribute catalogue
(`state-attributes.contract`). A key that stopped being rendered, or an attribute that
quietly changed meaning, fails a test rather than reaching a release.

[adr002]: https://github.com/chumlabhq/ui/blob/main/docs/adr/002-classes-key-vocabulary.md

<!-- Absolute, not relative: `docs/` is not in the package `files`, and a relative link
     here would 404 for anyone reading this on npm. That is the mistake ACCESSIBILITY.md
     made in reverse — the README linked to a file the tarball did not carry. -->
