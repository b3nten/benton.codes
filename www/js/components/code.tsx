import { attribute, css, effect, h, Ivysaur, state } from "blackberry.js";
import { highlightText, type ShjLanguage,  } from "@speed-highlight/core";

export class CodeBlock extends Ivysaur {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid grey !important;
    }

    pre {
      display: block;
      margin: 0;
      padding: 0.25rem;
      overflow: scroll;
      height: 100%;
      max-height: 100%;
      font-size: 1rem;
    }

    #title {
      padding: 0.25rem;
      border-bottom: 1px solid grey;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1rem;

      & > p {
        margin: 0;
      }

      & > button {
        width: 3rem;
        height: 1.5rem;
        padding: 0.25rem;
        background: none;
        border: none;
        color: grey;
        text-style: underline;
        transition: 0.15s;
        border: 1px solid transparent;

        &:hover {
          border: 1px solid grey;
          border-radius: 5px;
        }
      }
    }

    [class*="shj-lang-"] {
      white-space: pre;
      color: var(--text-color);
      box-sizing: border-box;
      border-radius: 10px;
      max-width: min(100%, 100vw);
      font:
        1rem OverpassMono,
        monospace;
    }

    .shj-inline {
      border-radius: 5px;
      margin: 0;
      display: inline-block;
    }

    [class*="shj-lang-"]::selection {
      background: #bdf5;
    }

    [class*="shj-lang-"] ::selection {
      background: #bdf5;
    }

    [class*="shj-lang-"] > div {
      display: flex;
      overflow: auto;
    }

    [class*="shj-lang-"] > div :last-child {
      outline: none;
      flex: 1;
    }

    .shj-numbers {
      counter-reset: line;
      padding-left: 5px;
    }

    .shj-numbers div {
      padding-right: 5px;
    }

    .shj-numbers div:before {
      color: #999;
      content: counter(line);
      opacity: 0.5;
      text-align: right;
      counter-increment: line;
      margin-right: 5px;
      display: block;
    }

    .shj-syn-cmnt {
      font-style: italic;
    }

    /* Light Mode (Rosé Pine Dawn) */
    .shj-syn-err,
    .shj-syn-kwd {
      color: #b4637a; /* Rose */
    }

    .shj-syn-num,
    .shj-syn-class {
      color: #ea9d34; /* Gold */
    }

    .shj-numbers,
    .shj-syn-cmnt {
      color: #797593; /* Muted */
    }

    .shj-syn-insert,
    .shj-syn-str {
      color: #286983; /* Pine */
    }

    .shj-syn-bool {
      color: #d7827e; /* Coral */
    }

    .shj-syn-type,
    .shj-syn-oper {
      color: #907aa9; /* Iris */
    }

    .shj-syn-section,
    .shj-syn-func {
      color: #56949f; /* Foam */
    }

    .shj-syn-deleted,
    .shj-syn-var {
      color: #d7827e; /* Coral */
    }

    /* Dark Mode (Rosé Pine Main) */
    @media (prefers-color-scheme: dark) {
      .shj-syn-err,
      .shj-syn-kwd {
        color: #eb6f92; /* Rose */
        text-shadow: 0 0 8px rgba(235, 111, 146, 0.25);
      }

      .shj-syn-num,
      .shj-syn-class {
        color: #f6c177; /* Gold */
        text-shadow: 0 0 8px rgba(246, 193, 119, 0.25);
      }

      .shj-numbers,
      .shj-syn-cmnt {
        color: #908caa; /* Muted */
        text-shadow: 0 0 8px rgba(144, 140, 170, 0.2);
      }

      .shj-syn-insert,
      .shj-syn-str {
        color: #9ccfd8; /* Foam */
        text-shadow: 0 0 8px rgba(156, 207, 216, 0.25);
      }

      .shj-syn-bool {
        color: #ebbcba; /* Coral */
        text-shadow: 0 0 8px rgba(235, 188, 186, 0.25);
      }

      .shj-syn-type,
      .shj-syn-oper {
        color: #c4a7e7; /* Iris */
        text-shadow: 0 0 8px rgba(196, 167, 231, 0.25);
      }

      .shj-syn-section,
      .shj-syn-func {
        color: #31748f; /* Pine */
        text-shadow: 0 0 8px rgba(49, 116, 143, 0.25);
      }

      .shj-syn-deleted,
      .shj-syn-var {
        color: #ebbcba; /* Coral */
        text-shadow: 0 0 8px rgba(235, 188, 186, 0.25);
      }
    }

    .shj-oneline {
      padding: 12px 10px;
    }

    .shj-lang-http.shj-oneline .shj-syn-kwd {
      color: var(--text-color);
      background: #25f;
      border-radius: 5px;
      padding: 5px 7px;
    }
  `;

  @state() accessor code_el = { value: null };

  @attribute("max-height") get max_height(): string {
    return "500px";
  }

  @attribute("max-width") get max_width(): string {
    return "500px";
  }

  @attribute("title") get title(): string {
    return "code";
  }

  @attribute("language") get language(): ShjLanguage {
    return "js";
  }

  @attribute("code") get code(): string {
    return "wtf";
  }

  on_mount = () => {
    effect(() => {
      if(!this.code_el.value) return;

      const content = this.code.split("\n");
      if (content.length > 1) {
        content.shift();
      }
      let indent = 0;
      for (let i = 0; i < content[0].length; i++) {
        if (content[0][i] === "\t" || content[0][i] === " ") {
          indent++;
        } else {
          break;
        }
      }
      for (let i = 0; i < content.length; i++) {
        let char = 0;
        let str = content[i];
        while ((str[char] === "\t" || str[char] === " ") && char < indent) {
          content[i] = content[i].slice(1);
          char++;
        }
      }
      highlightText(content.join("\n"), this.language, true, {
        hideLineNumbers: true,
      }).then(x => {
        this.code_el.value.innerHTML = x;
      })
    })
  }

  on_copy() {
    navigator.clipboard.writeText(this.code);
  }

  render = () => (
    <host style={`max-height:${this.max_height}; max-width: ${this.max_width}`}>
      <div id="title">
        <p>{this.title}</p>
        <button onclick={this.on_copy}>copy</button>
      </div>
      <pre>
        <code ref={this.code_el}></code>
      </pre>
    </host>
  );
}

CodeBlock.define_self("code-block");
