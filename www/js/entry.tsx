import init_blackberry, { Ivysaur } from "blackberry.js";
import "./encrypted_text.tsx"
import "./window.tsx"
import "./a-window.ts"

import { animate, stagger } from "motion";

init_blackberry();

class AnimateChildren extends Ivysaur {
  static light_dom = true;

  @attribute("on-mounted") get manual(): string | null {
    return null
  }

  onMounted(): void {
    if(this.manual) {
      new Function("animate", "stagger", this.manual).call(this, animate, stagger)
      return
    }
  }
}

AnimateChildren.define_self("animate-children")
