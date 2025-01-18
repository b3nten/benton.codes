import "./include/global.ts"

let animate = (config: {
  duration?: number,
  on_frame?: (delta: number, elapsed: number) => void,
  on_complete?: () => void
}) => {
  let start: number | undefined;
  let elapsed = 0;
  let delta = 0;

  let loop = (time: number) => {
    if(typeof start === "undefined") {
      start = time;
    }
    elapsed = time - start;
    delta = elapsed / (config.duration ?? 1000);
    if (elapsed < (config.duration ?? 1000)) {
      requestAnimationFrame(loop);
      config.on_frame?.(delta, elapsed);
    } else {
      config.on_complete?.();
    }
  }
  requestAnimationFrame(loop)
}

export class EncryptedText extends Component {
  static light_dom = true;

  static chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*+-?";
  static ignores = [" ", "\n", "\t", "\r", "\f", "\v"];
  static get_random_char = () => EncryptedText.chars[Math.floor(Math.random() * EncryptedText.chars.length)];

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
  }

  decrypt = () => {
    this.innerText = this.text_content;
  }

  animate_text = (duration = 800) => {
    animate({
      duration,
      on_frame: (delta: number, elapsed: number) => {
        this.encrypt();
      },
      on_complete: () => {
        this.decrypt();
      }
    })
  }

  on_hover = () => {
    if (this.run_on_hover) {
      this.animate_text(100)
    }
  }

  on_mount = () => {
    this.text_content = this.getAttribute("content") ?? this.innerText ?? "";
    this.add_event_listener("mouseenter", this.on_hover)
    if (this.run_on_mount) {
      this.animate_text(500)
    }
  }

}
EncryptedText.define_self("encrypted-text");
