import type { JSX } from 'solid-js';
import { SolidMarkdown } from 'solid-markdown';

export function Markdown(p: { markdown: string | undefined }) {
  return (
    <SolidMarkdown
      children={p.markdown ?? ''}
      components={{ a: CustomAnchor, img: CustomImage }}
    />
  );
}

function CustomAnchor(p: { href?: string; children: JSX.Element }) {
  const target = () => (p.href?.match(/https?:\/\//) ? '_blank' : undefined);

  return (
    <a href={p.href} target={target()}>
      {p.children}
    </a>
  );
}

function CustomImage(p: { alt?: string; src?: string }) {
  const alt = () => {
    return p.alt?.replace(/\s*style="[^"]+"\s*/, '');
  };

  const style = () => {
    return p.alt?.replace(/.*\s*style="([^"]+)"\s*.*/, '$1');
  };

  return <img alt={alt()} src={p.src} style={style()} />;
}
