# .ai/01_STANDARDS/SECURITY.md


Version: 2.0.0

# Purpose

Security is a platform-wide responsibility.

Every implementation must protect customer data, credentials, and infrastructure.

Security is designed into the architecture rather than added later.

# Secrets

Never commit:

- API keys

- passwords

- access tokens

- certificates

- private keys

Secrets must be loaded through the platform's secret management mechanism.

# Authentication

Authentication occurs only at defined system boundaries.

Services trust validated identity rather than re-authenticating requests internally.

# Authorization

Every protected action requires explicit authorization.

Examples:

- connector execution

- connector configuration

- administrative actions

- report deletion

Authorization checks belong in the Application Platform.

# Input Validation

Never trust external input.

Validate:

- API requests

- connector payloads

- uploaded files

- AI outputs

Validation occurs before persistence or business processing.

# Dependency Security

All dependencies must:

- be version pinned

- be scanned for vulnerabilities

- receive regular updates

Critical vulnerabilities block releases until addressed.

# AI Security

Never:

- expose secrets in prompts

- send unnecessary personal data to providers

- rely on AI for authorization decisions

Prompt inputs should contain only the minimum data required for the workflow.

# Secure Development Checklist

Every feature must verify:

✓ authentication

✓ authorization

✓ input validation

✓ output sanitization

✓ secret handling

✓ dependency review

✓ audit logging where appropriate

# Definition of Secure

A feature is secure when:

- credentials remain protected

- inputs are validated

- outputs are safe

- permissions are enforced

- secrets are externalized

- dependencies are current

- security tests pass
