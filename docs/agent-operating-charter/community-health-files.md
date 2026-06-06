## Community Health Files

### Purpose

- GitHub community health files define repository-facing standards, support routes, funding links, and decision
  expectations.
- Keep these files under `.github` when they primarily exist for GitHub repository surfaces rather than product
  documentation.
- Keep `README.md` and `LICENSE` in the repository root. `LICENSE` must stay repository-local so it is included when the
  project is cloned.

### File Responsibilities

- `CODE_OF_CONDUCT.md` defines expected human behavior in the project community.
- `CONTRIBUTING.md` defines the contribution posture and contributor-facing expectations.
- `SECURITY.md` defines the private vulnerability disclosure route.
- `SUPPORT.md` defines where users should ask for help, open issues, or start discussions.
- `GOVERNANCE.md` defines how project decisions are made and how influence is earned.
- `FUNDING.yml` defines Sponsor button funding targets.

### GitHub Surfaces

- `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, and `SECURITY.md` are surfaced prominently in GitHub repository UI and
  community standards flows.
- `SUPPORT.md` is surfaced in the new-issue flow as a support resource, not as a prominent repository sidebar link.
- `GOVERNANCE.md` is recognized as a supported community health file, but GitHub does not currently expose it as a
  prominent repository UI link. Link it from `README.md` when it should be discoverable.
- `FUNDING.yml` must live at `.github/FUNDING.yml`; the repository's Sponsor button also requires the GitHub repository
  `Sponsorships` feature to be enabled.

### README Links

- Include a `Community Standards` block in `README.md` when the repository has community health files that are not all
  obvious from GitHub UI.
- For published package READMEs that render on npm, GitHub Packages, and other external surfaces, use absolute
  `https://github.com/.../blob/HEAD/...` links.
- For local consumer/application READMEs that are only intended for GitHub and IDE navigation, keep links relative to
  preserve repository-local navigation.

### Funding Format

- Funding platform entries such as `buy_me_a_coffee` and `ko_fi` take platform usernames, not full URLs.
- Use `custom` for full donation URLs such as project donation pages or Boosty links; GitHub supports up to four custom
  URLs.
- Quote full custom URLs in YAML because `https://` contains a colon.

### Naming

- Use clear document headings such as `Code of Conduct`, `Contributing Guidelines`, `Security Policy`, `Support`, and
  `Governance`.
- Do not label a code of conduct as `Contributor Covenant` unless the repository uses the actual Contributor Covenant
  text.
