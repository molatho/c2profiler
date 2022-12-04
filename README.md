# c2profiler

Progressive web app for building & linting C2 profiles built in React JS.

## Install
```bash
git clone c2profiler
cd c2profiler
npm install
npm install -g peggy
# (Optionally) build Peggy parser
peggy src/Plugins/CobaltStrike/cs-grammar.pegjs -o src/Plugins/CobaltStrike/csparser/index.js --format es
```

# References
* Cobalt Strike - User Guide ([C&C](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2_main.htm), [Post-Ex](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2-extend_main.htm))
* Cobalt Strike - Reference Profile ([Github](https://github.com/Cobalt-Strike/Malleable-C2-Profiles/blob/master/normal/reference.profile))
* bigb0sss - Reference Profile ([Github](https://bigb0sss.github.io/posts/redteam-cobalt-strike-malleable-profile/))