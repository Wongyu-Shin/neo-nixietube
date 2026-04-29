# Reflexion — `<slug>` (Loop NNN)

> After every **discarded** iteration, append a short reflection on
> *why* the change failed. Phase 1 of the next iteration reads the last
> N reflections alongside `git log`. Persists *why-it-didn't-work* —
> the signal commit messages compress away.
>
> Source: `harness/features/reflexion.md`,
> `harness/research/reflexion.md`.

## Format

```markdown
### iter N · <commit-hash> · <discarded|crashed|hook-blocked>

**What I tried.** <1 sentence>

**What broke.** <1 sentence — concrete failure: assertion, regex miss,
metric regression, guard fail, etc.>

**Lesson.** <1 sentence — what to NOT try again, or what to try
differently. Avoid generalities.>
```

## Entries

<!-- Newest first. Keep short — one paragraph per entry. -->
