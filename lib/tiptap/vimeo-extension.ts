import { Node, mergeAttributes } from "@tiptap/core";

export interface VimeoOptions {
  HTMLAttributes: Record<string, unknown>;
  width: number;
  height: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    vimeo: {
      setVimeoVideo: (options: {
        src: string;
        width?: number;
        height?: number;
      }) => ReturnType;
    };
  }
}

function extractVimeoId(url: string): string | null {
  // Matches:
  //   https://vimeo.com/12345
  //   https://vimeo.com/12345/abc123 (private link)
  //   https://player.vimeo.com/video/12345
  //   vimeo.com/12345
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (!match) return null;
  return match[2] ? `${match[1]}?h=${match[2]}` : match[1];
}

export const Vimeo = Node.create<VimeoOptions>({
  name: "vimeo",

  group: "block",
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      width: 640,
      height: 360,
    };
  },

  addAttributes() {
    return {
      src: { default: null },
      width: { default: 640 },
      height: { default: 360 },
    };
  },

  parseHTML() {
    return [
      { tag: 'div[data-vimeo-video] iframe' },
      { tag: 'iframe[src*="player.vimeo.com"]' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { "data-vimeo-video": "", class: "vimeo-embed" },
      [
        "iframe",
        mergeAttributes(this.options.HTMLAttributes, {
          src: HTMLAttributes.src,
          width: HTMLAttributes.width ?? this.options.width,
          height: HTMLAttributes.height ?? this.options.height,
          frameborder: 0,
          allow: "autoplay; fullscreen; picture-in-picture",
          allowfullscreen: "true",
        }),
      ],
    ];
  },

  addCommands() {
    return {
      setVimeoVideo:
        (options) =>
        ({ commands }) => {
          const id = extractVimeoId(options.src);
          if (!id) return false;
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: `https://player.vimeo.com/video/${id}`,
              width: options.width ?? this.options.width,
              height: options.height ?? this.options.height,
            },
          });
        },
    };
  },
});
