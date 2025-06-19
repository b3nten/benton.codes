import init_blackberry, { attribute, Ivysaur } from "blackberry.js";
import "./components/code.tsx";
import { animate, stagger } from "motion";

init_blackberry();

class AnimateChildren extends Ivysaur {
  static light_dom = true;

  @attribute("on-mounted") get manual(): string | null {
    return null;
  }

  onMounted(): void {
    if (this.manual) {
      new Function("animate", "stagger", this.manual).call(
        this,
        animate,
        stagger,
      );
      return;
    }
  }
}

AnimateChildren.define_self("animate-children");

export class EncryptedText extends Ivysaur {
  static light_dom = true;

  static chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*+-?";
  static ignores = [
    " ",
    "\n",
    "\t",
    "\r",
    "\f",
    "\v",
    ",",
    ".",
    "!",
    "?",
    ":",
    ";",
    "'",
    '"',
    "`",
    "~",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "<",
    ">",
    "|",
    "\\",
    "/",
    "_",
    "-",
    "=",
    "+",
    "*",
    "&",
    "^",
    "%",
    "$",
    "#",
    "@",
    "!",
  ];
  static get_random_char = () =>
    EncryptedText.chars[Math.floor(Math.random() * EncryptedText.chars.length)];

  static {
    let rand = () => {
      setTimeout(
        () => {
          let els = Array.from(
            document.querySelectorAll("encrypted-text"),
          ).filter((e) => e.hasAttribute("hover"));
          let i = Math.floor(Math.random() * els.length);
          (els[i] as EncryptedText).animate_text(0.4);
          rand();
        },
        Math.random() * 2000 + 5000,
      );
    };
    rand();
  }

  @attribute("mount")
  get run_on_mount() {
    return false;
  }

  @attribute("hover")
  get run_on_hover() {
    return false;
  }

  text_content: string = "";

  encrypt = () => {
    let text = this.text_content;
    let encrypted_text = "";
    for (let i = 0; i < text.length; i++) {
      if (EncryptedText.ignores.includes(text[i])) {
        encrypted_text += text[i];
      } else {
        encrypted_text += EncryptedText.get_random_char();
      }
    }
    this.innerText = encrypted_text;
  };

  decrypt = () => {
    this.innerText = this.text_content;
  };

  animate_text = (duration = 0.8) => {
    animate(0, 1, {
      duration,
      onUpdate: this.encrypt,
      onComplete: this.decrypt,
    });
  };

  on_hover = () => {
    if (this.run_on_hover) {
      this.animate_text(0.1);
    }
  };

  on_mount = () => {
    this.text_content = this.getAttribute("content") ?? this.innerText ?? "";
    this.add_event_listener("mouseenter", this.on_hover);
    if (this.run_on_mount) {
      this.animate_text(0.5);
    }

    window.addEventListener("focus", () => this.animate_text(0.1));
  };
}

EncryptedText.define_self("encrypted-text");
