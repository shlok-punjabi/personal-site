export type HomeEntry = {
  label: string;
  href: "/work" | "/writing" | "/photos" | "/stories" | "/dog";
  response: string;
  note: string;
  items: readonly [string, string, string];
};

export const home = {
  name: "shlok punjabi",
  introduction: "people, companies, and things in between.",
  place: "new york · 2026",
  closing: "made slowly · new york",
  entries: [
    {
      label: "my work",
      href: "/work",
      response:
        "building teams for companies at the beginning of something important.",
      note: "the beginning is the part you can still hold in your hands.",
      items: ["the first team", "the hard tradeoff", "what stayed"],
    },
    {
      label: "my writing",
      href: "/writing",
      response: "ideas, observations, and things I wanted to think through.",
      note: "usually a sentence I was not ready to leave alone.",
      items: ["notes", "arguments", "unfinished thoughts"],
    },
    {
      label: "my photos",
      href: "/photos",
      response: "the moments I kept.",
      note: "not everywhere I went, only the frames that asked to stay.",
      items: ["rooms", "walks", "what the light did"],
    },
    {
      label: "my stories",
      href: "/stories",
      response: "the parts of my life that deserve more than a caption.",
      note: "longer than a post, and still not the whole of it.",
      items: ["family", "leaving", "the long way back"],
    },
    {
      label: "my dog",
      href: "/dog",
      response: "life with the one who runs the house.",
      note: "the day arranges itself around whoever is waiting by the door.",
      items: ["mornings", "the park", "who is actually in charge"],
    },
  ] satisfies HomeEntry[],
};

export function entryForSection(section: string) {
  return home.entries.find((entry) => entry.href === `/${section}`);
}
