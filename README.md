# clojurejs

Clojure interpreter in modern JavaScript (ESM)

Live demo: https://bobbicodes.github.io/clojurejs/

## Rationale

Eventually this will become a Codemirror extension similar to [lang-clojure-eval](https://github.com/bobbicodes/lang-clojure-eval/) but much lighter weight because it removes the Clojurescript dependency. To be precise, we're looking at 440kB versus 2MB. Designed for powering teaching tools, not writing production software.

## Features

- ✅ Tail call optimization
- ✅ Immutable collections and swappable atoms like Clojure
- ✅ JavaScript interop
- ✅ Thread-first (`->`)
- ✅ Thread-last (`->>`)
- ✅ Anonymous function shorthand eg. `#(inc %)`
- ✅ Macros

## Dev

```
npm install
npm run dev
```

## Build

```
npm run build
npm run preview
```

## Credits

Borrows heavily from these two implementations, but simplified and updated to work with modern JavaScript tooling.

- [Mal (Make A Lisp)](https://github.com/kanaka/mal)
- [clojurejs](https://github.com/gnab/clojurejs)
