# c2profiler

Progressive web app for building, editing and reviewing malleable C2 profiles, written in TypeScript and built atop of ReactJS.
Available on Github pages: [https://molatho.github.io/c2profiler/](https://molatho.github.io/c2profiler/).

## Install
Requires NodeJS 18+

```bash
git clone https://githubcom/molatho/c2profiler
cd c2profiler
npm install
# (Optionally) build Peggy parsers
npm install -g peggy
peggy src/Plugins/HTTP/http-grammar.pegjs -o src/Plugins/HTTP/httpparser/index.js --format es
peggy src/Plugins/CobaltStrike/cs-grammar.pegjs -o src/Plugins/CobaltStrike/csparser/index.js --format es
```

# License
This application is licensed under [AGPLv3](https://choosealicense.com/licenses/agpl-3.0/), a copy of the exact license can be found in the [LICENSE](LICENSE) file. This license is extended in the [LICENSE_ADDENDUM](LICENSE_ADDENDUM) file.

# References
* Cobalt Strike - User Guide ([C&C](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2_main.htm), [Post-Ex](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2-extend_main.htm))
* Cobalt Strike - Reference Profile ([Github](https://github.com/Cobalt-Strike/Malleable-C2-Profiles/blob/master/normal/reference.profile))
* bigb0sss - Reference Profile ([Github](https://bigb0sss.github.io/posts/redteam-cobalt-strike-malleable-profile/))