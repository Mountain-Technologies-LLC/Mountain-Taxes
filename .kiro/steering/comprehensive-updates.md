# Comprehensive Update Requirements

## Overview
This steering document establishes the requirement that any changes or updates to the Mountain Taxes Calculator repository must include comprehensive updates across all related components to maintain consistency and quality.

## Update Requirements

### When making ANY changes to the codebase, you MUST:

#### 1. Code Updates
- Update all affected source files in `website/src/`
- Ensure TypeScript types are updated in `website/src/types.ts` if data structures change
- Update related components that depend on modified functionality
- Maintain consistent coding patterns and style across the codebase

#### 2. Test Updates
- Update or create corresponding unit tests in `website/tests/`
- Ensure all existing tests pass after changes
- Add new test cases for new functionality
- Update integration tests if cross-component behavior changes
- Maintain test coverage for all modified code paths

#### 3. Documentation Updates
- Update README.md files at both root and website levels
- Update inline code comments and JSDoc documentation
- Update any relevant specification documents in `.kiro/specs/`
- Update INTEGRATION_SUMMARY.md if integration points change
- Update any architectural or design documentation

#### 4. Infrastructure Updates (if applicable)
- Update CDK infrastructure code in `infrastructure/src/` if deployment requirements change
- Update build scripts and deployment configurations
- Update environment-specific configurations

## Validation Checklist

Before considering any change complete, verify:

- [ ] All tests pass (`npm test` in website directory)
- [ ] TypeScript compilation succeeds (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Documentation accurately reflects the current state
- [ ] Integration tests cover new functionality
- [ ] No breaking changes without proper migration path

## Quality Standards

- Maintain consistent code style and patterns
- Ensure accessibility compliance for UI changes
- Follow security best practices
- Maintain performance standards
- Keep dependencies up to date and secure

## Enforcement

This requirement applies to:
- Feature additions
- Bug fixes
- Refactoring
- Dependency updates
- Configuration changes
- Infrastructure modifications

**No change is considered complete until all related tests, documentation, and code are properly updated and validated.**